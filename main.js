const { prepareData } = require("./prepare_data");
const cron = require('node-cron');
require('events').EventEmitter.defaultMaxListeners = 15;

async function start() {
  prepareData();
  cron.schedule('*/30 * * * *', () => {
    prepareData();
  });
}
// const job = new CronJob(
//   "00 00 00,12 * * *",
//   start,
//   null,
//   true,
//   "Europe/Helsinki"
// );

// job.start();
start();

