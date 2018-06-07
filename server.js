// server.js

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;        // set our port

// DB Connection
const mongoose = require('mongoose');
mongoose.connect(
  process.env.MONGO_URL ||
  'mongodb://localhost:27017/jobtest'
, (err)=>{
  if(!err) console.log('Connected to MongoDB');
  else console.log('DB connection failure: ', err);
});

// Start cronjobs
const runningCronJobs = require('./app/cronjobs').start();

// Apply Routes
app.use('/api', require('./app/routes'));

// Start
app.listen(port);
console.log('Serving on port ' + port);
