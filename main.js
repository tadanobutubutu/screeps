// Main.js - Module entry point

// utils/tasks.js

function isRandom(value, min, max) {
  return value >= min && value <= max;
}

/**
 * Task utility functions for the application
 */

/**
 * Default task configuration
 */
const DEFAULT_CONFIG = {
  timeout: 5000,
  retries: 3,
  priority: 'normal'
};

/**
 * Executes a task with the given options
 * @param {Object} options - Task options
 * @param {Function} callback - Task callback
 */
function executeTask(options, callback) {
  const config = Object.assign({}, DEFAULT_CONFIG, options);

  try {
    const result = callback(config);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Creates a new task with the given parameters
 * @param {string} name - Task name
 * @param {Object} params - Task parameters
 * @returns {Object} Task object
 */
function createTask(name, params) {
  return {
    id: Date.now(),
    name: name,
    params: params,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
}

/**
 * Updates an existing task
 * @param {Object} task - Task to update
 * @param {Object} updates - Updates to apply
 * @returns {Object} Updated task
 */
function updateTask(task, updates) {
  return Object.assign({}, task, updates, {
    updatedAt: new Date().toISOString()
  });
}

/**
 * Deletes a task by ID
 * @param {Array} tasks - Array of tasks
 * @param {number} taskId - Task ID to delete
 * @returns {Array} Filtered tasks array
 */
function deleteTask(tasks, taskId) {
  return tasks.filter(task => task.id !== taskId);
}

function getHealth() {
  return { status: 'ok' };
}

function getUnitHealth() {
  // This function has been added in the 'origin/main' branch.
  return { health: 100 }; // You may want to implement this function based on your bot's requirements.
}

// Export utility functions
module.exports = {
  isRandom,
  executeTask,
  createTask,
  updateTask,
  deleteTask,
  DEFAULT_CONFIG,
  getHealth,
  getUnitHealth // Include the function added in 'origin/main'
};