const validator = require('validator');
const isEmpty = require('./customFunctions').isEmpty;

const validateRegisterInput = (data) => {
  let errors = {};

  if (!validator.isLength(data.name, {
      min: 2,
      max: 40
    })) {
    errors.name = 'Name must be between 2 and 40 characters.';
  };

  if (isEmpty(data.name)) {
    errors.name = "Name is required.";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'Invalid Email.  Please try again.';
  }

  if (isEmpty(data.password)) {
    errors.password = "Please enter a unique password that is at least 8 characters long and contains a number and a letter."
  }

  // if (!validator.isLength(data.password), {
  //     min: 8,
  //     max: 40
  //   }) {
  //   errors.password = "Password too short.  Password must be at least 8 characters long."
  // }

  if (isEmpty(data.password2)) {
    errors.password2 = "Please verify your password.";
  }

  if (data.password !== data.password2) {
    errors.password2 = "Passwords do not match.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}; //end validateRegisterInput

module.exports = validateRegisterInput;