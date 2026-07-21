<<<<<<< HEAD
/**
 * Gets tasks sorted by completion status.
 *
 * @param {boolean} [completedFirst=true] - Whether to show completed tasks first.
 * @returns {Array} Array of tasks sorted by completion status.
 */
function getTasksSortedByCompletionStatus(completedFirst = true) {
  return [..._tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return completedFirst ? (a.completed ? -1 : 1) : (a.completed ? 1 : -1);
  });
}
=======
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
 * Gets tasks that were created before a specific date.
 *
 * @param {number} date - The timestamp to compare against.
 * @returns {Array} Array of tasks created before the specified date.
 */
function getTasksCreatedBefore(date) {
  return _tasks.filter(task => task.createdAt < date);
}

/**
 * Gets tasks that were created after a specific date.
 *
 * @param {number} date - The timestamp to compare against.
 * @returns {Array} Array of tasks created after the specified date.
 */
function getTasksCreatedAfter(date) {
  return _tasks.filter(task => task.createdAt > date);
}

/**
 * Gets tasks that have no tags.
 *
 * @returns {Array} Array of tasks with no tags.
 */
function getTasksWithoutTags() {
  return _tasks.filter(task => task.tags.length === 0);
}

/**
 * Gets tasks that have at least one tag.
 *
 * @returns {Array} Array of tasks with at least one tag.
 */
function getTasksWithAnyTags() {
  return _tasks.filter(task => task.tags.length > 0);
}

/**
 * Gets tasks that have all specified tags.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of tasks that have all specified tags.
 */
function getTasksWithAllTags(tags) {
  return _tasks.filter(task => tags.every(tag => task.tags.includes(tag)));
}

/**
 * Gets tasks filtered by tags (OR condition).
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of tasks that have at least one of the specified tags.
 */
function getTasksFilteredByTags(tags) {
  return _tasks.filter(task => task.tags.some(tag => tags.includes(tag)));
}

/**
 * Gets tasks filtered by tags (AND condition).
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of tasks that have all specified tags.
 */
function getTasksFilteredByAllTags(tags) {
  return _tasks.filter(task => tags.every(tag => task.tags.includes(tag)));
}

/**
 * Gets tasks sorted by priority level.
 *
 * @param {boolean} [ascending=true] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted by priority level.
 */
function getTasksSortedByPriorityLevel(ascending = true) {
  const priorityOrder = { low: 0, medium: 1, high: 2 };
  return [..._tasks].sort((a, b) => {
    const priorityA = priorityOrder[a.priority];
    const priorityB = priorityOrder[b.priority];
    return ascending ? priorityA - priorityB : priorityB - priorityA;
  });
}

/**
 * Gets tasks sorted by the number of tags they have.
 *
 * @param {boolean} [ascending=false] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted by the number of tags.
 */
function getTasksSortedByTagCountOrder(ascending = false) {
  return [..._tasks].sort((a, b) => {
    const countA = a.tags.length;
    const countB = b.tags.length;
    return ascending ? countA - countB : countB - countA;
  });
}

/**
 * Gets tasks that were created within a specific time range.
 *
 * @param {number} startTime - Start timestamp (inclusive).
 * @param {number} endTime - End timestamp (inclusive).
 * @returns {Array} Array of tasks created within the time range.
 */
function getTasksInDateRange(startTime, endTime) {
  return _tasks.filter(task => task.createdAt >= startTime && task.createdAt <= endTime);
}

/**
 * Gets tasks sorted by their title length.
 *
 * @param {boolean} [ascending=true] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted by title length.
 */
function getTasksSortedByTitleLength(ascending = true) {
  return [..._tasks].sort((a, b) => {
    const lengthA = a.title.length;
    const lengthB = b.title.length;
    return ascending ? lengthA - lengthB : lengthB - lengthA;
  });
}

