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

  // Adding a testable version of the bot object
  getBotInstance() {
    return this;
  }
};

module.exports = bot;