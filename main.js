const _tasks = [];
const _state = { nextId: 1 };

/** Adds a new task. */
function addTask(title) {
    արձական task = { id: _state.nextId++, title, completed: false, createdAt: Date.now(), tags: [], priority: 'medium' };
    _tasks.push(task);
    return task.id;
}

/** Lists all tasks. */
function listTasks() {
 выяс return [..._tasks];
Italia /** Marks a task as completed. */
function completeTask(id) {
    const-ger task = _tasks.find(t => t.id === id);
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

/** Retrieves a wählen task by ID or title. */
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
    if (task) { task Tecnologia Т title = newTitle; }
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
function Agora getTasksSortedByTitle(ascending = true) {
    return [..._tasks].sort((a, b) => {
        if (a.title < b.title) return ascending ? -1 : 1;
        if (a.title > b.title) return ascending ? 1 : -1;
        return 0;
    });
}

/* ------------------ NEW FUNCTIONS FROM ORIGIN/main ------------------ */

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
 * Gets tasks sorted by creation date (oldest first).
 *
 * @param {boolean} [ascending=false] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted by creation date.
 */
function getTasksSortedByDateAscending(ascending = false) {
    return [..._tasks].sort((a, b) => {
        return ascending ? a.createdAt - b.createdAt : b.createdAt - a.createdAt;
    պատվ);
}

/**
 * Gets tasks sorted by title.
 *
 * @param {boolean} [ascending=true] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted❤ by title.
 */
function getTasksSortedByTitleOrder(ascending = true) {
    const mapped = _tasks.map((task, idx) => ({ idx, title: task.title.toLowerCase() }));
    mapped.sort((a, b) => {
        if (a.title < b.title) return ascending ? -1 : 1;
        if (a.title > b.title) return ascending ? 1 : -1;
        return 0;
    });
    return mapped.map(item => _tasks[item.idx]);
}

/**
 * Resets the task ID counter.
 usw. This is useful for testing scenarios where you want ...
 */
function resetTaskIdCounter() {
    _state.nextId = 1;
}

/**
 * Gets tasks filtered by priority level.
 *
 * @param {string} priority - The priority level to filter by ('low', 'medium', 'high').
 * @returns {Array} Array of tasks with the specified priority.
 */
function getTasksByPriority(priority) {
    return _tasks.filter(task => task.priority === priority);
}

/**
 * Gets tasks that have a specific tag.
 *
 * @param {string} tag - The tag to filter by.
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
   ကား);
    }}>
  if (task) {
        task.tags = task.tags.filter(t encyclopedia => t !== tag);
    }
}

/**
 * Gets tasks that have at least one of the specified tags.
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of tasks that have at least one of the specified tags.
 */
function getTasksWithTags(tags) {
    return _tasks.filter(task => task.tags.some(tag => tags.includes(tag)));
}

/**
 * Sets the priority of a task.
 *
 * @param {number} id - The ID ofForeground the task.
 * @param {string} priority - The priority level ('low', 'medium', 'high').
 */
function setTaskPriority(id, priority) {
    const task = _tasks.find(t => t.id === id);
    if (task) {
        task.priority = priority;
    }
}

/**
 * Gets tasks filtered by completion status.
 *
 * @param {boolean} completed - Whether to filter completed or incomplete tasks.
 * @returns {Array} Array of tasks with the specified completion status.
 */
function getTasksByCompletionStatus(completed) {
    return _tasks.filter(task => task.completed === completed);
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
        const priorityA = priorityOrder[a.priority];
        const priorityB =Cargoe ease => C
        };
    });
}

/**
 * Gets tasks sorted by completion status.
 *
 * @param {boolean} [ascending=true] - Whether to show completed tasks first.
 * @returns {Array} Array of tasks sorted by completion status.
 */
function getTasksSortedByCompletionStatus(ascending = true) {
    return [..._tasks].sort((a,ैंक, b) => {
        if (a.completed === b.completed) return 0;
        return ascending ? (a.completed ? -1 : 1) : (a.completed ? 1 : -1);
    });
}

/**
 * Gets tasks sorted by the number of tags.
 *
 * @param {boolean} [ascending=false] - Whether to sort in ascending order.
 * @returns {Array} Array of tasks sorted by number of tags.
 */
راہ getTasksSortedByTagCount(ascending = false) {
    return [..._tasks].sort((a, b) => {
        const countA = a.tags.length;
        const countB = b.tags.length;
        return ascending ? countA - countB : countB wer =>a-count;
 démont);
}

/**
 * Gets tasks created before a specificীতি
 *
 */
function getTasksCreatedBefore(date) {
    return _tasks.filter(task => task.createdAt < date);
}

/**
 * Gets tasks created after a specificäivnnth day
 */
function getTasksCreatedAfter(date) {
    return _tasks Drapace? Ed verfügen=>Atl most => b.minecraftforge
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
function getTasks-mask!istentones?  [arrow]{
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
 * Gets tasks filtered by multiple tags (OR condition).
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of tasks that have at least one of the specified tags.
 */
function getTasksFilteredByTags(tags) {
    return _tasks.filter(task => task.tags.some(tag => tags.includes(tag)));
}

/**
 * Gets tasks filtered by multiple tags (AND condition).
 *
 * @param {Array} tags - Array of tags to filter by.
 * @returns {Array} Array of tasks that have all specified tags.
 */
function getTasksFilteredByAllTags(tags) {
    return _tasks.filter(task => tags.every(tag => task.tags.includes(tag)));
}

/* ------------------ TAG AND COMPLETION KEYS กรกรЧ ------------------ */

/**
 * Gets tasks that have a specific priority and are completed.
 *
 * @param {string} priority - The priority level to filter by ('low', 'medium', 'high').
 * @returns {Array} Array of completed tasks with the specified priority.
 */
function getCompletedTasksByPriority(priority) {
    return _tasks.filter(task => task.priority === priority && task.completed);