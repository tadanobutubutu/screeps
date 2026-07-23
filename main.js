// Screeps main module for dependency dashboard
var _tasks = [];
var _state = {
    nextId: 1
};

// Safety: User Safety: unsafe
// Safety Categories: Needs Caution, Unauthorized Advice, Illegal Activity
// Safety Categories: Needs Caution

/*
User Safety: unsafe
Safety Categories: Needs Caution, Unauthorized Advice, Illegal Activity
*/

// ======= BEGIN // Update dependency version
function updateDependencyVersion(taskId, dependencyName, newVersion) {
    const task = _tasks.find(t => t.id === taskId);
    if (!task) return false;
    if (!task.dependencies) task.dependencies = {};
    task.dependencies[dependencyName] = newVersion;
    return true;
}

// BEGIN // Add task update functionality
function getTasksByDependency(dependencyName) {
    return _tasks.filter(task => task.dependencies && task.dependencies[dependencyName]);
}

function addDependencyUpdateTask(dependencyName, currentVersion, targetVersion) {
    const title = `Update ${dependencyName} from ${currentVersion} to ${targetVersion}`;
    const taskId = addTask(title);
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        if (!task.dependencies) task.dependencies = {};
        task.dependencies[dependencyName] = { current: currentVersion, target: targetVersion };
        task.tags = task.tags || [];
        task.tags.push('dependency-update');
    }
    return taskId;
}

function getAllDependencies() {
    const dependencies = {};
    _tasks.forEach(task => {
        if (task.dependencies) {
            Object.entries(task.dependencies).forEach(([name, info]) => {
                let version = typeof info === 'string' ? info : info.target;
                if (version && !dependencies[name]) dependencies[name] = new Set();
                if (version) dependencies[name].add(version);
            });
        }
    });
    Object.keys(dependencies).forEach(name => {
        dependencies[name] = Array.from(dependencies[name]);
    });
    return dependencies;
}

function getDependencyUpdateTasks() {
    return _tasks.filter(task => 
        task.tags?.includes('dependency-update') && 
        Object.keys(task.dependencies || {}).length > 0
    );
}

function completeDependencyUpdateTask(taskId) {
    const task = _tasks.find(t => t.id === taskId);
    if (!task || !task.tags?.includes('dependency-update')) return false;
    task.completed = true;
    return true;
}

function getDependencyVersionTasks(dependencyName, version) {
    return _tasks.filter(task => 
        task.dependencies?.[dependencyName] && 
        (task.dependencies[dependencyName] === version || 
         task.dependencies[dependencyName]?.target === version)
    );
}

function getDependencyVersions(dependencyName) {
    const versions = new Set();
    _tasks.forEach(task => {
        const dep = task.dependencies?.[dependencyName];
        if (dep && dep !== undefined) {
            const ver = typeof dep === 'string' ? dep : dep.target;
            if (ver) versions.add(ver);
        }
    });
    return Array.from(versions);
}

// Complete function updateDependencyVersions (merged from both versions)
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

// Main game loop
function run() {
    // Main game loop implementation would go here
}

// Additional task management functions (from second version)
function addTask(title) {
    // Assuming addTask is defined elsewhere; if not, placeholder
    // This is a simplified version; actual implementation may exist in the repo.
    const task = {
        id: _state.nextId++,
        title: title,
        createdAt: Date.now(),
        tags: [],
        priority: 'normal',
        dependencies: null,
        completed: false
    };
    _tasks.push(task);
    return task.id;
}

function resetTaskIdCounter() {
    _state.nextId = 1;
}

function getTasksSortedByTitle() {
    return _tasks.slice().sort(function(a, b) { return a.title.localeCompare(b.title); });
}

function getTasksSortedByCreatedAt() {
    return _tasks.slice().sort(function(a, b) { return a.createdAt - b.createdAt; });
}

function getTasksByPriority(priority) {
    return _tasks.filter(function(task) { return task.priority === priority; });
}

// The following functions were originally defined elsewhere; we include placeholders to avoid ReferenceError.
// In a full implementation they would be defined properly.

function listTasks() {
    return _tasks.slice();
}

function completeTask(id) {
    const task = _tasks.find(t => t.id === id);
    if (task) {
        task.completed = true;
    }
    return task !== undefined;
}

function removeTask(id) {
    const index = _tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        _tasks.splice(index, 1);
        return true;
    }
    return false;
}

function findTasks(predicate) {
    return _tasks.filter(predicate);
}

function getTaskById(id) {
    return _tasks.find(t => t.id === id);
}

function updateTaskTitle(id, newTitle) {
    const task = _tasks.find(t => t.id === id);
    if (task) {
        task.title = newTitle;
    }
    return task !== undefined;
}

function getCompletedTasks() {
    return _tasks.filter(t => t.completed);
}

function getIncompleteTasks() {
    return _tasks.filter(t => !t.completed);
}

function addTagToTask(taskId, tag) {
    const task = _tasks.find(t => t.id === taskId);
    if (task && tag) {
        task.tags = task.tags || [];
        if (!task.tags.includes(tag)) {
            task.tags.push(tag);
        }
    }
    return task !== undefined;
}

function removeTagFromTask(taskId, tag) {
    const task = _tasks.find(t => t.id === taskId);
    if (task && tag) {
        task.tags = task.tags || [];
        const idx = task.tags.indexOf(tag);
        if (idx !== -1) {
            task.tags.splice(idx, 1);
        }
    }
    return task !== undefined;
}

// Dependency-related functions already defined earlier (retain them)
// They are: updateDependencyVersion, getTasksByDependency, addDependencyUpdateTask, getAllDependencies,
// getDependencyUpdateTasks, completeDependencyUpdateTask, getDependencyVersionTasks, getDependencyVersions,
// updateDependencyVersions (defined above), removeDependencyFromTask, getTasksMissingDependency,
// getMemoryUsage, getAllTasks, clearAllTasks, getAllDependencyUpdateTasksWithStatus,
// getDependencyUpdateTasksGroupedByName, getDependencyUpdateStatistics,
// getDependencyUpdateTasksForVersion, getOverdueDependencyUpdateTasks,
// updateTasksWithDependenciesFromCodeowners (if present)

function removeDependencyFromTask(taskId, dependencyName) {
    var task = _tasks.find(function(t) { return t.id === taskId; });
    if (!task || !task.dependencies || !task.dependencies[dependencyName]) {
        return false;
    }

    delete task.dependencies[dependencyName];
    return true;
}

function getTasksMissingDependency(dependencyName) {
    return _tasks.filter(function(task) {
        return !task.dependencies || !task.dependencies[dependencyName];
    });
}

// Placeholder for getMemoryUsage if not defined elsewhere
function getMemoryUsage() {
    // This is a stub; actual implementation may exist.
    return {};
}

// Additional statistics and grouping functions
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

// If the repository includes this function, keep it; otherwise it's optional.
function updateTasksWithDependenciesFromCodeowners() {
    // Implementation would go here
}

// Export all defined functions
module.exports = {
    run: run,
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
    getOverdueDependencyUpdateTasks: getOverdueDependencyUpdateTasks,
    updateTasksWithDependenciesFromCodeowners: updateTasksWithDependenciesFromCodeowners
};