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
 * Gets all dependency update tasks with their status.
 * @returns {Array} Array of dependency update tasks with status
 */
function getAllDependencyUpdateTasksWithStatus() {
  return _tasks
    .filter(task => task.tags && task.tags.includes('dependency-update'))
    .map(task => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      dependencies: task.dependencies || {},
      createdAt: task.createdAt
    }));
}

/**
 * Groups dependency update tasks by dependency name.
 * @returns {Object} Object with dependency names as keys and arrays of tasks as values
 */
function getDependencyUpdateTasksGroupedByName() {
  const grouped = {};

  _tasks.forEach(task => {
    if (task.tags && task.tags.includes('dependency-update') && task.dependencies) {
      Object.keys(task.dependencies).forEach(depName => {
        if (!grouped[depName]) grouped[depName] = [];
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

/**
 * Provides statistics about dependency updates.
 * @returns {Object} Statistics about dependency updates
 */
function getDependencyUpdateStatistics() {
  const stats = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    dependencies: {}
  };

  _tasks.forEach(task => {
    if (task.tags && task.tags.includes('dependency-update')) {
      stats.totalTasks++;
      if (task.completed) stats.completedTasks++;
      else stats.pendingTasks++;

      if (task.dependencies) {
        Object.entries(task.dependencies).forEach(([depName, versionInfo]) => {
          if (!stats.dependencies[depName]) {
            stats.dependencies[depName] = { count: 0, versions: new Set() };
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
  Object.keys(stats.dependencies).forEach(depName => {
    stats.dependencies[depName].versions = Array.from(stats.dependencies[depName].versions);
  });

  return stats;
}

/**
 * Retrieves dependency update tasks that target a specific version.
 * @param {string} version
 * @returns {Array} Array of tasks that update to the specified version
 */
function getDependencyUpdateTasksForVersion(version) {
  return _tasks.filter(task => {
    if (!task.tags || !task.tags.includes('dependency-update') || !task.dependencies) return false;
    return Object.values(task.dependencies).some(depInfo => {
      return (typeof depInfo === 'string' && depInfo === version) ||
        (depInfo && depInfo.target === version);
    });
  });
}

/**
 * Gets overdue dependency update tasks.
 * @param {number} daysOverdue Number of days to consider as overdue
 * @returns {Array} Array of overdue dependency update tasks
 */
function getOverdueDependencyUpdateTasks(daysOverdue) {
  daysOverdue = daysOverdue || 7;
  const now = Date.now();
  const overdueTime = daysOverdue * 24 * 60 * 60 * 1000;

  return _tasks.filter(task => {
    return task.tags && task.tags.includes('dependency-update') &&
      !task.completed &&
      (now - task.createdAt) > overdueTime;
  });
}

/**
 * Gets all dependency update tasks with their status and additional details.
 * @returns {Array} Array of dependency update tasks with detailed status
 */
function getDetailedDependencyUpdateTasks() {
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
               task.tags && task.tags.includes('manually-edited') ? 'manually-edited' :
               task.tags && task.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending')
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
                 task.tags && task.tags.includes('manually-edited') ? 'manually-edited' :
                 task.tags && task.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending')
      };
    });
}

/**
 * Gets a summary of dependency updates by status.
 * @returns {Object} Summary of dependency updates by status
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
            summary.byDependency[name] = {
              total: 0,
              completed: 0,
              pending: 0,
              versions: new Set()
            };
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

  // Convert sets to arrays and calculate percentages
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
 * @returns {Object} Dependency update tasks grouped by status
 */
function getDependencyUpdateTasksByStatus() {
  const result = {
    completed: [],
    pending: [],
    overdue: []
  };

  const now = Date.now();
  const overdueTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  _tasks.forEach(task => {
    if (task.tags && task.tags.includes('dependency-update')) {
      const taskInfo = {
        id: task.id,
        title: task.title,
        createdAt: task.createdAt,
        dependencies: task.dependencies || {},
        priority: task.priority
      };

      if (task.completed) {
        result.completed.push(taskInfo);
      } else if ((now - task.createdAt) > overdueTime) {
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
    !task.completed &&
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
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
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
  const index = task.tags.indexOf('blocked-by-closed-pr');
  if (index !== -1) {
    task.tags.splice(index, 1);
  }
  return true;
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
    console.log(`[DEBUG] ${message}`);
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

/**
 * Gets dependency update tasks that are in progress.
 * @returns {Array} Array of tasks in progress
 */
function getInProgressDependencyUpdateTasks() {
  return _tasks.filter(task =>
    task.tags && task.tags.includes('dependency-update') &&
    !task.completed &&
    !task.tags.includes('awaiting-schedule') &&
    !task.tags.includes('manually-edited') &&
    !task.tags.includes('blocked-by-closed-pr')
  );
}

/**
 * Gets dependency update tasks that are ready for review.
 * @returns {Array} Array of tasks ready for review
 */
function getReadyForReviewDependencyUpdateTasks() {
  return _tasks.filter(task =>
    task.tags && task.tags.includes('dependency-update') &&
    !task.completed &&
    task.tags.includes('awaiting-schedule')
  );
}

/**
 * Gets dependency update tasks that are blocked.
 * @returns {Array} Array of blocked tasks
 */
function getBlockedDependencyUpdateTasks() {
  return _tasks.filter(task =>
    task.tags && task.tags.includes('dependency-update') &&
    !task.completed &&
    (task.tags.includes('manually-edited') || task.tags.includes('blocked-by-closed-pr'))
  );
}

/**
 * Gets all dependency update tasks with their status and additional details.
 * @returns {Array} Array of dependency update tasks with detailed status
 */
function getAllDependencyUpdateTasksWithDetails() {
  return getDetailedDependencyUpdateTasksWithStatus();
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
              (task.tags && task.tags.includes('awaiting-schedule') ? 'awaiting-schedule' :
               task.tags && task.tags.includes('manually-edited') ? 'manually-edited' :
               task.tags && task.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending')
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
                 task.tags && task.tags.includes('manually-edited') ? 'manually-edited' :
                 task.tags && task.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending')
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
  getDetailedDependencyUpdateTasks,
  getDependencyUpdateSummary,
  getDependencyUpdateTasksByStatus,
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
  getInProgressDependencyUpdateTasks,
  getReadyForReviewDependencyUpdateTasks,
  getBlockedDependencyUpdateTasks,
  getAllDependencyUpdateTasksWithDetails,
  getDetailedDependencyUpdateTasksWithStatus,
  logging
};