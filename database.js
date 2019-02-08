const mongoose = require('mongoose');
const {mongoURI} = require('./config/keys');

mongoose
  .connect(
    mongoURI,
    {
      useNewUrlParser: true,
    },
  )
  .then(db => console.log('DB is connected'))
  .catch(err => console.log(err));
