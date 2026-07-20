/**
 * Simple in‑memory task utilities.
 *
 * The functions are intentionally very small so they can be unit‑tested
 * in isolation (the tests in `/tests/` can import this file directly).
 *
 * They operate on an internal array that lives for the process lifetime.
 *
 * Usage:
 *   const { addTask, listTasks, completeTask, removeTask, findTasks, add, parse, analyzeTexts, read, emotions } = require('./utils.tasks');
 *
 *   const id = addTask('Buy milk');
 *   console.log(listTasks());      // [{ id: 1, title: '
 */

/**
 * Lists all tasks.
 *
 * @returns {Array<{id:number,title
 */