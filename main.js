module.exports = {
  preset: '@babel/preset-env',
  testEnvironment: 'jest-environment-node',
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};