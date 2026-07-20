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
  const task = {
    id: _nextId++,
    title,
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
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
 * @returns {boolean} True if the task was found and updated, false otherwise.
 */
function completeTask(id) {
  const task = _tasks.find(t => t.id === id);
  if (task) {
    task.completed = true;
    task.updatedAt = Date.now();
    return true;
  }
  return false;
}

/**
 * Removes a task by ID.
 *
 * @param {number} id - The ID of the task to remove.
 * @returns {boolean} True if the task was found and removed, false otherwise.
 */
function removeTask(id) {
  const initialLength = _tasks.length;
  _tasks = _tasks.filter(t => t.id !== id);
  return _tasks.length !== initialLength;
}

/**
 * Finds tasks whose titles contain the given query string (case-insensitive).
 *
 * @param {string} query - The query string to search for.
 * @returns {Array<{id:number, title:string, completed:boolean}>} Matching tasks.
 */
function findTasks(query) {
  const lower = query.toLowerCase();
  return _tasks
    .filter(t => t.title.toLowerCase().includes(lower))
    .map(({ id, title, completed }) => ({ id, title, completed }));
}

/**
 * Retrieves a task by ID.
 *
 * @param {number} id - The ID of the desired task.
 * @returns {Object|null} The task object without internal metadata, or null if not found.
 */
function getTaskById(id) {
  const task = _tasks.find(t => t.id === id);
  if (!task) return null;
  const { id: taskId, title, completed } = task;
  return { id: taskId, title, completed };
}

/**
 * Updates a task's title.
 *
 * @param {number} id - The ID of the task to update.
 * @param {string} newTitle - The new title for the task.
 * @returns {boolean} True if the task was found and