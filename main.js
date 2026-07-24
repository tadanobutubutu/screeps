// main.js - Dependency Management System

const tasks = new Map();
const dependencies = new Map();

/**
 * Adds a new task to the management system
 * @param {string} taskId - Unique identifier for the task
 * @param {Object} taskData - Task configuration object
 * @returns {Object} - The added task object
 */
function addTask(taskId, taskData = {}) {
  if (!taskId || typeof taskId !== 'string') {
    console.error('Invalid task ID provided');
    return null;
  }

  if (tasks.has(taskId)) {
    console.warn(`Task ${taskId} already exists`);
    return tasks.get(taskId);
  }

  const task = {
    id: taskId,
    data: taskData,
    dependencies: taskData.dependencies || {}, // Added dependencies as empty object
    priority: taskData.priority || 'normal',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  tasks.set(taskId, task);
  
  // Also register in dependencies map if provided
  if (taskData.dependencies && Object.keys(taskData.dependencies).length > 0) {
    dependencies.set(taskId, taskData.dependencies);
  }

  console.log(`Task ${taskId} added successfully`);
  return task;
}

/**
 * Updates task priority - legacy function name
 * @param {string} taskId - Task identifier
 * @param {string} priority - New priority level
 * @returns {boolean} - Success status
 */
function updateTaskPriority(taskId, priority) {
  return updateDependencyVersions(taskId, { priority });
}

/**
 * Updates dependency versions for a task
 * @param {string} taskId - Task identifier
 * @param {Object} updates - Object containing updates (priority, dependencies, etc.)
 * @returns {boolean} - Success status
 */
function updateDependencyVersions(taskId, updates = {}) {
  if (!taskId || !tasks.has(taskId)) {
    console.error(`Task ${taskId} not found`);
    return false;
  }

  const task = tasks.get(taskId);

  // Update priority if provided
  if (updates.priority) {
    task.priority = updates.priority;
    console.log(`Updated priority for ${taskId} to ${updates.priority}`);
  }

  // Update dependencies if provided
  if (updates.dependencies) {
    task.dependencies = { ...task.dependencies, ...updates.dependencies };
    dependencies.set(taskId, task.dependencies);
    console.log(`Updated dependencies for ${taskId}`);
  }

  // Update other task data
  if (updates.data) {
    task.data = { ...task.data, ...updates.data };
  }

  task.updatedAt = new Date().toISOString();
  return true;
}

/**
 * Gets a task by ID
 * @param {string} taskId - Task identifier
 * @returns {Object|null} - Task object or null if not found
 */
function getTask(taskId) {
  return tasks.get(taskId) || null;
}

/**
 * Gets all tasks
 * @returns {Array} - Array of all task objects
 */
function getAllTasks() {
  return Array.from(tasks.values());
}

/**
 * Removes a task
 * @param {string} taskId - Task identifier
 * @returns {boolean} - Success status
 */
function removeTask(taskId) {
  if (!tasks.has(taskId)) {
    console.warn(`Task ${taskId} not found`);
    return false;
  }

  tasks.delete(taskId);
  dependencies.delete(taskId);
  console.log(`Task ${taskId} removed`);
  return true;
}

/**
 * Gets dependencies for a task
 * @param {string} taskId - Task identifier
 * @returns {Object} - Dependencies object or empty object
 */
function getTaskDependencies(taskId) {
  return dependencies.get(taskId) || {};
}

/**
 * Updates the status of a task
 * @param {string} taskId - Task identifier
 * @param {string} status - New status
 * @returns {boolean} - Success status
 */
function updateTaskStatus(taskId, status) {
  if (!taskId || !tasks.has(taskId)) {
    console.error(`Task ${taskId} not found`);
    return false;
  }

  const task = tasks.get(taskId);
  task.status = status;
  task.updatedAt = new Date().toISOString();
  console.log(`Task ${taskId} status updated to ${status}`);
  return true;
}

/**
 * Clears all tasks and dependencies
 */
function clearAll() {
  tasks.clear();
  dependencies.clear();
  console.log('All tasks and dependencies cleared');
}

// Export all functions and objects
module.exports = {
  addTask,
  updateTaskPriority,
  updateDependencyVersions,
  getTask,
  getAllTasks,
  removeTask,
  getTaskDependencies,
  updateTaskStatus,
  updateTask: updateDependencyVersions, // Alias for backward compatibility
  clearAll,
  tasks,
  dependencies
};