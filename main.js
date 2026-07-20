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
 * Finds tasks based on a query string or a predicate function.
 *
 * If a string is provided, it returns tasks whose titles contain the string
 * (case‑insensitive). If a function is provided, it uses that function to
 * filter the tasks. The filter function receives a task object and should
 * return a boolean.
 *
 * @param {string|function} queryOrPredicate - A search string or a predicate function.
 * @returns {Array<{id:number, title:string, completed:boolean}>} The matching tasks.
 */
function findTasks(queryOrPredicate) {
  let predicate;
  if (typeof queryOrPredicate === 'function') {
    predicate = queryOrPredicate;
  } else if (typeof queryOrPredicate === 'string') {
    const q = queryOrPredicate.toLowerCase();
    predicate = task => task.title.toLowerCase().includes(q);
  } else {
    throw new TypeError('findTasks expects a string or predicate function');
  }
  return _tasks
    .filter(predicate)
    .map