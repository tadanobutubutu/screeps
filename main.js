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
 * Updates the version of a specific dependency in a task.
 *
 * @param {number} taskId
 * @param {string} dependencyName
 * @param {string} newVersion
 * @returns {boolean} True if the update was successful
 */
function updateDependencyVersion(taskId, dependencyName, newVersion) {
    const task = _tasks.find(t => t.id === taskId);
    if (!task) return false;

    if (!task.dependencies) {
        task.dependencies = {};
    }

    task.dependencies[dependencyName] = newVersion;
    return true;
}

/**
 * Gets tasks that have a specific dependency.
 *
 * @param {string} dependencyName
 * @returns {Array} Array of tasks with the specified dependency
 */
function getTasksByDependency(dependencyName) {
    return _tasks.filter(task =>
        task.dependencies && task.dependencies[dependencyName]
    );
}

/**
 * Adds a task to update a specific dependency.
 *
 * @param {string} dependencyName
 * @param {string} currentVersion
 * @param {string} targetVersion
 * @returns {number} The ID of the created task
 */
function addDependencyUpdateTask(dependencyName, currentVersion, targetVersion) {
    const title = `Update ${dependencyName} from ${currentVersion} to ${targetVersion}`;
    const taskId = addTask(title);

    // Add dependency information to the task
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        task.dependencies = {
            [dependencyName]: {
                current: currentVersion,
                target: targetVersion
            }
        };
        // Add dependency-update tag
        if (!task.tags) task.tags = [];
        task.tags.push('dependency-update');
    }

    return taskId;
}

/**
 * Gets all dependencies across all tasks.
 *
 * @returns {Object} An object with all dependencies and their versions
 */
function getAllDependencies() {
    const dependencies = {};

    _tasks.forEach(task => {
        if (task.dependencies) {
            Object.entries(task.dependencies).forEach(([name, info]) => {
                let version;
                if (typeof info === 'string') {
                    version = info;
                } else if (info && typeof info === 'object' && info.target) {
                    version = info.target;
                } else {
                    return;
                }

                if (!dependencies[name]) {
                    dependencies[name] = new Set();
                }
                dependencies[name].add(version);
            });
        }
    });

    // Convert sets to arrays for easier consumption
    Object.keys(dependencies).forEach(name => {
        const set = dependencies[name];
        dependencies[name] = Array.from(set);
    });

    return dependencies;
}

/**
 * Gets tasks that need dependency updates.
 *
 * @returns {Array} Array of tasks with dependency updates
 */
function getDependencyUpdateTasks() {
    return _tasks.filter(task =>
        task.tags && task.tags.includes('dependency-update') &&
        task.dependencies && Object.keys(task.dependencies).length > 0
    );
}

/**
 * Marks a dependency update task as completed.
 *
 * @param {number} taskId
 * @returns {boolean} True if the task was marked as completed
 */
function completeDependencyUpdateTask(taskId) {
    const task = _tasks.find(t => t.id === taskId);
    if (!task || !task.tags || !task.tags.includes('dependency-update')) {
        return false;
    }

    task.completed = true;
    return true;
}

/**
 * Gets tasks that have a specific dependency version.
 *
 * @param {string} dependencyName
 * @param {string} version
 * @returns {Array} Array of tasks with the specified dependency version
 */
function getDependencyVersionTasks(dependencyName, version) {
    return _tasks.filter(task =>
        task.dependencies &&
        task.dependencies[dependencyName] &&
        ((typeof task.dependencies[dependencyName] === 'string' &&
          task.dependencies[dependencyName] === version) ||
         (task.dependencies[dependencyName] && task.dependencies[dependencyName].target === version))
    );
}

/**
 * Gets all versions of a specific dependency.
 *
 * @param {string} dependencyName
 * @returns {Array} Array of all versions of the specified dependency
 */
function getDependencyVersions(dependencyName) {
    const versions = new Set();

    _tasks.forEach(task => {
        if (task.dependencies && task.dependencies[dependencyName]) {
            const depInfo = task.dependencies[dependencyName];
            let ver;
            if (typeof depInfo === 'string') ver = depInfo;
            else if (depInfo.target) ver = depInfo.target;
            if (ver) versions.add(ver);
        }
    });

    return Array.from(versions);
}

