// Main entry point for the application

const runTests = () => {
  console.log('Running tests...');
};

const main = () => {
  console.log('Application started');
  runTests();
};

// Export for testing
module.exports = {
  main,
  runTests
};

// Run if executed directly
if (require.main === module) {
  main();
}