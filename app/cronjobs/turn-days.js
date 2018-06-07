const DaysController = require('../controllers/days');

module.exports = {
  start: ()=>{
    DaysController.turnDays(); // grants a first run
    return setInterval(()=>{ // turn days
      DaysController.turnDays();
    }, 10*60*1000); // each 10 minutes
  },
};
