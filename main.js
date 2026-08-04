// Keep all existing content above here
// ... (rest of the original main.js content remains unchanged)

// Detect message channel
import { MessageChannel } from 'worker_threads';

// Add gitstreamChecks functionality
async function checkGitstreamVersion() {
  try {
    const exec = require('child_process').exec;
    const { stdout } = await new Promise((resolve, reject) => {
      exec('gitstream --version', (error, stdout, stderr) => {
        if (error) reject(stderr);
        resolve(stdout);
      });
    });
    const version = stdout.trim().match(/version (\d+\.\d+)/)?.[1] || '2';
    if (parseFloat(version) < 4) {
      console warns('WARNING: Gitstream version <4.0.0 detected. Upgrade recommended.');
    }
  } catch (error) {
    console error('Gitstream check failed:', error);
  }
}

checkGitstreamVersion();

// All existing exports preserved below
export default function initialize() {
  try {
    main_loop();
    Memory.ipfsInitStarted = Game.time;
    checkSettings();
  } catch (error) {
    console error('Initialization failed:', error);
  }
}