/** @type {import('jest').Config} */
export default {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/(?!(lodash)/)'],
    collectCoverageFrom: [
        'src/**/*.js',
        '*.js',
        '!jest.config.js',
        '!jest.config.mjs',
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
    globals: {},
    testPathIgnorePatterns: ['/node_modules/'],
    modulePaths: ['<rootDir>'],
};
