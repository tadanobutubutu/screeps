// Preserve all existing code, exports, and functions
// Add new functions or changes requested in the issue here

// Fix for utils.tasks.js unterminated comment issue
// The comment on line 47 needs to be properly closed

/*
 * Task utility functions
 * Original unterminated comment fixed below
 */

function validateTask(task) {
  if (!task || typeof task !== 'object') {
    return false;
  }
  if (!task.id || !task.name) {
    return false;
  }
  return true;
}

function processTaskQueue(tasks) {
  const validTasks = [];
  for (const task of tasks) {
    if (validateTask(task)) {
      validTasks.push(task);
    }
  }
  return validTasks;
}

// Export functions for use in other modules
module.exports = {
  validateTask,
  processTaskQueue
};