/**
 * Simple in‑memory task utilities.
 *
 * The functions are intentionally very small so they can be unit‑tested
 * in isolation (the tests in `/tests/` can import this file directly).
 *
 * They operate on an internal array that lives for the process lifetime.
 *
 * Usage:
 *   const { addTask, listTasks, completeTask } = require('./utils.tasks');
 *
 *   const id = addTask('Buy milk');
 *   console.log(listTasks());      // [{ id: 1, title: 'Buy milk', done: false }]
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
    createdAt