import chai from 'chai';
const expect = chai.expect;

import Booking from '../src/booking'

let bookingData;
let booking;

describe('Booking', function() {
  beforeEach(function() {
    bookingData = JSON.parse(`{
      "id": "5fwrgu4i7k55hl6tv",
      "userID": 5,
      "date": "2022/01/19",
      "roomNumber": 21
    }`)
    booking = new Booking(bookingData)
  })

  it('should have an id', function() {
    expect(booking.id).to.equal(bookingData.id);
  });

  it('should have a matching customer id', function() {
    expect(booking.customerID).to.equal(bookingData.userID);
  });

  it('should have a date', function() {
    expect(booking.customer.date).to.equal(bookingData.date);
  });

  it('should have a roomNumber', function() {
    expect(booking.customer.roomNumber).to.equal(bookingData.roomNumber);
  });
});