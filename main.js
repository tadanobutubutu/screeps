/**
 * Simple in‑memory task utilities.
 *
 * The functions are intentionally very small so they can be unit‑tested
 * in isolation (the tests in `/tests/` can import this file directly).
 *
 * They operate on an internal array that lives for the process lifetime.
 *
 * Usage:
 *   const { addTask, listTasks, completeTask, removeTask, findTasks, getTaskById, updateTaskTitle, getTaskByIdByTitle, getCompletedTasks, getIncompleteTasks, clearAllTasks, getTaskCount } = require('./main');
 *
 *   const id = addTask('Buy milk');
 *   // [{ id: 1, title: 'Buy milk', completed: false }]
 *   completeTask(id);
 *   // [{ id: 1, title: 'Buy milk', completed: true }]
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
  const task = {
    id: _nextId++,
    title,
    completed: false,
    createdAt: Date.now()
  };
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
 * Finds tasks by title (case- insensitive partial match).
 *
 * @param {string} searchTerm - The term to search for in task titles.
 * @returns {Array} Array of matching tasks.
 */
function findTasks(searchTerm) {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return _tasks.filter(task =>
    task.title.toLowerCase().includes(lowerSearchTerm)
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
 * Gets a task by title (case-insensitive exact match).
 *
 * @param {string} title - The title of the task to retrieve.
 * @returns {Object|null} The task object or null if not found.
 */
function getTaskByIdByTitle(title) {
  const lowerTitle = title.toLowerCase();
  return _tasks.find(task => task.title.toLowerCase() === lowerTitle) || null;
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

/**
 * Gets all completed tasks.
 *
 * @returns {Array} Array of completed tasks.
 */
function getCompletedTasks() {
  return _tasks.filter(task => task.completed);
}

/**
 * Gets all incomplete tasks.
 *
 * @returns {Array} Array of incomplete tasks.
 */
function getIncompleteTasks() {
  return _tasks.filter(task => !task.completed);
}

/**
 * Clears all tasks.
 */
function clearAllTasks() {
  _tasks = [];
  _nextId = 1;
}

/**
 * Gets the total number of tasks.
 *
 * @returns {number} The count of all tasks.
 */
function getTaskCount() {
  return _tasks.length;
}

module.exports = {
  addTask,
  listTasks,
  completeTask,
  removeTask,
  findTasks,
  getTaskById,
  updateTaskTitle,
  getTaskByIdByTitle,
  getCompletedTasks,
  getIncompleteTasks,
  clearAllTasks,
  getTaskCount
};