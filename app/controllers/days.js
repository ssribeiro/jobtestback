const DayModel = require('../models/day');

const DaysController = {
  name: 'days',
  list: (req, res) => {
    DayModel.find(function(err, days) {
      if(err) res.send(err);
      res.json(days);
    });
  },
  find: (req, res) => {
    DayModel.findById(req.params.day, function(err, day) {
      if(err) res.send(err);
      res.json(day);
    });
  },
  updateDays: () => {
    console.log('updating days...');
  },
  turnDays: () => {
    console.log('turning days...');
  },
};

module.exports = DaysController;
