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
 *   console.log(listTasks());      // [{ id: 1, title: 'Buy milk', completed: false }]
 *   completeTask(id);
 *   console.log(listTasks());      // [{ id: 1, title: 'Buy milk', completed: true }]
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
 * @param {(task: {id:number, title:string, completed:boolean, ...}) => boolean} predicate - A function that takes a task and returns true if it matches.
 * @returns {Array<{id:number, title:string, completed:boolean}>} The matching tasks.
 */
function findTasks(predicate) {
  return _tasks.filter(predicate).map(({ id, title, completed }) => ({ id, title, completed }));
}

/**
 * Retrieves a task by its ID.
 *
 * @param {number} id - The ID of the task to retrieve.
 * @returns {({id:number, title:string, completed:boolean}|null)} The task if found, otherwise null.
 */
function get