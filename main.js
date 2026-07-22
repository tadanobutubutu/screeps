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
    if (!task) return; // early exit if task not found

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
    if (!originalTask) return null; // early exit if original task not found

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

    if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(lowerSearchTerm)
        );
    }

    if (tags && tags.length > 0) {
        filteredTasks = filteredTasks.filter(task =>
            tags.every(tag => task.tags.includes(tag))
        );
    }

    if (priority) {
        const validPriorities = ['low', 'medium', 'high'];
        if (!validPriorities.includes(priority)) {
            throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
        }
        filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }

    if (completed !== undefined) {
        filteredTasks = filteredTasks.filter(task => task.completed === completed);
    }

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
    const mapped = _tasks.map((task, idx) => ({ idx, title: task.title.toLowerCase() }));
    mapped.sort((a, b) => {
        if (a.title < b.title) return ascending ? -1 : 1;
        if (a.title > b.title) return ascending ? 1 : -1;
        return 0;
    });
    return mapped.map(item => _tasks[item.idx]);
}

/**
 * Gets tasks filtered by multiple criteria with OR logic.
 *
 * @param {Object} options - Filter options.
 * @param {string[]} [options.tags] - Tags to filter by (OR logic).
 * @param {string[]} [options.priorities] - Priorities to filter by (OR logic).
 * @param {boolean[]} [options.completionStatuses] - Completion statuses to filter by (OR logic).
 * @param {number} [options.startDate] - Start date for date range filter.
 * @param {number} [options.endDate] - End date for date range filter.
 * @returns {Array} Array of tasks matching any of the specified criteria.
 */
function getTasksByMultipleCriteriaOr(options = {}) {
    const {
        tags,
        priorities,
        completionStatuses,
        startDate,
        endDate
    } = options;

    if (!tags && !priorities && !completionStatuses && !startDate && !endDate) {
        return [..._tasks];
    }

    if (priorities) {
        const validPriorities = ['low', 'medium', 'high'];
        const invalidPriorities = priorities.filter(p => !validPriorities.includes(p));
        if (invalidPriorities.length > 0) {
            throw new Error(`Invalid priorities: ${invalidPriorities.join(', ')}. Must be one of: ${validPriorities.join(', ')}`);
        }
    }

    return _tasks.filter(task => {
        const matchesTags = tags ? tags.some(tag => task.tags.includes(tag)) : true;
        const matchesPriorities = priorities ? priorities.includes(task.priority) : true;
        const matchesCompletion = completionStatuses ? completionStatuses.includes(task.completed) : true;

        let matchesDateRange = true;
        if (startDate !== undefined || endDate !== undefined) {
            const createdAt = task.createdAt;
            const afterStart = startDate === undefined || createdAt >= startDate;
            const beforeEnd = endDate === undefined || createdAt <= endDate;
            matchesDateRange = afterStart && beforeEnd;
        }

        return matchesTags || matchesPriorities || matchesCompletion || matchesDateRange;
    });
}

/**
 * Gets tasks filtered by multiple criteria with AND logic.
 *
 * @param {Object} options - Filter options.
 * @param {string[]} [options.tags] - Tags to filter by (AND logic).
 * @param {string[]} [options.priorities] - Priorities to filter by (AND logic).
 * @param {boolean[]} [options.completionStatuses] - Completion statuses to filter by (AND logic).
 * @param {number} [options.startDate] - Start date for date range filter.
 * @param {number} [options.endDate] - End date for date range filter.
 * @returns {Array} Array of tasks matching all specified criteria.
 */
