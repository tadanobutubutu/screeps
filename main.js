// main.js - Application entry point with TestDriver integration

// Import sample test suite
const testSuite = require('./tests/sample_test_suite');

// ... rest of the main.js code

// Import the TestDriver utilities
const { TestDriver, TestDriverConfig } = module.exports;

// Create an instance of TestDriver
const testDriver = new TestDriver(TestDriverConfig);

// Run the sample test suite
testSuite(testDriver).then(() => {
  console.log('Test suite completed');
  testDriver.finish().then(() => process.exit(0));
});