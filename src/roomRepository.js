class RoomRepository {
  constructor(params) {
    this.rooms = params.rooms
    this.bookings = params.bookings
    this.attachPriceToBookings()
  }

  attachPriceToBookings() {
    this.bookings = this.bookings.map( (booking) => {
      let matchingRoom = this.rooms.find( (room) => room.number === booking.roomNumber)
      booking.price = matchingRoom.costPerNight
      return booking
    })
  }

  addBooking(newBooking) {
    this.bookings.push(newBooking)
    this.attachPriceToBookings()
  }

  filterRooms(selectedDate, selectedRoomType) {
  
    return this.rooms.filter( (room) => {
      let matchesSelectedRoomType = room.roomType === selectedRoomType
      let notBooked = this.notBooked(room, selectedDate)
      
      if (selectedRoomType !== "any") {
        return (matchesSelectedRoomType && notBooked)
      }
      return notBooked
    })
  }

  notBooked(room, date) {
    return !this.bookings.some( (booking) => {
      return ((booking.roomNumber === room.number) && (booking.date === date.split("-").join("/")))
    })
  }
}

export default RoomRepository