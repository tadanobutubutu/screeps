// utils.tasks.js
// (Assuming this is the file where the issue exists)

/**
 * Example function that was causing the lint error
 * @param {string} taskName - Name of the task
 * @returns {Promise} Resolves when task is complete
 */
async function exampleTask(taskName) {
  // This was the unterminated comment that needed fixing
  // /* This comment was not properly closed */

  // Rest of the function implementation
  console.log(`Processing task: ${taskName}`);
  return Promise.resolve();
}

// Other existing functions in utils.tasks.js should remain unchanged
// Make sure to preserve all existing exports and functions