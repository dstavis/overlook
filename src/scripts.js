/* eslint-disable brace-style */
/* eslint-disable max-len */
/* eslint-disable space-before-blocks */
// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';
import Customer from './customer'
import Booking from './booking'

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
// import './images/turing-logo.png'

// Endpoints

let bookingsURL = "http://localhost:3001/api/v1/bookings";
let customersURL = "http://localhost:3001/api/v1/customers"
let roomsURL = "http://localhost:3001/api/v1/rooms"

// Global Data Variables

let currentCustomer;
let today = new Date().toLocaleDateString("en-CA")
let rooms;
let bookings;

// Query Selectors

const dateControl = document.querySelector(`input[type="date"]`)
const roomFilter = document.querySelector("#room-type-select")

const customerWelcomeName = document.querySelector(".customer-name")
const customerTotalSpentDisplay = document.querySelector(".total-spent .dollars")

const individualBookingTemplate = document.querySelector(".individual-booking.template")
const individualBookingsContainer = document.querySelector(".individual-bookings-container")

const individualRoomDetailTemplate = document.querySelector(".individual-room-detail.template")
const individualRoomDetailsContainer = document.querySelector(".individual-room-details-container")

// Event listeners

window.addEventListener("load", start)
dateControl.addEventListener("input", criteriaChanged)
roomFilter.addEventListener("input", criteriaChanged)
individualRoomDetailsContainer.addEventListener("click", roomDetailsClicked)

function roomDetailsClicked(event) {
  // was it a book room button that got clicked?
  if (event.target.classList.contains("book-room-button")) {
    // if so, which room number was clicked?
    let roomNumberToBook = Number(event.target.dataset.id)
    // make a book request for that room number, for this customer's userID, on the date they have selected
    let formattedChosenDate = dateControl.value.split("-").join("/")
    let customerID = currentCustomer.id
    // { "userID": 48, "date": "2019/09/23", "roomNumber": 4 }
    let bookingInfo = {
      userID: customerID,
      date: formattedChosenDate,
      roomNumber: roomNumberToBook
    }
    makeRoomBooking(bookingInfo)
  }
}

function makeRoomBooking(bookingInfo) {
  // TODO: move this business logic into the Booking class
  let options = {
    method: "POST",
    headers: {"content-type": "application/JSON"},
    body: JSON.stringify(bookingInfo)
  }
  // use fetch to make a post request 
  fetch(bookingsURL, options)
    .then( (response) => {
      return response.json()
    })
    .then( (data) => {
      if (!data.newBooking) {
        throw new Error(data.message)
      } else {
        // update our data based on the new data
        // this should result in the following:
        // the booked room appearing in the list of bookings
        loadData({bookings: true})
        // the booked room being removed from the reservations pane
        criteriaChanged()
        console.log(data)
      }
    })
    .catch( (error) => {
      console.error(error)
    })
}

function chooseRandomCustomerID() {
  let randomIDNumber = Math.floor((1 + Math.random() * 50))
  return randomIDNumber
}

function start() {
  console.log("Here we go!") 
  dateControl.min = today;
  dateControl.value = today;
  loadData({bookings: true, rooms: true, randomCustomer: true })
  console.log("Data loading")
}

function loadData(options = { customers: true, bookings: true, rooms: true, randomCustomer: true }) {

  let promisesToLoad = []
  if (options.customers) promisesToLoad.push(fetch(customersURL));
  if (options.bookings) promisesToLoad.push(fetch(bookingsURL));
  if (options.rooms) promisesToLoad.push(fetch(roomsURL));
  if (options.randomCustomer) promisesToLoad.push(fetch(customersURL + "/" + chooseRandomCustomerID()));

  // alternate format for lines 112-115 ::> options.customers ? promisesToLoad.push(fetch(customersURL)) : "" 
  
  Promise.all(promisesToLoad)
    .then( (responses) => {
      return Promise.all(responses.map( (response) => {
        return response.json()
      }))
    })
    .then( (data) => {
      // customers = data[0].customers

      let bookingsData;
      let roomsData;
      let customerData;
      let apiData;

      data.forEach( (datum) => {
        if (datum.bookings) { bookingsData = datum.bookings }
        if (datum.rooms) { roomsData = datum.rooms }
        if (datum.name) { customerData = datum } else { customerData = currentCustomer}
      })
      
      apiData = { bookings: bookingsData, rooms: roomsData, customer: customerData }
      
      // global variables
      rooms = roomsData;
      bookings = bookingsData;

      // massage the data into convenient shapes for display scripts
      massageData(apiData)
      // display scripts
      displayCustomerName(currentCustomer)
      displayBookingsForCustomer(currentCustomer)
    })
}

function criteriaChanged() {
  let roomsForDisplay = determineRooms()
  // show a list of all the rooms that made it through the filter 
  showRoomsForReservation(roomsForDisplay)
}

