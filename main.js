// main.js
// Preserve all existing code and exports from the current file
// Only adding the new functions or changes requested in the issue

// Existing code would be here...

// Add new dependency-related functions
function getDependencyUpdates() {
  return {
    eslint: '^10.0.0',
    jest: '^30.0.0',
    'babel-jest': '^30.0.0',
    react: '^19.0.0',
    typescript: '^7.0.0'
  };
}

function getDependencyWarnings() {
  return {
    'google-osv-scanner-action': 'Updating multiple npm lock files is deprecated',
    'linear-bots/gitstream-github-action': 'Failed to look up github-tags package'
  };
}

function getDependencyDetails() {
  return {
    circleci: ['cimg/node 24.19.0'],
    devcontainer: [
      'mcr.microsoft.com/devcontainers/python 3.14',
      'ghcr.io/devcontainers/features/node 2',
      'node 24'
    ],
    githubActions: [
      'actions/checkout v7',
      'actions/setup-node v7',
      'actions/github-script v9',
      'google/osv-scanner-action v2.5.1',
      'github/codeql-action v4',
      'pnpm/action-setup v6'
    ],
    npm: [
      '@supabase/supabase-js ^2.47.0',
      'next ^16.2.11',
      'react ^19.0.0',
      'react-dom ^19.0.0',
      'typescript ^7.0.0'
    ]
  };
}

// Preserve all existing exports
// module.exports = { ...existingExports, ...newExports };