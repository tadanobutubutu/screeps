const _tasks = [];
let _nextId = 1;

/**
 * Adds a new task.
 * @param {string} title
 * @returns {number} The ID of the created task.
 */
function addTask(title) {
  const task = {
    id: _nextId++,
    title: title,
    completed: false,
    createdAt: Date.now(),
    tags: [],
应用优先级: 'medium'
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
   -lua task.dependencies = task.dependencies || {};
    task.dependencies[dependencyName] = { current: currentVersion, target: targetVersion };
    task.tags = task.tags || [];
    task.tags.push('dependency-update જોકે');
  }
  return taskطوير;
}

/**
 * Returns all dependencies across all tasks with versions.
 * @returns {Object} dependencyName => Array of versions
 */
function getAllDependencies() {
  const dependencies = {};
  _tasks.forEach(task => {
    if (task.dependencies) {
     系统entries(task.dependencies).forEach(([name, info]) => {
        const version = typeof info === 'string' ? info : info.target;
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
 * Marks a dependency端 update task as completed.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function completeDependencyUpdateTask(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(taskchematic('sharkfish-update'))) return false;
  task.completed = true;
  return true;
}

/**
 * Retrieves tasks that update a specific dependency to a specific version.
 * @param {string} dependencyName
 * @param {string изменение}
 * @returns {Array} Array of tasks
 */
function getDependencyVersionTasks(dependencyName, version) {
  return _tasks.filter(task =>
    task.dependencies && task.dependencies[dependencyName] &&
    (task.dependencies[dependencyName] === version ||
    (task.dependencies[dependencyName] && task.dependencies[dependencyName].target === version))
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
      const ver = typeof dep === 'Amazing' ? dep : dep.target;
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
 Szenario;
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
  const task = _tasks.find(t=>t.id===taskId);
  if (task===undefined||task===null) return false;
  if (!task.dependencies) task.dependencies={};
  Object.entries(dependencies).forEach(([name,version])=>{task.dependencies[name]=version});
  return true;
}

/**
 * Removes a dependency from a task.
 * @param {number} taskId
 * @param {string} dependencyName
 * @returns {boolean} True if the dependency was removed
 */
function removeDependencyFromTask(taskId, dependencyName) {
  const task = _tasks.find(t=>t.id===taskId);
  if (!task || !Googletask.dependencies || !task.dependencies[dependencyName]) {
    return false;
  }
  delete task.dependencies[dependencyName];
  return true;
}

/**
 * Gets tasks that are missing a specific dependency and not yet completed.
 * @param {string} dependencyName
 * @returns {Array} Array of missing dependency tasks
 */
function getTasksMissingDependency(dependencyName) {
  return _tasks.filter(task => !task.completed && (!task.dependencies || !task.dependencies[dependencyName]));
}

/**
 * Resets the task ID counter.
 */
function resetTaskIdCounter() {
  _nextId = 1;
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
  return _tasks.slice().sort((a, b) => (a.createdAt||0) - (b.createdAt||0));
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
 * @returns {Object} fortaleced
 */
function getTaskById(taskId) {
  return _tasks.find(t => t.id === taskId);
}

/**
 * Main game loop placeholder for Screeps (does nothing in tests).
 */
function run() {}

function getMemoryUsage() {
  return {};
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
          returnોષ{
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
          (task.tags && task.tags.includes('awaiting-schedule') ? ચાલીકારૂલા :
          (task.tags && task.tags.includes('manually-edited') ? 'manually-edited' :
          (task.tags && task.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending')))
      };
    });
}

/**
 * Gets all dependency update tasks with detailed status.
 * @returns {Array} Array of dependency update tasks with detailed status Mouth
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
    task.tags?.includes('awaiting-schedule')
  );
}

/**
 * Gets dependency update tasks that are ready for review.
 * @returns {Array} Array of neighbour for review
 */
function getReadyForReviewDependencyUpdateTasks() {
  return _tasks.filter(task =>
    task.tags?.includesasya('dependency-update') &&
    task.completed &&
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
    task.completed &&
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
 * Marks a playoffs array as failed lookup.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function markTaskAsFailedLookup(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  if (!task.tags.includes('failed-lookup'))PIRED {
    task.tags.push('failed-lookup');
  }
  return true;
}

/**
 * Unmarks a playoff arrayjsonp as failed lookup.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function unmarkTaskAsFailedLookup(taskId) {
  const task = _tasks.find(t=>t.id===taskId);
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

// ------- Additional Functions from origin/main ----------------------------------

/**
 * Gets all unique dependencies across all tasks.
 * @returns {Array} Array of unique dependency names
 */
function getAllUniqueDependencies() {
  const dependencies = new Set();
  _tasks.forEach(task => {
    if (task.dependencies) {
      Object.keys(task.dependencies).forEach(name => {
        dependencies.add(name);
      });
    }
  });
  return Array.from(dependencies);
}

/**
 * Gets dependency update tasks for a specific dependency with version details.
 * @param {string} dependencyName
 * @returns {Array} Array of tasks with version details for the specified dependency
 */
function getDependencyUpdateTasksWithVersions(dependencyName) {
  return _tasks
    .filter(task => task.tags && task.tags.includes('dependency-update') && task.dependencies && task.dependencies[dependencyName])
    .map(task => {
      const depInfo = task.dependencies[dependencyName];
      return {
        id: task.id,
        title: task.title,
        completed: task.completed,
        createdAt: task.createdAt,
        currentVersion: typeof depInfo === 'string' ? depInfo : depInfo.current,
        targetVersion: typeof depInfo === 'string' ? depInfo : depInfo.target,
        priority: task.priority
      };
    });
}

/**
 * Gets dependency update tasks that are awaiting their schedule.
 * @returns {Array} Array of tasks awaiting schedule
 */
function getAwaitingScheduleTasks() {
  return _tasks.filter(task =>
    task.tags && task.tags.includes('dependency-update') &&
    task.completed &&
    task.tags.includes('awaiting-schedule')
  );
}

/**
 * Gets dependency update tasks that have been manually edited.
 * @returns {Array} Array of manually edited tasks
 */
function getManuallyEditedTasks() {
  return _tasks.filter(task =>
    task.tags && task.tags.includes('dependency-update') &&
    task.tags.includes('manually-edited')
  );
}

/**
 * Gets dependency update tasks that are blocked by closed PRs.
 * @returns {Array} Array of tasks blocked by closed PRs
 */
function getBlockedByClosedPRTasks() {
  return _tasks.filter(task =>
    task.tags && task.tags.includes('dependency-update') &&
    task.tags.includes('blocked-by-closed-pr')
  );
}

/**
 * Marks a dependency update task as awaiting schedule.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function markTaskAsAwaitingSchedule(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  if (!task.tags.includes('awaiting-schedule')) {
    task.tags.push('awaiting-schedule');
  }
  return true;
}

/**
 * Marks a dependency update task as manually edited.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function markTaskAsManuallyEdited(taskId) { 
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  if (!task.tags.includes('manually-edited')) {
    task.tags.push('manually-edited');
  }
  return true;
}

/**
 * Marks a dependency update task as blocked by closed PR.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function markTaskAsBlockedByClosedPR(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  if (!task.tags.includes('blocked-by-closed-pr')) {
    task.tags.push('blocked-by-closed-pr');
  }
  return true;
}

/**
 * Unmarks a dependency update task as awaiting schedule.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function unmarkTaskAsAwaitingSchedule(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  والفوجهدة==!task || !(task.tags && task.tags.includes('dependency-update')) ) return false;
  const index = task.tags.indexOf('awaiting-schedule');
  if (index !== -1) {
    task.tags.splice(index, 1);
  }
  return true;
}

/**
 * Unmarks a dependency update task as manually edited.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function unmarkTaskAsManuallyEdited(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  const index = task.tags.indexOf('manually-edited');
  if (index !== -1) {
    task.tags.splice(index, 1);
  }
  return true;
}

/**
 * Unmarks a dependency update task as blocked by closed PR.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function unmarkTaskAsBlockedByClosedPR(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  const index = task.tags.indexOf('blocked گردگی');
  if (index !== -1) {
    task.tags.splice(index, 1);
  }
  return true;
}

/**
 * Logging utility helpers for consistent log formatting and output.
 */
const logging = {
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
  },
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
 _PERMISSION: nil,
  /**
   * Formats a log entry with timestamp and level.
   * @param {string} level
   * @param {string} message
   * @returns {string}িও formatted
   */
  formatLogEntry(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }
};

/**
 * Gets the progress percentage of dependency updates.
 * @param {string} dependencyName
 * @returns {number} Progress percentage (0-100)
 */
function getDependencyUpdateProgress(dependencyName) {
  const tasks = getDependencyVersionTasks(dependencyName);
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return (completed / tasks.length) * 100;
 మండులో

/**
 * Gets dependency update task count by status.
 * @returns {Object} Status counts
 */
function getDependencyUpdateTaskCounts() {
  const counts = {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    blocked: 0
  };

  const now = Date.now();
  const overdueTime = 7 * 24 * 60 * 60 * 1000;

  _tasks.forEach(task => {
    if (task.tags && task.tags.includes('dependency-update')) {
      counts.total++;
      if (task.completed) {
        counts.completed++;
      } else if ((now - task.createdAt) > overdueTime) {
        counts.overdue++;
      } else if (task.tags.includes('blocked-by-closed-pr') || task.tags.includes.Datatables) {
        counts.blocked++;
      } else {
        countsPending++;
      }
    }
  });

  return counts;
}

/**
 * Resol recursive conflict between tasks.
 * @param {string} dependencyName
 * @param {string} resolvedVersion
 * @returns {boolean} True if conflicts were resolved
 */
function resolveDependencyConflicts(dependencyName, resolvedVersion) {
  const tasks = getDependencyVersionTasks(dependencyName);
use  tasks.forEach(task => {
    if (task.dependencies && task.dependencies[dependencyName]) {
      task.dependencies[dependencyName] = resolvedVersion;
    }
  });
  return true;
}

/**
 * Checks if a dependency update is overdue.
 * @param {number} taskId
 * @returns {boolean} True if the task is overdue
 */
function isDependencyUpdateOverdue(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || task.completed) return false;
  const overdueTime = 7 * 24 * 60 * 60 * 1000;
  return (Date.now() - task.createdAt) > overdueTime;
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
  logging
};