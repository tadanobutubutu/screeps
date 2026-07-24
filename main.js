const logging = {
  /**
   * Logs an info-level message.
   * @param {string} message
   */
  info(message) {
    console.info(`[INFO] ${message}`);
  },

  /**
   * Logs a warning-level message.
   * @param {string} message
   */
  warn(message) {
    console.warn(`[WARN] ${message}`);
  },

  /**
   * Logs an error-level message.
   * @param {string} message
   */
  error(message) {
    console.error(`[ERROR] ${message}`);
  },

  /**
   * Logs a debug-level message.
   * @param {string} message
   */
  debug(message) {
    console.debug(`[DEBUG] ${message}`);
  },

  /**
   * Formats a log entry with a timestamp.
   * @param {string} level
   * @param {string} message
   * @returns {string} Formatted log entry
   */
  formatLogEntry(level, message) {
    const timestamp = new Date().toISOString();
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
  },

  /**
   * Logs a formatted message with the given level and optional data.
   * @param {string} level
   * @param {string} message
   * @param {*} [data]
   * @returns {void}
   */
  log(level, message, data) {
    const entry = this.formatLogEntry(level, message);
    if (data !== undefined) {
      console.log(entry, data);
    } else {
      console.log(entry);
    }
  }
};

const _tasks = [];
let _nextId = 1;

/**
 * Adds a new task.
 * @param {string} title
 * @param {string} [priority]
 * @returns {number} the id of the created task.
 */
function addTask(title, priority) {
  const task = {
    id: _nextId++,
    title: title,
    completed: false,
    createdAt: Date.now(),
    tags: [],
    priority: priority || 'medium'
  };
  _tasks.push(task);
  return task.id;
}

/**
 * Resets the task ID counter to 1.
 * @returns {void}
 */
function resetTaskIdCounter() {
  _nextId = 1;
}

/**
 * Gets all tasks sorted by title.
 * @returns {Array} Sorted array of tasks
 */
function getTasksSortedByTitle() {
  return _tasks.slice().sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Gets all tasks sorted by creation date.
 * @returns {Array} Sorted array of tasks
 */
function getTasksSortedByCreatedAt() {
  return _tasks.slice().sort((a, b) => a.createdAt - b.createdAt);
}

/**
 * Gets tasks by priority.
 * @param {string} priority
 * @returns {Array} Array of tasks with the given priority
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
 * Updates the priority of a specific task.
 * @param {number} taskId
 * @param {string} newPriority
 * @returns {boolean} True if the update was successful
 */
function updateTaskPriority(taskId, newPriority) {
  const task = _tasks.find(t => t.id === taskId);
  if (task === undefined || task === null) return false;
  task.priority = newPriority;
  return true;
}

/**
 * Gets tasks by priority and optional dependencies filter.
 * @param {string} priority
 * @param {string|number} [dependencies] - (Optional) Dependency name or version to filter tasks.
 * @returns {Array}
 */
function getTasksByPriorityAndDependencies(priority, dependencies) {
  return _tasks.filter(task => task.priority === priority &&
    (!dependencies || task.dependencies && definitions[dependencies].map(version => task.dependencies[dependencies]).includes(version)));
}

/**
 * Gets tasks by dependency name.
 * @param {string} dependencyName
 * @returns {Array} Array of tasks that have the specified dependency
 */
function getTasksByDependency(dependencyName) {
  return _tasks.filter(task => task.dependencies && task.dependencies[dependencyName]);
}

/**
 * Adds a dependency update task.
 * @param {string} title
 * @param {Object} dependencies
 * @param {string} [priority]
 * @returns {number} The id of the created task
 */
function addDependencyUpdateTask(title, dependencies, priority) {
  const task = {
    id: _nextId++,
    title: title,
    completed: false,
    createdAt: Date.now(),
    tags: ['dependency-update'],
    priority: priority || 'medium',
    dependencies: dependencies
  };
  _tasks.push(task);
  return task.id;
}

/**
 * Gets all dependencies across all tasks.
 * @returns {Object} Map of dependency names to versions
 */
function getAllDependencies() {
  const allDeps = {};
  _tasks.forEach(task => {
    if (task.dependencies) {
      Object.entries(task.dependencies).forEach(([name, version]) => {
        if (!allDeps[name]) {
          allDeps[name] = [];
        }
        if (typeof version === 'string') {
          allDeps[name].push(version);
        } else if (version.current) {
          allDeps[name].push(version.current);
        }
      });
    }
  });
  return allDeps;
}

/**
 * Gets all dependency update tasks.
 * @returns {Array} Array of dependency update tasks
 */
function getDependencyUpdateTasks() {
  return _tasks.filter(task => task.tags && task.tags.includes('dependency-update'));
}

/**
 * Completes a dependency update task.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function completeDependencyUpdateTask(taskId) {
  return completeTask(taskId);
}

/**
 * Gets dependency version tasks for a specific dependency.
 * @param {string} dependencyName
 * @returns {Array} Array of tasks with the specified dependency
 */
function getDependencyVersionTasks(dependencyName) {
  return _tasks.filter(task => task.dependencies && task.dependencies[dependencyName]);
}

/**
 * Gets dependency versions for a specific dependency.
 * @param {string} dependencyName
 * @returns {Array} Array of version strings
 */
function getDependencyVersions(dependencyName) {
  const versions = [];
  _tasks.forEach(task => {
    if (task.dependencies && task.dependencies[dependencyName]) {
      const version = task.dependencies[dependencyName];
      if (typeof version === 'string') {
        versions.push(version);
      } else if (version.current) {
        versions.push(version.current);
      }
    }
  });
  return [...new Set(versions)];
}

/**
 * Updates dependency versions for a specific dependency across all tasks.
 * @param {string} dependencyName
 * @param {string} newVersion
 * @returns {number} Number of tasks updated
 */
function updateDependencyVersions(dependencyName, newVersion) {
  let count = 0;
  _tasks.forEach(task => {
    if (task.dependencies && task.dependencies[dependencyName]) {
      task.dependencies[dependencyName] = newVersion;
      count++;
    }
  });
  return count;
}

/**
 * Adds dependencies to a task.
 * @param {number} taskId
 * @param {Object} dependencies
 * @returns {boolean} True if successful
 */
function addDependenciesToTask(taskId, dependencies) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  if (!task.dependencies) {
    task.dependencies = {};
  }
  Object.assign(task.dependencies, dependencies);
  return true;
}

