class Booking {
  constructor(bookingData) {
    this.id = bookingData.id
    this.customerID = bookingData.userID;
    this.date = bookingData.date;
    this.roomNumber = bookingData.roomNumber;
    this.price = Number(bookingData.price) || 0;
  }

}

export default Booking