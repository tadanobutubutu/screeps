/**
 * Simple in‑memory task utilities.
 *
 * These tiny helpers are purposely kept minimal so that the unit tests
 * in `/tests/` can import this file directly and run the logic in isolation.
 *
 * Usage:
 *
 *   const id = addTask('Buy milk');        // id is a number
 *   console.log(listTasks());              // [ { id: 1, title: 'Buy milk', completed: false, createdAt: ..., updatedAt: ... } ]
 *   completeTask(id);
 *   console.log(listTasks());              // [ { id: 1, title: 'Buy milk', completed: true, createdAt: ..., updatedAt: ... } ]
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
 * @returns {Array<{id:number, title:string, completed:boolean, createdAt:number, updatedAt:number}>} All tasks.
 */
function listTasks() {
  // Return a shallow copy to avoid external mutation.
  return _tasks.map(({ id, title, completed, createdAt, updatedAt }) => ({
    id,
    title,
    completed,
    createdAt,
    updatedAt,
  }));
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
  task.completed =