import chai from 'chai';
const expect = chai.expect;

import Customer from '../src/customer'

let customerData;
let customer;

describe('Customer', function() {
  beforeEach(function() {
    customerData = {id: 5, name: "Mary Jane"}
    customer = new Customer(customerData)
  })

  it('should have an id', function() {
    expect(customer.id).to.equal(customerData.id);
  });

  it('should have a name', function() {
    expect(customer.name).to.equal(customerData.name);
  });
});
