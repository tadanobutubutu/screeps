/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: [
        'src/**/*.js',
        '*.js',
        '!jest.config.js',
        '!node_modules/**',
        '!coverage/**',
    ],
    coverageReporters: ['lcov', 'text', 'json-summary'],
    coverageDirectory: 'coverage',
    testMatch: ['**/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: '.',
                outputName: 'junit.xml',
                classNameTemplate: '{filepath}',
            },
        ],
    ],
    // Screeps globals
    globals: {},
    testPathIgnorePatterns: ['/node_modules/'],
    modulePaths: ['<rootDir>'],
};
