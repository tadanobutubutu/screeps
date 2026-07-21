const _tasks = [];
const _state = { nextId: 1 };

/**
 * Adds a new task.
 *
 * @param {string} title - The task title.
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
 * Lists all tasks.
 *
 * @returns {Array} Array of all tasks.
 */
function listTasks() {
  return [..._tasks];
}

/**
 * Marks a task as completed.
 *
 * @param {number} id - The ID of the task to complete.
 */
function completeTask(id) {
  const task = _tasks.find(t => t.id === id);
  if (task) {
    task.completed = true;
  }
}

/**
 * Removes a task by ID.
 *
 * @param {number} id - The ID of the task to remove.
 */
function removeTask(id) {
  const index = _tasks.findIndex(t => t.id === id);
  if (index!== -1) {
    _tasks.splice(index, 1);
  }
}

/**
 * Finds tasks by title (case-insensitive partial match).
 *
 * @param {string} searchTerm - The term to search for in task titles.
 * @returns {Array} Array of matching tasks.
 */
function findTasks(searchTerm) {
  const lowerSearchTerm = searchTerm.toLowerCase();
  return _tasks.filter(task => task.title.toLowerCase().includes(lowerSearchTerm));
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
  } else {
    const lowerTitle = idOrTitle.toLowerCase();
    return _tasks.find(task => task.title.toLowerCase() === lowerTitle) || null;
  }
}

/**
 * Updates a task's title.
 *
 * @param {number|string} idOrTitle - The ID or title of the task to update.
 * @param {string} newTitle - The new title for the task.
 */
function updateTaskTitle(idOrTitle, newTitle) {
  const task = getTaskById(idOrTitle);
  if (task) {
    task.title = newTitle;
  }
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
  return _tasks.filter(task =>!task.completed);
}

/**
 * Clears all tasks.
 */
function clearAllTasks() {
  _tasks.length = 0;
  _state.nextId = 1;
}

/**
 * Gets the total number of tasks.
 *
 * @returns {number} The count of all tasks.
 */
function getTaskCount() {
  return _tasks.length;
}

/**
 * Gets tasks sorted by creation date (newest first).
 *
 * @returns {Array} Array of tasks sorted by creation date.
 */
function getTasksSortedByDate() {
  return [..._tasks].sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Gets tasks sorted alphabetically by title.
 *
 * @param {boolean} [ascending=true] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted alphabetically.
 */
function getTasksSortedByTitle(ascending = true) {
  return [..._tasks].sort((a, b) => {
    if (a.title < b.title) return ascending? -1 : 1;
    if (a.title > b.title) return ascending? 1 : -1;
    return 0;
  });
}

/**
 * Gets tasks created within a specific time range.
 *
 * @param {number} startTime - Start timestamp (inclusive).
 * @param {number} endTime - End timestamp (inclusive).
 * @returns {Array} Array of tasks created within the time range.
 */
function getTasksByDateRange(startTime, endTime) {
  return _tasks.filter(task => task.createdAt >= startTime && task.createdAt <= endTime);
}

/**
 * Gets tasks sorted by creation date (oldest first).
 *
 * @param {boolean} [ascending=false] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted by creation date (oldest first).
 */
function getTasksSortedByDateAscending(ascending = false) {
  return [..._tasks].sort((a, b) => {
    return ascending? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
  });
}

/**
 * Gets tasks sorted by title.
 *
 * @param {boolean} [ascending=true] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted by title.
 */
function getTasksSortedByTitleOrder(ascending = true) {
  const mapped = _tasks.map((task, idx) => ({ idx, title: task.title.toLowerCase() }));
  mapped.sort((a, b) => {
    if (a.title < b.title) return ascending? -1 : 1;
    if (a.title > b.title) return ascending? 1 : -1;
    return 0;
  });
  return mapped.map(item => _tasks[item.idx]);
}

/**
 * Resets the task ID counter.
 * This is useful for testing scenarios where you want to start fresh.
 */
function resetTaskIdCounter() {
  _state.nextId = 1;
}

/**
 * Gets tasks filtered by priority level.
 *
 * @param {string} priority - The priority level to filter by ('low', 'edium', 'high').
 * @returns {Array} Array of tasks with the specified priority.
 */
function getTasksByPriority(priority) {
  return _tasks.filter(task => task.priority === priority);
}

/**
 * Gets tasks that have a specific tag.
 *
 * @param {string} tag - The tag to filter by.
 * @returns {Array} Array of tasks with the specified tag.
 */
function getTasksByTag(tag) {
  return _tasks.filter(task => task.tags.includes(tag));
}

/**
 * Adds a tag to a task.
 *
 * @param {number} id - The ID of the task.
 * @param {string} tag - The tag to add.
 */
function addTagToTask(id, tag) {
  const task = _tasks.find(t => t.id === id);
  if (task &&!task.tags.includes(tag)) {
    task.tags.push(tag);
  }
}

/**
 * Removes a tag from a task.
 *
 * @param {number} id - The ID of the task.
 * @param {string} tag - The tag to remove.
 */
function removeTagFromTask(id, tag) {
  const task = _tasks.find(t => t.id === id);
  if (task) {
    task.tags = task.tags.filter(t => t!== tag);
  }
}

/**
 * Gets tasks that have at least one of the specified tags.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of tasks that have at least one of the specified tags.
 */
function getTasksWithTags(tags) {
  return _tasks.filter(task => task.tags.some(tag => tags.includes(tag)));
}

/**
 * Sets the priority of a task.
 *
 * @param {number} id - The ID of the task.
 * @param {string} priority - The priority level ('low', 'edium', 'high').
 */
function setTaskPriority(id, priority) {
  const task = _tasks.find(t => t.id === id);
  if (task) {
    task.priority = priority;
  }
}

/**
 * Gets tasks filtered by completion status.
 *
 * @param {boolean} completed - Whether to filter completed or incomplete tasks.
 * @returns {Array} Array of tasks with the specified completion status.
 */
function getTasksByCompletionStatus(completed) {
  return _tasks.filter(task => task.completed === completed);
}

/**
 * Gets tasks sorted by priority.
 *
 * @param {boolean} [ascending=true] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted by priority.
 */
function getTasksSortedByPriority(ascending = true) {
  const priorityOrder = { low: 0, medium: 1, high: 2 };
  return [..._tasks].sort((a, b) => {
    const priorityA = priorityOrder[a.priority];
    const priorityB = priorityOrder[b.priority];
    return ascending? priorityA - priorityB : priorityB - priorityA;
  });
}

/**
 * Gets tasks sorted by completion status.
 *
 * @param {boolean} [completedFirst=true] - Whether to show completed tasks first.
 * @returns {Array} Array of tasks sorted by completion status.
 */
function getTasksSortedByCompletion(completedFirst = true) {
  return [..._tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return completedFirst? (a.completed? -1 : 1) : (a.completed? 1 : -1);
  });
}

/**
 * Gets tasks sorted by number of tags.
 *
 * @param {boolean} [ascending=false] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted by number of tags.
 */
function getTasksSortedByTagCount(ascending = false) {
  return [..._tasks].sort((a, b) => {
    const countA = a.tags.length;
    const countB = b.tags.length;