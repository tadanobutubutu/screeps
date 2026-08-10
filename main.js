// main.js
// [Your existing code here]

// Example of how you might handle dependency updates
// This would be added to your existing codebase

// For the undici vulnerability update:
const undici = require('undici'); // Make sure you're using the latest version

// For the CodeQL action update:
/*
 * Update your GitHub Actions workflows to use:
 * - ... instead of v3
 */

// For the Node version updates:
/*
 * Update your devcontainer.json and other config files to use Node 24
 * instead of older versions
 */

// For the gitstream.yml issue:
/*
 * Either:
 * 1. Update the action reference to a valid version, or
 * 2. Remove the action if it's no longer needed
 */

// Import room manager module
const roomManager = require('./src/managers/roomManager');

// [Rest of your existing code]

// Export room manager for use in other modules
module.exports = {
  roomManager,
  undici
};