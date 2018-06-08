const ForecastsController = require('../controllers/forecasts');

module.exports = {
  start: ()=>{
    ForecastsController.generateForecasts();
    return setInterval(()=>{ // update days information
      ForecastsController.generateForecasts();
    }, 3*60*60*1000); // each 3 hours
  },
};
