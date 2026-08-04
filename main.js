// Keep all existing content above here
// ... (rest of the original main.js content remains unchanged)

const { Worker, parentPort } = require('worker_threads');

// Define gitstreamChecks only if not already present
if (!('gitstreamChecks' in module.exports)) {
  async function checkGitstreamVersion() {
    let child;
    try {
      child = new Worker(__filename, { type: 'module' });
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

      const version = stdout || '2';
      if (parseFloat(version) < 4) {
        // Handle version check logic here if needed
      }
    } catch (error) {
      console.error('Gitstream check failed:', error);
    } finally {
      if (child) child.terminate();
    }
  }

  module.exports.gitstreamChecks = checkGitstreamVersion;
}

// All existing exports preserved below
module.exports.initialize = function initialize() {
  try {
    main_loop();
    const lastTime = Game.time;
    checkSettings();
    // Call the gitstreamChecks function if it exists
    if ('gitstreamChecks' in module.exports) {
      module.exports.gitstreamChecks();
    }
  } catch (error) {
    console.error('Initialization failed:', error);
  }
};