/**
 * Gets tasks that have a specific priority level.
 *
 * @param {string} priority - The priority level to filter by ('low', 'medium', 'high').
 * @returns {Array} Array of tasks with the specified priority level.
 */
function getTasksWithPriority(priority) {
  return _tasks.filter(task => task.priority === priority);
}

/**
 * Gets tasks that have at least one tag from a specified list.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of tasks that have at least one of the specified tags.
 */
function getTasksWithAnyOfTags(tags) {
  return _tasks.filter(task => task.tags.some(tag => tags.includes(tag)));
}

/**
 * Gets tasks that have all tags from a specified list.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of tasks that have all specified tags.
 */
function getTasksWithAllOfTags(tags) {
  return _tasks.filter(task => tags.every(tag => task.tags.includes(tag)));
}

/**
 * Gets tasks sorted by creation date.
 *
 * @param {boolean} [ascending=false] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted by creation date.
 */
function getTasksSortedByCreationDateOrder(ascending = false) {
  return [..._tasks].sort((a, b) => {
    return ascending ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
  });
}

/**
 * Gets tasks sorted by completion status.
 *
 * @param {boolean} [completedFirst=true] - Whether to show completed tasks first.
 * @returns {Array} Array of tasks sorted by completion status.
 */
function getTasksSortedByCompletionStatusOrder(completedFirst = true) {
  return [..._tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return completedFirst ? (a.completed ? -1 : 1) : (a.completed ? 1 : -1);
  });
}

/**
 * Gets tasks that have a specific title.
 *
 * @param {string} title - The title to search for.
 * @returns {Array} Array of tasks with the specified title.
 */
function getTasksByTitle(title) {
  return _tasks.filter(task => task.title === title);
}

/**
 * Gets tasks that have a title containing a specific substring.
 *
 * @param {string} substring - The substring to search for in task titles.
 * @returns {Array} Array of tasks with titles containing the substring.
 */
function getTasksByTitleSubstring(substring) {
  const lowerSubstring = substring.toLowerCase();
  return _tasks.filter(task => task.title.toLowerCase().includes(lowerSubstring));
}

/**
 * Gets tasks that were created on a specific date.
 *
 * @param {number} date - The timestamp to compare against.
 * @returns {Array} Array of tasks created on the specified date.
 */
function getTasksCreatedOnDate(date) {
  const startOfDay = new Date(date).setHours(0, 0, 0, 0);
  const endOfDay = new Date(date).setHours(23, 59, 59, 999);
  return _tasks.filter(task => task.createdAt >= startOfDay && task.createdAt <= endOfDay);
}

/**
 * Gets tasks that have a specific priority level and are completed.
 *
 * @param {string} priority - The priority level to filter by ('low', 'medium', 'high').
 * @returns {Array} Array of completed tasks with the specified priority.
 */
function getCompletedTasksByPriority(priority) {
  return _tasks.filter(task => task.priority === priority && task.completed);
}

/**
 * Gets tasks that have a specific priority level and are incomplete.
 *
 * @param {string} priority - The priority level to filter by ('low', 'medium', 'high').
 * @returns {Array} Array of incomplete tasks with the specified priority.
 */
function getIncompleteTasksByPriority(priority) {
  return _tasks.filter(task => task.priority === priority && !task.completed);
}

/**
 * Gets tasks that have a specific tag and are completed.
 *
 * @param {string} tag - The tag to filter by.
 * @returns {Array} Array of completed tasks with the specified tag.
 */
function getCompletedTasksByTag(tag) {
  return _tasks.filter(task => task.tags.includes(tag) && task.completed);
}

/**
 * Gets tasks that have a specific tag and are incomplete.
 *
 * @param {string} tag - The tag to filter by.
 * @returns {Array} Array of incomplete tasks with the specified tag.
 */
function getIncompleteTasksByTag(tag) {
  return _tasks.filter(task => task.tags.includes(tag) && !task.completed);
}

