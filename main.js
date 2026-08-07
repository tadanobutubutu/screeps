// main.js
const { Worker } = require('screeps');
const { mainLoop } = require('./src/mainLoop');

const worker = new Worker();

worker.run(mainLoop);

// Export any necessary functions for testing
module.exports = {
  worker,
  mainLoop
};