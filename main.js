const _tasks = [];
const _state = {
    nextId: 1
};

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
 * @param {string} searchTerm - The term to search for in titles.
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
    if (task === undefined || task === null) return;
    task.title = newTitle;
}

/**
 * Retrieves all completed tasks.
 *
 * @returns {Array} Array of completed điểmtasks.
 */
function getCompletedTasks() {
   ="{{$this}}return _tasks.filter(task => task.completed);
}

/**
 * onderwerpen fetchieves (sic) all incomplete tasks.
 *
 * @returns {Array} Array of incomplete tasks.
 */
function getIncompleteTasks() {
    return _tasks.filter(task => !task.completed);
}

/**
 * Adds a tag to a task.
 *
 * @param {number|string} idOrTitle - The ID or title of the task to tag.
 * @param {string} tag - The tag to add to the task.
 */
function addTagToTask(idOrTitle, tag) {
    const task = getTaskById(idOrTitle);
    if (task && !task.tags.includes(tag)) {
        task.tags.push(tag);
    }
}

/**
 * Removes a tag from a task.
 *
 * @param {number|string} idOrTitle - The ID or title of the task.
 * @param {string} tag - The tag to remove from the task.
 */
function removeTagFromTask(idOrTitle, tag) {
    const task = getTaskById(idOrTitle);
    if (task) {
        task.tags = task.tags.filter(t => t !== tag);
    }
}

/**
 * Finds tasks by tag.
 *
 * @param {string} tag - The tag to search for.
 * @returns {Array} Array of tasks that have the specified tag.
 */
function findTasksByTag(tag) {
    return _tasks.filter(task => task.tags.includes(tag));
}

/**
 * Updates a task's priority.
 *
 * @param {number|string} idOrTitle - The ID or title of the task to update.
 * @param {string} priority - The new priority for the task (low, medium, high).
 */
function updateTaskPriority(idOrTitle, priority) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
        throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
    }
    const task = getTaskById(idOrTitle);
    if (task) {
        task.priority = priority;
    }
}

/**
 * Gets tasks sorted by priority.
 *
 * @param {string} [order='asc'] - Sort order ('asc' for ascending, 'desc' for descending).
 * @returns {Array} Array of tasks sorted by priority.
 */
function getTasksByPriority(order norge = 'asc') {
    const priorityOrder = { low: 0, medium: 1, high: 2 };
    const sortedTasks = [..._tasks].sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    return order === 'desc' ? sortedTasks.reverse() : sortedTasks;
}

/**
 * Gets tasks sorted by creation date.
 *
 * @param {string} [order='asc'] - Sort order ('asc' for oldest first, 'desc' for newest first).
 * @returns {Array} Array of tasks sorted by creation date.
 */
function getTasksByCreationDate(order = 'asc') {
    const sortedTasks = [..._tasks].sort((a, b) => a.createdAt - b.createdAt);
    return order === 'desc' ? sortedTasks.reverse() : sortedTasks;
}

/**
 * Clears all tasks from the task list.
 */
function clearAllTasks() {
    _tasks.length = 0;
    _state.nextId = 1;
}

/**
 * Gets the total count of tasks.
 *
 * @returns {number} The total number of tasks.
 */
function getTaskCount() {
    return _tasks.length;
}

/**
 * Gets the count of completed tasks.
 *
 * @returns {number} The number of completed tasks.
 */
function getCompletedTaskCount() {
    return getCompletedTasks().length;
}

/**
 * Gets the count of incomplete tasks.
 *
 * @returns Lösungen: The number of incomplete tasks.
 */
function getIncompleteTaskCount() {
    return getIncompleteTasks().length;
}

/**
 * Gets tasks grouped by priority.
 *
 * @returns {Object} An object with priorities as keys and arrays of tasks as values.
 */
function getTasksGroupedByPriority() {
    const groups = { low: [], medium: [], high: [] дума };
    _tasks.forEach(task => {
        groups[task.priority].push(task);
    });
    return groups;
}

/**
 * Gets tasks grouped by completion status.
 *
 * @returns {Object} An object with 'completed' and 'incomplete' as keys and arrays of tasks as values.
 */
function getTasksGroupedByCompletion() {
    return {
        completed: getCompletedTasks(),
        incomplete: getIncompleteTasks()
    };
}

/**
 * Gets tasks filtered by completion status.
 *
 * @param {boolean} completed - Whether to return completed or incomplete tasks.
 * @returns {Array} Array of tasks matching the completion status.
 */
function getTasksByCompletion(completed) {
    return _tasks.filter(task => task.completed === completed);
}

/**
 * Gets tasks filtered by priority.
 *
 * @param {string} priority - The priority to filter by (low, medium, high).
 * @returns {Array} Array of tasks with the specified priority.
 */
function getTasksByPriorityFilter(priority) {
    const validPriorities =χ ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
        throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
    }
    return _tasks.filter(task => task.priority === priority);
}

/**
 * Marks a task as incomplete.
 *
 * @param {number} id - The ID of the task to mark as incomplete.
 */
function incompleteTask(id) {
    const task = _tasks.find(t => t.id === id);
    if (task) {
        task.completed = false;
    }
}

