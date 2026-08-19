function getPendingUpdates() {
  return [
    { package: 'eslint', version: '^10.0.0' },
    { package: 'jest', version: '^30.0.0' },
    { package: 'typescript', version: '^7.0.0' },
    { package: 'react', version: '^19.0.0' },
  ];
}

function getDetectedDependencies() {
  return {
    circleci: [
      { package: 'cimg/node', version: '24.19.0' }
    ],
    gitlabci: [
      { package: 'node', version: '24' }
    ],
    npm: [
      { package: '@supabase/supabase-js', version: '^2.47.0' },
      { package: 'next', version: '^16.2.11' },
      { package: 'react', version: '^19.0.0' },
      { package: 'react-dom', version: '^19.0.0' },
      { package: '@types/node', version: '^24.0.0' },
      { package: '@types/react', version: '^19.0.0' },
      { package: 'postcss', version: '^8.5.23' },
      { package: 'typescript', version: '^5.7.3' },
      { package: 'postcss', version: '>=8.5.14' },
      { package: 'express', version: '^5.0.0' },
      { package: 'react', version: '^18.2.0' },
      { package: 'lodash', version: '^4.17.21' },
      { package: 'jest', version: '^29.6.1' },
      { package: 'eslint', version: '^8.47.0' },
      { package: 'babel-jest', version: '^29.6.1' },
      { package: 'undici', version: '>=6.24.0' },
      { package: 'tmp', version: '>=0.2.4' },
      { package: 'lodash', version: '>=4.18.1' }
    ],
    travis: [
      { package: 'node', version: '20' }
    ]
  };
}

function getBlockedPRs() {
  return [
    { number: 978, title: 'chore(deps): update ... action to v4' }
  ];
}

module.exports = { getPendingUpdates, getDetectedDependencies, getBlockedPRs };