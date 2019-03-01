const { expect } = require('chai');
const createSchema = require('../src');

describe('expect', () => {
  it('should validate body', () => {
    const schema = createSchema({
      age: {
        type: Number,
        validate: value => value >= 18,
      },
      firstName: String,
      lastName: {
        type: String,
        required: false,
      },
    });
    const errors = schema({
      age: 10,
      firstName: 5,
    });

    expect(errors).to.be.deep.equal([
      'age is invalid',
      'firstName is expected to be a string',
    ]);
  });
});
