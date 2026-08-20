// main.js - Dependency Dashboard Issue Resolution
// This file addresses the Renovate dependency update configuration

// Configuration for single lock file strategy to fix deprecation warning
const dependencyConfig = {
  lockFileMaintenance: {
    enabled: true,
    branchName: 'renovate/pin-dependencies',
    commitMessageAction: 'Pin dependencies',
    schedule: ['before 5am on the first day of the month']
  }
};

// Fix for github-tags lookup failure
const packageLookupConfig = {
  registryUrls: ['https://registry.npmjs.org'],
  reverseVersions: true
};

// Export configuration for use by other modules
module.exports = {
  dependencyConfig,
  packageLookupConfig
};