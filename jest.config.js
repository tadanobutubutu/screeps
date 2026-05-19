module.exports = {
  // テスト環境
  testEnvironment: 'node',

  // テスト対象
  testMatch: ['**/tests/**/*.test.js', '**/__tests__/**/*.js'],

  // カバレッジ設定
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'json-summary', 'text'],
  collectCoverageFrom: [
    '*.js',
    '!jest.config.js',
    '!rollup.config.mjs',
    '!node_modules/**',
    '!coverage/**',
    '!dist/**'
  ],

  // JUnit XMLレポーター（Codecov Test Results用）
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}'
    }]
  ]
};
