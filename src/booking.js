class Booking {
  constructor(bookingData) {
    this.id = bookingData.id // STRING!!!
    this.customerID = bookingData.userID;
    this.customer;
    this.date = bookingData.date;
    this.roomNumber = bookingData.roomNumber;
  }

}

export default Booking