/**
 * Updates multiple dependency versions in a task.
 *
 * @param {number} taskId
 * @param {Object} dependencies - Object with dependency names as keys and versions as values
 * @returns {boolean} True if the update was successful
 */
function updateDependencyVersions(taskId, dependencies) {
    const task = _tasks.find(t => t.id === taskId);
    if (!task) return false;

    if (!task.dependencies) {
        task.dependencies = {};
    }

    Object.entries(dependencies).forEach(([name, version]) => {
        task.dependencies[name] = version;
    });

    return true;
}

/**
 * Removes a dependency from a task.
 *
 * @param {number} taskId
 * @param {string} dependencyName
 * @returns {boolean} True if the dependency was removed
 */
function removeDependencyFromTask(taskId, dependencyName) {
    const task = _tasks.find(t => t.id === taskId);
    if (!task || !task.dependencies || !task.dependencies[dependencyName]) {
        return false;
    }

    delete task.dependencies[dependencyName];
    return true;
}

/**
 * Gets tasks that are missing a specific dependency.
 *
 * @param {string} dependencyName
 * @returns {Array} Array of tasks that don't have the specified dependency
 */
function getTasksMissingDependency(dependencyName) {
    return _tasks.filter(task => !task.dependencies || !task.dependencies[dependencyName]);
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
 * @returns {Array} Array of tasks sorted by title
 */
function getTasksSortedByTitle() {
    return [..._tasks].sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Gets tasks sorted by creation date.
 *
 * @returns {Array} Array of tasks sorted by creation date
 */
function getTasksSortedByCreatedAt() {
    return [..._tasks].sort((a, b) => a.createdAt - b.createdAt);
}

/**
 * Gets tasks by priority.
 *
 * @param {string} priority
 * @returns {Array} Array of tasks with the specified priority
 */
function getTasksByPriority(priority) {
    return _tasks.filter(task => task.priority === priority);
}

/**
 * Lists all tasks.
 *
 * @returns {Array} Array of all tasks
 */
function listTasks() {
    return [..._tasks];
}

/**
 * Marks a task as completed.
 *
 * @param {number} taskId
 * @returns {boolean} True if the task was marked as completed
 */
function completeTask(taskId) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = true;
        return true;
    }
    return false;
}

/**
 * Removes a task.
 *
 * @param {number} taskId
 * @returns {boolean} True if the task was removed
 */
function removeTask(taskId) {
    const index = _tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
        _tasks.splice(index, 1);
        return true;
    }
    return false;
}

/**
 * Finds tasks by title.
 *
 * @param {string} searchTerm
 * @returns {Array} Array of tasks matching the search term
 */
function findTasks(searchTerm) {
    return _tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

/**
 * Gets a task by ID.
 *
 * @param {number} taskId
 * @returns {Object|null} The task or null if not found
 */
function getTaskById(taskId) {
    const task = _tasks.find(t => t.id === taskId);
    return task || null;
}

/**
 * Updates a task's title.
 *
 * @param {number} taskId
 * @param {string} newTitle
 * @returns {boolean} True if the title was updated
 */
function updateTaskTitle(taskId, newTitle) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        task.title = newTitle;
        return true;
    }
    return false;
}

/**
 * Gets completed tasks.
 *
 * @returns {Array} Array of completed tasks
 */
function getCompletedTasks() {
    return _tasks.filter(task => task.completed);
}

/**
 * Gets incomplete tasks.
 *
 * @returns {Array} Array of incomplete tasks
 */
function getIncompleteTasks() {
    return _tasks.filter(task => !task.completed);
}

/**
 * Adds a tag to a task.
 *
 * @param {number} taskId
 * @param {string} tag
 * @returns {boolean} True if the tag was added
 */
function addTagToTask(taskId, tag) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        if (!task.tags) task.tags = [];
        if (!task.tags.includes(tag)) {
            task.tags.push(tag);
            return true;
        }
    }
    return false;
}

/**
 * Removes a tag from a task.
 *
 * @param {number} taskId
 * @param {string} tag
 * @returns {boolean} True if the tag was removed
 */
function removeTagFromTask(taskId, tag) {
    const task = _tasks.find(t => t.id === taskId);
    if (task && task.tags) {
        const index = task.tags.indexOf(tag);
        if (index !== -1) {
            task.tags.splice(index, 1);
            return true;
        }
    }
    return false;
}

