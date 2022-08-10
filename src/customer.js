/* eslint-disable max-len */
class Customer {
  constructor(customerData) {
    this.id = customerData.id;
    this.name = customerData.name;
    this.bookings = customerData.bookings;
    this.totalSpent = 0;
    this.updateTotalSpent();
  }

  updateTotalSpent() {
    this.totalSpent = Number( this.bookings.reduce( (sum, currentBooking) => {
      return sum += currentBooking.price
    }, 0).toFixed(2) )
  }

}

export default Customer