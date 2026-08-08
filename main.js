const posthog = require('posthog-js');

const bot = {  
  init() {
    posthog.capture('app', { app: 'screeps' });
    posthog.enableGlobalErrorTracking();
  },
  
  log(message) {
    posthog.capture('user', { message });
  },
  

  // Role-specific functions go here (will be added as per issue requirements)
};

module.exports = bot;