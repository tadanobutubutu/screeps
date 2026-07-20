/**
 * Simple in‑memory task utilities.
 *
 * These tiny helpers are purposely kept minimal so that the unit tests
 * in `/tests/` can import this file directly and run the logic in isolation.
 *
 * Usage:
 *
 *   const id = addTask('Buy milk');        // id is a number
 *   console.log(listTasks());              // [ { id: 1, title: 'Buy milk', completed: false } ]
 *   // or with timestamps:
 *   console.log(listTasks());              // [ { id: 1, title: 'Buy milk', completed: false, createdAt: ..., updatedAt: ... } ]
 *   completeTask(id);
 *   console.log(listTasks());              // [ { id: 1, title: 'Buy milk', completed: true, createdAt: ..., updatedAt: ... } ]
 *
 * @module main
 */
let _tasks = [];
let _nextId = 1;

/**
 * Adds a new task.
 *
 * @param {string} title - The task title.
 * @returns {number} The ID of the created task.
 */
function addTask(title) {
  const task = {
    id: _nextId++,
    title,
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  _tasks.push(task);
  return task.id;
}

/**
 * Lists all tasks.
 *
 * @returns {Array<{id:number, title:string, completed:boolean, createdAt:number, updatedAt:number}>} All tasks.
 */
function listTasks() {
  // Return a shallow copy to avoid external mutation.
  return _tasks.map(({ id, title, completed, createdAt, updatedAt }) => ({
    id,
    title,
    completed,
    createdAt,
    updatedAt,
  }));
}

/**
 * Marks a task as completed.
 *
 * @param {number} id - The ID of the task to complete.
 * @returns {boolean} True if a task was found and marked as completed.
 */
function completeTask(id) {
  const task = _tasks.find((t) => t.id === id);
  if (!task) return false;
  task.completed = true;
  task.updatedAt = Date.now();
  return true;
}

/**
 * Removes a task by ID.
 *
 * @param {number} id - The ID of the task to remove.
 * @returns {boolean} True if a task was found and removed.
 */
function removeTask(id) {
  const index = _tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  _tasks.splice(index, 1);
  return true;
}

/**
 * Finds tasks matching a query.
 *
 * @param {Object} query - An object containing properties to match.
 * @returns {Array} Array of matching tasks.
 */
function findTasks(query) {
  return _tasks.filter((task) => {
    for (const key in query) {
      if (task[key] !== query[key]) return false;
    }
    return true;
  });
}

/**
 * Retrieves a task by ID.
 *
 * @param {number} id - The ID of the task to retrieve.
 * @returns {Object|null} The task object or null if not found.
 */
function getTaskById(id) {
  const task = _tasks.find((t) => t.id === id);
  return task || null;
}

/**
 * Updates a task's title.
 *
 * @param {number} id - The ID of the task to update.
 * @param {string} newTitle - The new title for the task.
 * @returns {boolean} True if the task was found and updated.
 */
function updateTaskTitle(id, newTitle) {
  const task = _tasks.find((t) => t.id === id);
  if (!task) return false;
  task.title = newTitle;
  task.updatedAt = Date.now();
  return true;
}

module.exports = {
  addTask,
  listTasks,
  completeTask,
  removeTask,
  findTasks,
  getTaskById,
  updateTaskTitle,
};