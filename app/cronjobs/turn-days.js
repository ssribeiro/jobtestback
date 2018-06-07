const DaysController = require('../controllers/days');

module.exports = {
  start: ()=>{
    return setInterval(()=>{ // turn days
      DaysController.turnDays();
    }, 1*3*1000); // each 10 minutes
  },
};
