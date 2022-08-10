import chai from 'chai';
const expect = chai.expect;

import Customer from '../src/customer'
import Booking from '../src/booking'

let customerData;
let customer;
let bookingData1;
let bookingData2;

describe('Customer', function() {
  beforeEach(function() {
    bookingData1 = {
      id: "5fwrgu4i7k55hl6sz",
      userID: 5,
      date: "2022/04/22",
      roomNumber: 15,
      price: 294.56
    }
    bookingData2 = {
      id: "5fwrgu4i7k55hl6t5",
      userID: 5,
      date: "2022/01/24",
      roomNumber: 24,
      price: 327.24
    }

    let bookings = []
    bookings.push(new Booking(bookingData1))

    customerData = {id: 5, name: "Mary Jane", bookings}

    customer = new Customer(customerData)
  })

  it('should have an id', function() {
    expect(customer.id).to.equal(customerData.id);
  });

  it('should have a name', function() {
    expect(customer.name).to.equal(customerData.name);
  });

  it('HAPPY PATH should be able to calculate how much it has spent so far & change if bookings change', function() {
    expect(customer.totalSpent).to.equal(294.56);
    customer.bookings.push(new Booking(bookingData2))
    customer.updateTotalSpent()
    expect(customer.totalSpent).to.equal(294.56 + 327.24);
  });

  it('SAD PATH should have spent 0 if the customer has no bookings', function() {
    customer.bookings = []
    customer.updateTotalSpent()
    expect(customer.totalSpent).to.equal(0);
  });
});
