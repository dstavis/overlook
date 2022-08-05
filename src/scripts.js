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
let customers;
let bookings;
let rooms;

// Query Selectors

const eachBookingTemplate = document.querySelector(".each-booking template")
const eachBookingsContainer = document.querySelector(".each-bookings-container")

// Event listeners

window.addEventListener("load", start)

function chooseRandomCustomerID() {
  let randomIDNumber = Math.floor((1 + Math.random() * 50))
  return randomIDNumber
}

function start() {
  console.log("Here we go!") 
  let idNumber = chooseRandomCustomerID()

  loadData()
}

function loadData(){
  Promise.all( [fetch(customersURL), fetch(bookingsURL), fetch(roomsURL)] )
    .then( (responses) => {
      return Promise.all(responses.map( (response) => {
        return response.json()
      }))
    })
    .then( (data) => {
      customers = data[0].customers
      bookings = data[1].bookings
      rooms = data[2].rooms
    }) // massage the data into convenient shapes for display scripts
  // assign data to global variables => save it in the format that is most useful 

}

function loadCustomerBookings(customer){
  // let currentCustomer = new Customer(customerData)
  // getBookingsForCustomer(currentCustomer)
}

function getBookingsForCustomer(customer){
  // return an array containing bookings whose userID field matches the customer's id field
  
  // let bookings;
  // customer.id;
  // fetch(bookingsURL)
  //   .then( response => response.json())
  //   .then( data => )
  // return bookings;
}

function displayBookingsForCustomer(customerData) {
  
  // customerBookings.forEach( (booking) => {
  //   displayBooking(booking)
  // } )
}

function displayBooking(booking){
  // let freshBooking = eachBookingTemplate.cloneNode()
  // freshBooking.classList.remove("hidden")
  // freshBooking
  // // add data to the booking
  // eachBookingsContainer.append(freshBooking)
}