function getTasksByMultipleCriteriaAnd(options = {}) {
    const {
        tags,
        priorities,
        completionStatuses,
        startDate,
        endDate
    } = options;

    if (!tags && !priorities && !completionStatuses && !startDate && !endDate) {
        return [..._tasks];
    }

    if (priorities) {
        const validPriorities = ['low', 'medium', 'high'];
        const invalidPriorities = priorities.filter(p => !validPriorities.includes(p));
        if (invalidPriorities.length > 0) {
            throw new Error(`Invalid priorities: ${invalidPriorities.join(', ')}. Must be one of: ${validPriorities.join(', ')}`);
        }
    }

    return _tasks.filter(task => {
        const matchesTags = tags ? tags.every(tag => task.tags.includes(tag)) : true;
        const matchesPriorities = priorities ? priorities.includes(task.priority) : true;
        const matchesCompletion = completionStatuses ? completionStatuses.includes(task.completed) : true;

        let matchesDateRange = true;
        if (startDate !== undefined || endDate !== undefined) {
            const createdAt = task.createdAt;
            const afterStart = startDate === undefined || createdAt >= startDate;
            const beforeEnd = endDate === undefined || createdAt <= endDate;
            matchesDateRange = afterStart && beforeEnd;
        }

        return matchesTags && matchesPriorities && matchesCompletion && matchesDateRange;
    });
}

/**
 * Gets tasks filtered by multiple criteria with customizable logic.
 *
 * @param {Object} options - Filter options.
 * @param {string[]} [options.tags] - Tags to filter by.
 * @param {string[]} [options.priorities] - Priorities to filter by.
 * @param {boolean[]} [options.completionStatuses] - Completion statuses to filter by.
 * @param {number} [options.startDate] - Start date for date range filter.
 * @param {number} [options.endDate] - End date for date range filter.
 * @param {string} [options.logic='and'] - Logic to use for combining filters ('and' or 'or').
 * @returns {Array} Array of tasks matching the specified criteria.
 */
function getTasksByMultipleCriteria(options = {}) {
    const {
        tags,
        priorities,
        completionStatuses,
        startDate,
        endDate,
        logic = 'and'
    } = options;

    if (!tags && !priorities && !completionStatuses && !startDate && !endDate) {
        return [..._tasks];
    }

    if (priorities) {
        const validPriorities = ['low', 'medium', 'high'];
        const invalidPriorities = priorities.filter(p => !validPriorities.includes(p));
        if (invalidPriorities.length > 0) {
            throw new Error(`Invalid priorities: ${invalidPriorities.join(', ')}. Must be one of: ${validPriorities.join(', ')}`);
        }
    }

    return _tasks.filter(task => {
        const matchesTags = tags ?
            (logic === 'and' ?
                tags.every(tag => task.tags.includes(tag)) :
                tags.some(tag => task.tags.includes(tag))) :
            true;

        const matchesPriorities = priorities ?
            (logic === 'and' ?
                priorities.includes(task.priority) :
                priorities.includes(task.priority)) :
            true;

        const matchesCompletion = completionStatuses ?
            (logic === 'and' ?
                completionStatuses.includes(task.completed) :
                completionStatuses.includes(task.completed)) :
            true;

        let matchesDateRange = true;
        if (startDate !== undefined || endDate !== undefined) {
            const createdAt = task.createdAt;
            const afterStart = startDate === undefined || createdAt >= startDate;
            const beforeEnd = endDate === undefined || createdAt <= endDate;
            matchesDateRange = afterStart && beforeEnd;
        }

        if (logic === 'and') {
            return matchesTags && matchesPriorities && matchesCompletion && matchesDateRange;
        } else {
            return matchesTags || matchesPriorities || matchesCompletion || matchesDateRange;
        }
    });
}

/**
 * Updates the version of a dependency in the task list.
 * @param {string} dependencyName - The name of the dependency to update.
 * @param {string} newVersion - The new version number.
 * @returns {number} The number of tasks that were updated.
 */
function updateDependencyVersion(dependencyName, newVersion) {
    let updatedCount = 0;
    const versionRegex = new RegExp(dependencyName, 'i');

    _tasks.forEach(task => {
        if (versionRegex.test(task.title)) {
            task.title = task.title.replace(new RegExp(`(${dependencyName})[\\d.]+`, 'gi'), `$1${newVersion}`);
            updatedCount++;
        }
    });

    return updatedCount;
}

