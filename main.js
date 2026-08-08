const posthog = require('posthog-js');

const bot = {
  init() {
    posthog.capture('app', { app: 'screeps' });
    posthog.enableGlobalErrorTracking();
  },

  log(message) {
    posthog.capture('user', { message });
  },

  // ... existing functions and code preserved from original main.js
};

// Add this helper function to ensure test_random.js can be properly parsed
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = bot;