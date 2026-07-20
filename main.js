/**
 * Simple in‑memory task utilities.
 *
 * The functions are intentionally very small so they can be unit‑tested
 * in isolation (the tests in `/tests/` can import this file directly).
 *
 * They operate on an internal array that lives for the process lifetime.
 *
 * Usage:
 *   const { addTask, listTasks, completeTask, add, parse, analyzeTexts } = require('./utils.tasks');
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
  const task = { id: _nextId++, title, done: false };
  _tasks.push(task);
  return task.id;
}

/**
 * List all tasks.
 *
 * @returns {Object[]} An array of task objects.
 */
function listTasks() {
  // Return a shallow copy to prevent external mutation.
  return _tasks.map(t => ({ ...t }));
}

/**
 * Mark a task as completed.
 *
 * @param {number} id – The ID of the task to complete.
 * @returns {boolean} True if a task was found and marked, false otherwise.
 */
function completeTask(id) {
  const task = _tasks.find(t => t.id === id);
  if (task) {
    task.done = true;
    return true;
  }
  return false;
}

/**
 * A simple numeric addition helper – useful for quick unit tests
 * and demos that don't involve tasks.
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
  return a + b;
}

/**
 * Helper object for emotional analysis.
 */
const emotions = {
  /**
   * Parses emotional context from text input.
   *
   * @param {string} text - Input text to analyze.
   * @returns {{ sentiment: string, score: number }}
   */
  parseEmotion: function(text) {
    // Basic fallback implementation; could be replaced with ML model later.
    if (typeof text !== 'string') {
      throw new TypeError('text must be a string');
    }
    // Very naive sentiment heuristic: look for words.
    const positives = ['good', 'great', 'happy', 'love'];
    const negatives = ['bad', 'sad', 'hate', 'terrible'];
    let score = 0;
    const lower = text.toLowerCase();
    positives.forEach(p => { if (lower.includes(p)) score += 1; });
    negatives.forEach(n => { if (lower.includes(n)) score -= 1; });
    const sentiment = score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
    return { sentiment, score };
  },

  /**
   * Updates the emotion analysis model with new training data.
   *
   * @param {Array<{text: string, sentiment: string}>} trainingData
   */
  updateModel: function(trainingData) {
    // No-op in this basic implementation; placeholder for future ML training.
    if (!Array.isArray(trainingData)) {
      throw new TypeError('trainingData must be an array');
    }
  }
};

/**
 * Parses a single string for emotion.
 *
 * @param {string} text
 * @returns {{ sentiment: string, score: number }}
 */
function parse(text) {
  try {
    if (typeof emotions.parseEmotion === 'function') {
      return emotions.parseEmotion(text);
    }
    throw new Error(`Function emotions.parseEmotion is not implemented`);
  } catch (error) {
    console.error('Error parsing emotion:', error);
    return { sentiment: "neutral", score: 0 };
  }
}

/**
 * Analyzes an array of texts for emotional content.
 *
 * @param {string[]} texts - Array of input strings.
 * @returns {{ sentiment: string, score: number }[]} Array of emotion analysis results
 */
function analyzeTexts(texts) {
  if (!Array.isArray(texts)) {
    throw new TypeError('Expected an array