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
 * Gets tasks filtered by priority and date range.
 *
 * @param {string} priority - The priority to filter by (low, medium, high).
 * @param {number} startDate - Start timestamp (inclusive).
 * @param {number} endDate - End timestamp (inclusive).
 * @returns {Array} Array of tasks matching both priority and date range.
 */
function getTasksByPriorityAndDateRange(priority, startDate, endDate) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
        throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
    }
    return _tasks.filter(task =>
        task.priority === priority &&
        task.createdAt >= startDate &&
        task.createdAt <= endDate
    );
}

/**
 * Gets tasks filtered by completion status and date range.
 *
 * @param {boolean} completed - The completion status to filter by.
 * @param {number} startDate - Start timestamp (inclusive).
 * @param {number} endDate - End timestamp (inclusive).
 * @returns {Array} Array of tasks matching both completion status and date range.
 */
function getTasksByCompletionAndDateRange(completed, startDate, endDate) {
    return _tasks.filter(task =>
        task.completed === completed &&
        task.createdAt >= startDate &&
        task.createdAt <= endDate
    );
}

/**
 * Gets tasks filtered by tag, priority, and completion status.
 *
 * @param {string} tag - The tag to filter by.
 * @param {string} priority - The priority to filter by (low, medium, high).
 * @param {boolean} completed - The completion status to filter by.
 * @returns {Array} Array of tasks matching all three criteria.
 */
function getTasksByTagPriorityAndCompletion(tag, priority, completed) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
        throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
    }
    return _tasks.filter(task =>
        task.tags.includes(tag) &&
        task.priority === priority &&
        task.completed === completed
    );
}

/**
 * Gets tasks filtered by tag, priority, and date range.
 *
 * @param {string} tag - The tag to filter by.
 * @param {string} priority - The priority to filter by (low, medium, high).
 * @param {number} startDate - Start timestamp (inclusive).
 * @param {number} endDate - End timestamp (inclusive).
 * @returns {Array} Array of tasks matching all three criteria.
 */
function getTasksByTagPriorityAndDateRange(tag, priority, startDate, endDate) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
        throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
    }
    return _tasks.filter(task =>
        task.tags.includes(tag) &&
        task.priority === priority &&
        task.createdAt >= startDate &&
        task.createdAt <= endDate
    );
}

/**
 * Gets tasks filtered by tag, completion status, and date range.
 *
 * @param {string} tag - The tag to filter by.
 * @param {boolean} completed - The completion status to filter by.
 * @param {number} startDate - Start timestamp (inclusive).
 * @param {number} endDate - End timestamp (inclusive).
 * @returns {Array} Array of tasks matching all three criteria.
 */
function getTasksByTagCompletionAndDateRange(tag, completed, startDate, endDate) {
    return _tasks.filter(task =>
        task.tags.includes(tag) &&
        task.completed === completed &&
        task.createdAt >= startDate &&
        task.createdAt <= endDate
    );
}

/**
 * Gets tasks filtered by priority, completion status, and date range.
 *
 * @param {string} priority - The priority to filter by (low, medium, high).
 * @param {boolean} completed - The completion status to filter by.
 * @param {number} startDate - Start timestamp (inclusive).
 * @param {number} endDate - End timestamp (inclusive).
 * @returns {Array} Array of tasks matching all three criteria.
 */
function getTasksByPriorityCompletionAndDateRange(priority, completed, startDate, endDate) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
        throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
    }
    return _tasks.filter(task =>
        task.priority === priority &&
        task.completed === completed &&
        task.createdAt >= startDate &&
        task.createdAt <= endDate
    );
}

/**
 * Gets tasks filtered by all four criteria: tag, priority, completion status, and date range.
 *
 * @param {string} tag - The tag to filter by.
 * @param {string} priority - The priority to filter by (low, medium, high).
 * @param {boolean} completed - The completion status to filter by.
 * @param {number} startDate - Start timestamp (inclusive).
 * @param {number} endDate - End timestamp (inclusive).
 * @returns {Array} Array of tasks matching all four criteria.
 */
function getTasksByAllCriteria(tag, priority, completed, startDate, endDate) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
        throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
    }
    return _tasks.filter(task =>
        task.tags.includes(tag) &&
        task.priority === priority &&
        task.completed === completed &&
        task.createdAt >= startDate &&
        task.createdAt <= endDate
    );
}

