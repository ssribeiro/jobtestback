const mongoose  = require('mongoose');
const Schema  = mongoose.Schema;

/*
export interface Day {
  day: number;
  month: string;
  weekday: string;
  orderFromToday: number; // 0 for today, -1 for yesterday, +2 for the day next to tomorrow and so on...
  amountOfAThing: number; // Amount of any Stuff
};

let SampleDate:Day = {
  day: 6,
  month: 'july',
  weekday: 'friday',
  orderFromToday: 0,
  amountOfAThing: 27,
};
*/

const DaySchema  = new Schema({
    day: Number,
    month: String,
    weekday: String,
    orderFromToday: Number,
    relativeHumidity: Number,
});

DaySchema.statics.findByDay = function(day, cb) { return this.find({ day }, cb); };

module.exports = mongoose.model('Day', DaySchema);
