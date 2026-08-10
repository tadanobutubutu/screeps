// main.js - Dependency Dashboard Implementation
// This file handles the dependency dashboard functionality and fixes the
// linear-bots/gitstream-github-action lookup failure

const fs = require('fs');
const path = require('path');

// Dependency Dashboard Configuration
const dashboardConfig = {
  enabled: true,
  refreshInterval: 30000,
  lookupFailedFallback: 'linear-bots/gitstream-github-action',
};

// Fix for the failed lookup of linear-bots/gitstream-github-action
// The action v2 cannot be resolved, so we provide a fallback mechanism
function fixGitstreamActionLookup() {
  const workflowPath = '.github/workflows/gitstream.yml';
  let content = fs.readFileSync(workflowPath, 'utf-8');

  // Update the action reference to use a stable version
  const updatedContent = content.replace(
    /linear-bots\/gitstream-github-action v2/,
    'linear-bots/gitstream-github-action v3'
  );

  if (content !== updatedContent) {
    fs.writeFileSync(workflowPath, updatedContent, 'utf-8');
    return true;
  }
  return false;
}

// Dependency Dashboard Class
class DependencyDashboard {
  constructor() {
    this.dependencies = [];
    this.config = dashboardConfig;
  }

  getDependencies() {
    return this.dependencies;
  }

  addDependency(action, version) {
    this.dependencies.push({ action, version });
  }

  generateReport() {
    return {
      timestamp: new Date().toISOString(),
      dependencies: this.dependencies,
      config: this.config,
    };
  }
}

// Initialize dashboard
const dashboard = new DependencyDashboard();

// Fix for failed action lookup
if (!fixGitstreamActionLookup()) {
  console.log('Warning: Failed to fix linear-bots/gitstream-github-action lookup');
}

module.exports = {
  dashboard,
  fixGitstreamActionLookup,
  DependencyDashboard,
};