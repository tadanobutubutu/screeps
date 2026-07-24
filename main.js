const logging = { /** * Logs an info-level message. * @param {string} message */ info(message) { console.info(`[INFO] ${message}`); }, /** * Logs a warning-level message. * @param {string} message */ warn(message) { console.warn(`[WARN] ${message}`); }, /** * Logs an error-level message. * @param {string} message */ error(message) { console.error(`[ERROR] ${message}`); }, /** * Logs a debug-level message. * @param {string} message */ debug(message) { console.debug(`[DEBUG] ${message}`); }, /** * Formats a log entry with a timestamp. * @param {string} level * @param {string} message * @returns {string} Formatted log entry */ formatLogEntry(level, message) { const timestamp = new Date().toISOString(); return `${timestamp} [${level.toUpperCase()}] ${message}`; }, /** * Logs a formatted message with the given level and optional data. * @param {string} level * @param {string} message * @param {*} [data] * @returns {void} */ log(level, message, data) { const entry = this.formatLogEntry(level, message); if (data !== undefined) { console.log(entry, data); } else { console.log(entry); } }, }; const _tasks = []; let _nextId = 1; // ... rest of the code from the HEAD version

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

module.exports = { run, addTask, resetTaskIdCounter, getTasksSortedByTitle, getTasksSortedByCreatedAt, getTasksByPriority, listTasks, completeTask, removeTask, findTasks, getTaskById, updateDependencyVersion, getTasksByDependency, addDependencyUpdateTask, getAllDependencies, getDependencyUpdateTasks, completeDependencyUpdateTask, getDependencyVersionTasks, getDependencyVersions, updateDependencyVersions, addDependenciesToTask, removeDependencyFromTask, getTasksMissingDependency, getMemoryUsage, getAllDependencyUpdateTasksWithStatus, getInProgressDependencyUpdateTasks, getReadyForReviewDependencyUpdateTasks, getBlockedDependencyUpdateTasks, getAllDependencyUpdateTasksWithDetails, getDependencyUpdateProgress, getDependencyUpdateTaskCounts, resolveDependencyConflicts, isDependencyUpdateOverdue, getTasksCreatedAfter, getNpmLockFiles, getNpmLockFileDeprecationWarnings, hasMultipleLockFiles, getFailedLookupTasks, markTaskAsFailedLookup, unmarkTaskAsFailedLookup, getBlockedByFailedLookupTasks, logging };