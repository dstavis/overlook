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

let errorMessages = [];
let today = new Date().toLocaleDateString("en-CA")
let chosenCustomerID;
let currentCustomer;
let rooms;
let bookings;
let customers;



// Query Selectors

const loginSection = document.querySelector("#login")
const customerDashboard = document.querySelector("#customer-dashboard")
const managerDashboard = document.querySelector("#manager-dashboard")

let usernameInput = document.querySelector(`#username`)
let passwordInput = document.querySelector(`#password`)
const loginButton = document.querySelector(`#login-button`)
const errorDisplay = document.querySelector(`#error-display`)

const dateControl = document.querySelector(`input[type="date"]`)
const roomFilter = document.querySelector("#room-type-select")

const customerWelcomeName = document.querySelector(".customer-name")
const customerTotalSpentDisplay = document.querySelector(".total-spent .dollars")

const individualBookingTemplate = document.querySelector(".individual-booking.template")
const individualBookingsContainer = document.querySelector(".individual-bookings-container")

const individualRoomDetailTemplate = document.querySelector(".individual-room-detail.template")
const individualRoomDetailsContainer = document.querySelector(".individual-room-details-container")

// Event listeners 

// window.addEventListener("load", loadDashboard)
loginButton.addEventListener("click", submitLogin)
loginButton.addEventListener("keydown", submitLogin)
usernameInput.addEventListener("keydown", submitLogin)
passwordInput.addEventListener("keydown", submitLogin)
dateControl.addEventListener("input", criteriaChanged)
roomFilter.addEventListener("input", criteriaChanged)
individualRoomDetailsContainer.addEventListener("click", roomDetailsClicked)

function showManagerDashboard(){
  displayTodaysDate()
  loadManagerData()
  swapToManagerView()
}

function swapToManagerView(){
  loginSection.classList.add("hidden")
  managerDashboard.classList.remove("hidden")
}

function displayTodaysDate(){
  // part of the manager dashboard
  document.querySelector(".todays-date").innerText = today;
}

function submitLogin(event) {
  if (event.type === "keydown" && event.key !== "Enter") {
    return "do nothing"
  }
  let username = usernameInput.value
  let password = passwordInput.value
  let customerIDNumber = Number(username.split("customer")[1])

  errorMessages = []
  showLoginError()

  if (!username || !password) {
    errorMessages = []
    errorMessages.push("Please enter a value into both fields")
    showLoginError()
  } else if (username === "manager" && isValidPassword(password)){
    errorMessages = []
    errorMessages.push(`Correct information! Logging in for manager...`)
    showLoginError()
    showManagerDashboard()
  } else if (isValidUsername(username) && isValidPassword(password)) {
    errorMessages = []
    errorMessages.push(`Correct information! Logging in for customer ${customerIDNumber}...`)
    showLoginError()
    
    chosenCustomerID = customerIDNumber;
    loadDashboard()
  }
}


function isValidUsername(input) {
  let beginsWithCustomer = input.startsWith("customer")
  let idNumber = Number(input.split("customer")[1])
  let numberBetweenOneAndFifty = (idNumber > 0 && idNumber < 51)
  
  errorMessages = []
  
  if (beginsWithCustomer && numberBetweenOneAndFifty){
    return true
  } else {
    if (!beginsWithCustomer) {
      errorMessages.push("A username should begin with customer")
    }
    if (!idNumber) {
      errorMessages.push("A username must include a number")
    }
    if (!numberBetweenOneAndFifty) {
      errorMessages.push("A username's number must be between 1 and 50")
    }
  }
  showLoginError()
  return false;
}

function isValidPassword(input) {
  if (input === "overlook2021") {
    return true
  } else {
    errorMessages = []
    errorMessages.push("Incorrect password")
    showLoginError()
    return false
  }
}


function showLoginError() {
  errorDisplay.replaceChildren()
  errorDisplay.classList.remove("hidden")
  errorMessages.map( (message) => {
    let messageTag = document.createElement("p")
    messageTag.innerText = message
    return messageTag
  }).forEach( (messageNode) => {
    errorDisplay.append(messageNode)
  })
}

function swapToDashboardView() {
  loginSection.classList.add("hidden")
  customerDashboard.classList.remove("hidden")
}

