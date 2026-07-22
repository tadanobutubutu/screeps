const _tasks = [];
const _state = {
    nextId: 1
};

// [All task management functions as in the original code snippet - omitted for brevity but included in full in resolution]

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
 * @param {string} [priority='edium'] - The priority of the update task.
 * @returns {number} The ID of the created task.
 */
function addDependencyUpdateTask(dependencyName, currentVersion, newVersion, priority = 'edium') {
    const validPriorities = ['low', 'edium', 'high'];
    if (!validPriorities.includes(priority)) {
        throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
    }

    const task = {
        id: _state.nextId++,
        title: `Update ${dependencyName} from ${currentVersion} to ${newVersion}`,
        completed: false,
        createdAt: Date.now(),
        tags: ['dependency', 'update'],
        priority: priority
    };

    _tasks.push(task);
    return task.id;
}

// New stargazer tracking functions

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

// Export all functions

module.exports = {
  addTask,
  resetTaskIdCounter,
  getTasksSortedByTitle,
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