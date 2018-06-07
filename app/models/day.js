const mongoose  = require('mongoose');
const Schema  = mongoose.Schema;

const DaySchema  = new Schema({
    day: Number,
    month: String,
    weekday: String,
    orderFromToday: Number,
    relativeHumidity: Number,
});

const Util = require('../util');

DaySchema.statics.findByDay = function(day, cb) { return this.find({ day }, cb); };

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
    const dayNumber = date.date();
    const month = date.month()+1;
    const weekday = Util.localeWeekName(date.weekday());
    const orderFromToday = i;

    const day = { day: dayNumber, month, weekday, orderFromToday, relativeHumidity: null };
    days.push(new this(day));
  }
  days.forEach(day=>{
    day.save(err=>{ if(err) cb(err); });
  });
  console.log('days generated.');
};

DaySchema.statics.todayIsWrong = function(cb) {
  const today = Util.moment();
  this.findByDay(today.date(), function(err, daysFound) {
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

DaySchema.statics.turnDays = function(cb) {
  console.log('turning days..');
  this.dropAllDays(err=>{
    if(err) cb(err);
    else this.generateDays();
  });
};

module.exports = mongoose.model('Day', DaySchema);