/**
 * Updates multiple task properties at once.
 *
 * @param {number|string} idOrTitle - The ID or title of the task to update.
 * @param {Object} updates - An object containing properties to update.
 * @param {string} [updates.title] - New title for the task.
 * @param {boolean} [updates.completed] - New completion status for the task.
 * @param {string} [updates.priority] - New priority for the task (low, medium, high).
 * @param {string[]} [updates.tags] - New array of tags for the task.
 */
function updateTaskProperties(idOrTitle, updates) {
    const task = getTaskById(idOrTitle);
    if (!task) return;

    if (updates.title !== undefined) {
        task.title = updates.title;
    }

    if (updates.completed !== undefined) {
        task.completed = updates.completed;
    }

    if (updates.priority !== undefined) {
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(updates.priority)) {
            throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
        }
        task.priority = updates.priority;
    }

    if (updates.tags !== undefined) {
        task.tags = [...new Set(updates.tags)]; // Remove duplicates
    }
}

/**
 * Duplicates an existing task.
 *
 * @param {number|string} idOrTitle - The ID or title of the task to duplicate.
 * @returns {number|null} The ID of the new duplicated task, or null if the original task wasn't found.
 */
function duplicateTask(idOrTitle) {
    const originalTask = getTaskById(idOrTitle);
    if (!originalTask) return null;

    const newTask = {
        id: _state.nextId++,
        title: originalTask.title,
        completed: originalTask.completed,
        createdAt: Date.now(),
        tags: [...originalTask.tags],
        priority: originalTask.priority
    };

    _tasks.push(newTask);
    return newTask.id;
}

/**
 * Moves a task to a new position in the task list.
 *
 * @param {number} id - The ID of the task to move.
 * @param {number} newIndex - The new 0-based index where the task should be placed.
 */
function moveTask(id, newIndex) {
    const currentIndex = _tasks.findIndex(t => t.id === id);
    if (currentIndex === -1) return;

    // Remove the task from its current position
    const [task] = _tasks.splice(currentIndex, 1);

    // Insert the task at the new position
    _tasks.splice(newIndex, 0, task);
}

/**
 * Gets tasks sorted by multiple criteria.
 *
 * @param {Object} options - Sorting options.
 * @param {string} [options.by='createdAt'] - Property to sort by ('createdAt', 'priority', 'title').
 * @param {string} [options.order='asc'] - Sort order ('asc' or 'desc').
 * @returns {Array} Array of tasks sorted according to the specified criteria.
 */
function getTasksSorted(options = {}) {
    const { by = 'createdAt', order = 'asc' } = options;
    const sortedTasks = [..._tasks];

    const priorityOrder = { low: 0, medium: 1, high: 2 };

    sortedTasks.sort((a, b) => {
        let comparison = 0;

        switch (by) {
            case 'createdAt':
                comparison = a.createdAt - b.createdAt;
                break;
            case 'priority':
                comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
                break;
            case 'title':
                // ⚡ PERFORMANCE: Direct string comparison operators are significantly faster than localeCompare()
                if (a.title < b.title) {
                    comparison = -1;
                } else if (a.title > b.title) {
                    comparison = 1;
                } else {
                    comparison = 0;
                }
                break;
            default:
                comparison = 0;
        }

        return order === 'desc' ? -comparison : comparison;
    });

    return sortedTasks;
}

/**
 * Gets tasks with pagination support.
 *
 * @param {Object} options - Pagination options.
 * @param {number} [options.page=1] - Page number (1-based).
 * @param {number} [options.pageSize=10] - Number of items per page.
 * @returns {Object} An object containing paginated tasks and pagination info.
 */
function getTasksPaginated(options = {}) {
    const { page = 1, pageSize = 10 } = options;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedTasks = _tasks.slice(startIndex, endIndex);

    return {
        tasks: paginatedTasks,
        pagination: {
            currentPage: page,
            pageSize: pageSize,
            totalItems: _tasks.length,
            totalPages: Math.ceil(_tasks.length / pageSize),
            hasNextPage: endIndex < _tasks.length,
            hasPreviousPage: startIndex > 0
        }
    };
}

