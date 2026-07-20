/**
 * Simple in‑memory task utilities.
 *
 * The functions are intentionally very small so they can be unit‑tested
 * in isolation (the tests in `/tests/` can import this file directly).
 *
 * They operate on an internal array that lives for the process lifetime.
 *
 * Usage:
 *   const { addTask, listTasks, completeTask, add, emotions } = require('./utils.tasks');
 *
 *   const id = addTask('Buy milk');
 *   console.log(listTasks());      // [{ id: 1, title: 'Buy milk', done: false, createdAt: 1700423904123 }]
 *   completeTask(id);
 *   console.log(emotions.parseEmotion('I am happy')); // { sentiment: "neutral", score: 0 }
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
    const task = { id: _nextId++, title, done: false, createdAt: Date.now() };
    _tasks.push(task);
    return task.id;
}

/**
 * Lists all tasks.
 *
 * @returns {Array<{id:number,title:string,done:boolean,createdAt:number}>}
 */
function listTasks() {
    return _tasks.slice();
}

/**
 * Marks a task