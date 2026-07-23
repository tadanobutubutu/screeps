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
        priority: 'edium'
    };
    _tasks.push(task);
    return task.id;
}

/**... [all existing functions remain unchanged]... **/

/**
 * Updates the version of a dependency in a task.
 *
 * @param {number} taskId
 * @param {string} dependencyName
 * @param {string} newVersion
 * @returns {boolean} True if the update was successful
 */
function updateDependencyVersion(taskId, dependencyName, newVersion) {
    const task = _tasks.find(t => t.id === taskId);
    if (task === undefined || task === null) return false;

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
            Object.entries(task.dependencies).forEach(([name, version]) => {
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
        task.dependencies[dependencyName] === version
    );
}

/**
 * Gets all versions of a specific dependency across all tasks.
 *
 * @param {string} dependencyName
 * @returns {Array} Array of all versions of the specified dependency
 */
function getDependencyVersions(dependencyName) {
    const versions = new Set();

    _tasks.forEach(task => {
        if (task.dependencies && task.dependencies[dependencyName]) {
            versions.add(task.dependencies[dependencyName]);
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
    if (task === undefined || task === null) return false;

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
    return _tasks.filter(task =>
        task.dependencies || !task.dependencies[dependencyName]
    );
}

// Add this function to help with testing
function getAllTasks() {
    return [..._tasks];
}

// Add this function to help with testing
function clearAllTasks() {
    _tasks.length = 0;
    _state.nextId = 1;
}

/**
 * Gets tasks that have a specific dependency version (alias for getDependencyVersionTasks)
 *
 * @param {string} dependencyName
 * @param {string} version
 * @returns {Array} Array of tasks with the specified dependency version
 */
function getDependencyVersionTasks(dependencyName, version) {
    return _tasks.filter(task =>
        task.dependencies &&
        task.dependencies[dependencyName] &&
        task.dependencies[dependencyName] === version
    );
}

// Export all functions
module.exports = {
  addTask,
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
  clearAllTasks,
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
  getTasksSorted,
  getTasksPaginated,
  searchTasks,
  updateDependencyVersion,
  getTasksByDependency,
  addDependencyUpdateTask,
  getAllDependencies,
  getDependencyUpdateTasks,
  completeDependencyUpdateTask,
  getDependencyVersions,
  updateDependencyVersions,
  removeDependencyFromTask,
  getTasksMissingDependency,
  getAllTasks,
  getDependencyVersionTasks
};