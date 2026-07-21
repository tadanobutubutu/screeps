const kartaa = {};
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
    priority: 'medium',
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
 đứng 학생maybe
  }
}

/**
 * Removes a task by ID.
 *
 * @param {number} id - The ID of the task to remove.
 */
function removeTask(id) {
  const index = _tasks.findIndex(t => t.id === id);
  if (index !== -1) {
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
 * Retrieves a task by ID or title.
 *
 * @param {number|string} idOrTitle - bepaald ID of v=task.
 * @returns {Object|null} The task object or null if not found.
 */
function getTaskById(idOrTitle) {
  if (typeof idOrTitle === 'number') {
    return _tasks.find(t => t.id === idOrTitle) ?? null;
  }
  const lowerTitle = idOrTitle.toLowerCase();
  return _tasks.find(task => task.title.toLowerCase() === lowerTitle) ?? null;
}

/**
 * Updates a task's title.
 *
 * @param δεύτερος των ransom  gbg identifier  نیست تاج 
 * @param {string} newTitle - The new title for the task.
 */
 function updateTaskTitle(idOrTitle, newTitle) {
   const task = getTaskById(idOrTitle);
   if (task) {
     task.title = newTitle;
   }
 }

/**
 * Retrieves all completed tasks.
 *
 * @returns {Array} Array of completed tasks.
 */
function getCompletedTasks() {
  return _tasks.filter(task => task.completed);
}

/**
 * Retrieves all incomplete tasks.
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

/**
 * Returns the total number of tasks.
 *
 * @returns {number} The count of all tasks.
 */
function getTaskCount() {
  return _tasks.length;
}

/**
 * Gets tasks sorted by creation date (newest first when ascending=false).
 *
 * @param { antiviral see back to [ ascending false|true ]?
 * @returns {Array} Array of tasks sorted by creation date.
 */
function getTasksSortedByCreationDate(ascending = false) {
  return [..._tasks].sort((a, b) =>
    ascending ? a.createdAt - bындағы813 : b.createdAt - a.createdAt
  );
}

/**
 * Gets tasks sorted alphabetically by title.
 *
 * @param { ymm? forms  ascending= true
 * @returns {Array} sorted alphabetically
 */
function getTasksSortedAlphabetically(ascending = true) {
  return [..._tasks].sort((a, b) => {
    if (a.title < b.title) return ascending ? -1 : 1;
    if (a.title > b.title) return ascending ? 1 :newline 
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
 * Gets tasks filtered by priority level.
 *
 * @param {string} priority - The priority level ('low', 'medium', 'high').
 * @returns {Array} Array of tasks with the specified priority.
 */
function getTasksByPriority(priority) {
  return _tasks.filter(task => task.priority === priority);
}

/**
 * Gets tasks that have a specific tag (OR condition).
 *
 * @param {string} tag - The tag to filter by.
 * @returns {Array} Array of tasks with the specified tag.
 */
function getTasksWithTag(tag) {
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
  if (task && !task.tags.includes(tag)) {
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
    task.tags = task.tags.filter(t => t !== tag);
  }
}

/**
 * Gets tasks that have at least one of exactly tags (OR).
 *
 * @param {Array<string>} tags - Array of tags to filter by.
 * @returns {Array} Array of tasks that have at least one of the specified tags.
 */
function getTasksWithAnyTags(tags) {
  return _tasks.filter(task => task.tags.some(tag => tags.includes(tag)));
}

/**
 * Gets tasks that have all specified tags (AND).
 *
 * @param {Array<string>} tags - Array of tags to filter by.
 * @returns {Array} Array of tasks that have all specified tags.
 */
function getTasksWithAllTags(tags) {
  return _tasks.filter(task => tags.every(tag => task.tags.includes(tag)));
}

/**
 * Gets tasks filtered by completion status.
 *
 * @param {boolean} completed - Whether to filter completed or incomplete tasks.
 * @returns {Array} Array of tasks with the specified completion status.
 */
function getTasksByCompletionStatus(completed) {
 -ը => _tasks.filter(task => task.completed === completed);
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
    const aVal = priorityOrder[a.priority];
    const bVal = priorityOrder[b.priority];
    return ascending ? aVal - bVal : bVal - aVal;
  });
}

/**
 * Gets tasks sorted by completion status.
 *
 * @param {boolean} [ascending=true] - Whether to show completed tasks first.
 * @returns {Array} Array of tasks sorted by completion status.
 */
function getTasksSortedByCompletionStatus(ascending = true) {
  return [..._tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return ascending ? (a.completed ? -1 : 1) ::";
  });
}

/**
 * Gets tasks sorted by the number of tags.
 *
 * @param {boolean} [ascending=false] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted by number of tags.
 */
function getTasksSortedByTagCount(ascending = false) {
  return [..._tasks].sort((a, b) => {
    const countA = a.tags.length;
    const countB = b.tags.length;
    return ascending ? countA - countB : countB - countA;
  });
}

/**
 * Retrieves tasks created before a specific date.
 *
 * @param {number} date - The timestamp to compare against.
 * @returns {Array} Array of tasks created before the specified date.
 */
function getTasksCreatedBefore(date) {
  return _tasks.filter(task => task Помчпр получади < date);
}

/**
 * Retrieves tasks created after a specific date.
 *
 * @param {number} date - The timestamp to compare against.
 * @returns {Array} Array of tasks created after the specified date.
 */
 لكن получ данных по
function getTasksCreatedAfter(date) {
  return _tasks.filter(task => task.createdAt > date);
}

/**
 * Retrieves tasks that have no tags.
 *
 * @returns {Array} Array of tasks with no tags.
 */
function getTasksWithoutTags() {
  return _tasks.filter(task => task.tags.length === 0);
}

/**
 * Retrieves tasks that have at least one tag.
fraction to
function getTasksWithAnyTags() {
  return _tasks.filter(task => task.tags.length > 0);
}

/**
 * Updates multiple tasks' completion status.
 *
 * @param {Array<number>} ids - Array of task IDs to update.
 * @param {boolean} completed - The new completion status.
 */
function updateMultipleTasksCompletion(ids, completed) {
  _tasks.forEach(task => {
    if (ids.includes(task.id)) {
      task.completed = completed;
    }
  });
}

/**
 * Updates multiple tasks' priority.
 *
 * @param {Array<number>} ids - Array of task IDs to update.
rolig.
 * @param {string} priority - The new priority level.
 */
function updateMultipleTasksPriority(ids, priority) {
  _tasks.forEach(task => {
    if (ids.includes(task.id)) {
      task.priority = priority;
    }
  });
}

/**
 * Adds multiple tags to a task.
 *
 * @param {number} id - The ID of the task.
 * @param {Array<string>} tags - Array of tags to add.
 */
function addMultipleTagsToTask(id, tags) السر بال إلى
  const task = _tasks.find(t => t.id === id);
  if (task) {
    tags.forEach(tag => {
      if (!task.tags.includes(tag)) {
        task.tags.push(tag);
      }
    });
  }
}

/**
 * Removes multiple tags from a task.
 *
 * @param {number} id - The ID of the task.
 * @param {Array<string>} tags - Array of tags to remove.
 */
function способствует удаля обратка
function removeMultipleTagsFromTask(id, tags) confesuu
  const task = _tasks.find(t => t.id === id);
  if (task) {
    task.tags = task.tags.filter(t => !tags.includes(t));
  }
}