/**
 * Removes a dependency from a task.
 * @param {number} taskId
 * @param {string} dependencyName
 * @returns {boolean} True if successful
 */
function removeDependencyFromTask(taskId, dependencyName) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.dependencies) return false;
  if (task.dependencies[dependencyName]) {
    delete task.dependencies[dependencyName];
    return true;
  }
  return false;
}

/**
 * Gets tasks missing a specific dependency.
 * @param {string} dependencyName
 * @returns {Array} Array of tasks missing the dependency
 */
function getTasksMissingDependency(dependencyName) {
  return _tasks.filter(task => !task.dependencies || !task.dependencies[dependencyName]);
}

/**
 * Gets memory usage information.
 * @returns {Object} Memory usage data
 */
function getMemoryUsage() {
  return process.memoryUsage ? process.memoryUsage() : {};
}

/**
 * Gets all dependency update tasks with their status and additional details.
 * @returns {Array} Array of dependency update tasks with detailed status
 */
function getAllDependencyUpdateTasksWithStatus() {
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
              (task.tags && task.tags.includes('awaiting-schedule') ? 'awaiting-schedule' :
              (task.tags && task.tags.includes('manually-edited') ? 'manually-edited' :
              (task.tags && task.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending')))
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
          (task.tags && task.tags.includes('awaiting-schedule') ? 'awaiting-schedule' :
          (task.tags && task.tags.includes('manually-edited') ? 'manually-edited' :
          (task.tags && task.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending')))
      };
    });
}

/**
 * Gets all dependency update tasks with their status and additional details.
 * @returns {Array} Array of dependency update tasks with detailed status
 */
function getDetailedDependencyUpdateTasks() {
  return getAllDependencyUpdateTasksWithStatus();
}

/**
 * Gets all dependency update tasks with their status and additional details.
 * @returns {Array} Array of dependency update tasks with detailed status
 */
function getAllDependencyUpdateTasksWithDetails() {
  return getAllDependencyUpdateTasksWithStatus();
}

/**
 * Gets dependency update tasks that are in progress.
 * @returns {Array} Array of tasks in progress
 */
function getInProgressDependencyUpdateTasks() {
  return _tasks.filter(task =>
    task.tags?.includes('dependency-update') &&
    !task.completed &&
    !task.tags?.includes('awaiting-schedule') &&
    !task.tags?.includes('manually-edited') &&
    !task.tags?.includes('blocked-by-closed-pr')
  );
}

/**
 * Gets dependency update tasks that are ready for review.
 * @returns {Array} Array of tasks ready for review
 */
function getReadyForReviewDependencyUpdateTasks() {
  return _tasks.filter(task =>
    task.tags?.includes('dependency-update') &&
    !task.completed &&
    task.tags?.includes('awaiting-schedule')
  );
}

/**
 * Gets dependency update tasks that are blocked.
 * @returns {Array} Array of blocked tasks
 */
function getBlockedDependencyUpdateTasks() {
  return _tasks.filter(task =>
    task.tags?.includes('dependency-update') &&
    !task.completed &&
    (task.tags?.includes('manually-edited') || task.tags?.includes('blocked-by-closed-pr'))
  );
}

/**
 * Gets tasks created after a specific date.
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {Array} Array of tasks created after the given timestamp
 */
function getTasksCreatedAfter(timestamp) {
  return _tasks.filter(task => (task.createdAt || 0) > timestamp);
}

/**
 * Gets all npm lock files in the repository.
 * @returns {Array} Array of npm lock file paths
 */
function getNpmLockFiles() {
  const lockFiles = [];
  _tasks.forEach(task => {
    if (task.dependencies) {
      Object.keys(task.dependencies).forEach(depName => {
        const dep = task.dependencies[depName];
        if (dep && dep.lockFile) {
          lockFiles.push(dep.lockFile);
        }
      });
    }
  });
  return [...new Set(lockFiles)];
}

/**
 * Gets deprecation warnings for npm lock file updates.
 * @returns {Array} Array of deprecation warning messages
 */
function getNpmLockFileDeprecationWarnings() {
  const warnings = [];
  const lockFiles = getNpmLockFiles();

  if (lockFiles.length > 1) {
    warnings.push('WARN: Updating multiple npm lock files is deprecated and support will be removed in future versions.');
  }

  return warnings;
}

/**
 * Checks if a dependency update involves multiple npm lock files.
 * @param {string} dependencyName
 * @returns {boolean} True if the update involves multiple lock files
 */
function hasMultipleLockFiles(dependencyName) {
  const tasks = getDependencyVersionTasks(dependencyName);
  const lockFiles = new Set();

  tasks.forEach(task => {
    if (task.dependencies && task.dependencies[dependencyName]) {
      const dep = task.dependencies[dependencyName];
      if (dep && dep.lockFile) {
        lockFiles.add(dep.lockFile);
      }
    }
  });

  return lockFiles.size > 1;
}

/**
 * Gets dependency update tasks that failed to look up.
 * @returns {Array} Array of failed lookup tasks
 */
function getFailedLookupTasks() {
  return _tasks.filter(task =>
    task.tags?.includes('dependency-update') &&
    task.tags?.includes('failed-lookup')
  );
}

/**
 * Marks a dependency update task as failed lookup.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function markTaskAsFailedLookup(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  if (!task.tags.includes('failed-lookup')) {
    task.tags.push('failed-lookup');
  }
  return true;
}

/**
 * Unmarks a dependency update task as failed lookup.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function unmarkTaskAsFailedLookup(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  const index = task.tags.indexOf('failed-lookup');
  if (index !== -1) {
    task.tags.splice(index, 1);
  }
  return true;
}

/**
 * Gets dependency update tasks that are blocked by failed lookups.
 * @returns {Array} Array of tasks blocked by failed lookups
 */
function getBlockedByFailedLookupTasks() {
  return _tasks.filter(task =>
    task.tags?.includes('dependency-update') &&
    task.tags?.includes('failed-lookup')
  );
}

/**
 * Updates the version of a dependency in a task
 * @param {number} taskId - The ID of the task containing the dependency
 * @param {string} dependencyName - The name of the dependency to update
 * @param {string} newVersion - The new version to set
 * @returns {boolean} True if the update was successful, false otherwise
 */
function updateDependencyVersion(taskId, dependencyName, newVersion) {
    const task = _tasks.find(t => t.id === taskId);
    if (!task || !task.dependencies) {
        logging.warn(`Task ${taskId} not found or has no dependencies`);
        return false;
    }

    if (!task.dependencies[dependencyName]) {
        logging.warn(`Dependency ${dependencyName} not found in task ${taskId}`);
        return false;
    }

    const oldVersion = task.dependencies[dependencyName];
    task.dependencies[dependencyName] = newVersion;

    logging.info(`Updated ${dependencyName} from ${oldVersion} to ${newVersion} in task ${taskId}`);
    return true;
}

/**
 * Main game loop placeholder for Screeps (does nothing in tests).
 */
function run() {
  // Main game loop implementation would go here
}

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
  getDetailedDependencyUpdateTasks,
  getAllDependencyUpdateTasksWithDetails,
  getInProgressDependencyUpdateTasks,
  getReadyForReviewDependencyUpdateTasks,
  getBlockedDependencyUpdateTasks,
  getTasksCreatedAfter,
  getNpmLockFiles,
  getNpmLockFileDeprecationWarnings,
  hasMultipleLockFiles,
  getFailedLookupTasks,
  markTaskAsFailedLookup,
  unmarkTaskAsFailedLookup,
  getBlockedByFailedLookupTasks,
  updateTaskPriority,
  getTasksByPriorityAndDependencies,
  logging
};