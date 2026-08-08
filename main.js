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

// Add minimal test configuration for Jest coverage
if (process.env.NODE_ENV === 'test') {
  // Mock posthog for testing purposes
  jest.mock('posthog-js', () => ({
    capture: jest.fn(),
    enableGlobalErrorTracking: jest.fn()
  }));
}

module.exports = bot;