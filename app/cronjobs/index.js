const cronjobs = [
  require('./update-days'),
  require('./turn-days'),
  require('./fulfill-forecast'),
];

module.exports = {
  cronjobs: cronjobs,
  start: () => {
    let startedCronjobs = [];
    cronjobs.forEach(cronjob=>{
      startedCronjobs.push({ cronjob, task: cronjob.start() });
    });
    startedCronjobs.forEach(startedCronjob=>{
      console.log('Started cronjob with timeout: ', startedCronjob.task._idleTimeout);
    });
    return startedCronjobs;
  },
};