function roomDetailsClicked(event) {
  if (event.target.classList.contains("book-room-button")) {
    let roomNumberToBook = Number(event.target.dataset.id)
    
    let formattedChosenDate = dateControl.value.split("-").join("/")
    let customerID = currentCustomer.id
    
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

function deleteRoomBooking() {
  let idNumber = 0
  let options = {
    method: "DELETE"
  }
  fetch(bookingsURL + "/" + idNumber, options).then( (response) => {return response.json()}).then( (data) => {
    console.log(data)
  })
}

function chooseRandomCustomerID() {
  let randomIDNumber = Math.floor((1 + Math.random() * 50))
  return randomIDNumber
}

function loadDashboard() {
  dateControl.min = today;
  dateControl.value = today;
  loadData()
  swapToDashboardView()
}

function loadManagerData() {
  Promise.all( [fetch(customersURL), fetch(bookingsURL), fetch(roomsURL)] )
    .then( (responses) => {
      return Promise.all(responses.map( (response) => {
        return response.json()
      }))
    })
    .then( (data) => {
      let customerData = data[0].customers
      let bookingsData = data[1].bookings
      let roomsData = data[2].rooms
      
      let apiData = { bookings: bookingsData, rooms: roomsData, customers: customerData }
      
      // Global Variables
      rooms = apiData.rooms;
      bookings = apiData.bookings;
      customers = apiData.customers;

      showManagerStats()
    })
}

function showManagerStats() {
  let todaysBookings = bookings.filter( (booking) => {
    return booking.date === today.split("-").join("/")
  })

  let roomsAvailableToday = rooms.length - todaysBookings.length
  console.log("woah")

  let revenueToday = new Intl.NumberFormat('en-US', { style: "currency", currency: "USD"}).format(todaysBookings.reduce( (sum, booking) => {
    let price = rooms.find( (room) => {
      return Number(room.number) === Number(booking.roomNumber)
    }).costPerNight
    return sum + price
  }, 0))

  let percentageOccupied = Math.floor((todaysBookings.length / rooms.length) * 100) + "%"

  document.querySelector(".rooms-available-today").innerText = roomsAvailableToday;
  document.querySelector(".todays-revenue").innerText = revenueToday;
  document.querySelector(".percentage-occupied").innerText = percentageOccupied;
}

function loadData(){
  Promise.all( [fetch(customersURL), fetch(bookingsURL), fetch(roomsURL), fetch(customersURL + "/" + chosenCustomerID)] )
    .then( (responses) => {
      return Promise.all(responses.map( (response) => {
        return response.json()
      }))
    })
    .then( (data) => {
      // let customers = data[0].customers
      let bookingsData = data[1].bookings
      let roomsData = data[2].rooms
      let customerData = data[3]
      
      let apiData = { bookings: bookingsData, rooms: roomsData, customer: customerData }
      
      // Global Variables
      rooms = apiData.rooms;
      bookings = apiData.bookings;

      
      massageData(apiData)
      
      displayCustomerName(currentCustomer)
      displayBookingsForCustomer(currentCustomer)
    })
}

function criteriaChanged() {
  let roomsForDisplay = determineRooms()
  showRoomsForReservation(roomsForDisplay)
}

function determineRooms() {
  let newDate = dateControl.value;
  
  return rooms.filter( (room) => {
    let selectedRoomType = roomFilter.value
    
    let matchesSelectedRoomType = room.roomType === selectedRoomType
    let notBooked = !bookings.some( (booking) => {
      return ((booking.roomNumber === room.number) && (booking.date === newDate.split("-").join("/")))
    })
    
    if (roomFilter.value !== "any") {
      return (matchesSelectedRoomType && notBooked)
    }
    return notBooked
  })
}

function showRoomsForReservation(roomDetails) {
  individualRoomDetailsContainer.replaceChildren()

  if (roomDetails.length < 1) {
    let apologyMessage = document.createElement("h4")
    apologyMessage.innerText = "We're so terribly sorry, but there are no rooms available for the selected date and room type. Please try a different set of criteria."
    individualRoomDetailsContainer.append(apologyMessage) 
  }

  roomDetails.forEach( (roomDetail) => {
    let freshRoomDisplay = individualRoomDetailTemplate.cloneNode(true)
    freshRoomDisplay.classList.remove("template")
    freshRoomDisplay.classList.remove("hidden")
    
    freshRoomDisplay.querySelector("button").dataset.id = roomDetail.number
    freshRoomDisplay.querySelector(".room-number").innerText = "Room " + roomDetail.number
    freshRoomDisplay.querySelector(".room-cost").innerText = "$" + roomDetail.costPerNight
    freshRoomDisplay.querySelector(".room-type").innerText = roomDetail.roomType
    freshRoomDisplay.querySelector(".beds").innerText = roomDetail.numBeds + " " + roomDetail.bedSize + " bed(s)"
    let hasBidet = roomDetail.bidet ? "Yes" : "No"
    freshRoomDisplay.querySelector(".bidet").innerText = "Bidet: " + hasBidet
    
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
  freshBooking.querySelector(".date").innerText = booking.date;
  freshBooking.querySelector(".room-number").innerText = `Room ${booking.roomNumber}`;
  freshBooking.querySelector(".price").innerText = new Intl.NumberFormat('en-US', { style: "currency", currency: "USD"}).format(booking.price)
  individualBookingsContainer.append(freshBooking)
}
