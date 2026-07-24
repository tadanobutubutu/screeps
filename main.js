/**
 * User Safety: unsafe
 * Safety Categories: Needs Caution, Unauthorized Advice, Illegal Activity */
const _tasks = [];
const _state = { nextId: 1 };

/** * Adds a new task. * @param {string} title * @returns {number} The ID of the created task. */
function addTask(title) {
    const task = {
        id: _state.nextId++,
        title: title,
        completed: false,
        createdAt: Date.now(),
        tags: [],
        priority: 'medium'
    };
    _tasks.push(task);
    return task.id;
}

/** * Updates the version of a specific dependency in a task. * @param {number} taskId * @param {string} dependencyName * @param {string} newVersion * @returns {boolean} True if the update was successful */
function updateDependencyVersion(taskId, dependencyName, newVersion) {
    const task = _tasks.find(t => t.id === taskId);
    if (task === undefined || task === null) return false;
    if (!task.dependencies) task.dependencies = {};
    task.dependencies[dependencyName] = newVersion;
    return true;
}

/** * Gets tasks that depend on a specific dependency. * @param {string} dependencyName * @returns {Array} Array of tasks */
function getTasksByDependency(dependencyName) {
    return _tasks.filter(task => task.dependencies && task.dependencies[dependencyName]);
}

// ... [All previous functions remain unchanged] ...

/** * Gets a list of all dependency update tasks with their status and additional details. * @returns {Array} Array of dependency update tasks with detailed status */
function getAllDependencyUpdateTasksWithDetails() {
    return getDetailedDependencyUpdateTasksWithStatus();
}

/** * Gets dependency update tasks that are in progress. * @returns {Array} Array of tasks in progress */
function getInProgressDependencyUpdateTasks() {
    return _tasks.filter(task => 
        task.tags?.includes('dependency-update') && 
        !task.completed && 
        !task.tags?.includes('awaiting-schedule') && 
        !task.tags?.includes('manually-edited') && 
        !task.tags?.includes('blocked-by-closed-pr'
    );
}

/** * Gets dependency update tasks that are ready for review. * @returns {Array} Array of tasks ready for review */
function getReadyForReviewDependencyUpdateTasks() {
    return _tasks.filter(task => 
        task.tags?.includes('dependency-update') && 
        !task.completed && 
        task.tags?.includes('awaiting-schedule')
    );
}

/** * Gets dependency update tasks that are blocked. * @returns {Array} Array of blocked tasks */
function getBlockedDependencyUpdateTasks() {
    return _tasks.filter(task => 
        task.tags?.includes('dependency-update') && 
        !task.completed && 
        (task.tags?.includes('manually-edited') || task.tags?.includes('blocked-by-closed-pr'))
    );
}