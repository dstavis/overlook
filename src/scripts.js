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
        let newBooking = new Booking(data.newBooking);
        
        bookings.push(newBooking)
        currentCustomer.bookings.push(newBooking)
        updateCustomerBookings()
        displayBookingsForCustomer(currentCustomer)
        criteriaChanged()
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
  loadData()
  console.log("Data loading")
}

function loadData(){
  Promise.all( [fetch(customersURL), fetch(bookingsURL), fetch(roomsURL), fetch(customersURL + "/" + chooseRandomCustomerID())] )
    .then( (responses) => {
      return Promise.all(responses.map( (response) => {
        return response.json()
      }))
    })
    .then( (data) => {
      // customers = data[0].customers
      let bookingsData = data[1].bookings
      let roomsData = data[2].rooms
      let customerData = data[3]
      
      let apiData = { bookings: bookingsData, rooms: roomsData, customer: customerData }
      
      // hold on to the rooms 
      rooms = apiData.rooms;
      bookings = apiData.bookings;

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
  let customerBookingsWithPrice = apiData.bookings.filter( (booking) => {
    return booking.userID === apiData.customer.id
  }).map( (booking) => {
    booking.price = apiData.rooms.find( (room) => room.number === booking.roomNumber).costPerNight
    return new Booking(booking);
  }).sort( (a, b) => { return new Date(b.date) - new Date(a.date)} )
  
  let customerData = apiData.customer
  customerData.bookings = customerBookingsWithPrice;
    
  // assign data to global variables => save it in the format that is most useful 
  currentCustomer = new Customer(customerData)
}

function updateCustomerBookings() {
  currentCustomer.bookings = currentCustomer.bookings.map( (booking) => {
    let matchingRoom = rooms.find( (room) => room.number === booking.roomNumber)
    booking.price = matchingRoom.costPerNight
    return booking
  }).sort( (a, b) => { return new Date(b.date) - new Date(a.date)} )
}

function displayCustomerName() {
  // Query select the welcome message
  // insert the current customer's name into that text
  customerWelcomeName.innerText = currentCustomer.name;
}

function displayBookingsForCustomer(customer) {
  customer.updateTotalSpent()
  customerTotalSpentDisplay.innerText = new Intl.NumberFormat('en-US', { style: "currency", currency: "USD"}).format(customer.totalSpent)
  individualBookingsContainer.replaceChildren()
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
