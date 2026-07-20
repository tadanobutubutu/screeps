/**
 * Simple in‑memory task utilities.
 *
 * The functions are intentionally very small so they can be unit‑tested
 * in isolation (the tests in `/tests/` can import this file directly).
 *
 * They operate on an internal array that lives for the process lifetime.
 *
 * Usage:
 *   const { addTask, listTasks, completeTask, removeTask, findTasks, emotions } = require('./utils.tasks');
 *
 *   const id = addTask('Buy milk');
 *   console.log(listTasks());      // [{ id: 1, title: 'Buy milk', done: false, createdAt: Date }]
 *   completeTask(id);
 *   console.log(emotions.parseEmotion('I am happy')); // { sentiment: "neutral", score: 0 }
 */
"use strict";

let _nextId = 1;
const _tasks = [];

/**
 * Add a new task.
 *
 * @param {string} title – The