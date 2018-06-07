const DayModel = require('../models/day');

const generateDays = () => {
  console.log('generating days..');

};

const todayIsWrong = () => {
  return false;
};

const turnDays = () => {
  console.log('turning days..');
};

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
    DayModel.find((err, days) => {
      if(err) console.log('turning days error in model access.');
      else if(days.length == 0) generateDays();
      else if(todayIsWrong()) turnDays();
      else console.log('day not tuned yet. leaving days alone.');
    });
  },
};

module.exports = DaysController;