/**
 * Finds tasks by tag.
 *
 * @param {string} tag
 * @returns {Array} Array of tasks with the specified tag
 */
function findTasksByTag(tag) {
    return _tasks.filter(task => task.tags && task.tags.includes(tag));
}

/**
 * Updates a task's priority.
 *
 * @param {number} taskId
 * @param {string} newPriority
 * @returns {boolean} True if the priority was updated
 */
function updateTaskPriority(taskId, newPriority) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        task.priority = newPriority;
        return true;
    }
    return false;
}

/**
 * Gets tasks by priority filter.
 *
 * @param {string} priority
 * @returns {Array} Array of tasks with the specified priority
 */
function getTasksByPriorityFilter(priority) {
    return _tasks.filter(task => task.priority === priority);
}

/**
 * Gets tasks by creation date range.
 *
 * @param {number} startDate
 * @param {number} endDate
 * @returns {Array} Array of tasks within the date range
 */
function getTasksByCreationDate(startDate, endDate) {
    return _tasks.filter(task =>
        task.createdAt >= startDate && task.createdAt <= endDate
    );
}

/**
 * Gets the total number of tasks.
 *
 * @returns {number} Total count of tasks
 */
function getTaskCount() {
    return _tasks.length;
}

/**
 * Gets the number of completed tasks.
 *
 * @returns {number} Count of completed tasks
 */
function getCompletedTaskCount() {
    return _tasks.filter(task => task.completed).length;
}

/**
 * Gets tasks by status.
 *
 * @param {boolean} completed
 * @returns {Array} Array of tasks with the specified completion status
 */
function getTasksByStatus(completed) {
    return _tasks.filter(task => task.completed === completed);
}

/**
 * Marks a task as incomplete.
 *
 * @param {number} taskId
 * @returns {boolean} True if the task was marked as incomplete
 */
function incompleteTask(taskId) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = false;
        return true;
    }
    return false;
}

/**
 * Toggles a task's completion status.
 *
 * @param {number} taskId
 * @returns {boolean} True if the task's status was toggled
 */
function toggleTaskCompletion(taskId) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        return true;
    }
    return false;
}

/**
 * Adds multiple tags to a task.
 *
 * @param {number} taskId
 * @param {Array} tags
 * @returns {boolean} True if any tags were added
 */
function addTagsToTask(taskId, tags) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        if (!task.tags) task.tags = [];
        let added = false;
        tags.forEach(tag => {
            if (!task.tags.includes(tag)) {
                task.tags.push(tag);
                added = true;
            }
        });
        return added;
    }
    return false;
}

/**
 * Removes multiple tags from a task.
 *
 * @param {number} taskId
 * @param {Array} tags
 * @returns {boolean} True if any tags were removed
 */
function removeTagsFromTask(taskId, tags) {
    const task = _tasks.find(t => t.id === taskId);
    if (task && task.tags) {
        const initLen = task.tags.length;
        task.tags = task.tags.filter(t => !tags.includes(t));
        return task.tags.length !== initLen;
    }
    return false;
}

/**
 * Clears all tags from a task.
 *
 * @param {number} taskId
 * @returns {boolean} True if tags were cleared
 */
function clearTagsFromTask(taskId) {
    const task = _tasks.find(t => t.id === taskId);
    if (task && task.tags) {
        task.tags = [];
        return true;
    }
    return false;
}

/**
 * Gets all unique tags across all tasks.
 *
 * @returns {Array} Array of all unique tags
 */
function getAllTags() {
    const tags = new Set();
    _tasks.forEach(task => {
        if (task.tags) {
            task.tags.forEach(t => tags.add(t));
        }
    });
    return Array.from(tags);
}

/**
 * Finds tasks that have any of the specified tags.
 *
 * @param {Array} tags
 * @returns {Array} Array of tasks matching any specified tags
 */
function findTasksByAnyTag(tags) {
    return _tasks.filter(task => {
        if (task.tags) {
            return task.tags.some(tag => tags.includes(tag));
        }
        return false;
    });
}

/**
 * Finds tasks that have all of the specified tags.
 *
 * @param {Array} tags
 * @returns {Array} Array of tasks matching all specified tags
 */
