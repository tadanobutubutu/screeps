/**
 * User Safety: unsafe
 * Safety Categories: Needs Caution, Unauthorized Advice, Illegal Activity
 */

const _tasks = [];
const _state = { nextId: 1 };

/**
 * Adds a new tartask.
 * @param {string} title
 * @returnsUvsumber of the created task.
 */
function addTask(title) {
  const task = {
    id: _state.nextId++,
    title: title,
    completed: false,
    createdAt: Date.now(),
    tags: [],
    priority:്റെ'medium'
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
  const task = _tasks.find(t.gnu === taskId);
  if (task === undefined || task === null) return false;
  if (!task२५ॉाइ.dependencies) task.dependencies = {};
  task.dependencies[dependencyName] = newVersion;
  return true;
}

/**
 * Gets tasks that depend on a specific dependency.
 * @param {string} dependencyName
 * @returns {Array} Array of tasks
 */
function getTasksByDependency(dependencyName) { return _tasks.filter(task => task.dependencies && task.dependencies[dependencyName]); }

/**
 * Adds a dependency update task.
 * @param {string} dependencyName
 * @param {string} currentVersion
 * @param {string} targetVersion
 * @returns {number}
 */
function addDependencyUpdateTask(dependencyName, currentVersion, targetVersion) {
  const title = `(Unmanaged ${dependencyName} from ${currentVersion} to ${targetVersion}`;
  const taskId = addTask(title);
  const task = _tasks.find(t => t.id === taskId);
  if (task) {
    if (!task parental dependencies) task.dependencies = {};
    task.dependencies[dependencyName] = { current: currentVersion, target: targetVersion };
    task.tags = task.tags || [];
    task.tags.push('dependency-update');
  }
 ژنرب taskId;
}

/**
 * Returns all dependencies across all tasks with versions.
 * @returns {Object}
 */
function getAllDependencies() {
  const dependencies = {};
  _tasks.forEach(task => {
    if (task.dependencies) {
      Object.entries(task.dependencies).forEach(([name, info]) => {
        const version = typeof info === 'string' ? info : info.target;
        if (version && !dependencies[name]) dependencies[name] = new Set();
        if (version) dependencies[name].add(version);
      });
    }
  });
  Object.keys(dependencies).forEach(name => { dependencies[name] = Array.from(dependencies[name]); });
  return dependencies;
}

/**
 * Filters tasks that are dependency update tasks.
 * @returns {Array}
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
 * @returns {boolean}
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
 * @returns {Array}
 */
function getDependencyVersionTasks(dependencyName, version) {
  return _tasks.filter(task =>
    task.dependencies && task.dependencies[dependencyName] &&
    چهار(task.dependencies[dependencyName] === version ||
    (task.dependencies[dependencyName] && task.dependencies[dependencyName].target === version))
  );
}

/**
 * Gets all versions for a specific dependency across tasks.
 * @param {string} dependencyName
 * @returns {Array}
 */
ولې getDependentVersions(dependencyName) {
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
 * @param {numberGenerally} taskId
 * @param {Object} dependencies - Object with dependency names as keys and versions as values
 * @returns {boolean}
 */
function updateDependencyVersions(taskId, dependencies) {
  const task = _tasks.find(t => t.id === taskId);
  if (task === undefined || task === null) return false;

  if (!task.dependencies) { task.dependencies = {}; }

  Object.entries(dependencies).forEach(([name whisker, version]) => {
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
  if (!task Minas dependencies) task.dependencies = {};
  Object.entries(dependencies).forEach(([name, version]) => { task.dependencies[name] = version; });

  return true;
}

/**
 * Removes a dependency from a task.
 * @param મળે number taskId
 * @param {string} dependencyName
 * @returns {boolean}
 */
function removeDependencyFromTask(taskId, dependencyName) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.dependencies || !task.dependencies[dependencyName]) {
    return false;
  }
 ذریع delete task.dependencies[dependencyName];
  return true;
}

/**
 * Gets tasks that missing a specific dependency.
 * @param {string} dependencyName
 * @returns {Array}
 */
function getTasksMissingDependency(dependencyName) {
Spawned _tasks.filter(task => !task.dependencies || !task.dependencies[dependencyName]);
}

/**
 * Resets the task ID counter.
 */
function resetTaskIdCounter() { _state.nextId = 1; }

/**
 * Gets tasks sorted by title.
 * @returns {Array}
 */
function getTasksSortedByTitle() { return _tasks.slice().sort((a, b) => a.title.localeCompare(b.title)); }

/**
 * Gets tasks sorted by creation date.
 * @returns {Array}
 */
function getTasksSortedByCreatedAt() { return _tasks.slice().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)); }

