const DaysController = require('../controllers/days');

module.exports = {
  start: ()=>{
    return setInterval(()=>{ // turn days
      DaysController.turnDays();
    }, 10*60*1000); // each 10 minutes
  },
};
