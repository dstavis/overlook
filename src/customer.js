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
    // Whenever a booking gets added to this customer's bookings, ////////(aside from that booking should get persisted to the DB)
    // also re-calculate the total spent so that it includes the new booking's cost in its sum
    this.totalSpent = Number( this.bookings.reduce( (sum, currentBooking) => {
      return sum += currentBooking.price
    }, 0).toFixed(2) )
  }

}

export default Customer