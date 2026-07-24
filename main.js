let _tasks = [];
let _nextId = 1;

// ---------- Logging Utilities ----------
const logging = {
  /**
   * Logs an info-level message.
   * @param {string} message
   */
  info(message) {
    console.log(`[INFO] ${message}`);
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

// ---------- Task CRUD Iraqi Arabic--------
/**
 * Adds a new task with an optional priority and tags.
 * @param {string} title
 * @param {string} [priority='medium']
 * @param {string[]} [tags=[]]
 * @returns {number} The ID of the created task.
 */
function addTask(title, priority = 'medium', tags = []) {
  const task = {
    id: _nextId++,
    title,
    completed: false,
    createdAt: Date.now(),
    tags: Array.isArray(tags) ? [...tags] : [],
    priority,
    dependencies: {}
  };
  _tasks.push(task);
  return task.id;
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
 * Retrieves a copy of all tasks.
 * @returns {Array}
 */
function listTasks() {
  return _tasks.slice();
}

/**
 * Finds tasks by title substring.
 * @param {string} searchTerm
 * @returns {Array} Matching tasks
 */
function findTasks(searchTerm) {
  const term = typeof searchTerm === 'string' ? searchTerm.toLowerCase() : '';
  return _tasks.filter(task => task.title.toLowerCase().includes(term));
}

/**
 * Gets a task by its ID.
 * @param {number} taskId
 * @returns {Object|null}
 */
function getTaskById(taskId) {
  return _tasks.find(t => t.id === taskId) || null;
}

/**
 * Marks a task as completed.
 * @param {number} taskId
 * @returns {boolean}
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
 * Updates the version of a dependency in a task.
 * @param {number} taskId
 * @param {string} dependencyName
 * @param {string} newVersion
 * @returns {boolean} True if updated
 */
function updateDependencyVersion(taskId, dependencyName, newVersion) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  if (!task.dependencies) task.dependencies = {};
  task.dependencies[dependencyName] = newVersion;
  return true;
}

/**
 * Updates the priority of a task.
 * @param {number} taskId
 * @param {string} newPriority
 * @returns {boolean} True if updated
 */
function updateTaskPriority(taskId, newPriority) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  task.priority = newPriority;
  return true;
}

/**
 * Removes a dependency from a task.
 * @param {number} taskId
 * @param {string} dependencyName
 * @returns {boolean} True if removed
 */
function removeTaskDependency(taskId, dependencyName) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.dependencies || !task.dependencies[dependencyName]) return false;
  delete task.dependencies[dependencyName];
  return true;
}

/**
 * Adds a tag to a task.
 * @param {number} taskId
 * @param {string} tag
 * @returns {boolean} True if added
 */
function addTag(taskId, tag) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  if (!task.tags.includes(tag)) task.tags.push(tag);
  return true;
}

/**
 * Removes a tag from a task.
 * @param {number} taskId
 * @param {string} tag
 * @returns {boolean} True if removed
 */
function removeTag(taskId, tag) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  const index = task.tags.indexOf(tag);
  if (index !== -1) task.tags.splice(index, 1);
  return true;
}

/**
 * Gets tasks that have a specific dependency.
 * @param {string} dependencyName
 * @returns {Array} Tasks with the dependency
 */
function getTasksByDependency(dependencyName) {
  return _tasks.filter(task => task.dependencies && task.dependencies[dependencyName]);
}

/**
 * Gets tasks by priority.
 * @param {string} priority
 * @returns {Array} Tasks with the priority
 */
function getTasksByPriority(priority) {
  return _tasks.filter(task => task.priority === priority);
}

/**
 * Gets tasks by priority and optionally dependency.
 * @param {string} priority
 * @param {string} [dependencyName]
 * @returns {Array} Matching tasks
 */
function getTasksByPriorityAndDependencies(priority, dependencyName) {
  return _tasks.filter(task => task.priority === priority && (!dependencyName || getTasksByDependency(dependencyName).includes(task)));
}

/**
 * Gets tasks sorted by title.
 * @returns {Array} Sorted tasks
 */
