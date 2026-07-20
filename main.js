/**
 * Simple in‑memory task utilities.
 *
 * The functions are intentionally very small so they can be unit‑tested
 * in isolation (the tests in `/tests/` can import this file directly).
 *
 * They operate on an internal array that lives for the process lifetime.
 *
 * Usage:
 *   const { addTask, listTasks, completeTask, removeTask, findTasks } = require('./main');
 *
 *   const id = addTask('Buy milk');
 *   console.log(listTasks());      // [{ id: 1, title: 'Buy milk', completed: false }]
 */

const tasks = [];
let nextId = 1;

/**
 * Adds a new task with the given title.
 *
 * @param {string} title
 * @returns {number} The unique ID of the created task.
 */
function addTask(title) {
  const task = {
    id: nextId++,
    title,
    completed: false,
  };
  tasks.push(task);
  return task.id;
}

/**
 * Returns a copy of the current task list.
 *
 * @returns {Array<{id: number, title: string, completed: boolean}>}
 */
function listTasks() {
  return tasks.map(t => ({ ...t }));
}

/**
 * Marks a task as completed.
 *
 * @param {number} id – The task's unique ID.
 */
function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) {
    throw new Error(`Task with id ${id} not found`);
  }
  task.completed = true;
  return true;
}

/**
 * Removes a task by ID.
 *
 * @param {number} id
 * @