class Booking {
  constructor(bookingData) {
    this.id = bookingData.id
    this.customerID = bookingData.userID;
    this.customer;
    this.date = bookingData.date;
    this.roomNumber = bookingData.roomNumber;
    this.price = bookingData.price;
  }

}

export default Booking