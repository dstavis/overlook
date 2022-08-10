import chai from 'chai';
const expect = chai.expect;

import BookingList from '../src/bookingList'

let variableName;

describe('BookingList', function() {
  beforeEach(function() {
    variableName = {property: "value"}
    bookingList = new BookingList(variableName)
  })

  it('should have a property', function() {
    expect(bookingList.property).to.equal("value");
  });
});