function getTasksSortedByTitle() {
  return [..._tasks].sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Gets tasks sorted by creation date.
 * @returns {Array} Sorted tasks
 */
function getTasksSortedByCreatedAt() {
  return [..._tasks].sort((a, b) => a.createdAt - b.createdAt);
}

/**
 * Gets all dependency update tasks with status.
 * @returns {Array} Tasks with dependency-update tag and status
 */
function getAllDependencyUpdateTasksWithStatus() {
  return _tasks.filter(task => task.tags?.includes('dependency-update'));
}

/**
 * Gets detailed dependency update tasks.
 * @returns {Array} Detailed tasks
 */
function getDetailedDependencyUpdateTasks() {
  return _tasks.filter(task => task.tags?.includes('dependency-update'))
    .map(task => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      createdAt: task.createdAt,
      dependencies: Object.entries(task.dependencies || {})
        .map(([name, info]) => ({
          name,
          current: typeof info === 'string' ? info : info?.current || '',
          target: typeof info === 'string' ? info : info?.target || '',
          status: task.completed ? 'completed' : task.tags?.includes('awaiting-schedule') ? 'awaiting-schedule' : task.tags?.includes('manually-edited') ? 'manually-edited' : task.tags?.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending'
        })),
      priority: task.priority,
      tags: [...task.tags],
      status: task.completed ? 'completed' : task.tags?.includes('awaiting-schedule') ? 'awaiting-schedule' : task.tags?.includes('manually-edited') ? 'manually-edited' : task.tags?.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending'
    }));
}

/**
 * Gets dependency update tasks.
 * @returns {Array} Tasks with dependency-update tag
 */
function getDependencyUpdateTasks() {
  return _tasks.filter(task => task.tags?.includes('dependency-update'));
}

/**
 * Gets tasks that have a specific dependency.
 * @param {string} dependencyName
 * @returns {Array} Tasks with the dependency
 */
function getDependencyVersionTasks(dependencyName) {
  return _tasks.filter(task => task.dependencies?.[dependencyName] !== undefined);
}

/**
 * Gets unique versions of a dependency.
 * @param {string} dependencyName
 * @returns {Array} Unique versions
 */
function getDependencyVersions(dependencyName) {
  const versions = new Set();
  _tasks.forEach(task => {
    if (task.dependencies && task.dependencies[dependencyName]) {
      const dep = task.dependencies[dependencyName];
      if (typeof dep === 'string') versions.add(dep);
      else if (dep.current) versions.add(dep.current);
      if (dep.target) versions.add(dep.target);
    }
  });
  return Array.from(versions);
}

/**
 * Updates dependency versions for all tasks.
 * @param {string} dependencyName
 * @param {string} currentVersion
 * @param {string} targetVersion
 */
function updateDependencyVersions(dependencyName, currentVersion, targetVersion) {
  _tasks.forEach(task => {
    if (task.dependencies && task.dependencies[dependencyName])
      task.dependencies[dependencyName] = { current: currentVersion, target: targetVersion };
  });
}

/**
 * Adds dependencies to a task.
 * @param {number} taskId
 * @param {Object} dependencies
 * @returns {boolean} True if added
 */
function addDependenciesToTask(taskId, dependencies) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  task.dependencies = { ...task.dependencies, ...dependencies };
  return true;
}

/**
 * Gets tasks missing a dependency.
 * @param {string} dependencyName
 * @returns {Array} Tasks missing the dependency
 */
function getTasksMissingDependency(dependencyName) {
  return _tasks.filter(task => !task.completed && (!task.dependencies || !task.dependencies[dependencyName]));
}

/**
 * Gets memory usage.
 * @returns {Object} Memory usage info
 */
function getMemoryUsage() {
  return {
    taskCount: _tasks.length,
    nextId: _nextId,
    memory: typeof process !== 'undefined' ? process.memoryUsage() : {}
  };
}

/**
 * Gets dependency update progress percentage.
 * @param {string} dependencyName
 * @returns {number} Progress percentage
 */
function getDependencyUpdateProgress(dependencyName) {
  const tasks = getDependencyVersionTasks(dependencyName);
  if (tasks.length === 0) return 0;
  return (tasks.filter(t => t.completed).length / tasks.length) * 100;
}

/**
 * Gets dependency update task counts.
 * @returns {Object} Counts of tasks
 */
