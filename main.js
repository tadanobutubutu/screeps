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
  const task = { id: _nextId++, title, completed: false, createdAt: Date.now(), updatedAt: Date.now() };
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
  task.updatedAt = Date.now();
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
 * @returns {Array<{id:number, title:string, completed:boolean}>} The tasks that satisfy the predicate.
 */
function findTasks(predicate) {
  if (typeof predicate !== 'function') {
    throw new TypeError('Predicate must be a function');
  }
  return _tasks
    .filter(predicate)
    .map(({ id, title, completed }) => ({ id, title, completed }));
}

/**
 * Gets a task by its ID.
 *
 * @param {number} id - The ID of the task.
 * @returns {(Object|null)} The task object or null if not found.
 */
function getTaskById(id) {
  const task = _tasks.find(t => t.id === id);
  if (!task) return null;
  const { id: taskId, title, completed } = task;
  return { id: taskId, title, completed };
}

/**
 * Updates the title of a task.
 *
 * @param {number} id - The ID of the task to update.
 * @param {string} newTitle - The new title for the task.
 * @returns {boolean} True if the task