const validator = require('validator');
const isEmpty = require('./customFunctions').isEmpty;

const validateProfileInput = (data) => {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';


  if (!validator.isLength(data.handle, {
      min: 2,
      max: 40
    })) errors.handle = 'Handle must be between 2 and 40 characters.';
  if (data.website && !validator.isURL(data.website)) errors.website = 'Not a valid URL.';
  if (isEmpty(data.status)) errors.status = 'Status field is required.';
  if (isEmpty(data.skills)) errors.skills = 'You must input at least one skill.';


  return {
    errors,
    isValid: isEmpty(errors)
  };
}; //end validateProfileInput

module.exports = validateProfileInput;