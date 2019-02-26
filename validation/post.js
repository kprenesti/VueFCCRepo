const Validator = require('validator');
const isEmpty = require('./customFunctions').isEmpty;

const ValidatePostInput = (data) => {
  let errors = {};
  data.text = !isEmpty(data.text) ? data.text : '';
  if (!Validator.isLength(data.text, {
      min: 10,
      max: 300
    })) errors.text = "Post must be at least 10 characters and no more than 300 characters."
  if (Validator.isEmpty(data.text)) errors.text = "Text field is required";
  return {
    errors,
    isValid: isEmpty(errors)
  }

};

modules.exports = ValidatePostInput;