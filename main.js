const _tasks = [];
const _state = {
    nextId: 1
};

/**
 * User Safety: unsafe
 * Safety Categories: Needs Caution
 */

/**
 * Adds a new task.
 *
 * @param {string} title
 * @returns {number} The ID of the created task.
 */
function addTask(title) {
    const task = {
        id: _state.nextId++,
        title,
        completed: false,
        createdAt: Date.now(),
        tags: [],
        priority: 'edium'
    };
    _tasks.push(task);
    return task.id;
}

/**
 * Resets the task ID counter.
 */
function resetTaskIdCounter() {
    _state.nextId = 1;
}

/**
 * Gets tasks sorted by title.
 *
 * @returns {Array} Array of tasks sorted by title
 */
function getTasksSortedByTitle() {
    return [..._tasks].sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Gets tasks sorted by creation date.
 *
 * @returns {Array} Array of tasks sorted by creation date
 */
function getTasksSortedByCreatedAt() {
    return [..._tasks].sort((a, b) => a.createdAt - b.createdAt);
}

/**
 * Gets tasks by priority.
 *
 * @param {string} priority
 * @returns {Array} Array of tasks with the specified priority
 */
function getTasksByPriority(priority) {
    return _tasks.filter(task => task.priority === priority);
}

/**
 * Lists all tasks.
 *
 * @returns {Array} Array of all tasks
 */
function listTasks() {
    return [..._tasks];
}

/**
 * Marks a task as completed.
 *
 * @param {number} taskId
 * @returns {boolean} True if the task was marked as completed
 */
function completeTask(taskId) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = true;
        return true;
    }
    return false;
}

/**
 * Removes a task.
 *
 * @param {number} taskId
 * @returns {boolean} True if the task was removed
 */
function removeTask(taskId) {
    const index = _tasks.findIndex(t => t.id === taskId);
    if (index!== -1) {
        _tasks.splice(index, 1);
        return true;
    }
    return false;
}

/**
 * Finds tasks by title.
 *
 * @param {string} searchTerm
 * @returns {Array} Array of tasks matching the search term
 */
function findTasks(searchTerm) {
    return _tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

/**
 * Gets a task by ID.
 *
 * @param {number} taskId
 * @returns {Object|null} The task or null if not found
 */
function getTaskById(taskId) {
    return _tasks.find(t => t.id === taskId) || null;
}

/**
 * Updates a task's title.
 *
 * @param {number} taskId
 * @param {string} newTitle
 * @returns {boolean} True if the title was updated
 */
function updateTaskTitle(taskId, newTitle) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        task.title = newTitle;
        return true;
    }
    return false;
}

/**
 * Gets completed tasks.
 *
 * @returns {Array} Array of completed tasks
 */
function getCompletedTasks() {
    return _tasks.filter(task => task.completed);
}

/**
 * Gets incomplete tasks.
 *
 * @returns {Array} Array of incomplete tasks
 */
function getIncompleteTasks() {
    return _tasks.filter(task =>!task.completed);
}

/**
 * Adds a tag to a task.
 *
 * @param {number} taskId
 * @param {string} tag
 * @returns {boolean} True if the tag was added
 */
function addTagToTask(taskId, tag) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        if (!task.tags) task.tags = [];
        if (!task.tags.includes(tag)) {
            task.tags.push(tag);
            return true;
        }
    }
    return false;
}

/**
 * Removes a tag from a task.
 *
 * @param {number} taskId
 * @param {string} tag
 * @returns {boolean} True if the tag was removed
 */
function removeTagFromTask(taskId, tag) {
    const task = _tasks.find(t => t.id === taskId);
    if (task && task.tags) {
        const index = task.tags.indexOf(tag);
        if (index!== -1) {
            task.tags.splice(index, 1);
            return true;
        }
    }
    return false;
}

// Add this function to handle memory visualization
function getMemoryUsage() {
    const memoryUsage = process.memoryUsage();
    return {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
        arrayBuffers: memoryUsage.arrayBuffers
    };
}

// Export all functions
module.exports = {
  addTask,
  resetTaskIdCounter,
  getTasksSortedByTitle,
  getTasksSortedByCreatedAt,
  getTasksByPriority,
  listTasks,
  completeTask,
  removeTask,
  findTasks,
  getTaskById,
  updateTaskTitle,
  getCompletedTasks,
  getIncompleteTasks,
  addTagToTask,
  removeTagFromTask,
  getMemoryUsage
};