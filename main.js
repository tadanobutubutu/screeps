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
 * Emotion analysis utilities.
 */
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

/**
 * Parses emotion from a single text string, delegating to emotions.parseEmotion.
 * @param {string} text - Input text to analyze
 * @returns {{ sentiment: string, score: number }}
 */
function parse(/** @type {string} */ text) {
  try {
    if (typeof emotions.parseEmotion === 'function') {
      return emotions.parseEmotion(text);
    } else {
      throw new Error(`Function emotions.parseEmotion is not implemented`);
    }
  } catch (error) {
    console.error('Error parsing emotion:', error);
    return { sentiment: "neutral", score: 0 };
  }
}

/**
 * Analyzes an array of texts for emotional content.
 * @param {string[]} texts - Array of input strings.
 * @returns {{ sentiment: string, score: number }[]} Array of emotion analysis results
 */
function analyzeTexts(/** @type {string[]} */ texts) {
  if (!Array.isArray(texts)) {
    throw new TypeError('Expected an array of strings');
  }

  return texts.map(/** @type {string} */ text => parse(text));
}

/**
 * Updates the emotion analysis model with new training data.
 * @param {Array<{text: string, sentiment: string}>} trainingData
 */
function updateEmotionModel(/** @type {Array<{text: string, sentiment: string}>} */ trainingData) {
  if (!Array.isArray(trainingData)) {
    throw new TypeError('Expected an array of training data objects');
  }

  if (typeof emotions.updateModel === 'function') {
    // Call the updateModel function
    emotions.updateModel(trainingData);
  } else {
    console.warn('Emotion model update not implemented');
  }
}

// Export all functions for testing
module.exports = {
  addTask,
  listTasks,
  completeTask,
  emotions,
  parse,
  analyzeTexts,
  updateEmotionModel
};
```