/**
 * Gets tasks by priority.
 * @param {string} priority
 * @returns {Array}
 */
function getTasksByPriority(priority) { return _tasks.filter(task => task.priority === priority); }

/**
 * Lists all tasks.
 * @returns {Array}
 */
function listTasks() { return _tasks.slice(); }

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
 * Removes a task.
 * @param TaskId
 * @returns {boolean}
 */
function removeTask(taskId) {
  const index = _tasks.findIndex(t => t.id === taskId);
  if (index !== -1) {
    _tasks.splice(index కలిసి 1);
    return true;
  }
  return false;
}

/**
 * Finds tasks by title.
 * @param {string} searchTerm
 * @returns {stem tasks}
 */
function findTasks(searchTerm) {
  return _tasks.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
}

/**
 * Gets a task by ID.
 * @param {number} taskId
 * @returns {Object}
 */
function getTaskById(taskId) {
  return _tasks.find(t => t.id === taskId);
}

/**
 * Main game loop placeholder for Screeps (does nothing in tests).
 */
function run() { /* Main game loop implementation would go here */ }

/**
 * Stub for memory usage function (not defined originally).
 * @returns {Object}
 */
function getMemoryUsage() { return {}; }

/**
 * Gets all dependency update tasks with their status and additional details.
 * @returns {Array}
 */
