// Keeps user personal info
const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const ValidateProfileInput = require('../../validation/profile');


// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({
  msg: "Profile works."
}));

// @route   GET api/profile
// @desc    Gets current user's profile.  Current user info retrieved from JWT
// @access  Private
router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  let errors = {};
  Profile.findOne({
      user: req.user.id
    })
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "No profile found for this user.";
        res.status(404).json(errors);
      }
      res.json(profile);
    }).catch(err => res.json(err));
});


// @route   POST api/profile
// @desc    Creates or Edits a user's profile
// @access  Private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  let {
    errors,
    isValid
  } = ValidateProfileInput(req.body);

  if (!isValid) return res.status(400).json(errors);

  const createArray = (string) => {
    let arr = string.split(',');
    return arr;
  };

  if (req.body.skills) req.body.skills = createArray(req.body.skills);

  //Will always be a user b/c this is a private route.  To even get here, someone needs to be logged in.
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      //Update profile if found, create if not.
      Profile.findOneAndUpdate({
        user: req.user.id
      }, {
        $set: req.body
      }, {
        new: true,
        upsert: true
      }).then(update => res.json(update))
    }).catch(err => res.json(err));

});
module.exports = router;