/*
User Safety: unsafe
Safety Categories: Needs Caution, Unauthorized Advice, Illegal Activity
*/
var _tasks = [];
var _state = {
    nextId: 1
};

// Safety Categories: Needs Caution

/**
 * Adds a new task.
 *
 * @param {string} title
 * @returns {number} The ID of the created task.
 */
function addTask(title) {
    var task = {
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
    return _tasks.filter(function(task) {
        return task.dependencies && task.dependencies[dependencyName];
    });
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
    var title = "Update " + dependencyName + " from " + currentVersion + " to " + targetVersion;
    var taskId = addTask(title);

    // Add dependency information to the task
    var task = _tasks.find(function(t) { return t.id === taskId; });
    if (task) {
        task.dependencies = {};
        task.dependencies[dependencyName] = {
            current: currentVersion,
            target: targetVersion
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
    var dependencies = {};

    _tasks.forEach(function(task) {
        if (task.dependencies) {
            Object.entries(task.dependencies).forEach(function(entry) {
                var name = entry[0];
                var info = entry[1];
                var version;
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
    Object.keys(dependencies).forEach(function(name) {
        var set = dependencies[name];
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
    return _tasks.filter(function(task) {
        return task.tags && task.tags.includes('dependency-update') &&
            task.dependencies && Object.keys(task.dependencies).length > 0;
    });
}

/**
 * Marks a dependency update task as completed.
 *
 * @param {number} taskId
 * @returns {boolean} True if the task was marked as completed
 */
function completeDependencyUpdateTask(taskId) {
    var task = _tasks.find(function(t) { return t.id === taskId; });
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
 * Gets all versions of a dependency.
 *
 * @param {string} dependencyName
 * @returns {Array} Array of all versions of the specified dependency
 */
function getDependencyVersions(dependencyName) {
    var versions = new Set();

    _tasks.forEach(function(task) {
        if (task.dependencies && task.dependencies[dependencyName]) {
            var depInfo = task.dependencies[dependencyName];
            var ver;
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

    Object.entries(dependencies).forEach(function(entry) {
        var name = entry[0];
        var version = entry[1];
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
    var task = _tasks.find(function(t) { return t.id === taskId; });
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
    return _tasks.filter(function(task) {
        return !task.dependencies || !task.dependencies[dependencyName];
    });
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
    return _tasks.slice().sort(function(a, b) { return a.title.localeCompare(b.title); });
}

/**
 * Gets tasks sorted by creation date.
 *
 * @returns {Array} Array of tasks sorted by creation date
 */
function getTasksSortedByCreatedAt() {
    return _tasks.slice().sort(function(a, b) { return a.createdAt - b.createdAt; });
}

/**
 * Gets tasks by priority.
 *
 * @param {string} priority
 * @returns {Array} Array of tasks with the specified priority
 */
function getTasksByPriority(priority) {
    return _tasks.filter(function(task) { return task.priority === priority; });
}

/**
 * Gets all tasks for testing.
 *
 * @returns {Array} All tasks
 */
function getAllTasks() {
    return _tasks.slice();
}

/**
 * Clears all tasks for testing.
 *
 * @returns {void}
 */
function clearAllTasks() {
    _tasks.length = 0;
}

/**
 * Gets all dependency update tasks with their status.
 *
 * @returns {Array} Array of dependency update tasks with status
 */
function getAllDependencyUpdateTasksWithStatus() {
    return _tasks
        .filter(function(task) { return task.tags && task.tags.includes('dependency-update'); })
        .map(function(task) {
            return {
                id: task.id,
                title: task.title,
                completed: task.completed,
                dependencies: task.dependencies || {},
                createdAt: task.createdAt
            };
        });
}

/**
 * Gets dependency update tasks grouped by dependency name.
 *
 * @returns {Object} Object with dependency names as keys and arrays of tasks as values
 */
function getDependencyUpdateTasksGroupedByName() {
    var grouped = {};

    _tasks.forEach(function(task) {
        if (task.tags && task.tags.includes('dependency-update') && task.dependencies) {
            Object.keys(task.dependencies).forEach(function(depName) {
                if (!grouped[depName]) {
                    grouped[depName] = [];
                }
                grouped[depName].push({
                    id: task.id,
                    title: task.title,
                    completed: task.completed,
                    version: task.dependencies[depName],
                    createdAt: task.createdAt
                });
            });
        }
    });

    return grouped;
}

/**
 * Gets dependency update statistics.
 *
 * @returns {Object} Statistics about dependency updates
 */
function getDependencyUpdateStatistics() {
    var stats = {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        dependencies: {}
    };

    _tasks.forEach(function(task) {
        if (task.tags && task.tags.includes('dependency-update')) {
            stats.totalTasks++;
            if (task.completed) {
                stats.completedTasks++;
            } else {
                stats.pendingTasks++;
            }

            if (task.dependencies) {
                Object.entries(task.dependencies).forEach(function(entry) {
                    var depName = entry[0];
                    var versionInfo = entry[1];
                    if (!stats.dependencies[depName]) {
                        stats.dependencies[depName] = {
                            count: 0,
                            versions: new Set()
                        };
                    }

                    stats.dependencies[depName].count++;
                    if (typeof versionInfo === 'string') {
                        stats.dependencies[depName].versions.add(versionInfo);
                    } else if (versionInfo && versionInfo.target) {
                        stats.dependencies[depName].versions.add(versionInfo.target);
                    }
                });
            }
        }
    });

    // Convert sets to arrays
    Object.keys(stats.dependencies).forEach(function(depName) {
        stats.dependencies[depName].versions = Array.from(stats.dependencies[depName].versions);
    });

    return stats;
}

/**
 * Gets dependency update tasks for a specific version.
 *
 * @param {string} version
 * @returns {Array} Array of tasks that update to the specified version
 */
function getDependencyUpdateTasksForVersion(version) {
    return _tasks.filter(function(task) {
        return task.tags && task.tags.includes('dependency-update') &&
            task.dependencies &&
            Object.values(task.dependencies).some(function(depInfo) {
                return (typeof depInfo === 'string' && depInfo === version) ||
                    (depInfo && depInfo.target === version);
            });
    });
}

/**
 * Gets dependency update tasks that are overdue.
 *
 * @param {number} daysOverdue - Number of days to consider as overdue
 * @returns {Array} Array of overdue dependency update tasks
 */
function getOverdueDependencyUpdateTasks(daysOverdue) {
    daysOverdue = daysOverdue || 7;
    var now = Date.now();
    var overdueTime = daysOverdue * 24 * 60 * 60 * 1000;

    return _tasks.filter(function(task) {
        return task.tags && task.tags.includes('dependency-update') &&
            !task.completed &&
            (now - task.createdAt) > overdueTime;
    });
}

/**
 * Gets tasks that have a specific dependency.
 *
 * @param {string} dependencyName
 * @returns {Array} Array of tasks with the specified dependency
 */
function getTasksByDependency(dependencyName) {
    return _tasks.filter(function(task) {
        return task.dependencies && task.dependencies[dependencyName];
    });
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
    var title = "Update " + dependencyName + " from " + currentVersion + " to " + targetVersion;
    var taskId = addTask(title);

    // Add dependency information to the task
    var task = _tasks.find(function(t) { return t.id === taskId; });
    if (task) {
        task.dependencies = {};
        task.dependencies[dependencyName] = {
            current: currentVersion,
            target: targetVersion
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
    var dependencies = {};

    _tasks.forEach(function(task) {
        if (task.dependencies) {
            Object.entries(task.dependencies).forEach(function(entry) {
                var name = entry[0];
                var info = entry[1];
                var version;
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
    Object.keys(dependencies).forEach(function(name) {
        var set = dependencies[name];
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
    return _tasks.filter(function(task) {
        return task.tags && task.tags.includes('dependency-update') &&
            task.dependencies && Object.keys(task.dependencies).length > 0;
    });
}

/**
 * Marks a dependency update task as completed.
 *
 * @param {number} taskId
 * @returns {boolean} True if the task was marked as completed
 */
function completeDependencyUpdateTask(taskId) {
    var task = _tasks.find(function(t) { return t.id === taskId; });
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
 * Gets all versions of a dependency.
 *
 * @param {string} dependencyName
 * @returns {Array} Array of all versions of the specified dependency
 */
function getDependencyVersions(dependencyName) {
    var versions = new Set();

    _tasks.forEach(function(task) {
        if (task.dependencies && task.dependencies[dependencyName]) {
            var depInfo = task.dependencies[dependencyName];
            var ver;
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

    Object.entries(dependencies).forEach(function(entry) {
        var name = entry[0];
        var version = entry[1];
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
    var task = _tasks.find(function(t) { return t.id === taskId; });
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
    return _tasks.filter(function(task) {
        return !task.dependencies || !task.dependencies[dependencyName];
    });
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
    return _tasks.slice().sort(function(a, b) { return a.title.localeCompare(b.title); });
}

/**
 * Gets tasks sorted by creation date.
 *
 * @returns {Array} Array of tasks sorted by creation date
 */
function getTasksSortedByCreatedAt() {
    return _tasks.slice().sort(function(a, b) { return a.createdAt - b.createdAt; });
}

/**
 * Gets tasks by priority.
 *
 * @param {string} priority
 * @returns {Array} Array of tasks with the specified priority
 */
function getTasksByPriority(priority) {
    return _tasks.filter(function(task) { return task.priority === priority; });
}

/**
 * Gets all tasks for testing.
 *
 * @returns {Array} All tasks
 */
function getAllTasks() {
    return _tasks.slice();
}

/**
 * Clears all tasks for testing.
 *
 * @returns {void}
 */
function clearAllTasks() {
    _tasks.length = 0;
}

/**
 * Gets all dependency update tasks with their status.
 *
 * @returns {Array} Array of dependency update tasks with status
 */
function getAllDependencyUpdateTasksWithStatus() {
    return _tasks
        .filter(function(task) { return task.tags && task.tags.includes('dependency-update'); })
        .map(function(task) {
            return {
                id: task.id,
                title: task.title,
                completed: task.completed,
                dependencies: task.dependencies || {},
                createdAt: task.createdAt
            };
        });
}

/**
 * Gets dependency update tasks grouped by dependency name.
 *
 * @returns {Object} Object with dependency names as keys and arrays of tasks as values
 */
function getDependencyUpdateTasksGroupedByName() {
    var grouped = {};

    _tasks.forEach(function(task) {
        if (task.tags && task.tags.includes('dependency-update') && task.dependencies) {
            Object.keys(task.dependencies).forEach(function(depName) {
                if (!grouped[depName]) {
                    grouped[depName] = [];
                }
                grouped[depName].push({
                    id: task.id,
                    title: task.title,
                    completed: task.completed,
                    version: task.dependencies[depName],
                    createdAt: task.createdAt
                });
            });
        }
    });

    return grouped;
}

/**
 * Gets dependency update statistics.
 *
 * @returns {Object} Statistics about dependency updates
 */
function getDependencyUpdateStatistics() {
    var stats = {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        dependencies: {}
    };

    _tasks.forEach(function(task) {
        if (task.tags && task.tags.includes('dependency-update')) {
            stats.totalTasks++;
            if (task.completed) {
                stats.completedTasks++;
            } else {
                stats.pendingTasks++;
            }

            if (task.dependencies) {
                Object.entries(task.dependencies).forEach(function(entry) {
                    var depName = entry[0];
                    var versionInfo = entry[1];
                    if (!stats.dependencies[depName]) {
                        stats.dependencies[depName] = {
                            count: 0,
                            versions: new Set()
                        };
                    }

                    stats.dependencies[depName].count++;
                    if (typeof versionInfo === 'string') {
                        stats.dependencies[depName].versions.add(versionInfo);
                    } else if (versionInfo && versionInfo.target) {
                        stats.dependencies[depName].versions.add(versionInfo.target);
                    }
                });
            }
        }
    });

    // Convert sets to arrays
    Object.keys(stats.dependencies).forEach(function(depName) {
        stats.dependencies[depName].versions = Array.from(stats.dependencies[depName].versions);
    });

    return stats;
}

/**
 * Gets dependency update tasks for a specific version.
 *
 * @param {string} version
 * @returns {Array} Array of tasks that update to the specified version
 */
function getDependencyUpdateTasksForVersion(version) {
    return _tasks.filter(function(task) {
        return task.tags && task.tags.includes('dependency-update') &&
            task.dependencies &&
            Object.values(task.dependencies).some(function(depInfo) {
                return (typeof depInfo === 'string' && depInfo === version) ||
                    (depInfo && depInfo.target === version);
            });
    });
}

/**
 * Gets dependency update tasks that are overdue.
 *
 * @param {number} daysOverdue - Number of days to consider as overdue
 * @returns {Array} Array of overdue dependency update tasks
 */
function getOverdueDependencyUpdateTasks(daysOverdue) {
    daysOverdue = daysOverdue || 7;
    var now = Date.now();
    var overdueTime = daysOverdue * 24 * 60 * 60 * 1000;

    return _tasks.filter(function(task) {
        return task.tags && task.tags.includes('dependency-update') &&
            !task.completed &&
            (now - task.createdAt) > overdueTime;
    });
}

// Export all defined functions
module.exports = {
    addTask: addTask,
    resetTaskIdCounter: resetTaskIdCounter,
    getTasksSortedByTitle: getTasksSortedByTitle,
    getTasksSortedByCreatedAt: getTasksSortedByCreatedAt,
    getTasksByPriority: getTasksByPriority,
    listTasks: listTasks,
    completeTask: completeTask,
    removeTask: removeTask,
    findTasks: findTasks,
    getTaskById: getTaskById,
    updateTaskTitle: updateTaskTitle,
    getCompletedTasks: getCompletedTasks,
    getIncompleteTasks: getIncompleteTasks,
    addTagToTask: addTagToTask,
    removeTagFromTask: removeTagFromTask,
    updateDependencyVersion: updateDependencyVersion,
    getTasksByDependency: getTasksByDependency,
    addDependencyUpdateTask: addDependencyUpdateTask,
    getAllDependencies: getAllDependencies,
    getDependencyUpdateTasks: getDependencyUpdateTasks,
    completeDependencyUpdateTask: completeDependencyUpdateTask,
    getDependencyVersionTasks: getDependencyVersionTasks,
    getDependencyVersions: getDependencyVersions,
    updateDependencyVersions: updateDependencyVersions,
    removeDependencyFromTask: removeDependencyFromTask,
    getTasksMissingDependency: getTasksMissingDependency,
    getMemoryUsage: getMemoryUsage,
    getAllTasks: getAllTasks,
    clearAllTasks: clearAllTasks,
    getAllDependencyUpdateTasksWithStatus: getAllDependencyUpdateTasksWithStatus,
    getDependencyUpdateTasksGroupedByName: getDependencyUpdateTasksGroupedByName,
    getDependencyUpdateStatistics: getDependencyUpdateStatistics,
    getDependencyUpdateTasksForVersion: getDependencyUpdateTasksForVersion,
    getOverdueDependencyUpdateTasks: getOverdueDependencyUpdateTasks
};