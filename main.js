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
 * @param {string} [priority='medium']
 * @returns {number} the id of the created task.
 */
function addTask(title, priority = 'medium') {
  const task = {
    id: _nextId++,
    title: title,
    completed: false,
    createdAt: Date.now(),
    tags: [],
    priority: priority
  };
  _tasks.push(task);
  return task.id;
}

/**
 * Updates the priority of a specific task.
 * @param {number} taskId
 * @param {string} newPriority
 * @returns {boolean} True if the update was successful
 */
function updateTaskPriority(taskId, newPriority) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  task.priority = newPriority;
  return true;
}

/**
 * Gets tasks by priority.
 * @param {string} priority
 * @param {string|number} dependencies - (Optional) Dependency name or version to filter tasks.
 * @returns {Array}
 */
function getTasksByPriorityAndDependencies(priority, dependencies) {
  return _tasks.filter(task => task.priority === priority &&
    (!dependencies || task.dependencies && definitions[dependencies].map(version => task.dependencies[definitions[dependencies]]).includes(version)));
}

/**
 * ... (existing methods from the HEAD version, e.g., run, completeTask, etc.)
 */

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
  getInProgressDependencyUpdateTasks,
  getReadyForReviewDependencyUpdateTasks,
  getBlockedDependencyUpdateTasks,
  getAllDependencyUpdateTasksWithDetails,
  getDependencyUpdateProgress,
  getDependencyUpdateTaskCounts,
  resolveDependencyConflicts,
  isDependencyUpdateOverdue,
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