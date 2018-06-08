const DayModel = require('../models/day');

const Util = require('../util');

const DaysController = {
  name: 'days',
  list: (req, res) => {
    DayModel.find(function(err, days) {
      if(err) res.send(err);
      res.json(days.sort(function(a, b){
        if(a.orderFromToday < b.orderFromToday) return -1;
        if(a.orderFromToday > b.orderFromToday) return 1;
        return 0;
      }));
    });
  },
  find: (req, res) => {
    DayModel.findByDay(req.params.id, function(err, day) {
      if(err) res.send(err);
      res.json(day[0]);
    });
  },
  updateDays: () => {
    console.log('updating days...');
    // Fetch a climate provider for relative humidity information on new york city
    const start = Util.moment().subtract(2, 'days').valueOf();
    const end = Util.moment().add(2, 'days').valueOf();
    /*Util.fetch(
      'http://history.openweathermap.org/data/2.5/history/city?id=5128638&type=hour&start='
      + start + '&end=' + end + '&APPID=' + 'a09fb7dc6d406551630877c5b4b72cac' )
      .then(res => res.json())
	    .then(json => console.log('got: ', json));*/
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
