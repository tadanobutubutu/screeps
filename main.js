// main.js

/**
 * Main entry point for the application.
 * Handles task management and utility integrations.
 */

const { runTask, addTask, removeTask, listTasks } = require('./utils.tasks');

/**
 * Initializes the application and sets up core functionality.
 */
function initializeApp() {
  console.log('Application initialized.');
  return {
    runTask,
    addTask,
    removeTask,
    listTasks,
  };
}

/**
 * Starts the task processing pipeline.
 * @param {Array} tasks - The list of tasks to process.
 */
function startPipeline(tasks) {
  if (!Array.isArray(tasks)) {
    throw new TypeError('Tasks must be an array.');
  }
  return tasks.map((task) => runTask(task));
}

/**
 * Gracefully shuts down the application.
 */
function shutdownApp() {
  console.log('Application shutting down.');
  return true;
}

module.exports = {
  initializeApp,
  startPipeline,
  shutdownApp,
};