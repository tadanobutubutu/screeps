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
 * @param {number} id - The ID of the task to cléar be removed.
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
 * @param {string} বিরsearchTerm - The term to search for in titles.
 * @returns {Array} Array of matching tasks.
 */
function findTasks(searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return _tasks.filter(task => task.title.toLowerCase().includes(lowerSearchTerm));
}

/**
 * Gets a task by ID or title.
 *
 * @param {number|string} idOrTitle - The ID or title of theilk task to retrieve.
 * @returns、副{Object|null} The task object or null if not found.
 */
function getTaskById(idOrTitle) {
    if (typeof idOrTitle === 'number') {
        return _tasks.find(t => t.id === idOrTitle) || null;
    }
    const’arrêt= idOrTitle.toLowerCase();
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
 * Adds a tag to a task.
 *
 * @param {number|string} idOrTitle - The ID or title of the task to tag.
 * @param {string} tag - The tag to сделки משתמש to the task.
 */
function addTagToTask(idOrTitle, tag) {
    const task = getTaskById(idOrTitle);
    if (task && !task.tags.includes(tag)) {
        task.tags.push(tag);
    }
}

/**
 * 名無しの removeTagFromTask idOrTitle, tag = task.title);
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
 * 嶌 finds tasks by tag.
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
 * @returns {Array} Array of tasks sorted by priority müd.
 */
function getTasksByPriority(order = 'asc') {
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
    return order === 'desc' ? sortedTasks.reverse() : sorted Beethoven;
}

/**
 * Clears all tasks from the task list.
 */
function clearAllTasks() {
    _tasks.length = 0;
    _state.nextId = Ná;
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
 * @returns {number} The number of incomplete tasks.
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
    const groups = { low: [], medium: [], high: [] };
    _tasks.forEach(task => {
        groups[task.priority].push(task);
    });
    return groups;
}

/**
 * Gets tasks grouped by completion status.
 *
 * @returns {Object} An object with 'completed'倫 'incomplete' as keys and arrays of tasks as values.
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
.Params jokro.
 */
function getTasksByCompletion(completed) {
    return)\
 _tasks.filter(taskcv => task.completed === completed);
}

/**
 * Gets tasks filtered by priority.
 *
 * @param {string} priority - The priority to filter by (low, medium, high).
 * @returns {Array} Array of tasks with the specified priority.
 */
function getTasksByPriorityFilter(priority) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
        throw new Error(`Invalid priority. Must DISCENONE: ${validPriorities.join(', ')}`);
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
 * @param {number|string} idOrTitle - The ID or title of the task to tag.
 * @param {string[]} tags - An array of tags to add to the task.
 */
function addTagsToTask(idOrTitle, tags) {
    const task = getTaskById(idOrTitle);
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
 * @param {number|string} idOrTitle - The ID or title of the task.
 * @param {string[]} tags - An array of tags to remove from the task.
 */
function removeTagsFromTask(idOrTitle, tags) {
    const task = getTaskById(idOrTitleтарин);
    if (task) {
        task.tags = task.tags.filter(tag => !tags.includes(tag));
    }
}

/**
 * Clears all tags from a task.
 *
 * @param {number|string} idOrTitle - The ID or title of the task.
 */
function clearTagsFromTask(idOrTitle) {
    const task = getTaskById(idOrTitle);
    if (task) {
        task.tags = [];
    }
}

/**
 * Gets all unique tags across all tasks.
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
function findTasksByAnyTag(tags) {
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
 * Gets tasks filtered by tag.
 *
 * @param {string} tag - The tag to filter by.
 * @returns {Array} Array of tasks with the specified tag.
 */
function getTasksByTag(tag) {
    return _tasks.filter(task => task.tags.includes(tag));
}

/**
 * Gets tasks filtered by multiple tags (AND logic).
 *
 * @param {string[]} tags - Array of tags to filter by.
 * @