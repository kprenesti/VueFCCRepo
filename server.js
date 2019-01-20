require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// DATABASE
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
  })
  .then(() => console.log('Database Connected.  Woo hoo!'))
  .catch(err => console.log(err));


// ROUTE INFO
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

app.get('/', (req, res) => {
  res.send('Hello');
})

// APP INIT
app.listen(port, () => console.log(`Server listening on port ${port}`));