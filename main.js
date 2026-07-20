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