/**
 * Gets tasks that reference a specific dependency.
 * @param {string} dependencyName - The name of the dependency to search for.
 * @returns {Array} Array of tasks that reference the specified dependency.
 */
function getTasksByDependency(dependencyName) {
    const dependencyRegex = new RegExp(dependencyName, 'i');
    return _tasks.filter(task => dependencyRegex.test(task.title));
}

/**
 * Adds a dependency update task to the task list.
 * @param {string} dependencyName - The name of the dependency to update.
 * @param {string} currentVersion - The current version of the dependency.
 * @param {string} newVersion - The new version to update to.
 * @param {string} [priority='medium'] - The priority of the update task.
 * @returns {number} The ID of the created task.
 */
function addDependencyUpdateTask(dependencyName, currentVersion, newVersion, priority = 'medium') {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
        throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
    }

    const task = {
        id: _state.nextId++,
        title: `${dependencyName}: update from ${currentVersion} to ${newVersion}`,
        completed: false,
        createdAt: Date.now(),
        tags: ['dependency'],
        priority
    };
    _tasks.push(task);
    return task.id;
}

/**
 * Tracks a stargazer for the repository.
 * @param {string} username - The GitHub username of the stargazer.
 * @param {string} [reason=''] - Optional reason for starring.
 * @returns {number} The ID of the created stargazer record.
 */
function trackStargazer(username, reason = '') {
    const stargazer = {
        id: _state.nextId++,
        username,
        starredAt: Date.now(),
        reason,
        isRunaway: false
    };

    _tasks.push({
        ...stargazer,
        title: `Stargazer: ${username}`,
        completed: false,
        tags: ['stargazer']
    });

    return stargazer.id;
}

/**
 * Marks a stargazer as a runaway stargazer.
 * @param {string} username - The GitHub username of the stargazer.
 * @returns {boolean} True if the stargazer was found and marked as runaway.
 */
function markAsRunawayStargazer(username) {
    const stargazerTask = _tasks.find(task =>
        task.tags.includes('stargazer') &&
        task.title.includes(`Stargazer: ${username}`)
    );

    if (stargazerTask) {
        stargazerTask.isRunaway = true;
        stargazerTask.tags.push('runaway');
        return true;
    }
    return false;
}

/**
 * Gets all stargazers.
 * @param {boolean} [includeRunaway=true] - Whether to include runaway stargazers.
 * @returns {Array} Array of stargazer records.
 */
function getAllStargazers(includeRunaway = true) {
    return _tasks.filter(task =>
        task.tags.includes('stargazer') &&
        (includeRunaway || !task.isRunaway)
    ).map(task => ({
        id: task.id,
        username: task.title.replace('Stargazer: ', ''),
        starredAt: task.starredAt,
        reason: task.reason,
        isRunaway: task.isRunaway
    }));
}

/**
 * Gets runaway stargazers.
 * @returns {Array} Array of runaway stargazer records.
 */
function getRunawayStargazers() {
    return _tasks.filter(task =>
        task.tags.includes('stargazer') &&
        task.isRunaway
    ).map(task => ({
        id: task.id,
        username: task.title.replace('Stargazer: ', ''),
        starredAt: task.starredAt,
        reason: task.reason
    }));
}

/**
 * Removes a stargazer record.
 * @param {string} username - The GitHub username of the stargazer to remove.
 * @returns {boolean} True if the stargazer was found and removed.
 */
function removeStargazer(username) {
    const index = _tasks.findIndex(task =>
        task.tags.includes('stargazer') &&
        task.title.includes(`Stargazer: ${username}`)
    );

    if (index !== -1) {
        _tasks.splice(index, 1);
        return true;
    }
    return false;
}

/**
 * Marks a task as completed.
 * @param {number} id - The ID of the task to mark as completed.
 */
function completeTask(id) {
    const task = _tasks.find(t => t.id === id);
    if (task) {
        task.completed = true;
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
  getTasksByTag,
  getTasksByTags,
  getTasksByDateRange,
  getTasksByAllCriteria,
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