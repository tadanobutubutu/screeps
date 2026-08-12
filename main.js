// utils.tasks.js
// This file contains utility functions for task management

/**
 * Executes a task with error handling
 * @param {Function} task - The task function to execute
 * @param {Object} options - Configuration options
 * @returns {Promise} Resolves with task result or rejects with error
 */
async function executeTask(task, options = {}) {
  try {
    // Validate task is a function
    if (typeof task !== 'function') {
      throw new Error('Task must be a function');
    }

    // Execute the task with provided options
    const result = await task(options);

    // Return the result
    return result;
  } catch (error) {
    // Handle and log errors
    console.error('Task execution failed:', error);
    throw error; // Re-throw for caller to handle
  }
}

/**
 * Creates a task queue with concurrency control
 * @param {number} concurrency - Maximum number of concurrent tasks
 * @returns {Object} Task queue interface
 */
function createTaskQueue(concurrency = 1) {
  // Implementation would go here
  // This is just a placeholder to demonstrate the structure
  return {
    add: (task) => {
      // Queue implementation would go here
    },
    onIdle: () => {
      // Event handler would go here
    }
  };
}

// Export all utility functions
module.exports = {
  executeTask,
  createTaskQueue
};