// Task management and dependency handling for the Screeps bot
// ------------------------------------------------------------
let _tasks = [];
const _state = { nextId: 1 };

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

// ---------- Task CRUD ----------
/**
 * Adds a new task with an optional priority and tags.
 * @param {string} title
 * @param {string} [priority='medium']
 * @param {string[]} [tags=[]]
 * @returns {number} The ID of the created task.
 */
function addTask(title, priority = 'medium', tags = []) {
  const task = {
    id: _state.nextId++,
    title: title,
    completed: false,
    createdAt: Date.now(),
    tags: [...tags],
    priority: priority,
    dependencies: {}
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
  if (!task) return false;
  if (!task.dependencies) task.dependencies = {};
  task.dependencies[dependencyName] = newVersion;
  return true;
}

/**
 * Updates the priority of a task.
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
 * Removes a dependency from a task.
 * @param {number} taskId
 * @param {string} dependencyName
 * @returns {boolean} True if the dependency was removed
 */
function removeTaskDependency(taskId, dependencyName) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.dependencies || !task.dependencies[dependencyName]) {
    return false;
  }
  delete task.dependencies[dependencyName];
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
  const taskId = addTask(title, 'medium', ['dependency-update']);
  const task = _tasks.find(t => t.id === taskId);
  if (task) {
    if (!task.dependencies) task.dependencies = {};
    task.dependencies[dependencyName] = { current: currentVersion, target: targetVersion };
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
 * @param {string} [version]
 * @returns {Array} Array of tasks
 */
function getDependencyVersionTasks(dependencyName, version) {
  if (version) {
    return _tasks.filter(task =>
      task.dependencies && task.dependencies[dependencyName] &&
      (task.dependencies[dependencyName] === version ||
      (task.dependencies[dependencyName] && task.dependencies[dependencyName].target === version))
    );
  }
  return _tasks.filter(task =>
    task.dependencies && task.dependencies[dependencyName]
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
 * Updates multiple dependency versions in a task (simple string versions).
 * @param {number} taskId
 * @param {Object} dependencies - Object with dependency names as keys and versions as values
 * @returns {boolean} True if the update was successful
 */
function updateDependencyVersions(taskId, dependencies) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;

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
  if (!task) return false;
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
  return _tasks.filter(task => !task.completed && (!task.dependencies || !task.dependencies[dependencyName]));
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
 * Gets tasks filtered by priority and optionally a dependency name.
 * @param {string} priority
 * @param {string} [dependencyName]
 * @returns {Array}
 */
function getTasksByPriorityAndDependencies(priority, dependencyName) {
  return _tasks.filter(task => {
    if (task.priority !== priority) return false;
    if (dependencyName) {
      return task.dependencies && task.dependencies[dependencyName];
    }
    return true;
  });
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
  if (!task) return false;
  task.completed = true;
  return true;
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
  return _tasks.find(t => t.id === taskId) || null;
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
 * Gets detailed dependency update tasks (alias for getAllDependencyUpdateTasksWithStatus).
 * @returns {Array} Array of dependency update tasks with detailed status
 */
function getDetailedDependencyUpdateTasks() {
  return getAllDependencyUpdateTasksWithStatus();
}

/**
 * Gets detailed dependency update tasks with status (alias).
 * @returns {Array} Array of dependency update tasks with detailed status
 */
function getDetailedDependencyUpdateTasksWithStatus() {
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
 * Gets dependency update tasks that are in progress.
 * @returns {Array} Array of in-progress tasks
 */
function getInProgressDependencyUpdateTasks() {
  return _tasks.filter(task =>
    task.dependencies && Object.keys(task.dependencies).length > 0 &&
    !task.completed &&
    task.tags && task.tags.includes('in-progress')
  );
}

/**
 * Gets dependency update tasks that are ready for review.
 * @returns {Array} Array of ready-for-review tasks
 */
function getReadyForReviewDependencyUpdateTasks() {
  return _tasks.filter(task =>
    task.dependencies && Object.keys(task.dependencies).length > 0 &&
    !task.completed &&
    task.tags && task.tags.includes('ready-for-review')
  );
}

/**
 * Gets dependency update tasks that are blocked.
 * @returns {Array} Array of blocked tasks
 */
function getBlockedDependencyUpdateTasks() {
  return _tasks.filter(task =>
    task.dependencies && Object.keys(task.dependencies).length > 0 &&
    !task.completed &&
    task.tags && task.tags.includes('blocked')
  );
}

/**
 * Gets dependency update tasks that have failed lookup.
 * @returns {Array} Array of failed lookup tasks
 */
function getFailedLookupTasks() {
  return _tasks.filter(task =>
    task.tags && task.tags.includes('dependency-update') &&
    task.tags.includes('failed-lookup')
  );
}

/**
 * Gets dependency update tasks blocked by failed lookup.
 * @returns {Array} Array of tasks blocked by failed lookup
 */
function getBlockedByFailedLookupTasks() {
  return _tasks.filter(task =>
    task.tags && task.tags.includes('dependency-update') &&
    task.tags.includes('blocked-by-failed-lookup')
  );
}

/**
 * Marks a task as having failed lookup.
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
 * Unmarks a task as having failed lookup.
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

// ---------- Tag Operations ----------
function addTag(taskId, tag) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  if (!task.tags.includes(tag)) {
    task.tags.push(tag);
  }
  return true;
}

function removeTag(taskId, tag) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  const index = task.tags.indexOf(tag);
  if (index !== -1) {
    task.tags.splice(index, 1);
    return true;
  }
  return false;
}

// ---------- Filtering & Analyses ----------
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
}

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
      } else if (task.tags.includes('blocked-by-closed-pr') || task.tags.includes('manually-edited')) {
        counts.blocked++;
      } else {
        counts.pending++;
      }
    }
  });

  return counts;
}

/**
 * Resolves dependency conflicts between tasks.
 * @param {string} dependencyName
 * @param {string} resolvedVersion
 * @returns {boolean} True if conflicts were resolved
 */
function resolveDependencyConflicts(dependencyName, resolvedVersion) {
  const tasks = getDependencyVersionTasks(dependencyName);
  tasks.forEach(task => {
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

// ---------- NPM Lock File Utilities ----------

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

// ---------- Scheduler ----------
/**
 * Schedules dependencies in development.
 * @returns {void}
 */
function scheduleDependenciesInDevelopment() {
  logging.info('Scheduling dependencies in development...');
}

/**
 * Processes tasks when scheduled.
 * @returns {void}
 */
function processTasksWhenScheduled() {
  logging.info('Processing scheduled tasks...');
}

/**
 * Resolves task dependencies in page tasks.
 * @returns {void}
 */
function resolveTaskDependenciesInPageTasks() {
  logging.info('Resolving task dependencies in page tasks...');
}

/**
 * Main game loop placeholder for Screeps.
 */
function run() {
  logging.info('Bot execution loop started');
  scheduleDependenciesInDevelopment();
  processTasksWhenScheduled();
  resolveTaskDependenciesInPageTasks();
}

// ---------- Memory UI Helpers ----------
/**
 * Gets memory usage statistics.
 * @returns {Object}
 */
function getMemoryUsage() {
  return {
    taskCount: _tasks.length,
    nextId: _state.nextId,
    memory: typeof process !== 'undefined' ? process.memoryUsage() : {}
  };
}

/**
 * Gets tasks created after a specific timestamp.
 * @param {number} timestamp
 * @returns {Array} Array of tasks created after the timestamp
 */
function getTasksCreatedAfter(timestamp) {
  return _tasks.filter(task => task.createdAt > timestamp);
}

// ---------- Exports ----------
module.exports = {
  run,
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
  getDetailedDependencyUpdateTasksWithStatus,
  getAllDependencyUpdateTasksWithDetails,
  getDependencyUpdateTasks,
  getDependencyVersionTasks,
  getDependencyVersions,
  updateDependencyVersions,
  addDependenciesToTask,
  removeDependencyFromTask,
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
  getFailedLookupTasks,
  markTaskAsFailedLookup,
  unmarkTaskAsFailedLookup,
  markTaskAsAwaitingSchedule,
  markTaskAsManuallyEdited,
  markTaskAsBlockedByClosedPR,
  unmarkTaskAsAwaitingSchedule,
  unmarkTaskAsManuallyEdited,
  unmarkTaskAsBlockedByClosedPR,
  resetTaskIdCounter,
  getDependencyUpdateTasksWithVersions,
  getAllDependencies,
  getAllUniqueDependencies,
  addDependencyUpdateTask,
  completeDependencyUpdateTask,
  getDependencyUpdateSummary,
  getDependencyUpdateTasksByStatus,
  getTasksCreatedAfter
};