function getDependencyUpdateTaskCounts() {
  const counts = { total: 0, completed: 0, pending: 0, overdue: 0, blocked: 0 };
  const now = Date.now();
  const overdueTime = 7 * 24 * 60 * 60 * 1000;
  _tasks.forEach(task => {
    if (task.tags?.includes('dependency-update')) {
      counts.total++;
      if (task.completed) counts.completed++;
      else if ((now - task.createdAt) > overdueTime) counts.overdue++;
      else if (task.tags.includes('blocked-by-closed-pr') || task.tags.includes('manually-edited')) counts.blocked++;
      else counts.pending++;
    }
  });
  return counts;
}

/**
 * Resolves dependency conflicts.
 * @param {string} dependencyName
 * @param {*} resolvedVersion
 * @returns {boolean} True if resolved
 */
function resolveDependencyConflicts(dependencyName, resolvedVersion) {
  const tasks = getDependencyVersionTasks(dependencyName);
  tasks.forEach(task => {
    if (task.dependencies && task.dependencies[dependencyName])
      task.dependencies[dependencyName] = resolvedVersion;
  });
  return true;
}

/**
 * Checks if a dependency update task is overdue.
 * @param {number} taskId
 * @returns {boolean} True if overdue
 */
function isDependencyUpdateOverdue(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || task.completed) return false;
  const overdueTime = 7 * 24 * 60 * 60 * 1000;
  return (Date.now() - task.createdAt) > overdueTime;
}

/**
 * Schedules dependencies for development.
 */
function scheduleDependenciesInDevelopment() {
  logging.info('Dependencies scheduled for development...');
}

/**
 * Processes tasks when scheduled.
 */
function processTasksWhenScheduled() {
  logging.info('Processing tasks...');
}

/**
 * Resolves task dependencies in page tasks.
 */
function resolveTaskDependenciesInPageTasks() {
  logging.info('Resolving dependencies...');
}

/**
 * Gets npm lock files.
 * @returns {Array} Unique lock files
 */
function getNpmLockFiles() {
  const files = [];
  _tasks.forEach(task => {
    if (task.dependencies)
      Object.keys(task.dependencies).forEach(dep => {
        const depData = task.dependencies[dep];
        if (depData && depData.lockFile) files.push(depData.lockFile);
      });
  });
  return [...new Set(files)];
}

/**
 * Gets npm lock file deprecation warnings.
 * @returns {Array} Warnings
 */
function getNpmLockFileDeprecationWarnings() {
  return getNpmLockFiles().length > 1 ? ['WARN: Multiple lock files detected'] : [];
}

/**
 * Checks if a dependency has multiple lock files.
 * @param {string} dependencyName
 * @returns {boolean} True if multiple lock files
 */
function hasMultipleLockFiles(dependencyName) {
  const tasks = getDependencyVersionTasks(dependencyName);
  const locks = new Set();
  tasks.forEach(task => {
    if (task.dependencies && task.dependencies[dependencyName]) {
      const dep = task.dependencies[dependencyName];
      if (dep && dep.lockFile) locks.add(dep.lockFile);
    }
  });
  return locks.size > 1;
}

/**
 * Gets tasks blocked by failed lookup.
 * @returns {Array} Blocked tasks
 */
function getBlockedByFailedLookupTasks() {
  return _tasks.filter(task => task.tags?.includes('blocked-by-failed-lookup'));
}

/**
 * Gets tasks created after a timestamp.
 * @param {number} timestamp
 * @returns {Array} Tasks created after timestamp
 */
function getTasksCreatedAfter(timestamp) {
  return _tasks.filter(task => task.createdAt > timestamp);
}

/**
 * Marks a task as failed lookup.
 * @param {number} taskId
 * @returns {boolean} True if marked
 */
function markTaskAsFailedLookup(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  if (!task.tags) task.tags = [];
  if (!task.tags.includes('failed-lookup')) task.tags.push('failed-lookup');
  return true;
}

/**
 * Unmarks a task as failed lookup.
 * @param {number} taskId
 * @returns {boolean} True if unmarked
 */
function unmarkTaskAsFailedLookup(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags) return false;
  const index = task.tags.indexOf('failed-lookup');
  if (index !== -1) task.tags.splice(index, 1);
  return true;
}

/**
 * Gets failed lookup tasks.
 * @returns {Array} Failed lookup tasks
 */
function getFailedLookupTasks() {
  return _tasks.filter(task => task.tags?.includes('failed-lookup'));
}

