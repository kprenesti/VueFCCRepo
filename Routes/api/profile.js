// Keeps user personal info
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({
  msg: "Profile works."
}));

// @route   GET api/profile
// @desc    Gets current user's profile.  Get's user's id from token
// @access  Private
router.get('/', passport.authenticate('jwt'), (req, res) => {
  const errors = {};
  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      if (!profile) {
        errors.noprofile = "No profile found.";
        res.status(404).json(errors);
      }
      res.json(profile);
    }).catch((err) => {
      res.json(err);
    })
});

module.exports = router;