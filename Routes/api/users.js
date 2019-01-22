//Only deals with auth, not real user information
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');


// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({
  msg: "Users works."
}));


// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', (req, res)=> {
  User.findOne({email: req.body.email})
    .then((user)=>{
      if(user){ 
        res.status(400).json({msg: "Email already in use.  Please login."})
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mp'
        })
        const newbie = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          // avatar
        });
      }
    })
  });

module.exports = router;