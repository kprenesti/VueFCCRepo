//Only deals with auth, not real user information
const express = require('express');
const router = express.Router();


// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({
  msg: "Users works."
}));

module.exports = router;