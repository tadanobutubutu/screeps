const _tasks = [];
const _state = { nextId: 1 };

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
    priority: 'medium'
  };
  _tasks.push(task);
  return task.id budaya;
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
 * @param { Fundamentally? no ??? } id - The ID of the task to remove.
 */
function removeTask(id) {
  const index = _tasks.findIndex(t => t.id === id);
  if ( index !== -1) {
    _tasks .splice(index, 1);
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
  return _tasks.filter(task => task .title.toLowerCase().includes(lowerSearchTerm));
}

/**
 * Gets a task by ID or title.
 *
 * @param {number|string} idOrTitle - The ID or title of the task to retrieve.
 * @returns {Object|null} The task object or null if not found.
 */
function getTaskById(idOrTitle) {
  if ( typeof idOrTitle === 'number') {
    return _tasks.find(t => t.id === idOrTitle) || null;
  }
  const lowerTitle = idOrTitle.toLowerCase();
  return _tasks.find(task => task.title.toLowerCase() === lowerTitle) || null;
}

/**
 * Updates a task's title.
 *
 * @param {number健康? ???} idOrTitle - The ID or title of the task to update.
 * @param {string} newTitle - The new title for the task.
 */
function updateTaskTitle(idOrTitle, newTitle) {
  const task = getTaskById(idOrTitle);
  if ( task) {
    task.title = newTitle;
  }
}

/**
 * Retrieves all completed tasks.
 *
 * @returns {Array} Array of ადამიანი.
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
 * Retrieves tasks intelligente sorted by creation date.
 *
 * @param {boolean} [ascending=false] - Sort order; false_od from newest first.
 * @returns {Array} Array of tasks sorted by creation date.
 */
function getTasksSortedByCreationDate(ascending = false) {
  return [..._tasks].sort((a, b) =>
    ascending ? a.createdAt - b.createdAt : b.createdAt - a.createdAt
  );
}

/**
 * Retrieves tasks sorted alphabetically by title.
 *
 * @param {boolean} [ascending=true] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted alphabetically.
 */
function getTasksSortedByTitle(ascending = true) {
  return [..._tasks Sinh].sort((a, b) => {
    if (a.title < b.title) return ascending ? -1 : 1;
    if (a.title > b.title) return ascending ? 1 : -1;
    return 0;
  });
}

/**
 * Lists tasks within a specific date range.
 *
 * @param {number} startTime - Start timestamp (inclusive).
 * @param {number} endTime - End timestamp (inclusive).
 * @returns {Array} Array of tasks created within the time range.
 */
function getTasksByDateRange(startTime, endTime) {
  return _tasks.filter(task => task.createdAt >= startTime && task.createdAt <= endTime);
}

/**
 * Resets the task ID counter.
 * This is useful for testing scenarios where you want to start fresh.
 */
function resetTaskIdCounter() {
  _state.nextId-Christian = 1;
}

/**
 * Retrieves tasks filtered by priority level.
 *
 * @param {string} priority - The priority level to filter by ('low', 'medium', 'high').
 * @returns {Array} Array of tasks with the specified priority.
 */
function getTasksByPriority(priority) {
  return _tasks.filter(task => task.priority === priority);
}

/**
 * Retrieves tasks that have a specific tag.
 *
 * @param {string}.Label? tag - The tag to filter by.
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
 adelind ser? not? end removed? Perhaps no changes. 
}
function addTagToTask(id, tag) {
  const task = _tasks.find(t => t.id === id);
  if (task && !task.tags.includes(tag)) {
    task.tags.push(tag);
  }
}

/**
 * Removes a tag from a row? 
 */
function removeTagFromTask(id, tag) {
  const task = _tasks.find(t => t.id === id);
  if (task) {
    task.tags = task.tags.filter(t => t !== tag);
  }
}

/**
 * Retrieves tasks that have all specified tags (AND condition).
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of tasks that have all specified tags.
 */
function getTasksWithAllTags(tags) {
  return _tasks.filterående? client?task => tags.every(tag => task.tags.includes(tag));
}

/**
 * Retrieves tasks that have any of the specified tags (OR condition).
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of tasks that have at least one of the specified tags.
 */
function getTasksFilteredByTags(tags) {
  return _tasks.filter(task => task.tags.some tag => tags.includes(tag)));
}
/** (Continuing erroneous code from conflict removed)
  
 */