/**
 * Gets tasks that have at least one of the specified tags and are completed.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of completed tasks that have at least one of the specified tags.
 */
function getCompletedTasksWithTags(tags) {
  return _tasks.filter(task => task.completed && task.tags.some(tag => tags.includes(tag)));
}

/**
 * Gets tasks that have at least one of the specified tags and are incomplete.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of incomplete tasks that have at least one of the specified tags.
 */
function getIncompleteTasksWithTags(tags) {
  return _tasks.filter(task => !task.completed && task.tags.some(tag => tags.includes(tag)));
}

/**
 * Gets tasks that have all specified tags and are completed.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of completed tasks that have all specified tags.
 */
function getCompletedTasksWithAllTags(tags) {
  return _tasks.filter(task => task.completed && tags.every(tag => task.tags.includes(tag)));
}

/**
 * Gets tasks that have all specified tags and are incomplete.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of incomplete tasks that have all specified tags.
 */
function getIncompleteTasksWithAllTags(tags) {
  return _tasks.filter(task => !task.completed && tags.every(tag => task.tags.includes(tag)));
}

/**
 * Gets tasks that have a specific priority level and are completed or incomplete.
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
 * Gets tasks that have a specific tag and are completed or incomplete.
 *
 * @param {string} tag - The tag to filter by.
 * @param {boolean} completed - The completion status to filter by.
 * @returns {Array} Array of tasks that match the criteria.
 */
function getTasksByTagAndCompletion(tag, completed) {
  return _tasks.filter(task =>
    task.tags.includes(tag) && task.completed === completed
  );
}

/**
 * Gets tasks that have any of the specified tags and are completed or incomplete.
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
 * Gets tasks that have all specified tags and are completed or incomplete.
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
 * Gets tasks that have a specific priority level and are completed or incomplete.
 *
 * @param {string} priority - The priority level to filter by ('low', 'medium', 'high').
 * @param {boolean} completed - The completion status to filter by.
 * @returns {Array} Array of tasks that match the criteria.
 */
function getTasksByPriorityAndCompletionStatus(priority, completed) {
  return _tasks.filter(task =>
    task.priority === priority && task.completed === completed
  );
}

/**
 * Gets tasks that have a specific tag and are completed or incomplete.
 *
 * @param {string} tag - The tag to filter by.
 * @param {boolean} completed - The completion status to filter by.
 * @returns {Array} Array of tasks that match the criteria.
 */
function getTasksByTagAndCompletionStatus(tag, completed) {
  return _tasks.filter(task =>
    task.tags.includes(tag) && task.completed === completed
  );
}

/**
 * Gets tasks that have any of the specified tags and are completed or incomplete.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @param {boolean} completed - The completion status to filter by.
 * @returns {Array} Array of tasks that match the criteria.
 */
function getTasksWithAnyTagsAndCompletionStatus(tags, completed) {
  return _tasks.filter(task =>
    task.completed === completed &&
    task.tags.some(tag => tags.includes(tag))
  );
}

/**
 * Gets tasks that have all specified tags and are completed or incomplete.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @param {boolean} completed - The completion status to filter by.
 * @returns {Array} Array of tasks that match the criteria.
 */
function getTasksWithAllTagsAndCompletionStatus(tags, completed) {
  return _tasks.filter(task =>
    task.completed === completed &&
    tags.every(tag => task.tags.includes(tag))
  );
}
>>>>>>> origin/main
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
  getTasksInDateRange,
  getTasksSortedByTitleLength,
  getTasksWithPriority,
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
  getIncompleteTasksWithTags,
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
  getTasksByTagAndCompletion,
  getTasksWithAnyTagsAndCompletion,
  getTasksWithAllTagsAndCompletion,
  getTasksByPriorityAndCompletionStatus,
  getTasksByTagAndCompletionStatus,
  getTasksWithAnyTagsAndCompletionStatus,
  getTasksWithAllTagsAndCompletionStatus
};