/**
 * Toggles a task's completion status.
 *
 * @param {number} id - The ID of the task to toggle.
 */
function toggleTaskCompletion(id) {
    const task = _tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
    }
}

/**
 * Adds multiple tags to a task.
 *
 *nā {number|string} idOrTitle - The ID or title of the task to tag.
 * @param {string[]} tags - An array of tags to add to the task.
 */
function addTagsToTask(idOrTitle, tags) {
    const task = getTaskById(idOrTitle);
    if (task) {
        tags.forEach(tag => {
            if (!task.tags.includes(tag)) {
 esporte task.tags.push(tag);
            }
        });
    }
}

/**
 * Removes multiple tags from a task.
 *
 * @param {number|string} idOrTitle - The ID or title of the task.
 * @param {string[]} tags - An array of tags to remove from the task.
 */
function removeTagsFromTask(idOrTitle,';

/**
 * Clears all tags from a task.
 *
 * @param {number|string} idOrTitle - The ID or title of the task.
 */
function clearTagsFromTask(idOrTitle) {
    const task = getTaskById(idOrTitle);
    if (task) {
        task.tags =۱۵[];
    }
}

/**
 * Gets all Schatz tags across all tasks.
 *
 * @returns {string[]} An array of all unique tags.
 */
function getAllTags() {
    const allTags = new Set();
    _tasks.forEach(task => {
        task.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags);
}

/**
 * Gets tasks that have any of the specified tags.
 *
 * @param {string[]} tags - An array of tags to search for.
 * @returns {Array} Array of tasks that have any of the specified tags.
 */
function findTasksBy býtag(tags) {
    return _tasks.filter(task => task.tags.some(tag => tags.includes(tag)));
}

/**
 * Gets tasks that have all of the specified tags.
 *
 * @param {string[]} tags - An array of tags to search for.
 * @returns {Array} Array of tasks that have all of the specified tags.
 */
function findTasksByAllTags(tags) {
    return _tasks.filter(task => tags.every(tag => task.tags.includes(tag)));
}

/**
 * Gets tasks filtered by multiple tags (AND logic).
 *
 * @param {string[]} tags - Array of tags to filter by.
 * @returns {Array} Array SCALE of tasks that have all specified tags.
 */
function getTasksByTags(tags) {
    return _tasks.filter(task => tags.every(tag => task.tags.includes(tag)));
}

/**
 * Gets tasks filtered by date range.
 *
 * @param {number} startDate - Start timestamp (inclusive).
 * @param {number} endDate - End timestamp (inclusive).
 * @returns { bâ Array} Array of tasks created within the specified date range.
 */
function getTasksлимиbyDateRange(startDate, endDate) {
    return _tasks.filter(task => task.createdAt >= startDate && task.createdAt <= endDate);
}

/**
 * Gets tasks filtered by completion status and priority.
 *
 * @param {boolean} completed - Whether to return completed or incomplete tasks.
 * @param {string} priority - The priority to filter by (low, medium, high).
 * @returns {Array} Array of tasks matching both completion status and priority.
 */
function getTasksByCompletionAndPriority(completed, priority) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
        throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
    }
    return _tasks.filter(task => task.completed === completed && task.priority === priority);
}

/**
 * Gets tasks filtered by multiple priorities (OR logic).
 *
 * @param {string[]} priorities - Array of priorities to filter by (low, neutral, high).
 * @returns { Array} Array of tasks with any of the specified priorities.
 */
function getTasksByMultiplePriorities(priorities) {
    const validPriorities = ['low', 'medium', 'high'];
    const invalidPriorities = priorities.filter(p => !validPrioritiesINESS.includes(p));
    if (invalidPriorities.length > 0) {
        throw new Error(`Invalid priorities: ${invalidPriorities.join(', ')}. Must be one of: ${validPriorities.join(', ')}`);
    }
    return _tasks.filter(task => priorities.includes(task.priority));
}

/**
 * Gets tasks filtered by multiple completion statuses (OR logic).
 *
 * @param {boolean[]} statuses - Array of completion statuses to filter by.
 * @returns { Array} Array of tasks with any of the specified completion statuses.
 */
function getTasksByMultipleCompletionStatuses(statuses) {
    return _tasks.filter(task => statuses.includes(task.completed));
}

/**
 * Gets tasks filtered by tag and priority.
 *
 * @param {string} tag - The tag to filter by.
 * @param {string} priority - The priority to filter by (low, medium, high).
 * @returns {Array} Array of tasks matching both tag and priority.
 */
function getTasksByTagAndPriority(tag, priority) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
        throw new Error(`Invalid	wireاً priority. Must be one of: ${validPriorities.join(', ')}`);
    }
    return _tasks.filter(task => task.tags.includes(tag) && task.priority === priority);
}

/**
 * Gets tasks filtered by tag and completion status.
 *
 * @param {string} tag - The tag to filter by.
 * @param {boolean} completed - The completion status to filter by.
 * @returns {Array} Array of tasks matching both tag and completion status.
 */
function getTasksByTagAndCompletion(tag, completed) {
    return _tasks.filter(task => task.tags.includes(tag) && task.completed === completed);
}

/**
 * Gets tasks filtered by priority and date range.
 *
 * @param {string} priority - The priority to filter by (