import chai from 'chai';
const expect = chai.expect;

import Booking from '../src/booking'
import RoomRepository from '../src/roomRepository';

let roomRepository;
let bookings;
let rooms;

describe('RoomRepository', function() {
  beforeEach(function() {

    rooms = []
    bookings = []
    bookings.push(new Booking())

    roomRepository = new RoomRepository({ bookings: bookings, rooms: rooms })
  })

  it('should have rooms', function() {
    expect(roomRepository.rooms.length).to.equal();
  });

  it('should have bookings', function() {
    expect(roomRepository.bookings.length).to.equal();
  });

  it('should return unbooked rooms that match both the date and the roomType chosen', function() {
    let date = ""
    let roomType = ""
    // on the happy path, we spit out unbooked rooms that match both the date and the roomType chosen

    expect(roomRepository.filterRooms(date, roomType).length).to.equal(2);
  });

  it('should return an empty array if no rooms match', function() {
    // on the sad path, there are no unbooked rooms that match both the date and the roomType chosen, so we...
      // return an empty array and let scripts.js figure out to show the error?
      // return an error message?
    expect(roomRepository.filterRooms(date, roomType).length).to.equal(0);
  });
});
