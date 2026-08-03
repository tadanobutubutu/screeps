/**
 * Main entry point for the application.
 * Handles task management and utility functions.
 */

const { addTask, removeTask, getTasks } = require('./utils.tasks');

/**
 * Initialize the application with default tasks.
 * @returns {Array} The initial list of tasks.
 */
function initializeApp() {
  const defaultTasks = [
    { id: 1, title: 'Setup project', completed: false },
    { id: 2, title: 'Write tests', completed: false },
    { id: 3, title: 'Review code', completed: false }
  ];
  return defaultTasks;
}

/**
 * Run the main application logic.
 */
function main() {
  const tasks = initializeApp();
  console.log('Application started with tasks:', tasks);

  // Add a new task
  const newTask = addTask(tasks, 'Deploy application');
  console.log('After adding task:', newTask);

  // Complete a task
  const updatedTasks = removeTask(tasks, 2);
  console.log('After removing task:', updatedTasks);

  // Get all remaining tasks
  const remainingTasks = getTasks(updatedTasks);
  console.log('Remaining tasks:', remainingTasks);
}

// Execute main function when this file is run directly
if (require.main === module) {
  main();
}

module.exports = {
  initializeApp,
  main
};