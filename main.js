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
    console.log(`[DEBUG] ${message}`);
  },

  /**
   * Logs a formatted message with the given level and optional data.
   * @param {string} level
   * @param {string} message
   * @param {*} [data]
   */
  log: function (level, message, data) {
    if (data !== undefined) {
      console.log(this.formatLogEntry(level, message), data);
    } else {
      console.log(this.formatLogEntry(level, message));
    }
  },

  /**
   * Formats a log entry with the specified level and message.
   * @param {string} level
   * @param {string} message
   * @returns {string} The formatted log entry
   */
  formatLogEntry: function (level, message) {
    const timestamp = new Date().toISOString();
    return `[${level} @ ${timestamp}] ${message}`;
  }
};

const _tasks = [];
let _nextId = 1;

// ... rest of the code from the HEAD version

module.exports = {
  run,
  addTask,
  resetTaskIdCounter,
  getTasksSortedByTitle,
  getTasksSortedByCreatedAt,
  getTasksSortedByPriority,
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
  logging
};