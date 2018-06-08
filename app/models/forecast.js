const mongoose  = require('mongoose');
const Schema  = mongoose.Schema;

const ForecastSchema  = new Schema({
    city: String,
    time_stamp: Number,
    main_information : Object,
});

const Util = require('../util');

ForecastSchema.statics.updateOrSave = function(forecast, cb) {
  this.retrieve(forecast, (err, old_forecast)=>{
    if(err) cb(err);
    else {
      if(!!old_forecast) {
        old_forecast.main_information = forecast.main_information;
        old_forecast.save(cb);
      } else {
        new_forecast = this.create(forecast, cb);
      }
    }
  });
};

ForecastSchema.statics.retrieve = function(forecast, cb) {
  this.find({ city: forecast.city, time_stamp: forecast.time_stamp }, (err, forecasts) => {
    if(err) cb(err);
    else {
      if(forecasts.length == 0) cb(null, null);
      else cb(null, forecasts[0]);
    }
  });
};

ForecastSchema.statics.forDay = function(day, cb) {
  const starter = Util.moment(day.time_stamp).hours(0).minutes(0).seconds(0).milliseconds(0).valueOf();
  const ender = Util.moment(day.time_stamp).hours(23).minutes(59).seconds(59).milliseconds(999).valueOf();
  this.forecastsBetween(starter, ender, cb);
};

ForecastSchema.statics.forecastsBetween = function(starter, ender, cb) {
  this.find({ time_stamp: { '$gte': starter, '$lte': ender }}, cb);
};

ForecastSchema.statics.meanValues = function(forecasts) {
  const divisor = forecasts.length;
  if(forecasts.length==0) cb([]);
  else {
    let forecast = forecasts.reduce((forecast_total, forecast)=>{
      forecast_total.main_information.temp += forecast.main_information.temp;
      forecast_total.main_information.temp_min += forecast.main_information.temp_min;
      forecast_total.main_information.temp_max += forecast.main_information.temp_max;
      forecast_total.main_information.pressure += forecast.main_information.pressure;
      forecast_total.main_information.sea_level += forecast.main_information.sea_level;
      forecast_total.main_information.grnd_level += forecast.main_information.grnd_level;
      forecast_total.main_information.humidity += forecast.main_information.humidity;
      forecast_total.main_information.temp_kf += forecast.main_information.temp_kf;
      return forecast_total;
    });
    forecast.main_information.temp = forecast.main_information.temp / divisor;
    forecast.main_information.temp_min = forecast.main_information.temp_min / divisor;
    forecast.main_information.temp_max = forecast.main_information.temp_max / divisor;
    forecast.main_information.pressure = forecast.main_information.pressure / divisor;
    forecast.main_information.sea_level = forecast.main_information.sea_level / divisor;
    forecast.main_information.grnd_level = forecast.main_information.grnd_level / divisor;
    forecast.main_information.humidity = forecast.main_information.humidity / divisor;
    return forecast;
  }
};

ForecastSchema.statics.spreadInCities = function(forecasts) {
  let spread = {};
  forecasts.forEach(forecast=>{
    if( spread.hasOwnProperty(forecast.city) ) spread[forecast.city].push(forecast);
    else spread[forecast.city] = [forecast];
  });
  return spread;
};

module.exports = mongoose.model('Forecast', ForecastSchema);
