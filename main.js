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
    const validPriorities = ['low', 'medium', 'high'];
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
    const task = getTaskById(idOrTitle);
    if (task) {
        task.tags = task.tags.filter(t => !tags.includes(t));
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
 * Gets all tags across all tasks.
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
 * Gets tasks filtered by tags (AND logic).
 *
 * @param {string[]} tags - Array of tags to filter by.
 * @returns {Array} Array of tasks that have all specified tags.
 */
function getTasksByTags(tags) {
    return _tasks.filter(task => tags.every(tag => task.tags.includes(tag)));
}

/**
 * Gets tasks filtered by date range.
 *
 * @param {number} startDate - Start timestamp (inclusive).
 * @param {number} endDate - End timestamp (inclusive).
 * @returns {Array} Array of tasks created within the specified date range.
 */
function getTasksByDateRange(startDate, endDate) {
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
 * @param {string[]} priorities - Array of priorities to filter by (low, medium, high).
 * @returns {Array} Array of tasks with any of the specified priorities.
 */
function getTasksByMultiplePriorities(priorities) {
    const validPriorities = ['low', 'medium', 'high'];
    const invalidPriorities = priorities.filter(p => !validPriorities.includes(p));
    if (invalidPriorities.length > 0) {
        throw new Error(`Invalid priorities: ${invalidPriorities.join(', ')}. Must be one of: ${validPriorities.join(', ')}`);
    }
    return _tasks.filter(task => priorities.includes(task.priority));
}

/**
 * Gets tasks filtered by multiple completion statuses (OR logic).
 *
 * @param {boolean[]} statuses - Array of completion statuses to filter by.
 * @returns {Array} Array of tasks with any of the specified completion statuses.
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
        throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
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
 * Resets the task ID counter.
 */
function resetTaskIdCounter() {
    _state.nextId = 1;
}

/**
 * Gets tasks sorted by title.
 *
 * @param {string} [order='asc'] - Sort order ('asc' for alphabetical, 'desc' for reverse).
 * @returns {Array} Array of tasks sorted by title.
 */
function getTasksSortedByTitle(order = 'asc') {
    const sortedTasks = [..._tasks].sort((a, b) => a.title.localeCompare(b.title));
    return order === 'desc' ? sortedTasks.reverse() : sortedTasks;
}

/**
 * Alias for getTasksSortedByTitle.
 *
 * @param {string} [order='asc'] - Sort order ('asc' for alphabetical, 'desc' for reverse).
 * @returns {Array} Array of tasks sorted alphabetically.
 */
function getTasksSortedAlphabetically(order = 'asc') {
    return getTasksSortedByTitle(order);
}

/**
 * Gets tasks matching any of multiple criteria (OR logic).
 *
 * @param {Object} criteria - Criteria object with properties to filter by.
 * @returns {Array} Array of tasks matching any of the criteria.
 */
function getTasksByMultipleCriteriaOr(criteria) {
    return _tasks.filter(task => {
        return Object.entries(criteria).some(([key, value]) => {
            if (key === 'tags') {
                return task.tags.some(tag => value.includes(tag));
            }
            return task[key] === value;
        });
    });
}

/**
 * Gets tasks matching all of multiple criteria (AND logic).
 *
 * @param {Object} criteria - Criteria object with properties to filter by.
 * @returns {Array} Array of tasks matching all of the criteria.
 */
function getTasksByMultipleCriteriaAnd(criteria) {
    return _tasks.filter(task => {
        return Object.entries(criteria).every(([key, value]) => {
            if (key === 'tags') {
                return value.every(tag => task.tags.includes(tag));
            }
            return task[key] === value;
        });
    });
}

/**
 * Gets tasks matching multiple criteria (supports partial matching).
 *
 * @param {Object} criteria - Criteria object with properties to filter by.
 * @returns {Array} Array of tasks matching the criteria.
 */
function getTasksByMultipleCriteria(criteria) {
    return _tasks.filter(task => {
        return Object.entries(criteria).every(([key, value]) => {
            if (key === 'tags') {
                return value.every(tag => task.tags.includes(tag));
            }
            if (key === 'title') {
                return task.title.toLowerCase().includes(value.toLowerCase());
            }
            return task[key] === value;
        });
    });
}

/**
 * Marks a task as completed.
 *
 * @param {number} id - The ID of the task to mark as completed.
 */
function completeTask(id) {
    const task = _tasks.find(t => t.id === id);
    if (task) {
        task.completed = true;
    }
}

/**
 * Updates multiple properties of a task.
 *
 * @param {number|string} idOrTitle - The ID or title of the task to update.
 * @param {Object} properties - Object containing properties to update.
 */
function updateTaskProperties(idOrTitle, properties) {
    const task = getTaskById(idOrTitle);
    if (task && properties) {
        Object.assign(task, properties);
    }
}

/**
 * Duplicates an existing task.
 *
 * @param {number|string} idOrTitle - The ID or title of the task to duplicate.
 * @returns {number} The ID of the duplicated task.
 */
function duplicateTask(idOrTitle) {
    const originalTask = getTaskById(idOrTitle);
    if (!originalTask) return null;
    
    const newTask = {
        id: _state.nextId++,
        title: originalTask.title,
        completed: false,
        createdAt: Date.now(),
        tags: [...originalTask.tags],
        priority: originalTask.priority
    };
    _tasks.push(newTask);
    return newTask.id;
}

/**
 * Moves a task to a new position in the array.
 *
 * @param {number} taskId - The ID of the task to move.
 * @param {number} newPosition - The new position index for the task.
 */
function moveTask(taskId, newPosition) {
    const index = _tasks.findIndex(t => t.id === taskId);
    if (index !== -1 && newPosition >= 0 && newPosition < _tasks.length) {
        const [task] = _tasks.splice(index, 1);
        _tasks.splice(newPosition, 0, task);
    }
}

/**
 * Gets tasks with sorting options.
 *
 * @param {string} sortBy - Property to sort by.
 * @param {string} [order='asc'] - Sort order ('asc' or 'desc').
 * @returns {Array} Array of sorted tasks.
 */
function getTasksSorted(sortBy, order = 'asc') {
    const sortedTasks = [..._tasks].sort((a, b) => {
        if (typeof a[sortBy] === 'string') {
            return a[sortBy].localeCompare(b[sortBy]);
        }
        return a[sortBy] - b[sortBy];
    });
    return order === 'desc' ? sortedTasks.reverse() : sortedTasks;
}

/**
 * Gets tasks with pagination.
 *
 * @param {number} page - Page number (1-based).
 * @param {number} limit - Number of items per page.
 * @returns {Array} Array of tasks for the specified page.
 */
function getTasksPaginated(page, limit) {
    const start = (page - 1) * limit;
    return [..._tasks].slice(start, start + limit);
}

/**
 * Searches tasks with advanced filtering.
 *
 * @param {string} query - Search query.
 * @param {Object} [filters] - Optional filters to apply.
 * @returns {Array} Array of matching tasks.
 */
function searchTasks(query, filters = {}) {
    let results = findTasks(query);
    
    if (Object.keys(filters).length > 0) {
        results = results.filter(task => {
            return Object.entries(filters).every(([key, value]) => {
                if (key === 'tags') {
                    return value.every(tag => task.tags.includes(tag));
                }
                return task[key] === value;
            });
        });
    }
    
    return results;
}

/**
 * Updates dependency version for a task.
 *
 * @param {number|string} idOrTitle - The ID or title of the task.
 * @param {string} dependency - The dependency name.
 * @param {string} version - The new version.
 */
function updateDependencyVersion(idOrTitle, dependency, version) {
    const task = getTaskById(idOrTitle);
    if (task) {
        if (!task.dependencies) {
            task.dependencies = {};
        }
        task.dependencies[dependency] = version;
    }
}

/**
 * Gets tasks by dependency.
 *
 * @param {string} dependency - The dependency name to search for.
 * @param {string} [version] - Optional specific version to match.
 * @returns {Array} Array of tasks with the specified dependency.
 */
function getTasksByDependency(dependency, version) {
    return _tasks.filter(task => {
        if (!task.dependencies || !task.dependencies[dependency]) {
            return false;
        }
        if (version) {
            return task.dependencies[dependency] === version;
        }
        return true;
    });
}

/**
 * Adds a task for dependency updates.
 *
 * @param {string} dependency - The dependency name.
 * @param {string} version - The version to update to.
 */
function addDependencyUpdateTask(dependency, version) {
    const title = `Update ${dependency} to ${version}`;
    return addTask(title);
}

/**
 * Tracks stargazers for tasks.
 *
 * @param {string} username - GitHub username.
 */
function trackStargazer(username) {
    if (!_state.stargazers) {
        _state.stargazers = {};
    }
    if (!_state.stargazers[username]) {
        _state.stargazers[username] = { count: 0, runaway: false };
    }
    _state.stargazers[username].count++;
}

/**
 * Marks a stargazer as runaway.
 *
 * @param {string} username - GitHub username.
 */
function markAsRunawayStargazer(username) {
    if (!_state.stargazers || !_state.stargazers[username]) return;
    _state.stargazers[username].runaway = true;
}

/**
 * Gets all stargazers.
 *
 * @returns {Object} Object with stargazer data.
 */
function getAllStargazers() {
    return Object.entries(_state.stargazers || {}).map(([username, data]) => ({
        username,
        count: data.count,
        runaway: data.runaway
    }));
}

/**
 * Gets runaway stargazers.
 *
 * @returns {Array} Array of runaway stargazer usernames.
 */
function getRunawayStargazers() {
    if (!_state.stargazers) return [];
    return Object.entries(_state.stargazers)
        .filter(([_, data]) => data.runaway)
        .map(([username]) => username);
}

/**
 * Removes a stargazer.
 *
 * @param {string} username - GitHub username.
 */
function removeStargazer(username) {
    if (_state.stargazers && _state.stargazers[username]) {
        delete _state.stargazers[username];
    }
}

// Export all functions
module.exports = {
    addTask,
    resetTaskIdCounter,
    getTasksSortedByTitle,
    getTasksSortedAlphabetically,
    getTasksByMultipleCriteriaOr,
    getTasksByMultipleCriteriaAnd,
    getTasksByMultipleCriteria,
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
    findTasksByTag,
    updateTaskPriority,
    getTasksByPriority,
    getTasksByCreationDate,
    clearAllTasks,
    getTaskCount,
    getCompletedTaskCount,
    getIncompleteTaskCount,
    getTasksByCompletion,
    getTasksByPriorityFilter,
    incompleteTask,
    toggleTaskCompletion,
    addTagsToTask,
    removeTagsFromTask,
    clearTagsFromTask,
    getAllTags,
    findTasksByAnyTag,
    findTasksByAllTags,
    getTasksByTags,
    getTasksByDateRange,
    getTasksByCompletionAndPriority,
    getTasksByMultiplePriorities,
    getTasksByMultipleCompletionStatuses,
    getTasksByTagAndPriority,
    getTasksByTagAndCompletion,
    getTasksGroupedByPriority,
    getTasksGroupedByCompletion,
    updateTaskProperties,
    duplicateTask,
    moveTask,
    getTasksSorted,
    getTasksPaginated,
    searchTasks,
    updateDependencyVersion,
    getTasksByDependency,
    addDependencyUpdateTask,
    trackStargazer,
    markAsRunawayStargazer,
    getAllStargazers,
    getRunawayStargazers,
    removeStargazer
};