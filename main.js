// utils.tasks.js
// This file contains task-related utility functions

/**
 * Executes a series of tasks in sequence
 * @param {Array<Function>} tasks - Array of task functions to execute
 * @returns {Promise} Resolves when all tasks are complete
 */
async function runTasks(tasks) {
  for (const task of tasks) {
    await task();
  }
}

/**
 * Creates a new task with the given name and function
 * @param {string} name - Name of the task
 * @param {Function} fn - Task function to execute
 * @returns {Object} Task object
 */
function createTask(name, fn) {
  return {
    name,
    execute: fn
  };
}

// Example usage:
// const tasks = [
//   createTask('task1', async () => { /* task logic */ }),
//   createTask('task2', async () => { /* task logic */ })
// ];
// await runTasks(tasks);

module.exports = {
  runTasks,
  createTask
};