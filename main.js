// main.js - Application entry point with TestDriver integration

const fs = require('fs');
const path = require('path');

// Import sample test suite (if it exists)
const testSuite = (typeof require !== 'undefined') ? require('./tests/sample_test_suite') : undefined;

// TestDriver configuration for production environment testing
const TestDriverConfig = {
  baseUrl: process.env.TESTDRIVER_BASE_URL || 'https://api.example.com',
  apiKey: process.env.TESTDRIVER_API_KEY || 'test-api-key-fixture',
  timeout: 30000,
  retries: 2,
  environment: 'production'
};

// Import the TestDriver utilities
const { TestDriver, TestDriverConfig } = module.exports

// Create an instance of TestDriver
const testDriver = new TestDriver(TestDriverConfig)

async function navigate(url) {
  console.log(`... Navigating to ${url}`);
  const requestId = this.generateRequestId();
  return { success: true, url, requestId };
}

async function click(selector) {
  console.log(`... Clicking element ${selector}`);
  const requestId = this.generateRequestId();
  return { success: true, selector, requestId };
}

async function type(selector, text) {
  console.log(`... Typing "${text}" into ${selector}`);
  const requestId = this.generateRequestId();
  return { success: true, selector, text, requestId };
}

async function screenshot(name = 'screenshot') {
  console.log(`... Taking screenshot: ${name}`);
  const requestId = this.generateRequestId();
  return { success: true, name, requestId };
}

async function finish() {
  console.log('... Session finished');
  return { success: true };
}

// Helper to create a TestDriver instance for tests
function createTestDriver(overrideConfig = {}) {
  return new TestDriver(overrideConfig);
}

// Helper to load JSON fixtures
function loadFixture(filePath) {
  const absolutePath = path.resolve(__dirname, filePath);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

// Async function to setup and initialize a TestDriver
async function setupTestDriver(config = {}) {
  const driver = new TestDriver(config);
  await driver.initialize();
  return driver;
}

// Export TestDriver utilities and run the sample test suite if it exists
if (testSuite) {
  testSuite(testDriver).then(() => {
    console.log('Test suite completed')
    testDriver.finish().then(() => process.exit(0))
  })
}

// Export TestDriver utilities
module.exports = {
  TestDriver,
  TestDriverConfig,
  createTestDriver,
  loadFixture,
  setupTestDriver,
};