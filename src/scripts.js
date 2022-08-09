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

const customerWelcomeName = document.querySelector(".customer-name")
const customerTotalSpentDisplay = document.querySelector(".total-spent .dollars")

const individualBookingTemplate = document.querySelector(".individual-booking.template")
const individualBookingsContainer = document.querySelector(".individual-bookings-container")

const individualRoomDetailTemplate = document.querySelector(".individual-room-detail.template")
const individualRoomDetailsContainer = document.querySelector(".individual-room-details-container")

// Event listeners

window.addEventListener("load", start)
dateControl.addEventListener("input", dateChanged)

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

function dateChanged(event) {
  let newDate = event.target.value;
  // check all the rooms.
  // for each room's room number, are there any bookings with that room number whose date matches newDate?
  // if so, that room is OUT
  // all the other rooms are in
  console.log("wat")
  let roomsForDate = rooms.filter( (room) => {
    return !bookings.some( (booking) => {
      return ((booking.roomNumber === room.number) && (booking.date === newDate.split("-").join("/")))
    })
  })
  // show a list of all the rooms that made it through the filter 
  showRoomsForReservation(roomsForDate)
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
    freshRoomDisplay.querySelector(".room-number").innerText = roomDetail.number
    freshRoomDisplay.querySelector(".room-cost").innerText = "$" + roomDetail.costPerNight
    freshRoomDisplay.querySelector(".beds").innerText = roomDetail.numBeds + " " + roomDetail.bedSize + "(s)"
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

  // find bookings whose userID field matches customer.ID field
  let customerBookingsWithPrice = apiData.bookings.filter( (booking) => {
    return booking.userID === apiData.customer.id
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
  
  let customerData = apiData.customer
  customerData.bookings = instantiatedBookings;
    
  // assign data to global variables => save it in the format that is most useful 
  currentCustomer = new Customer(customerData)
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
