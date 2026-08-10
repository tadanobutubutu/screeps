// Existing code remains unchanged

// New function to handle test failures
function handleTestFailures(testResults) {
  if (testResults.some(result => result.status === 'failed')) {
    console.error('Unit test failures detected:', testResults.filter(result => result.status === 'failed'));
    // Add additional error handling or logging as needed
  }
}

// Export the new function (optional, depending on your project structure)
// export { handleTestFailures };