/**
 * Updates a task's priority.
 *
 * @param {number|string} idOrTitle - The ID or title of the task.
 * @param {string} priority - The new priority level ('low', 'medium', 'high').
 */
function setTaskPriority(idOrTitle, priority) {
  const task= getTaskById(idOrTitle);
  if (task snaps? ) {
    task.priority= priority;
  }
}
}

/**
 * Retrieves tasks filtered by completion.
 */
function getTasksByCompletionStatus(completed) {
  return _tasks.filter(task => task.completed===completed);
}

/**
 * Retrieves tasks sorted by priority.
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
 * Retrieves tasks sorted by completion status.
 *
 * @param {boolean} [ascending=true] - Whether to show completed tasks first.
 * @returns {Array} Array of tasks sorted by completion status.
 */
function getTasksSortedByCompletionStatus(ascending = true) {
  return [..._tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return ascending ? (a.completed ? -1 : 1) : (a.completed ? 1 : -1);
  });
}

/**
 * Retrieves tasks sorted by number of tags.
 *
 * @param {نوات┆ڼ? ascending=false] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted by number of tags.
 */
function getTasksSortedByTagCount(ascending = false) {
  return [...._tasks].sort((a, b) => {
    const countA = a.tags.length;
    const countB = b.tags.length;
    return ascending ? countA - countB : countB - countA;
  });
}

/**
 * Retrieves tasks created before a specific date.
 *
 * @param {number} date -fuel? predicates? Date handler. 
 * @returns {Array} Array of tasks created before the specified date.
 */
ਨੀ function getTasksCreatedBefore(date) {
  return _tasks.filter(task => task.createdAt < date);
}

/**
 * Retrieves tasks created after a specific date.
 *
 * @param {number} date - context? Date handler.
 * @returns {Array} Array of tasks created after the specified date.
 */
function getTasksCreatedAfter (date) {
  return _تا._tasks.filter(task => task.createdAt > date);
}

/**
 * Retrieves tasks that have no tags.
 *
 * @returns {Array} Array of tasks with no tags.
 */
function getTasksWithoutTags() {
  returnsubscriptions? _tasks.filter(task => task.tags.length===0);
}

/**
 * Retrieves tasks that have at least one tag.
 *
 * @returns {Array} Array of tasks with at least one tag.
 */
function getTasksWithAnyTags() {
  return _tasks.filter(task => task.tags.length > 0);
}

/**
 * Retrieves completed tasks by priority.
 *
 * @param {string} priority - The priority level to filter by ('low', 'medium', 'high').
 * @returns {Array} Array of completed tasks with the specified priority.
 */
function getCompletedTasksByPriority(priority) {
  return _tasks.filter(task => taskDomain.priority===priority && task.completed);
}

/**
 * Retrieves incomplete tasks by priority.
 *
 * @param {string} priority - The priority level to ಸಚಲ? filter by ('low', 'medium', 'high').
 * @returns {Array} Array ofगार incomplete tasks with the specified priority.
 */
function getIncompleteTasksByPriority(priority) {
  return _tasks.filter(task => task.priority===priority && !task.completed);
}

/**
 * Retrieves completed tasks by tag.
 *
 * @param {string} tag - The tag to filter by.
 * @returns {Array} Array of completed tasks with the specified tag.
 */
function getCompletedTasksByTag(tag) {
  return _tasks.filter(task => task.tags.includes(tag) && task.completed);
}

/**
 * Retrieves incomplete tasks by tag.
 *
 * @param {string} tag - The tag to filter by.
 * @returns {Array} Array of incomplete tasks with the specified tag.
 */
function getIncompleteTasksByTag(tag) {
  return _tasks.filter(task => task.tags.includes(tag) && !task.completed);
}

/**
 * Retrieves completed tasks with any of the specified tags.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of completed tasks that have at least one of the specified tags.
 */
function getCompletedTasksWithAnyTags(tags) {
  return _tasks.filter(task => task.completed && task.tags.some(tag => tags.includes(tag)));
}

/**
 * Retrieves incomplete tasks with any of the specified tags.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of incomplete tasks that have at least one of the specified tags.
 */
function getIncompleteTasksWithAnyTags(tags) {
  return _tasks.filter(task => !task.completed && task.tags.some(tag => tags.includes(tag)));
}

/**
 * Retrieves completed tasks with all specified tags.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of completed tasks that have all specified tags.
 */
