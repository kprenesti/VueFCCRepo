// Keeps user personal info
const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const ValidateProfileInput = require('../../validation/profile');
const ValidateExperienceInput = require('../../validation/experience');
const ValidateEducationInput = require('../../validation/education');


/*
======================================
PRIVATE ROUTES
======================================
*/

// @route   POST api/profile
// @desc    Creates or Edits a user's profile
// @access  Private
router.post('/',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
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



// @route POST api/profile/experience
// @desc  Creates a new experience.
// @access Private
router.post('/experience', passport.authenticate('jwt', {
  session: false,
}), (req, res) => {
  const {
    errors,
    isValid
  } = ValidateExperienceInput(req.body);

  if (!isValid) return res.status(404).json(errors);

  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      profile.experience.unshift(req.body);
      profile.save().then(profile => res.json(profile));
    })
});



// @route POST api/profile/experience
// @desc  Creates a new experience.
// @access Private
router.post('/education', passport.authenticate('jwt', {
  session: false,
}), (req, res) => {
  const {
    errors,
    isValid
  } = ValidateEducationInput(req.body);

  if (!isValid) return res.status(404).json(errors);

  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      profile.education.unshift(req.body);
      profile.save().then(profile => res.json(profile));
    })
});



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
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "No profile found for this user.";
        res.status(404).json(errors);
      }
      res.json(profile);
    }).catch(err => res.json(err));
});



// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
        user: req.user.id
      })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        // Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);



// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
        user: req.user.id
      })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);



// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    Profile.findOneAndRemove({
      user: req.user.id
    }).then(() => {
      User.findOneAndRemove({
        _id: req.user.id
      }).then(() =>
        res.json({
          success: true
        })
      );
    });
  }
);







/*
======================================
PUBLIC ROUTES
======================================
*/

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({
      profile: 'There are no profiles'
    }));
});

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  let errors = {};
  Profile.findOne({
      handle: req.params.handle
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'Sorry. There is no profile for that user.';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});


// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({
      user: req.params.user_id
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({
        profile: 'There is no profile for this user'
      })
    );
});


module.exports = router;