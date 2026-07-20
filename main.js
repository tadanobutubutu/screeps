/**
 * Simple in‑memory task utilities.
 *
 * The functions are intentionally very small so they can be unit‑tested
 * in isolation (the tests in `/tests/` can import this file directly).
 *
 * They operate on an internal array that lives for the process lifetime.
 *
 * Usage:
 *   const { addTask, listTasks, completeTask, read, parseEmotion } = require('./main.js');
 *
 *   const id = addTask('Buy milk');
 *   console.log(listTasks());      // [{ id: 1, title: 'Buy milk', done: false, createdAt: 1700423904123 }]
 *   completeTask(id);
 *   console.log(parseEmotion('I am happy')); // { sentiment: 'neutral', score: 0 }
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
    createdAt: Date.now()
  };
  _tasks.push(task);
  return task.id;
}

/**
 * List all tasks.
 *
 * @returns {Array<{id:number, title:string, done:boolean, createdAt:number}>} A copy of the task list.
 */
function listTasks() {
  return _tasks.map(t => ({ ...t }));
}

/**
 * Mark a task as completed.
 *
 * @param {number} id – The task ID to complete.
 */
function completeTask(id) {
  const task = _tasks.find(t => t.id === id);
  if (task) {
    task.done = true;
  }
}

/**
 * Reads content. (placeholder)
 *
 * @returns {string}
 */
function read() {
  // Implementation would go here
  return "";
}

/**
 * Emotion analysis utilities.
 */
const emotions = {
  /**
   * Parses emotional context from text input.
   *
   * @param {string} text - Input text to analyze
   * @returns {{ sentiment: string, score: number }}
   */
  parseEmotion: function (text) {
    // Simple heuristic placeholder
    if (typeof text !== 'string') {
      return { sentiment: 'neutral', score: 0 };
    }
    const lower = text.toLowerCase();
    let score = 0;
    if (lower.includes('happy') || lower.includes('great') || lower.includes('good')) {
      score = 1;
    } else if (lower.includes('sad') || lower.includes('bad') || lower.includes('terrible')) {
      score = -1;
    }
    const sentiment = score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
    return { sentiment, score };
  }
};

module.exports = {
  addTask,
  listTasks,
  completeTask,
  read,
  parseEmotion: emotions.parseEmotion
};