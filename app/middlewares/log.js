// middleware to log all requests
module.exports = function(req, res, next) {
  console.log('We got a REQUEST!'); // do logging
  next();
};
