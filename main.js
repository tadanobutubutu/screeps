const dependencies = {
  npm: [
    '@supabase/supabase-js',
    'next',
    'react',
    'react-dom',
    '@types/node',
    '@types/react',
    'postcss',
    'typescript',
    'eslint',
    'jest',
    'prettier',
    'rollup',
    'undici',
    'lodash',
    'posthog-js'
  ],
  actions: [
    'actions/checkout',
    'actions/setup-node',
    'actions/setup-python',
    'actions/first-interaction',
    'actions/stale',
    'actions/labeler'
  ],
  circleci: [
    'cimg/node'
  ],
  gitlabci: [
    'node'
  ]
};

const { version } = require('node'); // Added functionality to check Node version

// Added logging of Node version
console.log(`Current Node version: ${version}`);

function getPendingUpdates() {
  return {
    awaitingSchedule: [
      { name: 'node.js', current: '24.18.1', target: '24.19.0', type: 'chore' },
      { name: 'posthog-js', current: '1.409.5', target: '1.413.3', type: 'fix' },
      { name: 'actions/checkout', current: 'v4', target: 'v7', type: 'chore' },
      { name: 'typescript', current: '^5.7.3', target: '^7.0.0', type: 'chore' }
    ],
    security: [
      { name: 'undici', current: '>=6.24.0', target: 'v8.9.0', type: 'chore', security: true }
    ]
  };
}

function checkDependencyUpdates() {
  const updates = getPendingUpdates();
  return updates;
}

function validateDependencyConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('Invalid configuration');
  }
  return true;
}

function getSecurityUpdates() {
  const updates = getPendingUpdates();
  return updates.security || [];
}

function getScheduledUpdates() {
  const updates = getPendingUpdates();
  return updates.awaitingSchedule || [];
}

function getBlockedPRs() {
  return [
    { name: 'actions/checkout', prNumber: 978, reason: 'Blocked by existing closed PR' }
  ];
}

function getDependencySummary() {
  const updates = getPendingUpdates();
  const pending = updates.awaitingSchedule || [];
  const security = updates.security || [];
  return {
    totalPending: pending.length + security.length,
    securityCount: security.length,
    scheduledCount: pending.length,
    blockedCount: getBlockedPRs().length
  };
}

function getAllDetectedDependencies() {
  return {
    npm: dependencies.npm.length,
    actions: dependencies.actions.length,
    circleci: dependencies.circleci.length,
    gitlabci: dependencies.gitlabci.length,
    total: Object.values(dependencies).reduce((sum, arr) => sum + arr.length, 0)
  };
}

function checkForFailedLookups() {
  return [
    { package: 'github-_tags', error: 'Failed to look up github-_tags package', suggestion: 'no-result' }
  ];
}

module.exports = {
  dependencies,
  getPendingUpdates,
  checkDependencyUpdates,
  validateDependencyConfig,
  getSecurityUpdates,
  getScheduledUpdates,
  getBlockedPRs,
  getDependencySummary,
  getAllDetectedDependencies,
  checkForFailedLookups
};