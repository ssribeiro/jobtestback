const DayModel = require('../models/day');
const ForecastModel = require('../models/forecast');

const Util = require('../util');

const DaysController = {
  name: 'days',
  list: (req, res) => {
    DayModel.allSorted((err, days) => {
      if(err) res.send(err);
      res.json(days);
    });
  },
  find: (req, res) => {
    DayModel.findByDay(req.params.id, function(err, day) {
      if(err) res.send(err);
      else if(!!day){
        ForecastModel.forDay(day, (err, forecasts)=>{
          if(err) res.send(err);
          else {
            let day_weather = Object.assign({},
              { day: day.day },
              { weather: ForecastModel.spreadInCities(forecasts) }
            );
            res.json(day_weather);
          }
        });
      }
      else res.json({ error: 'outside scope'});
    });
  },
  updateDays: () => {
    console.log('updating days...');
    DayModel.allSorted((err, days)=>{
      if(!!err) console.log('error updating days');
      else {
        days.forEach(day => {
          ForecastModel.forDay(day, (err, forecasts) => {
            if(err) console.log('error retrieving day forecasts');
            else {
              if(forecasts.length > 0) {
                let spread_forecasts = ForecastModel.spreadInCities(forecasts);
                const mean_values = {
                  ny: ForecastModel.meanValues(spread_forecasts.ny),
                  tk: ForecastModel.meanValues(spread_forecasts.tk),
                  sp: ForecastModel.meanValues(spread_forecasts.sp),
                };
                day.relativeHumidity = {};
                day.relativeHumidity.ny = mean_values.ny.main_information.humidity;
                day.relativeHumidity.tk = mean_values.tk.main_information.humidity;
                day.relativeHumidity.sp = mean_values.sp.main_information.humidity;
                day.save(err=> {
                  if(err) console.log('error saving day in update days');
                });
              }
            }
          });
        });
        console.log('finished days updating');
      }
    });
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
