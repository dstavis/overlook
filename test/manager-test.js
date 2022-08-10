import chai from 'chai';
const expect = chai.expect;

import Manager from '../src/manager'

let variableName;

describe('BookingList', function() {
  beforeEach(function() {
    variableName = {property: "value"}
    manager = new Manager(variableName)
  })

  it('should have a property', function() {
    expect(manager.property).to.equal("value");
  });
});