/**
 * Gets tasks with search and filter capabilities.
 *
 * @param {Object} options - Search and filter options.
 * @param {string} [options.searchTerm] - Search term to filter task titles.
 * @param {string[]} [options.tags] - Tags to filter by (AND logic).
 * @param {string} [options.priority] - Priority to filter by.
 * @param {boolean} [options.completed] - Completion status to filter by.
 * @param {number} [options.startDate] - Start date for date range filter.
 * @param {number} [options.endDate] - End date for date range filter.
 * @returns {Array} Array of tasks matching all specified criteria.
 */
function searchTasks(options = {}) {
    const {
        searchTerm,
        tags,
        priority,
        completed,
        startDate,
        endDate
    } = options;

    let filteredTasks = [..._tasks];

    // Apply search term filter
    if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(lowerSearchTerm)
        );
    }

    // Apply tags filter (AND logic)
    if (tags && tags.length > 0) {
        filteredTasks = filteredTasks.filter(task =>
            tags.every(tag => task.tags.includes(tag))
        );
    }

    // Apply priority filter
    if (priority) {
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(priority)) {
            throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
        }
        filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }

    // Apply completion status filter
    if (completed !== undefined) {
        filteredTasks = filteredTasks.filter(task => task.completed === completed);
    }

    // Apply date range filter
    if (startDate !== undefined || endDate !== undefined) {
        filteredTasks = filteredTasks.filter(task => {
            const createdAt = task.createdAt;
            const afterStart = startDate === undefined || createdAt >= startDate;
            const beforeEnd = endDate === undefined || createdAt <= endDate;
            return afterStart && beforeEnd;
        });
    }

    return filteredTasks;
}

/**
 * Resets the task ID counter.
 * This is useful for testing scenarios where you want to start fresh.
 */
function resetTaskIdCounter() {
    _state.nextId = 1;
}

/**
 * Gets tasks sorted alphabetically by title using fast direct string comparison.
 *
 * @param {boolean} [ascending=true] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted alphabetically.
 */
function getTasksSortedByTitle(ascending = true) {
    // ⚡ PERFORMANCE: Direct string comparison operators (<, >) are significantly
    // faster than localeCompare() in JS engines.
    return [..._tasks].sort((a, b) => {
        if (a.title < b.title) return ascending ? -1 : 1;
        if (a.title > b.title) return ascending ? 1 : -1;
        return 0;
    });
}

/**
 * Gets tasks sorted alphabetically (case-insensitive) using a Schwartzian transform
 * and fast direct string comparison to avoid repeated inside-loop lowercasing.
 *
 * @param {boolean} [ascending=true] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted alphabetically.
 */
function getTasksSortedAlphabetically(ascending = true) {
    // ⚡ PERFORMANCE: Schwartzian transform (map-sort-map) pre-calculates the lowercase
    // keys once per element, reducing string conversion complexity from O(N log N) to O(N).
    // Direct string comparison is used instead of expensive localeCompare().
    const mapped = _tasks.map((task, idx) => ({ idx, title: task.title.toLowerCase() }));
    mapped.sort((a, b) => {
        if (a.title < b.title) return ascending ? -1 : 1;
        if (a.title > b.title) return ascending ? 1 : -1;
        return 0;
    });
    return mapped.map(item => _tasks[item.idx]);
}

// Export all functions
module.exports = {
  addTask,
  resetTaskIdCounter,
  getTasksSortedByTitle,
  getTasksSortedAlphabetically,
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
  getTasksGroupedByPriority,
  getTasksGroupedByCompletion,
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
  getTasksByTag,
  getTasksByTags,
  getTasksByDateRange,
  getTasksByCompletionAndPriority,
  getTasksByMultiplePriorities,
  getTasksByMultipleCompletionStatuses,
  getTasksByTagAndPriority,
  getTasksByTagAndCompletion,
  getTasksByPriorityAndDateRange,
  getTasksByCompletionAndDateRange,
  getTasksByTagPriorityAndCompletion,
  getTasksByTagPriorityAndDateRange,
  getTasksByTagCompletionAndDateRange,
  getTasksByPriorityCompletionAndDateRange,
  getTasksByAllCriteria,
  updateTaskProperties,
  duplicateTask,
  moveTask,
  getTasksSorted,
  getTasksPaginated,
  searchTasks
};