/**
 * Gets tasks awaiting schedule.
 * @returns {Array} Awaiting schedule tasks
 */
function getAwaitingScheduleTasks() {
  return getDependencyUpdateTasks().filter(task => task.tags?.includes('awaiting-schedule'));
}

/**
 * Gets manually edited tasks.
 * @returns {Array} Manually edited tasks
 */
function getManuallyEditedTasks() {
  return getDependencyUpdateTasks().filter(task => task.tags?.includes('manually-edited'));
}

/**
 * Gets tasks blocked by closed PR.
 * @returns {Array} Blocked tasks
 */
function getBlockedByClosedPRTasks() {
  return getDependencyUpdateTasks().filter(task => task.tags?.includes('blocked-by-closed-pr'));
}

/**
 * Gets in-progress dependency update tasks.
 * @returns {Array} In-progress tasks
 */
function getInProgressDependencyUpdateTasks() {
  return _tasks.filter(task => task.dependencies && Object.keys(task.dependencies).length > 0 && !task.completed && task.tags?.includes('in-progress'));
}

/**
 * Gets ready-for-review dependency update tasks.
 * @returns {Array} Ready-for-review tasks
 */
function getReadyForReviewDependencyUpdateTasks() {
  return _tasks.filter(task => task.dependencies && Object.keys(task.dependencies).length > 0 && !task.completed && task.tags?.includes('ready-for-review'));
}

/**
 * Gets blocked dependency update tasks.
 * @returns {Array} Blocked tasks
 */
function getBlockedDependencyUpdateTasks() {
  return _tasks.filter(task => task.dependencies && Object.keys(task.dependencies).length > 0 && !task.completed && task.tags?.includes('blocked'));
}

/**
 * Marks task as awaiting schedule.
 * @param {number} taskId
 * @returns {boolean} True if marked
 */
function markTaskAsAwaitingSchedule(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags?.includes('dependency-update')) return false;
  if (!task.tags?.includes('awaiting-schedule')) task.tags.push('awaiting-schedule');
  return true;
}

/**
 * Unmarks task as awaiting schedule.
 * @param {number} taskId
 * @returns {boolean} True if unmarked
 */
function unmarkTaskAsAwaitingSchedule(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags?.includes('dependency-update')) return false;
  const index = task.tags.indexOf('awaiting-schedule');
  if (index >= 0) task.tags.splice(index, 1);
  return true;
}

/**
 * Marks task as manually edited.
 * @param {number} taskId
 * @returns {boolean} True if marked
 */
function markTaskAsManuallyEdited(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags?.includes('dependency-update')) return false;
  if (!task.tags?.includes('manually-edited')) task.tags.push('manually-edited');
  return true;
}

/**
 * Unmarks task as manually edited.
 * @param {number} taskId
 * @returns {boolean} True if unmarked
 */
function unmarkTaskAsManuallyEdited(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags?.includes('dependency-update')) return false;
  const index = task.tags.indexOf('manually-edited');
  if (index >= 0) task.tags.splice(index, 1);
  return true;
}

/**
 * Marks task as blocked by closed PR.
 * @param {number} taskId
 * @returns {boolean} True if marked
 */
function markTaskAsBlockedByClosedPR(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags?.includes('dependency-update')) return false;
  if (!task.tags?.includes('blocked-by-closed-pr')) task.tags.push('blocked-by-closed-pr');
  return true;
}

/**
 * Unmarks task as blocked by closed PR.
 * @param {number} taskId
 * @returns {boolean} True if unmarked
 */
function unmarkTaskAsBlockedByClosedPR(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags?.includes('dependency-update')) return false;
  const index = task.tags.indexOf('blocked-by-closed-pr');
  if (index >= 0) task.tags.splice(index, 1);
  return true;
}

/**
 * Resets the task ID counter.
 */
function resetTaskIdCounter() {
  _nextId = 1;
}

/**
 * Gets dependency update tasks with versions.
 * @param {string} dependencyName
 * @returns {Array} Tasks with versions
 */
