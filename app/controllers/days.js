const DayModel = require('../models/day');

const Util = require('../util');

const generateDays = () => {
  console.log('generating days..');

  let days = [];
  for(let i=-2; i<=2; i++) {
    /* Fullfill day */
    const date = Util.moment().add(i, 'days');
    const dayNumber = date.date();
    const month = date.month()+1;
    const weekday = Util.localeWeekName(date.weekday());
    const orderFromToday = i;

    const day = { day: dayNumber, month, weekday, orderFromToday, relativeHumidity: null };
    days.push(new DayModel(day));
  }
  days.forEach(day=>{
    day.save(err=>{
      if(err) return console.log('error saving one of the days on DB');
    });
  });
  console.log('days generated.');
};

const dropAllDays = (cb) => { DayModel.remove({}, cb); };

const todayIsWrong = (cb) => {
  const today = Util.moment();
  DayModel.findByDay(today.date(), function(err, daysFound) {
    if(err) cb(err);
    else {
      const day = daysFound[0];
      if( day.orderFromToday != 0 ||
          day.month != (today.month()+1) ||
          day.weekday != Util.localeWeekName(today.weekday()) )
        cb(null, true);
      else cb(null, false);
    }
  });
};

const turnDays = () => {
  console.log('turning days..');
  dropAllDays(err=>{
    if(err) console.log('Error dropping days..');
    else generateDays();
  });
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
    DayModel.findByDay(req.params.day, function(err, day) {
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
      else {
        todayIsWrong((err, wrongDay)=>{
          if(err) console.log('error recovering the day for the turn');
          else if(wrongDay) turnDays();
          else console.log('day not turned yet. leaving days alone.');
        });
      }
    });
  },
};

module.exports = DaysController;
