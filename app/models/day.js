const mongoose  = require('mongoose');
const Schema  = mongoose.Schema;

const DaySchema  = new Schema({
    time_stamp: Number,
    day: Number,
    month: Number,
    weekday: String,
    orderFromToday: Number,
    relativeHumidity: {
      ny: Number,
      tk: Number,
      sp: Number,
    },
});

const Util = require('../util');

DaySchema.statics.allSorted = function(cb) {
  this.find((err, days) => {
    if(err) cb(err);
    else {
      let days_sorted = days.sort(function(a, b){
        if(a.orderFromToday < b.orderFromToday) return -1;
        if(a.orderFromToday > b.orderFromToday) return 1;
        return 0;
      });
      cb(null, days_sorted);
    }
  });
};

DaySchema.statics.findByDay = function(day, cb) { return this.find({ day }, (err, days)=>{
  if(err) cb(err);
  else if(days) cb(null, days[0]);
  else cb(null, null);
}); };

DaySchema.statics.dropAllDays = function(cb) { return this.remove({}, cb); };

DaySchema.statics.isVoid = function(cb) {
  this.find((err, days) => {
    if(err) cb(err);
    else if(days.length == 0) cb(null, true);
    else cb(null, false);
  });
};

DaySchema.statics.generateDays = function(cb) {
  console.log('generating days..');
  let days = [];
  for(let i=-2; i<=2; i++) {
    /* Fullfill day */
    const date = Util.moment().add(i, 'days');
    const time_stamp = date.valueOf();
    const dayNumber = date.date();
    const month = date.month()+1;
    const weekday = Util.localeWeekName(date.weekday());
    const orderFromToday = i;

    const day = { time_stamp, day: dayNumber, month, weekday, orderFromToday, relativeHumidity: null };
    days.push(new this(day));
  }
  days.forEach(day=>{
    day.save(err=>{ if(err) cb(err); });
  });
  console.log('days generated.');
};

DaySchema.statics.todayIsWrong = function(cb) {
  const today = Util.moment();
  this.findByDay(today.date(), function(err, dayFound) {
    if(err) cb(err);
    else {
      const day = dayFound;
      if( day.orderFromToday != 0 ||
          day.month != (today.month()+1) ||
          day.weekday != Util.localeWeekName(today.weekday()) )
        cb(null, true);
      else cb(null, false);
    }
  });
};

DaySchema.statics.turnDays = function(cb) {
  console.log('turning days..');
  this.dropAllDays(err=>{
    if(err) cb(err);
    else this.generateDays();
  });
};

module.exports = mongoose.model('Day', DaySchema);
