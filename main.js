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
    const task = { id: _nextId++, title, done: false };
    _tasks.push(task);
    return task.id;
}

/**
 * Lists all tasks.
 *
 * @returns {Array<{id:number,title:string,done:boolean}>}
 */
function listTasks() {
    return _tasks.slice();
}

/**
 * Marks a task as completed.
 *
 * @param {number} id – The task's ID.
 * @throws Will throw an error if the task is not found.
 */
function completeTask(id) {
    const task = _tasks.find(t => t.id === id);
    if (!task) {
        throw new Error(`No task with id ${id}`);
    }
    task.done = true;
}

/**
 * Adds two numbers.
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
    return a