function determineRooms() {
  let newDate = dateControl.value;
  
  return rooms.filter( (room) => {
    let selectedRoomType = roomFilter.value
    
    let matchesSelectedRoomType = room.roomType === selectedRoomType
    // check all the rooms.
    // for each room's room number, are there any bookings with that room number whose date matches newDate?
    // if so, that room is OUT
    // all the other rooms are in
    let notBooked = !bookings.some( (booking) => {
      return ((booking.roomNumber === room.number) && (booking.date === newDate.split("-").join("/")))
    })
    
    // if the user is filtering by room type
    if (roomFilter.value !== "any") {
      // return true only if both the matches and notbooked are true
      return (matchesSelectedRoomType && notBooked)
    }
    // otherwise, ignore matches and return true if notbooked alone is true
    return notBooked
  })
}

function showRoomsForReservation(roomDetails) {
  // empty the roomsContainer of any old rooms!!!
  individualRoomDetailsContainer.replaceChildren()
  // for each roomDetail, do the following
  roomDetails.forEach( (roomDetail) => {
    // grab the template for an individualRoomDetail and clone it, then remove the template and hidden classes
    let freshRoomDisplay = individualRoomDetailTemplate.cloneNode(true)
    freshRoomDisplay.classList.remove("template")
    freshRoomDisplay.classList.remove("hidden")
    // fill the fresh individualRoomDetail with the data extracted from the room
    freshRoomDisplay.querySelector("button").dataset.id = roomDetail.number
    freshRoomDisplay.querySelector(".room-number").innerText = "Room " + roomDetail.number
    freshRoomDisplay.querySelector(".room-cost").innerText = "$" + roomDetail.costPerNight
    freshRoomDisplay.querySelector(".room-type").innerText = roomDetail.roomType
    freshRoomDisplay.querySelector(".beds").innerText = roomDetail.numBeds + " " + roomDetail.bedSize + " bed(s)"
    let hasBidet = roomDetail.bidet ? "Yes" : "No"
    freshRoomDisplay.querySelector(".bidet").innerText = "Bidet: " + hasBidet
    // find the container we want the individualRoomDetail(s) to be displayed in
    // append the filled-in individualRoomDetail to the container
    individualRoomDetailsContainer.append(freshRoomDisplay)
  })
}
  
function massageData(apiData) {
  // What do I want to know for display?
  // I want to know all the bookings made by a single customer.
  let customerID = currentCustomer.id || apiData.customer.id
  // find bookings whose userID field matches customer.ID field
  let customerBookingsWithPrice = apiData.bookings.filter( (booking) => {
    return booking.userID === customerID
    // For each booking, I want to know how much it cost
  }).map( (booking) => {
    // get that booking's roomNumber value and find the room whose room.number value matches it
    // that room has a costPerNight, which tells me the cost of the booking
    booking.price = apiData.rooms.find( (room) => room.number === booking.roomNumber).costPerNight
    return booking;
  })
  // I want each customer to know how much they've spent so far
  // after I've made a list of all the bookings w/costs, reduce it by summing their costs together to get the total
  // *note: I moved this logic into a method on the Customer class so that it could be used in other situations
  // it also gets used automatically during the customer constructor so we don't have to specifically ask for it 
  
  // Create class instances of customer (and bookings to live on that customer)
  let instantiatedBookings = customerBookingsWithPrice.map(bookingData => {
    return new Booking(bookingData)
  })

  // Sort bookings by date in descending order (most recent/farthest in the future first)
  instantiatedBookings.sort( (a, b) => { return new Date(b.date) - new Date(a.date)} )
  
  if (!currentCustomer) {
    let customerData = apiData.customer
    customerData.bookings = instantiatedBookings;
    currentCustomer = new Customer(customerData)
  } else {
    currentCustomer.bookings = instantiatedBookings;
  }
  
  // assign data to global variables => save it in the format that is most useful 
}



function displayCustomerName() {
  // Query select the welcome message
  // insert the current customer's name into that text
  customerWelcomeName.innerText = currentCustomer.name;
}

function displayBookingsForCustomer(customer) {
  
  // Now that I've got that info, what do I want to do with it?
  // I want to display the customer's total spent in the header
  customerTotalSpentDisplay.innerText = new Intl.NumberFormat('en-US', { style: "currency", currency: "USD"}).format(customer.totalSpent)
  individualRoomDetailsContainer.replaceChildren()
  customer.bookings.forEach( (booking) => {
    displayBooking(booking)
  } )
}

function displayBooking(booking){
  let freshBooking = individualBookingTemplate.cloneNode(true)
  freshBooking.classList.remove("template")
  freshBooking.classList.remove("hidden")
  // fill the template clone with a particular booking's info
  // I want to display a list of rows with each booking's info, including...
    // The booking date
    // the room number
    // the cost of that booking
  freshBooking.querySelector(".date").innerText = booking.date;
  freshBooking.querySelector(".room-number").innerText = `Room ${booking.roomNumber}`;
  freshBooking.querySelector(".price").innerText = new Intl.NumberFormat('en-US', { style: "currency", currency: "USD"}).format(booking.price)
  individualBookingsContainer.append(freshBooking)
}
