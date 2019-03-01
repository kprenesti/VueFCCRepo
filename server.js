require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 9090;
const bodyParser = require('body-parser');
const passport = require('passport');

// DATABASE
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
  })
  .then(() => console.log('Database Connected.  Woo hoo!'))
  .catch(err => console.log(err));


// MIDDLEWARE
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(passport.initialize());

// PASSPORT CONFIG
require('./config/passport')(passport);
// ROUTE INFO
const users = require('./Routes/api/users');
const posts = require('./Routes/api/posts');
const profile = require('./Routes/api/profile');
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

// APP INIT
app.listen(port, () => console.log(`Server listening on port ${port}`));