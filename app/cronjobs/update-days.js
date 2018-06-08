const DaysController = require('../controllers/days');

module.exports = {
  start: ()=>{
    return setInterval(()=>{ // update days information
      DaysController.updateDays();
    }, 10*60*1000); // each 5 minutes
  },
};
