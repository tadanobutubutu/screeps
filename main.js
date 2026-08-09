// main.js
const { getCurrentVersion, updateVersion } = require('./versionUtils');
const { logUpdate } = require('./logger');

/**
 * Updates Node.js version to v24.19.0
 */
function updateNodeVersion() {
  const currentVersion = getCurrentVersion('node');
  if (currentVersion !== '24.19.0') {
    updateVersion('node', '24.19.0');
    logUpdate('Node.js', currentVersion, '24.19.0');
  }
}

/**
 * Updates TypeScript to v7
 */
function updateTypeScript() {
  const currentVersion = getCurrentVersion('typescript');
  if (currentVersion !== '7.0.0') {
    updateVersion('typescript', '7.0.0');
    logUpdate('TypeScript', currentVersion, '7.0.0');
  }
}

/**
 * Updates posthog-js to v1.414.0
 */
function updatePostHog() {
  const currentVersion = getCurrentVersion('posthog-js');
  if (currentVersion !== '1.414.0') {
    updateVersion('posthog-js', '1.414.0');
    logUpdate('posthog-js', currentVersion, '1.414.0');
  }
}

/**
 * Updates undici to v8.9.0
 */
function updateUndici() {
  const currentVersion = getCurrentVersion('undici');
  if (currentVersion !== '8.9.0') {
    updateVersion('undici', '8.9.0');
    logUpdate('undici', currentVersion, '8.9.0');
  }
}

/**
 * Updates actions/checkout to v7
 */
function updateCheckoutAction() {
  const currentVersion = getCurrentVersion('actions/checkout');
  if (currentVersion !== 'v7') {
    updateVersion('actions/checkout', 'v7');
    logUpdate('actions/checkout', currentVersion, 'v7');
  }
}

/**
 * Updates google/osv-scanner-action to v2.5.0
 */
function updateOsvScannerAction() {
  const currentVersion = getCurrentVersion('google/osv-scanner-action');
  if (currentVersion !== 'v2.5.0') {
    updateVersion('google/osv-scanner-action', 'v2.5.0');
    logUpdate('google/osv-scanner-action', currentVersion, 'v2.5.0');
  }
}

// Export all existing functions
module.exports = {
  // Existing exports
  ...require('./existingExports'),

  // New update functions
  updateNodeVersion,
  updateTypeScript,
  updatePostHog,
  updateUndici,
  updateCheckoutAction,
  updateOsvScannerAction
};