const validator = require('validator');
const isEmpty = require('./customFunctions').isEmpty;

const validateLoginInput = (data) => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!validator.isEmail(data.email)) {
    errors.email = 'Invalid Email.  Please try again.';
  }

  if (isEmpty(data.password)) {
    errors.password = "Please enter your password."
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
}; //end validateRegisterInput

module.exports = validateLoginInput;