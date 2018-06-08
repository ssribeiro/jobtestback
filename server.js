// server.js
const env = require('./env');

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const cors       = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 8080;        // set our port

// DB Connection
const mongoose = require('mongoose');
mongoose.connect(
  process.env.MONGO_URL ||
  'mongodb://localhost:27017/jobtest'
, (err)=>{
  if(!err) {
    console.log('Connected to MongoDB');

    // Start cronjobs
    const runningCronJobs = require('./app/cronjobs').start();
  }
  else {
    console.log('DB connection failure: ', err);
    process.exit(1);
  }
});

// Apply Routes
app.use('/api', require('./app/routes'));

// Start;
if(!env.production) app.listen(port);
else {
  const fs = require('fs');
  const sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };
  const https = require('https');
  https.createServer(sslOptions, app).listen(8080);
}
console.log('Serving on port ' + port);

module.exports = app;
