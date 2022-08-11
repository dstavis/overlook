import chai from 'chai';
const expect = chai.expect;

import Booking from '../src/booking'
import RoomRepository from '../src/roomRepository';

let roomRepository;
let bookings;
let rooms;
let roomsData;
let bookingsData;

describe('RoomRepository', function() {
  beforeEach(function() {

    roomsData = JSON.parse('{"rooms":[{"number":1,"roomType":"single room","bidet":true,"bedSize":"queen","numBeds":1,"costPerNight":358.4},{"number":2,"roomType":"suite","bidet":false,"bedSize":"full","numBeds":2,"costPerNight":477.38},{"number":3,"roomType":"junior suite","bidet":false,"bedSize":"king","numBeds":1,"costPerNight":491.14},{"number":4,"roomType":"residential suite","bidet":false,"bedSize":"queen","numBeds":1,"costPerNight":429.44},{"number":5,"roomType":"single room","bidet":true,"bedSize":"queen","numBeds":2,"costPerNight":340.17}]}')
    bookingsData = JSON.parse('{"bookings":[{"id":"5fwrgu4i7k55hl6sz","userID":9,"date":"2022/08/10","roomNumber":1},{"id":"5fwrgu4i7k55hl6t5","userID":43,"date":"2022/08/10","roomNumber":5},{"id":"5fwrgu4i7k55hl6t6","userID":13,"date":"2022/08/10","roomNumber":3},{"id":"5fwrgu4i7k55hl6t7","userID":20,"date":"2022/08/10","roomNumber":4},{"id":"5fwrgu4i7k55hl6t8","userID":1,"date":"2022/08/10","roomNumber":5}]}' )
    
    rooms = roomsData.rooms
    bookings = bookingsData.bookings.map( (bookingData) => {return new Booking (bookingData)})
    

    roomRepository = new RoomRepository({ bookings: bookings, rooms: rooms })
  })

  it('should have rooms', function() {
    expect(roomRepository.rooms.length).to.equal(5);
  });

  it('should have bookings', function() {
    expect(roomRepository.bookings.length).to.equal(5);
  });

  it('should be able to check if a room is available', function() {
    // happy path, there is no booking for that room on this date
    let room = rooms[0];
    let date = "2022/08/12";
    
    expect(roomRepository.notBooked(room, date)).to.equal(true);
  });

  it('should be able to check if a room is already booked', function() {
    // sad path, there is at least one booking for this room on this date
    let room = rooms[0];
    let date = "2022/08/10";
    
    expect(roomRepository.notBooked(room, date)).to.equal(false);
  });

  it('should return unbooked rooms that match both the date and the roomType chosen', function() {
    // happy path
    // we spit out unbooked rooms that match both the date and the roomType chosen
    // there are two unbooked rooms 
    let date = "2022/08/11"
    let roomType = "single room"

    expect(roomRepository.filterRooms(date, roomType).length).to.equal(2);
  });
  

  it('should return an empty array if no rooms match', function() {
    // sad path
    // there are no unbooked rooms that match both the date and the roomType chosen, so we...
      // return an empty array and let scripts.js figure out to show the error?
      // return an error message?
    let date = "2022/08/10";
    let roomType = "junior suite"

    expect(roomRepository.filterRooms(date, roomType).length).to.equal(0);
  });
});
