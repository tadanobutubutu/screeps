/**
 * User Safety: unsafe
 * Safety Categories: Needs Caution, Unauthorized Advice, Illegal Activity
 */

const _tasks = [];
const _state = { nextId: 1 };

/**
 * Adds a new task.
 * @param {string} title
 * @returns {number} The ID of the created task.
 */
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

/**
 * Updates the version of a specific dependency in a task.
 * @param {number} taskId
 * @param {string} dependencyName
 * @param {string} newVersion
 * @returns {boolean} True if the update was successful
 */
function updateDependencyVersion(taskId, dependencyName, newVersion) {
  const task = _tasks.find(t => t.id === taskId);
  if (task === undefined || task === null) return false;
  if (!task.dependencies) task.dependencies = {};
  task.dependencies[dependencyName] = newVersion;
  return true;
}

/**
 * Gets tasks that depend on a specific dependency.
 * @param {string} dependencyName
 * @returns {Array} Array of tasks
 */
function getTasksByDependency(dependencyName) {
  return _tasks.filter(task => task.dependencies && task.dependencies[dependencyName]);
}

/**
 * Adds a dependency update task.
 * @param {string} dependencyName
 * @param {string} currentVersion
 * @param {string} targetVersion
 * @returns {number} The ID of the created task.
 */
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

/**
 * Returns all dependencies across all tasks with versions.
 * @returns {Object} dependencyName => Array of versions
 */
function getAllDependencies() {
  const dependencies = {};
  _tasks.forEach(task => {
    if (task.dependencies) {
      Object.entries(task.dependencies).forEach(([name, info]) => {
        var version = typeof info === 'string' ? info : info.target;
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

/**
 * Filters tasks that are dependency update tasks.
 * @returns {Array} Array of tasks
 */
function getDependencyUpdateTasks() {
  return _tasks.filter(task =>
    task.tags && task.tags.includes('dependency-update') &&
    Object.keys(task.dependencies || {}).length > 0
  );
}

/**
 * Marks a dependency update task as completed.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function completeDependencyUpdateTask(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  task.completed = true;
  return true;
}

/**
 * Retrieves tasks that update a specific dependency to a specific version.
 * @param {string} dependencyName
 * @param {string} version
 * @returns {Array} Array of tasks
 */
function getDependencyVersionTasks(dependencyName, version) {
  return _tasks.filter(task =>
    task.dependencies && task.dependencies[dependencyName] &&
    (task.dependencies[dependencyName] === version ||
    task.dependencies[dependencyName] && task.dependencies[dependencyName].target === version)
  );
}

/**
 * Gets all versions for a specific dependency across tasks.
 * @param {string} dependencyName
 * @returns {Array} Array of eligible unique versions
 */
function getDependencyVersions(dependencyName) {
  const versions = new Set();
  _tasks.forEach(task => {
    const dep = task.dependencies && task.dependencies[dependencyName];
    if (dep) {
      const ver = typeof dep === 'string' ? dep : dep.target;
      if (ver) versions.add(ver);
    }
  });
  return Array.from(versions);
}

/**
 * Updates multiple dependency versions in a task.
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
 * Adds multiple dependencies to a task.
 * @param {number} taskId
 * @param {Object} dependencies
 * @returns {boolean}
 */
function addDependenciesToTask(taskId, dependencies) {
  const task = _tasks.find(t => t.id === taskId);
  if (task === undefined || task === null) return false;
  if (!task.dependencies) task.dependencies = {};
  Object.entries(dependencies).forEach(([name, version]) => {
    task.dependencies[name] = version;
  });
  return true;
}

/**
 * Removes a dependency from a task.
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
 * @returns {Array} Array of tasks sorted by title
 */
function getTasksSortedByTitle() {
  return _tasks.slice().sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Gets tasks sorted by creation date.
 * @returns {Array} Array of tasks sorted by creation date
 */
function getTasksSortedByCreatedAt() {
  return _tasks.slice().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
}

/**
 * Gets tasks by priority.
 * @param {string} priority
 * @returns {Array} Array of tasks with the specified priority
 */
function getTasksByPriority(priority) {
  return _tasks.filter(task => task.priority === priority);
}

/**
 * Lists all tasks.
 * @returns {Array} Array of all tasks
 */
function listTasks() {
  return _tasks.slice();
}

/**
 * Marks a task as completed.
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
 * @param {string} searchTerm
 * @returns {Array} Array of tasks matching the search term
 */
function findTasks(searchTerm) {
  return _tasks.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
}

/**
 * Gets a task by ID.
 * @param {number} taskId
 * @returns {Object} The task object
 */
function getTaskById(taskId) {
  return _tasks.find(t => t.id === taskId);
}

/**
 * Main game loop placeholder for Screeps (does nothing in tests).
 */
function run() {
  // Main game loop implementation would go here
}

/**
 * Stub for memory usage function (not defined originally).
 * @returns {Object} Empty object
 */
function getMemoryUsage() {
  return {};
}

/**
 * Gets all dependency update tasks with their status and additional details.
 * @returns {Array} Array of dependency update tasks with detailed status
 */
function getDetailedDependencyUpdateTasksWithStatus() {
  return _tasks
    .filter(task => task.tags && task.tags.includes('dependency-update'))
    .map(task => {
      const dependencies = task.dependencies || {};
      const dependencyDetails = Object.entries(dependencies).map(([name, info]) => {
        if (typeof info === 'string') {
          return { name, current: info, target: info, status: 'current' };
        } else {
          return {
            name,
            current: info.current,
            target: info.target,
            status: task.completed ? 'completed' :
              (task.tags?.includes('awaiting-schedule') ? 'awaiting-schedule' :
               task.tags?.includes('manually-edited') ? 'manually-edited' :
               task.tags?.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending')
          };
        }
      });

      return {
        id: task.id,
        title: task.title,
        completed: task.completed,
        createdAt: task.createdAt,
        dependencies: dependencyDetails,
        priority: task.priority,
        tags: task.tags || [],
        status: task.completed ? 'completed' :
          (task.tags?.includes('awaiting-schedule') ? 'awaiting-schedule' :
           task.tags?.includes('manually-edited') ? 'manually-edited' :
           task.tags?.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending')
      };
    });
}

// Export all defined functions
module.exports = {
  run,
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
  updateDependencyVersion,
  getTasksByDependency,
  addDependencyUpdateTask,
  getAllDependencies,
  getDependencyUpdateTasks,
  completeDependencyUpdateTask,
  getDependencyVersionTasks,
  getDependencyVersions,
  updateDependencyVersions,
  addDependenciesToTask,
  removeDependencyFromTask,
  getTasksMissingDependency,
  getMemoryUsage,
  getAllDependencyUpdateTasksWithStatus,
  getDependencyUpdateTasksGroupedByName,
  getDependencyUpdateStatistics,
  getDependencyUpdateTasksForVersion,
  getOverdueDependencyUpdateTasks,
  getDetailedDependencyUpdateTasksWithStatus,
  getAllUniqueDependencies,
  getDependencyUpdateTasksWithVersions,
  getAwaitingScheduleTasks,
  getManuallyEditedTasks,
  getBlockedByClosedPRTasks,
  markTaskAsAwaitingSchedule,
  markTaskAsManuallyEdited,
  markTaskAsBlockedByClosedPR,
  unmarkTaskAsAwaitingSchedule,
  unmarkTaskAsManuallyEdited,
  unmarkTaskAsBlockedByClosedPR,
  getDetailedDependencyUpdateTasksWithStatus
};