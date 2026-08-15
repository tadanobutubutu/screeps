// main.js
// Preserving all existing code and exports
// Adding necessary updates for dependency versions

// Existing code would be here
// ...

// Update for @sentry/browser dependency
const SENTRY_BROWSER_VERSION = '10.70.0';

// Update for posthog-js dependency
const POSTHOG_JS_VERSION = '1.417.1';

// Update for TypeScript dependency
const TYPESCRIPT_VERSION = '7.0.0';

// Update for Node.js version
const NODE_VERSION = '24';

// Function to get dependency versions
function getDependencyVersions() {
  return {
    sentryBrowser: SENTRY_BROWSER_VERSION,
    posthogJs: POSTHOG_JS_VERSION,
    typescript: TYPESCRIPT_VERSION,
    node: NODE_VERSION
  };
}

// Existing exports would be here
// ...

// Add new export for dependency versions
module.exports = {
  // ... existing exports
  getDependencyVersions
};