// utils.tasks.js

/**
 * Utility functions for task management
 */

/**
 * Task priority levels
 */
const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

/**
 * Task status options
 */
const STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

/**
 * Creates a new task object
 * @param {string} title - Task title
 * @param {string} description - Task description
 * @param {string} priority - Task priority level
 * @returns {Object} New task object
 */
function createTask(title, description, priority = PRIORITY.MEDIUM) {
  return {
    id: generateId(),
    title,
    description,
    priority,
    status: STATUS.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Generates a unique ID for tasks
 * @returns {string} Unique identifier
 */
function generateId() {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validates task data
 * @param {Object} task - Task object to validate
 * @returns {boolean} Whether task is valid
 */
function validateTask(task) {
  if (!task.title || typeof task.title !== 'string') {
    return false;
  }
  if (!task.priority || !Object.values(PRIORITY).includes(task.priority)) {
    return false;
  }
  return true;
}

/**
 * Updates task status
 * @param {Object} task - Task to update
 * @param {string} newStatus - New status value
 * @returns {Object} Updated task
 */
function updateTaskStatus(task, newStatus) {
  if (!Object.values(STATUS).includes(newStatus)) {
    throw new Error('Invalid status value');
  }
  return {
    ...task,
    status: newStatus,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Filters tasks by priority
 * @param {Array} tasks - Array of tasks
 * @param {string} priority - Priority level to filter by
 * @returns {Array} Filtered tasks
 */
function filterByPriority(tasks, priority) {
  return tasks.filter(task => task.priority === priority);
}

/**
 * Sorts tasks by creation date
 * @param {Array} tasks - Array of tasks
 * @param {boolean} ascending - Sort order
 * @returns {Array} Sorted tasks
 */
function sortByDate(tasks, ascending = true) {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

module.exports = {
  PRIORITY,
  STATUS,
  createTask,
  generateId,
  validateTask,
  updateTaskStatus,
  filterByPriority,
  sortByDate
};