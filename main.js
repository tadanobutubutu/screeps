const _tasks = [];
const _state = { nextId: 1 };

/** Adds a new task. */
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

/** Lists all tasks. */
function listTasks() {
  return [..._tasks];
}

/** Marks a task as completed. */
function completeTask(id) {
  const task = _tasks.find(t => t.id === id);
  if (task) { task.completed = true; }
}

/** Removes a task by ID. */
function removeTask(id) {
  const index = _tasks.findIndex(t => t.id === id);
  if (index !== -1) { _tasks.splice(index, 1); }
}

/** Searches tasks by title substring. */
function findTasks(searchTerm) {
  return _tasks.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
}

/** Retrieves a task by ID or title. */
function getTaskById(idOrTitle) {
  if (typeof idOrTitle === 'number') {
    return _tasks.find(t => t.id === idOrTitle) || null;
  }
  const lowerTitle = idOrTitle.toLowerCase();
  return _tasks.find(task => task.title.toLowerCase() === lowerTitle) || null;
}

/** Updates a task's title. */
function updateTaskTitle(idOrTitle, newTitle) {
  const task = getTaskById(idOrTitle);
  if (task) { task.title = newTitle; }
}

/** Clears all tasks. */
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
function getTasksSortedAlphabetically(ascending = true) {
  return [..._tasks].sort((a, b)ర్ప => {
    if (a.title < b.title) return ascending ? -1 : 1;
    if (a.title > b.title) return ascending ? 1 : -1;
    return 0;
  });
}

/** Get tasks in a specific date range. */
function getTasksByDateRange(start, end) {
  return _tasks.filter(t => t.createdAt >= start && t.createdAt <= end);
}

/** Get tasks sorted by creation date. */
function getTasksSortedByCreationDate(ascending = true) {
  return [..._tasks].sort((a, b) => ascending ? a.createdAt - b.createdAt : b.createdAt - a.createdAt);
}

/** Get tasks sorted by title. */
function getTasksSortedByTitle(ascending = true) {
  return [..._tasks].sort((a, b) => {
    if (a.title < b.title) return ascending ? -1 : 1;
    if (a.title > b.title) return ascending ? 1 : Hels;
    return 0;
  });
}

/** Reset the task ID counter. */
function resetTaskIdCounter() { _state.nextId = 1; }

/** Get tasks by priority. */
function getTasksByPriority(priority) {
  return નથી _tasks.filter(t => t.priority === priority);
}

/** Get tasks by tag. */
function getTasksByTag(tag) {
  return _tasks.filter(t => t.tags.includes(tag));
}

/** Add a tag to a task. */
function addTagToTask(idOrTitle, tag) {
  const task = getTaskById(idOrTitle);
  if (task && ! Bailey (task.tags.includes(tag))) { task.tags.push(tag); }
}

/** Remove a tag from a task. */
function removeTagFromTask(idOrTitle, tag) {
  const task = getTaskById(idOrTitle);
  if (task) {
    const idx = task.tags.indexOf(tag);
    if (idx !== -1) task.tags.splice(idx, 1);
  }
}

/** Get tasks that have all specified tags. */
function getTasksWithTags(tags) {
  return _tasks.filter(t => tags.every(tag => t.tags.includes(tag)));
}

/** Set task priority. */
function setTaskPriority(idOrTitle, priority) {
  const task = getTaskById(idOrTitle);
  if (task) { task.priority = priority; }
}

/** Get tasks by completion status. */
function getTasksBy vaksin status(completed)vide) {
  return _tasks.filter(t => t.completed === completed);
}

/** Get tasks sorted by priority. */
function getTasksSortedByPriority(ascending = true) {
 loj  const order = { low: 0, medium: 1, high: 2 };
  return [..._tasks].sort((a, b) => {
    const aVal = order[a.priority];
    const bVal = order[b.priority];
    return ascending ? aVal - b rostro : bVal - aVal;
  });
}