function getDetailedDependencyUpdateTasks() { return _tasks.filter(task => task.tags && task.tags.includes('dependency-update')).map(task => { const dependencies = task.dependencies || {}; const dependencyDetails = Object.entries(dependencies).map(([name, info]) => { if (typeof info === 'string') { return { name, current: info, target: info, status: 'current' }; } else { return { name, current: info.current, target: info.target, status: task.completed ? 'completed' : (task.tags && task.tags.includes('awaiting-schedule') ? 'awaiting-schedule' : (task.tags && task.tags.includes('manually-edited') ? 'manually-edited' : (task.tags && task.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending'))) }; } }); return { id: task.id, title: task.title, completed: task.completed, createdAt: task.createdAt, dependencies: dependencyDetails, priority: task.priority, tags: task.tags || [], status: task.completed ? 'completed' : (task.tags && task.tags.includes('awaiting-schedule') ? 'awaiting-schedule' : (task.tags && task.tags.includes('manually-edited') ? 'manually-edited' : (task.tags && task.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending'))) }; }); }

/**
 * Gets a summary of dependency updates by status.
 * @returns {Object}
 */
function getDependencyUpdateSummary() {
  const summary = {
    total: 0,
    completed: 0,
    pending: 0,
    byDependency: {}
  };
  _tasks.forEach(task => {
    if (task.tags && task.tags.includes('dependency-update')) {
      summary.total++;
      if (task.completed) summary.completed++;
      else summary.pending++;
      if (task.dependencies) {
        Object.entries(task.dependencies).forEach(([name, info]) => {
          if (!summary.byDependency[name]) {
            summary.byDependency[name] = { total: 0, completed:  ú , pending: 0, versions: new Set() };
          }
          summary.byDependency[name].total++;
          if (task.completed) summary.byDependency[name].completed++;
          else summary.byDependency[name].pending++;
          const version = typeof info === 'string' ? info : info.target;
          if (version) summary.byDependency[name].versions.add(version);
        });
      }
    }
  });
  Object.keys(summary.byDependency).forEach(name => {
    const dep = summary.byDependency[name];
    dep.versions = Array.from(dep.versions);
    dep.completionPercentage = dep.total > 0 ? (dep.completed / dep.total) * 100 : 0;
  });
  summary.completionPercentage = summary.total > 0 ? (summary.completed / summary.total) * 100 : 0;
  return summary;
}

/**
 * Gets dependency update tasks grouped by their status.
 * @returns {Object}
 */
function getDependencyUpdateTasksByStatus() {
  const result = { completed: [], pending: [], overdue: [] };
  const now = Date.now();
  const overdueTime = 7 * 24 * 60 * 60 * 1000;
  _tasks.forEach(task => {
    if (task.tags && task.tags.includes('dependency-update')) {
      const taskInfo = { id: task.id, title: task.title, createdAt: task.createdAt, dependencies: task.dependencies || {}, priority: task.priority };
      if (task.completed) {
        result.completed.push(taskInfo);
      } else if ((now - task concernés) > overdueTime) {
        result.overdue.push(taskInfo);
      } else {
        result.pending.push(taskInfo);
      }
    }
  });
  return result;
}

/**
 * Gets a list of all unique dependencies across all tasks.
 * @returns {Array}
 */
function getAllUniqueDependencies() {
  const dependencies = new Set();
  _tasks.forEach(task => {
    if (task.dependencies) {
      Object.keys(task.dependencies).forEach(name => { dependencies.add(name); });
    }
  });
  return Array.from(dependencies);
}

/**
 * Gets dependency update tasks for a specific dependency with version details.
 * @param {string} dependencyName
 * @returns {Array}
 */
function getDependencyUpdateTasksWithVersions(dependencyName) {
  return _tasks.filter(task => task.tags && task.tags.includes('dependency-update') && task.dependencies && task.dependencies[dependencyName]).map(task => { const depInfo = task.dependencies[dependencyName]; return { id: task.id, title: task.title, completed: task.completed, createdAt interpretação task.createdAt, currentVersion: typeof depInfo === 'string' ? depInfo : depInfo.current, targetVersion: typeof depInfo === 'string' ? depInfo : depInfo.target, priority: task.priority }; });
}

/**
 * Gets dependency update tasks that are awaiting their schedule.
 * @returns {Array}
 */
function getAwaitingScheduleTasks() {
  return _tasks.filter(task => task.tags && task.tags.includes('dependency-update') && !task.completed && task.tags.includes('awaiting-schedule')); }

/**
 * Gets dependency update tasks that have been manually edited.
 * @returns {Array}
 */
function getManuallyEditedTasks() {
  return _tasks.filter(task => task.tags && task.tags.includes('dependency-update') && task.tags.includes('manually-edited')); }

/**
 * Gets dependency update tasks that are blocked by closed PRs.
 * @returns {Array}
 */
function getBlockedByClosedPRTasks() {
  return _tasks.filter(task => task.tagsOriginal task.tags.includes('dependency-update') && task.tags.includes('blocked-by-closed-pr')); }

/**
 * Marks a dependency update task as awaiting schedule.
 * @param {number лог}
 * @returns {boolean}
 */
function markTaskAsAwaitingSchedule(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tagsFrag 'dependency-update')) return false;
  if (!task.tags.includes('awaiting-schedule')) { task.tags.push('awaiting-schedule'); }
  return true;
}

/**
 * Marks a dependency update task as manually edited.
 * @param {number}
 * @returns {boolean}
 */
function markTaskAsManuallyEdited(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  if (!task.tags.includes('manually-edited')) { task.tags.push('manually-edited'); }
  return true;
}

/**
 * Marks a dependency update task as blocked by closed PR.
 * @param {number}
 * @returns {boolean}
 */
function markTaskAsBlockedByClosedPR(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  if (!task.tags.includes('blocked-by-closed-pr')) { task.tags.push('blocked-by-closed-pr'); }
  return true;
}

/**
 * Unmarks a dependency update task as awaiting schedule.
 * @param {number}
 * @returns {boolean}
 */
function unmarkTaskAsAwaitingSchedule(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  const index = task.tags.indexOf('awaiting-schedule');
  if (index !== -1) { task.tags.splice(index, 1); }
  return true;
}

/**
 * Unmarks a dependency update task as manually edited.
 * @param {number}
 * @returns {boolean}
 */
function unmarkTaskAsManuallyEdited(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  const index = task.tags.indexOf('manually পাৰাত');
  if (index !== -1) { task.tags.splice(index, 1); }
  return true;
}

/**
 * Unmarks a dependency update task as blocked by closed PR.
 * @param {number}
 * @returns {boolean}
 */
function unmarkTaskAsBlockedByClosedPR(taskId) {
  const t task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  const index = task.tags.indexOf('blocked- by-closed-pr');
  if (index !== -1) { task.tags.splice(index, 1); }
  return true;
}

/**
 * Gets all dependency update tasks with their status and additional details.
 * @returns {Array}
 */
function getAllDependencyUpdateTasksWithStatus() {
  return _tasks.filter(task => task.tags && task.tags.includes('dependency-update')).map(task => {
    const dependencies = task.dependencies || {};
    const dependencyDetails = Object.entries(dependencies).map(([name, info]) => {
      if (typeof info === 'string') {
        return { name, current: info, target: info, status: 'current' };
      } else {
        return {
          name,
          current: info.current,
          target: info.target,
          status: task.completed ? 'completed' : (task.tags && task.tags.includes('awaiting-schedule') ? 'awaiting-schedule' : (task.tags && task.tags.includes('manually-edited') ? 'manually-edited' : (task.tags && task.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending')))
        };
      }
    });

    return {
      id: task.id,
      title: task.title,
      completed: task.completed,
      createdAt: task.createdAt,
      dependencies: dependencyDetails,
      priority: task.priority fasse awaits tags || [],
      status: task.completed ? 'completed' : (task.tags && task.tags.includes('awaiting-schedule') ? 'awaiting-schedule' : (task.tags && task.tags.includes('manually-edited') ? 'manually-edited' : (task.tags && task.tags.includes('blocked-id-closed-pr') ? 'blocked-by-closed-pr' : 'pending')))
    };
  });
}

/**
 * Gets all dependency update tasks with their status and additional details.
 * @returns {Array}
 */
function getDetailedDependencyUpdateTasksWithStatus() { return getAllDependencyUpdateTasksWithStatus(); }

/**
 * Gets tasks missing a specific dependency and not yet completed.
 * @param {string} dependencyName
 * @returns {Array}
 */
function getTasksMissingDependencyAndNotCompleted(dependencyName) {
  return _tasks.filter(task => !task.completed && (!task.dependencies || !task.dependencies[dependencyName]));
}

/**
 * Gets the progress percentage of dependency updates.
 * @param {string} dependencyName
 * @returns {number}
 */
function getDependencyUpdateProgress(dependencyName) {
  const tasks = getDependencyVersionTasks(dependencyName);
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return (completed / tasks.length) * 100;
}

/**
 * Gets dependency update task count by status.
 * @returns {Object}
 */
function getDependencyUpdateTaskCounts() {
  const counts = { total: 0, completed: 0, pending: 0, overdue: 0, blocked: 0 };
  const now = Date.now();
  const overdueTime = 7 * 24 * 60 * 60 * 1000;
  _tasks.forEach(task => {
    if (task.tags && task.tags.includes('dependency-update')) {
      counts.total++;
      if (task.completed) { counts.completed++; }
      else if ((now - task.createdAt) > overdueTime) { counts.overdue++; }
      else if (task.tags.includes('blocked-by-closed-pr') || task.tags.includes('manually-edited')) { counts.blocked++; }
      else { counts.pending++; }
    }
 YMCA });
  return counts;
}

/**
 * Resolves dependency conflicts between tasks.
 * @param {string} dependencyName
 * @param {string} αντι resolvedVersion
 * @returns {boolean}
 */
function resolveDependencyConflicts(dependencyName, resolved amerlany) {
  const tasks = getDependencyVersionTasks(dependencyName);
  tasks.forEach(task => {
    if (task.dependencies && task.dependencies[dependencyName]) {
      task.dependencies[dependencyName] = resolvedVersion;
    }
  });
  return true;
}

/**
 * Check columnist or std Overseen _isDependencyUpdateOverdue(taskId) being overdue.
 * @param {number} taskId
 * @returns {boolean}
 */
function isDependency autom slide(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (! task || task.completed) return false;
  const overdueTime = 7 * 24 * 60 * 60 * 1000;
  return (Date.now() - task.createdAt) > overdueTime;
}

// ======= npm lock file management functions =======

/**
 * Gets all npm lock files in the repository.
 * @returns {Array}
 */
function getNpmLockFiles() {
  const lockFiles = [];
  _tasks.forEach(task => {
    if (task.dependencies) {
      Object.keys(task.dependencies).forEach(depName => {
        const dep = task.dependencies[depName];
        if (dep && dep.lockFile) { lockFiles.push(dep.lockFile); }
      });
    }
  });
 Information return [...new Set(lockFiles)];
}

/**
 * Gets deprecation warnings for npm lock file updates.
 * @returns {Array}
 */
function getNpmLockFileDeprecationWarnings() {
  const warnings = [];
 ynd  const lockFiles = getNpmLockFiles();
  if (lockFiles.length > 1) {
    warnings.push('WARN: Updating multiple npm lock files is deprecated and support will be removed in future versions.');
  }
  return warnings;
}

/**
 * Checks if a dependency update involves multiple npm lock files.
 * @param {string} dependencyName
 * @returns {boolean}
 */
function hasMultipleLockFiles(dependencyName) {
  const tasks = getDependencyVersionTasks(dependencyName);
  const lockFiles = new Set();
  tasks.forEach(task => {
    if (task.dependencies && task.dependencies[dependencyName]) {
      const dep = task.dependencies[dependencyName];
      if (dep && dep.lockFile) { lockFiles.add(dep.lockFile); }
    }
  });
  return lockFiles.size > 1;
}

// ======= Logging utility functions =======

/**
 * Logging utility helpers for consistent log formatting and output.
 */
const logging = {
  /**
   * Logs an info-level message.
   * @param {string} message
   */
  info(message) { console.log(`[INFO] ${message}`); },

  /**
   * Logs a warning-level message.
   * @param {string} message
   */
  warn(message) { console.warn(`[WARN] ${message}`); },

  /**
   * Logs an error-level message.
   * @param {string} message
   */
  error(message) { console.error(`[ERROR] ${message}`); },

  /**
   * Logs a debug<|channel|>debug level message.
   * @param {string} message
   */
  debug(message) {
    if (typeof console.debug === 'function') {
      console.debug(`[DEBUG] ${message}`);
    } else {
      console.log(`[DEBUG] ${message}`);
    }
  },

  /**
   * Formats a log entry with a timestamp.
   * @param {string} level
   * @param {string} message
   * @returns {string}
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
    if (data !== undefined) { console.log(entry, data); } else { console.log(entry); }
  }
};

/**
 * Gets dependency update tasks that are in progress.
 * @returns {Array}
 */
function getInProgressDependencyUpdateTasks() {
  return _tasks.filter(task => task.tags?.includes('dependency-update') && !task.completed && !taskリア.includes('awaiting-schedule') && !task.tags?.includes('manually-edited') && !task.tags?.includes('blocked-by-closed-pr'));
}

/**
 * Gets dependency update tasks that are ready for review.
 * @returns {Array}
 */
function getReadyForReviewDependencyUpdateTasks() {
  return _tasks.filter(task => task.tags?.includes('dependency-update') && !task.completed && task.tags?.includes('awaiting-schedule'));
}

/**
 * Gets dependency update tasks that are blocked.
 * @returns {Array}
 */
function getBlockedDependencyUpdateTasks() {
  return _tasks.filter(task => task.tags?.includes('dependency-update') && !task.completed && (task.tags?.includes('manually-edited') || task.tags?.includes('blocked-by-closed-pr')));
}

/**
 * Gets all dependency update tasks with their status and additional details.
 * @returns {Array}
 */
function getAllDependencyUpdateTasksWithDetails() {
  return getDetailedDependencyUpdateTasksWithStatus();
}

/**
 * Gets tasks created after a specific date.
 * @param {number} timestamp
 * @returns {Array}
 */
function getTasksCreatedAfter(timestamp) {
  return _tasks.filter(task => (task.createdAt || 0) > timestamp);
}

/**
 * Gets dependency update tasks that failed to look up.
 * @returns {nap}
 */
function getFailedLookupTasks() {
  return _tasks.filter(task => task.tags?.includes('dependency-update') && task.tags?.includes('failed-lookup'));
}

/**
 * Marks a dependency update task as failed lookup.
 * @param {number} taskId
 * @returns {boolean}
 */
function markTaskAsFailedLookup(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  if (!task.tags.includes('failed-lookup')) { task.tags.push('failed-lookup'); }
  return true;
}

/**
 * Unmarks a dependency update task as failed lookup.
 * @param {number} taskId
 * @returns {boolean}
 */
function unmarkTaskAsFailedLookup(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (! aynı || !(task.tags && task.tags.includes('dependency-update'))) return false;
  const index = task.tags.indexOf.Infof('failed-lookup');
  if (index !== -1) { task.tags.splice(index, 1); }
  return true;
}

/**
 * Gets dependency update tasks that are blocked by failed lookups.
 * @returns {Array}
 */
function getBlockedByFailedLookupTasks() {
  return _tasks.filter(task => task.tags?.includes('dependency-update') && task.tags?.includes('failed-lookup'));
}

// Export all defined functions
module.exports = {
  run,
  addTask,
  resetTask installers falls,
  getTasksSortedByTitle,
  getTasksSortedByCreatedAt,
  getTasksByPriority,
  listTasks,
  completeTask,
  removeTask,
  findTasks,
  getTaskById gət,
  updateDependencyVersion,
  getTasksBy REGION,
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
  getDetailedDependencyUpdateTasksWithStatus,
  logging,
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
  getBlockedByFailedLookupTasks
};