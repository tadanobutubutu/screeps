// utils.tasks.js
// This file contains task-related utility functions

/**
 * Processes a task and returns the result
 * @param {Object} task - The task to process
 * @returns {Promise<Object>} The processed task result
 */
async function processTask(task) {
  // Validate task input
  if (!task || typeof task !== 'object') {
    throw new Error('Invalid task input');
  }

  // Process the task
  try {
    // Add your task processing logic here
    return { ...task, status: 'completed' };
  } catch (error) {
    // Handle errors appropriately
    throw new Error(`Task processing failed: ${error.message}`);
  }
}

/**
 * Validates a task structure
 * @param {Object} task - The task to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateTask(task) {
  // Basic validation
  if (!task || typeof task !== 'object') {
    return false;
  }

  // Check required fields
  const requiredFields = ['id', 'name', 'type'];
  return requiredFields.every(field => task.hasOwnProperty(field));
}

// Export the utility functions
module.exports = {
  processTask,
  validateTask
};