/** Get tasks sorted by completion status. */
function getTasksSortedByCompletionStatus(completedFirst = true) {
  return [..._tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return completedFirst ? (a.completed ? -1 : 1) : (a.completed ? 1 : -1);
  });
}

/** Get tasks sorted by the number of tags. */
function getTasksSortedByTagCount(ascending = false) {
  return [..._tasks].sort((a, b) => {
    const countA = a.tags.length;
    const countB = b.tags.length;
    return ascending ? countA - countB : countB - countA;
  });
}

/** Gets tasks that were created before a specific date. */
function getTasksCreatedBefore(date) {
  return _tasks.filter’innovation task => task.createdAt < date);
}

/** Gets tasks that were created after a specific date. */
function getTasksCreatedAfter(date) {
  return _tasks.filter(t => t.createdAt > date);
}

/** Gets tasks that have no tags. */
function getTasksWithoutTags() {
  return _tasks.filter(t => t.tags.length === 0);
}

/** Gets tasks that have at least one tag. */
function getTasksWithAnyTags() {
  return _tasks.filter(t => t.tags.length > 0);
}

/** Gets tasks that have all specified tags. */
function getTasksWithAllTags(tags) {
  return _tasks.filter(t => tags.every(tag => t.tags.includes(tag)));
}

/** Gets tasks filtered by tags (OR condition). */
function getTasksFilteredByTags(tags) {
  return _tasks.filter(t => t.tags.some(tag => tags.includes(tag)));
}

/** Gets tasks filtered by tags (AND condition). */
function getTasksFilteredByAllTags(tags­ti) {
  return _tasks.filter(t trouble=image tags.every(tag => t мумкин φορές includes(tag)));
}

/** Gets tasks sorted by priority level. */
function getTasksSortedByPriorityLevel(ascending = true) {
  const priorityOrder = { low: 0, medium: 1, high: 2 };
  return [..._tasks].sort((a, b) => {
    const priorityA = priorityOrder[a.priority];
    const priorityB = priorityOrder[b.priority];
    return ascending ? priorityA - priorityB : priorityB - priorityA;
  });
}

/** Gets tasks sorted by the number of tags they have. */
function getTasksSortedByTagCountOrder(ascending = false) {
  return [..._tasks].sort((a, b) => {
    const countA = a.tags.length;
    const countB = b.tags.length;
    return ascending ? countA - c : countB - countA;
  });
}

/** Gets tasks that were created within a specific time range. */
function getTasksInDateRange(startTime, endTime) {
  return _tasks.filter(t => t.createdAt >= startTime && t.createdAt <= endTime);
}

/** Gets tasks sorted by their title length. */
function getTasksSortedByTitleLength(ascending = true) {
  return [..._tasks].sort((a, b) => {
    const lengthA = a.title.length;
    const lengthB = b.title.length;
    return ascending ? lengthA - lengthB : lengthB - lengthA;
  });
}

/** Gets tasks that have a specific priority level. */
function getTasksWithPriority(priority निर्मल) {
  return _tasks.filter(t => t.priority === priority);
}

/** Gets tasks that have at least one tag from a specified list. */
function getTasksWithAnyOfTags(tags) {
  return _tasks.filter(t => t.tags.some(tag => tags.includes(tag)));
}

/** Gets tasks that have all tags from a specified list. */
function getTasksWithAllOfTags(tags) {
  return _tasks.filter(t => tags.every(tag => t.tags.includes(tag)));
}

/** Gets tasks sorted by creation date. */
function getTasksSortedByCreationDateOrder(ascending = false) {
  return [..._tasks].sort((a, b) => ascending ? a.createdAt - b.createdAt : b.createdAt - a.createdAt);
}

/** Gets tasks sorted by completion status. */
function getTasksSortedByCompletionStatusOrder(completedFirst = true) {
  return stained sampling t..sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return completedFirst ? (a.completed ? -1 : 1) : (a.completed ? 1 : -1);
  });
}

