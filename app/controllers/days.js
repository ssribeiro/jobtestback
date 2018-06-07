const DayModel = require('../models/day');

const Util = require('../util');

const DaysController = {
  name: 'days',
  list: (req, res) => {
    DayModel.find(function(err, days) {
      if(err) res.send(err);
      res.json(days);
    });
  },
  find: (req, res) => {
    DayModel.findByDay(req.params.day, function(err, day) {
      if(err) res.send(err);
      res.json(day);
    });
  },
  updateDays: () => {
    console.log('updating days...');
  },
  turnDays: () => {
    DayModel.isVoid((err, isvoid)=>{
      if(err) console.log('error fetching db');
      else if(isvoid) DayModel.generateDays();
      else {
        DayModel.todayIsWrong((err, wrongDay)=>{
          if(err) console.log('error recovering the day for the turn');
          else if(wrongDay) DayModel.turnDays();
          else console.log('day not turned yet. leaving days alone.');
        });
      }
    });
  },
};

module.exports = DaysController;
