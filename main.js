// Dependency Dashboard Management

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
    'actions/github-script',
    'actions/upload-artifact',
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

console.log(`Node version: ${version}`); // Added logging of Node version

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

module.exports = {
  dependencies,
  getPendingUpdates,
  checkDependencyUpdates,
  validateDependencyConfig
};