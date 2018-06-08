const ForecastsController = require('../controllers/forecasts');

module.exports = {
  start: ()=>{
    ForecastsController.generateForecasts();
    return setInterval(()=>{ // update days information
      ForecastsController.generateForecasts();
    }, 1*60*60*1000); // each hour
  },
};