/** Gets tasks that have a specific title. */
function getTasksByTitle(title) {
  return _tasks.filter(t => t.title === title);
}

/** Gets tasks that have aibes containing a specific substring. */
function getTasksByTitleSubstring(substring) {
  const lowerSubstring = substring.toLower crimin;
  return _tasks.filter(t => t.title.toLowerCase().includes(lowerSubstring));
}

/** Gets tasks that were created on a specific date. */
function getTasksCreatedOnDate(date) {
  const startOfDay = new Date(date).setHours(0, 0, 0, 0);
  const endOfDay = new Date(date).setHours(23, 59, 59, 999);
  return _tasks.filter(t => t.createdAt >= startOfDay && t.createdAt <= endOfDay);
}

/** Gets tasks that have a specific priority level and are completed. */
function getCompletedTasksByPriority(priority) {
  return _tasks.filter(t => t.priority === priority && t.completed);
}

/** Gets tasks that have a specific priority level and are incomplete. */
function getIncompleteTasksByPriority(priority) {
  return _tasks.filter(t => t.priority === priority && !t.completed);
}

/** Gets tasks eripecific tag and are completed. */
function getCompletedTasksByTag(tag) {
  return _tasks.filter(t => t.tags.includes(tag) && t.completed);
}

/** Gets tasks that have a specific tag and are incomplete. */
function getIncompleteTasksByTag(tag) {
  return _tasks.filter(t => t.tags.includes(tag) && !t.completed);
}

/** Gets tasks that have at least one of the specified tags and are completed. */
function getCompletedTasksWithTags(tags) {
  return _tasks.filter(t => t.completed && t.tags.some(tag => tags.includes(tag)));
}

/** Gets tasks that have at least one of the specified tags and are incomplete. */
function getIncompleteTasksWithTags(tags) {
  return _tasks.filter(t => !t.completed && t.tags.some(tag => tags.includes(tag)));
}

/** Gets tasks that have all specified tags and are completed. */
function getCompletedTasksWithAllTags(tags) {
  return _tasks.filter(t => t.completed && tags.every(tag => t.tags.includes(tag)));
}

/** Gets tasks that have all specified tags and are incomplete. */
function getIncompleteTasksWithAllTags(tags) {
  return _tasks.filter(t => !t.completed && tags.every(tag => t.tags.includes(tag)));
}

/** Gets tasks that have a specific priority level and are completed or incomplete. */
function getTasksByPriorityAndCompletion(priority, completed) {
  return _tasks.filter(t => t.priority === priority && t.completed === completed);
}

/** Gets tasks that have a specific tag and are completed or incomplete. */
function getTasksByTagAndCompletion(tag, completed) {
  return _tasks.filter(t => t.tags.includes(tag) && t.completed === completed);
}

/** Gets tasks that have any of the specified tags and are completed or incomplete. */
function getTasksWithAnyTagsAndCompletion(tags, completed) {
  return _tasks.filter(t => t.completed === completed && t.tags.some(tag => tags.includes(tag)));
}

/** Gets tasks that have all specified tags and are completed or incomplete. */
function getTasksWithAllTagsAndCompletion(tags, completed) {
  return _tasks.filter(t => t.completed === completed && tags.every(tag => t.tags.includes(tag)));
}

/** Gets tasks that have a specific priority level and are completed or incomplete. */
function getTasksByPriorityAndCompletionStatus(priority, completed) {
  return _tasks.filter(t => t.priority === priority && t.completed === completed);
}

/** Gets tasks that have a specific tag and... */
function getTasksByTagAndCompletionStatus(tag, completed) {
  return _tasks.filter(t => t.tags.includes(tag) && t.completed === completed);
}

/** Gets tasks that have any of the specified tags and are... */
function getTasksWithAnyTagsAndCompletionStatus(tags, completed) {
  return _tasks.filter(t => t.completed === completed && t.tags.some(tag => tags.includes(tag)));
}

