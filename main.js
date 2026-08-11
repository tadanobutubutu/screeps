// utils.tasks.js

// Helper function to format task output
function formatTaskOutput(tasks) {
  return tasks.map(task => {
    return {
      id: task.id,
      name: task.name,
      status: task.status,
    };
  });
}

// Function to validate task data
function validateTaskData(task) {
  if (!task || typeof task !== 'object') {
    return false;
  }
  return true;
}

// Main function to process tasks
function processTasks(tasks) {
  const validTasks = tasks.filter(validateTaskData);
  return formatTaskOutput(validTasks);
}

/*
 * Multi-line comment describing the export structure
 * This is a properly terminated multi-line comment
 */

// Export the module
module.exports = {
  formatTaskOutput,
  validateTaskData,
  processTasks,
};