function getDependencyUpdateTasksWithVersions(dependencyName) {
  return _tasks
    .filter(task => task.tags?.includes('dependency-update') && task.dependencies?.[dependencyName])
    .map(task => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      createdAt: task.createdAt,
      currentVersion: typeof task.dependencies[dependencyName] === 'string' ? task.dependencies[dependencyName] : task.dependencies[dependencyName]?.current,
      targetVersion: typeof task.dependencies[dependencyName] === 'string' ? task.dependencies[dependencyName] : task.dependencies[dependencyName]?.target,
      priority: task.priority
    }));
}

/**
 * Gets all unique dependencies.
 * @returns {Array} Unique dependencies
 */
function getAllUniqueDependencies() {
  const deps = new Set();
  _tasks.forEach(task => {
    if (task.dependencies) Object.keys(task.dependencies).forEach(dep => deps.add(dep));
  });
  return Array.from(deps);
}

/**
 * Gets all dependencies (alias for getAllUniqueDependencies).
 * @returns {Array} All dependencies
 */
function getAllDependencies() {
  return getAllUniqueDependencies();
}

/**
 * Completes a dependency update task.
 * @param {number} taskId
 * @returns {boolean} True if completed
 */
function completeDependencyUpdateTask(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags?.includes('dependency-update')) return false;
  task.completed = true;
  return true;
}

/**
 * Gets all dependency update tasks with details.
 * @returns {Array} Detailed tasks
 */
function getAllDependencyUpdateTasksWithDetails() {
  return getDetailedDependencyUpdateTasks();
}

/**
 * Gets dependency update tasks with details.
 * @returns {Array} Detailed tasks with versions
 */
function getDependencyUpdateTasksWithDetails() {
  return _tasks
    .filter(task => task.tags?.includes('dependency-update'))
    .map(task => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      createdAt: task.createdAt,
      dependencies: Object.entries(task.dependencies || {})
        .map(([name, info]) => ({
          name,
          current: typeof info === 'string' ? info : info?.current || '',
          target: typeof info === 'string' ? info : info?.target || ''
        })),
      priority: task.priority,
      tags: [...task.tags]
    }));
}

/**
 * Gets dependency update progress.
 * @returns {Object} Progress by dependency
 */
function getDependencyUpdateProgressByDependency() {
  const progress = {};
  const dependencies = getAllUniqueDependencies();
  dependencies.forEach(dep => {
    progress[dep] = getDependencyUpdateProgress(dep);
  });
  return progress;
}

module.exports = {
  logging,
  addTask,
  completeTask,
  removeTask,
  findTasks,
  getTaskById,
  listTasks,
  updateDependencyVersion,
  updateTaskPriority,
  removeTaskDependency,
  addTag,
  removeTag,
  getTasksByDependency,
  getTasksByPriority,
  getTasksByPriorityAndDependencies,
  getTasksSortedByTitle,
  getTasksSortedByCreatedAt,
  getAllDependencyUpdateTasksWithStatus,
  getDetailedDependencyUpdateTasks,
  getDependencyUpdateTasks,
  getDependencyVersionTasks,
  getDependencyVersions,
  updateDependencyVersions,
  addDependenciesToTask,
  getTasksMissingDependency,
  getMemoryUsage,
  getDependencyUpdateProgress,
  getDependencyUpdateTaskCounts,
  resolveDependencyConflicts,
  isDependencyUpdateOverdue,
  scheduleDependenciesInDevelopment,
  processTasksWhenScheduled,
  resolveTaskDependenciesInPageTasks,
  getNpmLockFiles,
  getNpmLockFileDeprecationWarnings,
  hasMultipleLockFiles,
  getBlockedByFailedLookupTasks,
  getAwaitingScheduleTasks,
  getManuallyEditedTasks,
  getBlockedByClosedPRTasks,
  getInProgressDependencyUpdateTasks,
  getReadyForReviewDependencyUpdateTasks,
  getBlockedDependencyUpdateTasks,
  getBlockedByFailedLookupTasks,
  resetTaskIdCounter,
  getDependencyUpdateTasksWithVersions,
  getAllDependencies,
  getDependencyUpdateTasks,
  completeDependencyUpdateTask,
  getAllDependencyUpdateTasksWithDetails,
  getTasksMissingDependency,
  getTasksCreatedAfter,
  markTaskAsFailedLookup,
  unmarkTaskAsFailedLookup,
  getFailedLookupTasks,
  _tasks,
  _nextId,
  getTaskById
};