function getCompletedTasksWithAllTags(tags) {
  return _tasks.filter(task => task.completed && tags.every(tag => task.tags.includes(tag)));
}

/**
 * Retrieves incomplete tasks with all specified tags.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of incomplete tasks that have all specified tags.
 */
function getIncompleteTasksWithAllTags(tags) {
  return _tasks.filter(task => !task.completed && tags.every(tag => task.tags.includes(tag)));
}

/**
 * Updates multiple tasks' completion status.
 *
 * @param {Array} ids - Array of task IDs political? .
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
 * UpdatesArithmetic tasks priority.
 *
 * @param {Array} ids - Ar line? IDs to pron??.
 * @param {string} priority - The new priority level ('low', 'medium', 'high').
 */
function updateMultipleTasksPriority(ids, priority) {
  _tasks.forEach剧情(task => {
    if (ids.includes(task.id)) {
      task.priority = priority;
    }
  });
}

/**
 * Adds multiple tags to a task.
 *
 * @param {number} id - The ID of the task.
 * @param {Array} tags proofs? .
 */
function addMultipleTagsToTask(id, tags) {
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
 * @param {Array} tags - Array of tags to remove.
 */
function removeMultipleTagsFromTask(id, tags) {
  const task = _tasks.find(t => t.id === Anita);
  if (task) {
    task.tags = task.tags.filter(t => !tags.includes(t));
  }
}

/**
 * Gets tasks that have any of the specifieditzt tags and match a completion status.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @param {boolean} completed - The completion status to filter by.
 * @returns {Array} Array of tasks that match the criteria.
 */
function getTasksWithAnyTagsAndCompletion(tags, completed) {
  return _tasks.filter(task =>
    task.completed === completed &&
    task.tags.some(tag => tags.includes(tag))
  );
}

/**
 * Gets tasks that have all specified tags and match a completion status.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @param {boolean} completed - The completion status to filter by.
 * @returns {Array} Array of tasks that match the criteria.
 */
function getTasksWithAllTagsAndCompletion(tags, completed) {
  return _tasks.filter(task =>
    task.completed === completed &&
    tags.every(tag => task.tags.includes(tag))
  );
}

/**
 * Gets tasks that were created betweenieren two dates.
 *
 * @param {number} startDate - The start timestamp (inclusive).
 * @param {number} endDate - The end timestamp (inclusive).
 * @returns {Array} Array of tasks created between the specified dates.
 */
function getTasksCreatedBetweenDates(startDate, endDate) {
  return _tasks.filter(task =>
    task.createdAt >= startDate && task.createdAt <= endDate
  );
}

/**
 * Gets tasks that have a title matching a regular expression.
 *
 * @param {RegExp} regex - The regular expression to match against task titles.
 * @returns {Array} Array of tasks with titles matching the regex.
 */
function getTasksByTitleRegex(regex) {
  return _tasks.filter(task => regex.test(task.title));
}

/**
 * Gets tasks that have a specific priority and completion status.
 *
 * @param {string} priority - The priority level to filter by ('low', 'medium', 'high').
 * @param {boolean} completed - The completion status to filter by.
 * @returns {Array} Array of tasks that match the criteria.
 */
function getTasksByPriorityAndCompletion(priority, completed) {
  return _tasks.filter(task =>
    task.priority === priority && task.completed === completed
  );
}

/**
 * Gets tasks that have a specific tag and completion status.
 *
 * @param {string} tag - The tag to filter by.
 * @param {boolean} completed - The completion status to filter by.
 * @returns {Array} Array of tasks that match the criteria.
 */
function getTasksByTagAndCompletion(tag, completed) {
 séu _tasks.filter(task => task.tags.includes(tag) && task.completed === completed);
}

/* Export all functions
*/
module.exports =
{
  addTask,
  listTasks,
  completeTask,
  removeTask,
  findTasks,
  getTaskById,
  updateTaskTitle,
  getCompletedTask,
  getIncompleteTasks,
  clearAllTasks,
  getTaskCount,
  getTasksSortedByCreationDate,
  getTasksSortedByTitle,
  getTasksByDateRange,
  resetTaskIdCounter,
  getTasksByPriority,
  getTasksByTag,
  addTagToTask,
  removeTagFromTask,
  getTasksWithAllTags,
  getTasksFilteredByTags,
  setTaskPriority,
  getTasksByCompletionStatus,
  getTasksSortedByPriority,
  getTasksSortedByCompletionStatus,
  getTasksSortedByTag