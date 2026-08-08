const posthog = require('posthog-js').default || require('posthog-js');

const bot = {
  init() {
    posthog.capture('app', { app: 'screeps' });
  },

  log(message) {
    posthog.capture('user', { message });
  },

  // existing functions and code preserved from original main.js
};

module.exports = bot;