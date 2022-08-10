import chai from 'chai';
const expect = chai.expect;

import Room from '../src/room'

let variableName;

describe('BookingList', function() {
  beforeEach(function() {
    variableName = {property: "value"}
    room = new Room(variableName)
  })

  it('should have a property', function() {
    expect(room.property).to.equal("value");
  });
});
