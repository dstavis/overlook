import chai from 'chai';
const expect = chai.expect;

import Booking from '../src/booking'

let bookingData;
let booking;
let bookingData2;
let booking2;

describe('Booking', function() {
  beforeEach(function() {
    bookingData = JSON.parse(`{
      "id": "5fwrgu4i7k55hl6tv",
      "userID": 5,
      "date": "2022/01/19",
      "roomNumber": 21
    }`)
    booking = new Booking(bookingData)

    bookingData2 = JSON.parse(`{
      "id": "5fwrgu4i7k55hl6tv",
      "userID": 5,
      "date": "2022/01/19",
      "roomNumber": 21,
      "price": "234.56"
    }`)

    booking2 = new Booking(bookingData2)
  })

  it('should have an id', function() {
    expect(booking.id).to.equal(bookingData.id);
  });

  it('should have a matching customer id', function() {
    expect(booking.customerID).to.equal(bookingData.userID);
  });

  it('should have a date', function() {
    expect(booking.date).to.equal(bookingData.date);
  });

  it('should have a roomNumber', function() {
    expect(booking.roomNumber).to.equal(bookingData.roomNumber);
  });

  it('should have a default price of 0 if no price was included in the parameters', function() {
    expect(booking.price).to.equal(0);
  });

  it('should have a price if one was provided', function() {
    expect(booking2.price).to.equal(234.56);
  });
});