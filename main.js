/**
 * Simple in‑memory task utilities.
 *
 * The functions are intentionally very small so they can be unit‑tested
 * in isolation (the tests in `/tests/` can import this file directly).
 *
 * They operate on an internal array that lives for the process lifetime.
 *
 * Usage:
 *   const { addTask, listTasks, completeTask, removeTask, findTasks, getTaskById, updateTaskTitle } = require('./main');
 *
 *   const id = addTask('Buy milk');
 *   );      // [{ id: 1, title: 'Buy milk', completed: false }]
 *   completeTask(id);
 *   );      // [{ id: 1, title: 'Buy milk', completed: true }]
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
  const task = { id: _nextId++, title, completed: false, createdAt: Date.now() };
  _tasks.push(task);
  return task.id;
}

/**
 * Lists all tasks.
 *
 * @returns {Array<{id:number, title:string, completed:boolean}>} All tasks.
 */
function listTasks() {
  // Return a shallow copy to avoid external mutation.
  return _tasks.map(({ id, title, completed }) => ({ id, title, completed }));
}

/**
 * Marks a task as completed.
 *
 * @param {number} id - The ID of the task to complete.
 * @returns {boolean} True if a task was found and marked as completed.
 */
function completeTask(id) {
  const task = _tasks.find(t => t.id === id);
  if (task === undefined || task === null) return false;
  task.completed = true;
  return true;
}

/**
 * Removes a task from the list.
 *
 * @param {number} id - The ID of the task to remove.
 * @returns {boolean} True if a task was found and removed.
 */
function removeTask(id) {
  const index = _tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  _tasks.splice(index, 1);
  return true;
}

/**
 * Finds tasks that match a given predicate.
 *
 * @param {function} predicate - A function that takes a task and returns a boolean.
 * @returns {Array<{id:number, title:string, completed:boolean}>} Matching tasks.
 */
function findTasks(predicate) {
  // Use the same mapping as listTasks to keep the API consistent.
  return _tasks.filter(predicate).map(({ id, title, completed }) => ({ id, title, completed }));
}

/**
 * Gets a task by its ID.
 *
 * @param {number} id - The ID of the task to retrieve.
 * @returns {{id:number, title:string, completed:boolean}|null} The task or null if not found.
 */
function getTaskById(id) {
  const task = _tasks.find(t => t.id === id);
  if (task === undefined || task === null) return null;
  return { id: task.id, title: task.title, completed: task.completed };
}

/**
 * Updates the title of a task.
 *
 * @param {number} id - The ID of the task to update.
 * @param {string} newTitle - The new title for the task.
 * @returns {boolean} True if the task was found and updated.
 */
function updateTaskTitle(id, newTitle) {
  const task = _tasks.find(t => t.id === id);
  if (task === undefined || task === null) return false;
  task.title = newTitle;
  return true;
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