function findTasksByAllTags(tags) {
    return _tasks.filter(task => {
        if (task.tags) {
            return tags.every(tag => task.tags.includes(tag));
        }
        return false;
    });
}

/**
 * Gets tasks that have a specific tag (alias for findTasksByTag).
 *
 * @param {string} tag
 * @returns {Array} Array of tasks with the specified tag
 */
function getTasksByTag(tag) {
    return findTasksByTag(tag);
}

/**
 * Gets tasks that have all of the specified tags (alias for findTasksByAllTags).
 *
 * @param {Array} tags
 * @returns {Array} Array of tasks matching all specified tags
 */
function getTasksByTags(tags) {
    return findTasksByAllTags(tags);
}

/**
 * Gets tasks created within a specific date range.
 *
 * @param {number} startDate
 * @param {number} endDate
 * @returns {Array} Array of tasks within the date range
 */
function getTasksByDateRange(startDate, endDate) {
    return _tasks.filter(task => {
        if (task.createdAt >= startDate && task.createdAt <= endDate) return true;
        return false;
    });
}

/**
 * Gets tasks that match all specified criteria.
 *
 * @param {Object} criteria
 * @returns {Array} Array of tasks matching all criteria
 */
function getTasksByAllCriteria(criteria) {
    return _tasks.filter(task => {
        return Object.entries(criteria).every(([key, val]) => {
            if (key === 'tags') {
                return task.tags && val.every(t => task.tags.includes(t));
            }
            return task[key] === val;
        });
    });
}

/**
 * Updates multiple properties of a task.
 *
 * @param {number} taskId
 * @param {Object} properties
 * @returns {boolean} True if any properties were updated
 */
function updateTaskProperties(taskId, properties) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        let updated = false;
        Object.entries(properties).forEach(([k, v]) => {
            if (task[k] !== v) {
                task[k] = v;
                updated = true;
            }
        });
        return updated;
    }
    return false;
}

/**
 * Duplicates a task.
 *
 * @param {number} taskId
 * @returns {number|null} The ID of the duplicated task or null if not found
 */
function duplicateTask(taskId) {
    const orig = _tasks.find(t => t.id === taskId);
    if (orig) {
        const newTask = {...orig, id: _state.nextId++, createdAt: Date.now(), completed: false};
        _tasks.push(newTask);
        return newTask.id;
    }
    return null;
}

/**
 * Moves a task to a new position in the list.
 *
 * @param {number} taskId
 * @param {number} newIndex
 * @returns {boolean} True if the task was moved
 */
function moveTask(taskId, newIndex) {
    const idx = _tasks.findIndex(t => t.id === taskId);
    if (idx !== -1 && newIndex >= 0 && newIndex < _tasks.length) {
        const task = _tasks.splice(idx, 1)[0];
        _tasks.splice(newIndex, 0, task);
        return true;
    }
    return false;
}

/**
 * Adds a function to get memory usage metrics.
 *
 * @returns {Object} Memory usage stats
 */
function getMemoryUsage() {
    const memoryUsage = process.memoryUsage();
    return {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
        arrayBuffers: memoryUsage.arrayBuffers
    };
}

/**
 * Adds a function getAllTasks for testing.
 *
 * @returns {Array} All tasks
 */
function getAllTasks() {
    return [..._tasks];
}

/**
 * Adds a function clearAllTasks for testing.
 */
function clearAllTasks() {
    _tasks.length = 0;
}

// Export all defined functions
module.exports = {
    addTask,
    updateDependencyVersion,
    getTasksByDependency,
    addDependencyUpdateTask,
    getAllDependencies,
    getDependencyUpdateTasks,
    completeDependencyUpdateTask,
    getDependencyVersionTasks,
    getDependencyVersions,
    updateDependencyVersions,
    removeDependencyFromTask,
    getTasksMissingDependency,
    resetTaskIdCounter,
    getTasksSortedByTitle,
    getTasksSortedByCreatedAt,
    getTasksByPriority,
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
    getTasksByPriorityFilter,
    getTasksByCreationDate,
    getTaskCount,
    getCompletedTaskCount,
    getTasksByStatus,
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
    getMemoryUsage,
    getAllTasks,
    clearAllTasks
};