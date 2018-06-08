const Util = require('../util');
const env = require('../../env');

const ForecastProvider = {
  getForecasts: (cb) => {
    // get for New York
    let new_york = [];
    let tokyo = [];
    let sao_paulo = [];
    ForecastProvider.getCityForecasts('5128638', (err, ny_forecasts) => {
      if(err) cb(err);
      else {
        new_york = ny_forecasts.list;
        // get for Tokyo
        ForecastProvider.getCityForecasts('1850147', (err, tk_forecasts) => {
          if(err) cb(err);
          else {
            tokyo = tk_forecasts.list;
            // get for Sao Paulo
            ForecastProvider.getCityForecasts('3448439', (err, sp_forecasts) => {
              sao_paulo = sp_forecasts.list;

              new_york = new_york.map(forecast=>{ forecast.city = 'ny'; return forecast; });
              tokyo = tokyo.map(forecast=>{ forecast.city = 'tk'; return forecast; });
              sao_paulo = sao_paulo.map(forecast=>{ forecast.city = 'sp'; return forecast; });

              let mixed = new_york.concat(tokyo, sao_paulo);
              cb(null, mixed);
            });
          }
        });
      }
    });
  },
  getCityForecasts: (id, cb) => {
    Util.fetch(
      'https://api.openweathermap.org/data/2.5/forecast?'
      +'appid='+env.forecast_api_id
      +'&id='+id)
      .then(res => res.json())
	    .then(json => cb(null, json))
      .catch(err => cb(err));
  }
};

module.exports = ForecastProvider;
