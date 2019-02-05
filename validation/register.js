const Validator = require('validator');
const isEmpty = require('./customFunctions');

const validateRegisterInput = (data) => {
  let errors = {};

  if (!validator.isLength(data.name, {
      min: 2,
      max: 40
    })) {
    errors.name = 'Name must be between 2 and 40 characters.';
  };

  if (!validator.isEmail(data.email)) {
    errors.email = 'Invalid Email.  Please try again.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}; //end validateRegisterInput

module.exports = validateRegisterInput;