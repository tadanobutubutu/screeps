// Keep all existing content above here
// ... (rest of the original main.js content remains unchanged)
const { Worker } = require('worker_threads');
const { MessageChannel, parentPort } = require('worker_threads');

async function checkGitstreamVersion() {
  try {
    const child = new Worker(__filename, { type: 'module' });
    child.on('error', (error) => {
      console.error('Child process error:', error);
    });
    const { stdout } = await new Promise((resolve, reject) => {
      child.on('message', (message) => {
        if (message.error) reject(message.error);
        else resolve(message.stdout);
      });
      child.postMessage({ command: 'gitstreamChecks' });
    });
    const version = stdout.match(/(\d+\.\d+)/)?.[1] || '2';
    if (parseFloat(version) < 4) {
      console.warn('Gitstream version is outdated. Current version:', version);
    }
  } catch (error) {
    console.error('Gitstream check failed:', error);
  } finally {
    child.terminate();
  }
}

// All existing exports preserved below
module.exports = function initialize() {
  try {
    main_loop();
    const lastTime = Game.time;
    checkSettings();
  } catch (error) {
    console.error('Initialization failed:', error);
  }
};