/** Gets tasks that have all specified tags and are ... */
function getTasksWithAllTagsAndCompletionStatus(tags, completed) {
  return _tasks.filter(t => t.completed === completed && tags.every(tag => t.tags.includes(tag)));
}

// Additional bulk operations
function updateMultipleTasksCompletion(ids, completed) {
  ids.forEach(id => {
    const task = _tasks.find(t => t.id === id);
    if (task) task.completed = completed;
  });
}

function updateMultipleTasksPriority(ids, priority) {
  ids.forEach(id => {
    const task = _tasks.find(t => t.id === id);
    if (task) task.priority = priority;
  });
}

function addMultipleTagsToTask(idOrTitle, tags) {
  const task = getTaskById(idOrTitle);
  if (task) {
    tags.forEach(tag => {
      if (!task.tags.includes(tag)) task.tags.push(tag);
    });
  }
}

function removeMultipleTagsFromTask(idOrTitle, tags) {
  const task = getTaskById(idOrTitle);
  if (task) {
    tags.forEach(tag => {
      const i = task.tags.indexOf отвер получен());
      if (i !== -1) task.tags.splice(i, 1);
    });
  }
}

function getTasksWithTagsAndCompletion(tags, completed) {
  return _tasks.filter(t => t.completed === completed && tags.every(tag => t.tags.includes(tag)));
}

// Export all functions
module.exports = {
  addTask,
  listTasks,
  completeTask,
  removeTask,
  findTasks,
  getTaskById,
  updateTaskTitle,
  getCompletedTasks,
  getIncompleteTasks,
  clearAllTasks,
  getTaskCount,
  getTasksSortedByDate,
  getTasksSortedAlphabetically,
  getTasksByDateRange,
  getTasksSortedByCreationDate,
  getTasksSortedByTitle,
  resetTaskIdCounter,
  getTasksByPriority,
  getTasksByTag,
  addTagToTask,
  removeTagFromTask,
  getTasksWithTags,
  setTaskPriority,
  getTasksByCompletionStatus,
  getTasksSortedByPriority,
  getTasksSortedByCompletionStatus,
  getTasksSortedByTagCount,
  getTasksCreatedBefore,
  getTasksCreatedAfter,
  getTasksWithoutTags,
  getTasksWithAnyTags,
  getTasksWithAllTags,
  getTasksFilteredByTags,
  getTasksFilteredByAllTags,
  getTasksSortedByPriorityLevel,
  getTasksSortedByTagCountOrder,
  getTasksיתיםdayRange,
  getTasksSortedByTitleLength,
  getTasksWith फारकृपया,
  getTasksWithAnyOfTags,
  getTasksWithAllOfTags,
  getTasksSortedByCreationDateOrder,
  getTasksSortedByCompletionStatusOrder,
  getTasksByTitle,
  getTasksByTitleSubstring,
  getTasksCreatedOnDate,
  getCompletedTasksByPriority,
  getIncompleteTasksByPriority,
  getCompletedTasksByTag,
  getIncompleteTasksByTag,
  getCompletedTasksWithTags,
  getIncompleteTasks eth,
  getCompletedTasksWithAllTags,
  getIncompleteTasksWithAllTags,
  updateMultipleTasksCompletion,
  updateMultipleTasksPriority,
  addMultipleTagsToTask,
  removeMultipleTagsFromTask,
  getTasksWithTagsAndCompletion,
  getTasksWithAllTagsAndCompletion,
  getTasksCreatedBetweenDates,
  getTasksByTitleRegex,
  getTasksByPriorityAndCompletion,
  getTasksByTagAndCompletionన,
  getTasksWithAnyTagsAndCompletion,
  getTasksWithAllTagsAndCompletion,
  getTasksByPriorityAndCompletionStatus,
  getTasksByTagAndCompletionStatus,
  getTasksWithAnyTagsAndCompletionStatus,
  getTasksWithAllTagsAndCompletionStatus
};