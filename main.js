const _tasks = [];
const _state = { nextId: 1 };

/** Adds a new task. */
function addTask(title) {
    const task = { id: _state.nextId++, title, completed: false, createdAt: Date.now(), tags: [], priority: 'medium' };
    _tasks.push(task);
    return task.id;
}

/** Lists all tasks. */
function listTasks() {
    return [..._tasks];
}

/** Marks a task as completed. */
function completeTask(id) {
    const task = _tasks.find(t => t.id === id);
    if (task) { task.completed = true; }
}

/**
 * Removes a task by ID.
 *
 * @param {number} id - The ID of the task to remove.
 */
function removeTask(id) {
    const index = _tasks.findIndex(t => t.id === id);
    if (index !== -1) { _tasks.splice(index, 1); }
}

/**
 * Finds tasks by title (case-insensitive partial match).
 *
 * @param {string} searchTerm - The term to search for in task titles.
 * @returns {Array} Array of matching tasks.
 */
function findTasks(searchTerm) {
    return _tasks.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
}

/**
 * Gets a task by ID or title.
 *
 * @param {number|string} idOrTitle - The ID or title of the task to retrieve.
 * @returns {Object|null} The task object or null if not found.
 */
function getTaskById(idOrTitle) {
    if (typeof idOrTitle === 'number') {
        return _tasks.find(t => t.id === idOrTitle) || null;
    }
    const lowerTitle = idOrTitle.toLowerCase();
    return _tasks.find(task => task.title.toLowerCase() === lowerTitle) || null;
}

/**
 * Updates a task's title.
 *
 * @param {number|string} idOrTitle - The ID or title of the task to update.
 * @param {string} newTitle - The new title for the task.
 */
function updateTaskTitle(idOrTitle, newTitle) {
    const task = getTaskById(idOrTitle);
    if (task) { task.title = newTitle; }
}

/**
 * Gets all completed tasks.
 *
 * @returns {Array} Array of completed tasks.
 */
function getCompletedTasks() {
  return _tasks.filter(task => task.completed);
}

/**
 * Gets all incomplete tasks.
 *
 * @returns {Array} Array of incomplete tasks.
 */
function getIncompleteTasks() {
  return _tasks.filter(task => !task.completed);
}

/**
 * Clears all tasks.
 */
function clearAllTasks() {
    _tasks.length = 0;
    _state.nextId = 1;
}

/** Task count. */
function getTaskCount() {
    return _tasks.length;
}

/** Tasks sorted newest-first by date. */
function getTasksSortedByDate() {
    return [..._tasks].sort((a, b) => b.createdAt - a.createdAt);
}

/** Tasks sorted alphabetically by title. */
function getTasksSortedByTitle(ascending = true) {
    return [..._tasks].sort((a, b) => {
        if (a.title < b.title) return ascending ? -1 : 1;
        if (a.title > b.title) return ascending ? 1 : -1;
        return 0;
    });
}