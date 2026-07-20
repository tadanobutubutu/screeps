/**
 * Simple in‑memory task utilities.
 *
 * The functions are intentionally very small so they can be unit‑tested
 * in isolation (the tests in `/tests/` can import this file directly).
 *
 * They operate on an internal array that lives for the process lifetime.
 *
 * Usage:
 *   const { addTask, listTasks, completeTask, read, emotions } = require('./utils.tasks');
 *
 *   const id = addTask('Buy milk');
 *   console.log(listTasks());      // [{ id: 1, title: 'Buy milk', done: false, createdAt: 1700423904123 }]
 *   completeTask(id);
 *   console.log(emotions.parseEmotion('I am happy')); // { sentiment: 'neutral', score: 0 }
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
function add(/** @type {number} */ a, /** @type {number} */ b) {
    return a + b;
}

const emotions = {
  /**
   * Parses emotional context from text input
   * @param {string} text - Input text to analyze
   * @returns {{ sentiment: string, score: number }}
   */
  parseEmotion: function(/** @type {string} */ text) {
    // Basic fallback implementation
    return { sentiment: "neutral", score: 0 };
  },

  /**
   * Updates the emotion analysis model with new training data.
   * @param {Array<{text: string, sentiment: string}>} trainingData
   */
  updateModel: function(/** @type {Array<{text: string, sentiment: string}>} */ trainingData) {
    // Implementation would go here
  }
};

module.exports = {
    addTask,
    listTasks,
    completeTask,
    add,
    emotions
};