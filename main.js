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
 * Updates multiple task properties at once.
 *
 * @param {number|string} idOrTitle - The ID or title of the task to update.
 * @param {Object} updates - An object containing properties to update.
 * @param {string} [updates.title] - New title for the task.
 * @param {boolean} [updates.completed] - Completion status for the task.
 * @param {string[]} [updates.tags] - Array of tags for the task.
 * @param {string} [updates.priority] - Priority level for the task.
 */
function updateTask(idOrTitle, updates) {
    const task = getTaskById(idOrTitle);
    if (task) {
        if (updates.title !== undefined) task.title = updates.title;
        if (updates.completed !== undefined) task.completed = updates.completed;
        if (updates.tags !== undefined) task.tags = updates.tags;
        if (updates.priority !== undefined) task.priority = updates.priority;
    }
}

/**
 * Adds a tag to a task.
 *
 * @param {number|string} idOrTitle - The ID or title of the task.
 * @param {string} tag - The tag to add.
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
 * @param {string} tag - The tag to remove.
 */
function removeTagFromTask(idOrTitle, tag) {
    const task = getTaskById(idOrTitle);
    if (task) {
        task.tags = task.tags.filter(t => t !== tag);
    }
}

/**
 * Filters tasks by completion status.
 *
 * @param {boolean} completed - Whether to filter completed or incomplete tasks.
 * @returns {Array} Array of matching tasks.
 */
function filterTasksByCompletion(completed) {
    return _tasks.filter(task => task.completed === completed);
}

/**
 * Filters tasks by priority.
 *
 * @param {string} priority - The priority level to filter by.
 * @returns {Array} Array of matching tasks.
 */
function filterTasksByPriority(priority) {
    return _tasks.filter(task => task.priority === priority);
}

/**
 * Filters tasks by tag.
 *
 * @param {string} tag - The tag to filter by.
 * @returns {Array} Array of matching tasks.
 */
function filterTasksByTag(tag) {
    return _tasks.filter(task => task.tags.includes(tag));
}

/**
 * Sorts tasks by creation date.
 *
 * @param {boolean} [ascending=true] - Whether to sort in ascending order.
 * @returns {Array} Array of sorted tasks.
 */
function sortTasksByDate(ascending = true) {
    return [..._tasks].sort((a, b) => {
        return ascending ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
    });
}

/**
 * Sorts tasks by priority.
 *
 * @param {boolean} [ascending=true] - Whether to sort in ascending order.
 * @returns {Array} Array of sorted tasks.
 */
function sortTasksByPriority(ascending = true) {
    const priorityOrder = { low: 0, medium: 1, high: 2 };
    return [..._tasks].sort((a, b) => {
        const aPriority = priorityOrder[a.priority] || 1;
        const bPriority = priorityOrder[b.priority] || 1;
        return ascending ? aPriority - bPriority : bPriority - aPriority;
    });
}