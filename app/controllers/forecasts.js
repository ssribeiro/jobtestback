const ForecastModel = require('../models/forecast');
const ForecastProvider = require('../providers/forecast');
const Util = require('../util');

const ForecastsController = {
  name: 'forecasts',
  generateForecasts: () => {
    console.log('generating forecasts..');
    ForecastProvider.getForecasts((err, forecasts) => {
      if(err) console.log('Error generating forecasts: ', err);
      else {
        forecasts.forEach(forecast=>{
          forecast_parsed = ForecastsController.parseProvidedForecast(forecast);
          ForecastModel.updateOrSave(forecast_parsed, (err) => {
            if(err) console.log('error saving forecast');
          });
        });
        console.log('forecasts generated.');
      }
    });
  },
  parseProvidedForecast: (provided) => {
    const city = provided.city;
    console.log(provided);
    const time_stamp = Util.moment(+provided.dt*1000).valueOf();
    const main_information = provided.main;
    return { city, time_stamp, main_information };
  },
};

module.exports = ForecastsController;
