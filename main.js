/**
 * Simple in‑memory task utilities.
 *
 * The functions are intentionally very small so they can be unit‑tested
 * in isolation (the tests in `/tests/` can import this file directly).
 *
 * They operate on an internal array that lives for the process lifetime.
 *
 * Usage:
 *   const { addTask, listTasks, completeTask, removeTask, findTasks } = require('./utils.tasks');
 *
 *   const id = addTask('Buy milk');
 *   console.log(listTasks());      // [{ id: 1, title: 'Buy milk', done: false, createdAt: Date }]
 *   completeTask(id);
 */
"use strict";

let _nextId = 1;
const _tasks = [];

/**
 * Add a new task.
 *
 * @param {string} title – The task description.
 * @returns {number} The new task’s unique ID.
 */
function addTask(title) {
  if (typeof title !== 'string') {
    throw new TypeError('title must be a string');
  }
  const task = {
    id: _nextId++,
    title,
    done: false,
    createdAt: new Date(),
  };
  _tasks.push(task);
  return task.id;
}

/**
 * Remove a task by its id.
 *
 * @param {number} id – The ID of the task to remove.
 * @returns {boolean} True if a task was removed.
 */
function removeTask(id) {
  const idx = _tasks.findIndex(t => t.id === id);
  if (idx === -1) return false;
  _tasks.splice(idx, 1);
  return true;
}

/**
 * Mark a task as completed.
 *
 * @param {number} id – The ID of the task to complete.
 * @returns {boolean} True if the task was found and updated.
 */
function completeTask(id) {
  const task = _tasks.find(t => t.id === id);
  if (!task) return false;
  task.done = true;
  return true;
}

/**
 * Find tasks by optional filters.
 *
 * @param {Object} [options] – Filter options.
 * @param {boolean} [options.done] – Only show tasks with matching status.
 * @param {string} [options.titleContains] – Only show tasks whose title contains this string (case‑insensitive).
 * @returns {Array<{id:number,title:string,done:boolean,createdAt:Date}>}
 */
function findTasks(options = {}) {
  const { done, titleContains } = options;
  return _tasks.filter(task => {
    if (typeof done === 'boolean' && task.done !== done) return false;
    if (typeof titleContains === 'string' &&
        !task.title.toLowerCase().includes(titleContains.toLowerCase())) return false;
    return true;
  });
}

/**
 * List all tasks, optionally filtering by completion status.
 *
 * @param {Object} [options] – Filter options.
 * @param {boolean} [options.done] – Only show tasks with matching status.
 * @returns {Array<{id:number,title:string,done:boolean,createdAt:Date}>}
 */
function listTasks(options = {}) {
  const { done } = options;
  if (typeof done === 'undefined') {
    return [..._tasks];
  }
  return _tasks.filter(task => task.done === done);
}

module.exports = {
  addTask,
  listTasks,
  completeTask,
  removeTask,
  findTasks,
};