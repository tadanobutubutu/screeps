/**
 * Simple in‑memory task utilities.
 *
 * These tiny helpers are purposely kept minimal so that the unit tests
 * in `/tests/` can import this file directly and run the logic in isolation.
 *
 * Usage:
 *
 *   const {
 *     addTask,
 *     listTasks,
 *     completeTask,
 *     removeTask,
 *     findTasks,
 *     getTaskById,
 *     updateTaskTitle
 *   } = require('./main');
 *
 *   const id = addTask('Buy milk');        // id is a number
 *   console.log(listTasks());              // [ { id: 1, title: 'Buy milk', completed: false } ]
 *   completeTask(id);
 *   console.log(listTasks());              // [ { id: 1, title: 'Buy milk', completed: true } ]
 *
 * @module main
 */
let _tasks = [];
let _nextId = 1;

/**
 * Adds a new task.
 *
 * @param {string} title - The task title.
 * @returns {number} The ID of the created task.
 */
function addTask(title) {
  const task = { id: _nextId++, title, completed: false };
  _tasks.push(task);
  return task.id;
}

/**
 * Lists all tasks.
 *
 * @returns {Array} Array of all tasks.
 */
function listTasks() {
  return [..._tasks];
}

/**
 * Marks a task as completed.
 *
 * @param {number} id - The ID of the task to complete.
 */
function completeTask(id) {
  const task = _tasks.find(t => t.id === id);
  if (task) {
    task.completed = true;
  }
}

/**
 * Removes a task by ID.
 *
 * @param {number} id - The ID of the task to remove.
 */
function removeTask(id) {
  _tasks = _tasks.filter(t => t.id !== id);
}

/**
 * Finds tasks by title (case-insensitive partial match).
 *
 * @param {string} searchTerm - The term to search for in task titles.
 * @returns {Array} Array of matching tasks.
 */
function findTasks(searchTerm) {
  return _tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

/**
 * Gets a task by ID.
 *
 * @param {number} id - The ID of the task to retrieve.
 * @returns {Object|null} The task object or null if not found.
 */
function getTaskById(id) {
  return _tasks.find(t => t.id === id) || null;
}

/**
 * Updates a task's title.
 *
 * @param {number} id - The ID of the task to update.
 * @param {string} newTitle - The new title for the task.
 */
function updateTaskTitle(id, newTitle) {
  const task = _tasks.find(t => t.id === id);
  if (task) {
    task.title = newTitle;
  }
}

module.exports = {
  addTask,
  listTasks,
  completeTask,
  removeTask,
  findTasks,
  getTaskById,
  updateTaskTitle
};