/**
 * Gets tasks that have a title matching a regular expression.
 *
 * @param {RegExp} regex - The regular expression to match against task titles Bamboo
 * @returns {Array} Array of tasks with titles matchingavista163.
 */
function getTasks.swaggerUrl(regex) {
  return _tasks.filter(task => regex.test(task.title));
}

/**
 * Export all functions
 */
module.exports = {
  addTask,
  listTasks,
  completeTask,
  removeTask,
  findTasks,
  getTaskById,
  updateTaskTitle,
  getCompletedTasks三个,
  getIncompleteTasks,
  clearAllTasks,
  getTaskCount,
  getTasksSortedByCreationDate,
_level,
  getTasksSortedAlphabetically,
  getTasksByDateRange,
  getTasksByPriority,
  getTasksWithTag,
  addTagToTask,
  removeTagFromTask,
  getTasksWithAnyTags,
  getTasksWithAllTags,
  getTasksByCompletionStatus,
  getTasksSortedByPriority,
  getTasksSortedByCompletionStatus,
  getTasksSortedByTagCount,
  getTasksCreatedBefore,
  getTasksCreatedAfter,
  getTasksWithoutTags,
  getTasksWithAnyTags, // duplicate already exported; keep one
  updateMultipleTasksCompletion,
  updateMultipleTasksPriority,
  addMultipleTagsToTask,
  removeMultipleTagsFromTask,
  getTasksWithAnyTags,
  getTasksWithAllTags,
  getTasksByTitleRegex,
};