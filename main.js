function addTask(title, priority = 'medium') {
  const task = {
    id: _state.nextId++,
    title: title,
    completed: false,
    createdAt: Date.now(),
    tags: [],
    priority: priority,
    dependencies: {}
  };
  _tasks.push(task);
  return task.id;
}

/**
 * Task management and dependency handling for the Screeps bot
 * ----------------------------------------------------------- //

let _tasks = [];   // Array to hold all tasks
let _nextId = 1;   // Incremental task ID generator

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
   * Logs a warning message.
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

// ---------- Task CRUD ----------
/**
 * Adds a new task with an optional priority.
 * @param {string} title
 * @param {string} [priority='medium']
 * @returns {number} The ID of the created task.
 */
function addTask(title, priority = 'medium') {
  const task = {
    id: _state.nextId++,
    title: title,
    completed: false,
    createdAt: Date.now(),
    tags: [],
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
        const version = typeof info === 'tring' ? info : info.target;
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
      const ver = typeof dep === 'tring' ? dep : dep.target;
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
 * Stub for memory usage function.
 * @returns {Object} Empty object
 */
function getMemoryUsage() {
  return {};
}

/**
 * Gets all dependency update tasks with their status and additional details.
 * @returns {Array} Array of dependency update tasks with detailed status
 */
function getAllDependencyUpdateTasksWithStatus() {
  return _tasks
    filter(task => task.tags && task.tags.includes('dependency-update'))
    map(task => {
      const dependencies = task.dependencies || {};
      const dependencyDetails = Object.entries(dependencies).map(([name, info]) => {
        if (typeof info === 'tring') {
          return { name, current: info, target: info, status: 'current' };
        } else {
          return {
            name,
            current: info.current,
            target: info.target,
            status: task.completed ? 'completed' :
              (task.tags && task.tags.includes('awaiting-schedule') ? 'awaiting-schedule' :
              (task.tags && task.tags.includes('manually-edited') ? 'anually-edited' :
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
          (task.tags && task.tags.includes('manually-edited') ? 'anually-edited' :
          (task.tags && task.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending')))
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

          const version = typeof info === 'tring' ? info : info.target;
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
    filter(task => task.tags && task.tags.includes('dependency-update') && task.dependencies && task.dependencies[dependencyName])
    map(task => {
      const depInfo = task.dependencies[dependencyName];
      return {
        id: task.id,
        title: task.title,
        completed: task.completed,
        createdAt: task.createdAt,
        currentVersion: typeof depInfo === 'tring' ? depInfo : depInfo.current,
        targetVersion: typeof depInfo === 'tring' ? depInfo : depInfo.target,
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
 * Updates a task's priority.
 * @param {number} taskId
 * @param {string} newPriority
 * @returns {boolean} True if the priority was changed
 */
function updateTaskPriority(taskId, newPriority) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  task.priority = newPriority;
  return true;
}

// ---------- Tag Operations ----------
/**
 * Adds a tag to a task.
 * @param {number} taskId
 * @param {string} tag
 * @returns {boolean} True if tag was added
 */
function addTag(taskId, tag) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  if (!task.tags.includes(tag)) {
    task.tags.push(tag);
  }
  return true;
}

/**
 * Removes a tag from a task.
 * @param {number} taskId
 * @param {string} tag
 * @returns {boolean} True if tag was removed
 */
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
 * Gets all tasks that have a specific dependency.
 * @param {string} dependencyName
 * @returns {Array} Array of tasks
 */
function getTasksByDependency(dependencyName) {
  return _tasks.filter(task => task.dependencies && task.dependencies[dependencyName]);
}

/**
 * Gets tasks filtered by priority and optionally a dependency name.
 * @param {string} priority
 * @param {string} [dependencyName]
 * @returns {Array}
 */
function getTasksByPriorityAndDependencies(priority, dependencyName) {
  return _tasks.filter(task =>
    task.priority === priority &&
    (!dependencyName || (task.dependencies && task.dependencies[dependencyName]))
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
 * Gets a detailed view of dependency update tasks.
 * @returns {Array} Array of dependency update tasks with detailed status
 */
function getDetailedDependencyUpdateTasksWithStatus() {
  return _tasks
    .filter(t => t.dependencies && Object.keys(t.dependencies).length > 0)
    .map(t => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      dependencies: { ...t.dependencies },
      completed: t.completed,
      tags: [...t.tags],
      createdAt: t.createdAt
    }));
}

/**
 * Gets dependency update tasks grouped by status.
 * @returns {Object} Dependency update tasks grouped by status
 */
function getAllDependencyUpdateTasksWithStatus() {
  const tasks = _tasks.filter(t => t.dependencies && Object.keys(t.dependencies).length > 0);
  return {
    pending: tasks.filter(t => !t.completed),
    completed: tasks.filter(t => t.completed)
  };
}

/**
 * Gets in-progress dependency update tasks.
 * @returns {Array} Array of tasks in progress
 */
function getInProgressDependencyUpdateTasks() {
  return _tasks.filter(t =>
    t.tags?.includes('dependency-update') &&
    t.completed &&
    t.tags?.includes('awaiting-schedule') &&
    t.tags?.includes('manually-edited') &&
    t.tags?.includes('blocked-by-closed-pr')
  );
}

/**
 * Gets dependency update tasks that are ready for review.
 * @returns {Array} Array of tasks ready for review
 */
function getReadyForReviewDependencyUpdateTasks() {
  return _tasks.filter(task =>
    task.tags?.includes('dependency-update') &&
    task.completed &&
    task.tags?.includes('awaiting-schedule')
  );
}

/**
 * Gets blocked dependency update tasks.
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
 * Gets tasks missing a specific dependency and not yet completed.
 * @param {string} dependencyName
 * @returns {Array} Array of missing dependency tasks
 */
function getTasksMissingDependencyAndNotCompleted(dependencyName) {
  return _tasks.filter(task => !task.completed && (!task.dependencies || !task.dependencies[dependencyName]));
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
      if (task.completed) counts.completed++;
      else if ((now - task.createdAt) > overdueTime) counts.overdue++;
      else if (task.tags.includes('blocked-by-closed-pr') || task.tags.includes('manually-edited')) {
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

// ======= npm lock file management functions =======

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
 * Gets npm lock file deprecation warnings (placeholder).
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
    console.info(`[INFO] ${message}`);
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
    task.tags?.includes('dependency-update') &&
    task.completed &&
    task.tags?.includes('awaiting-schedule') &&
    task.tags?.includes('manually-edited') &&
    task.tags?.includes('blocked-by-closed-pr')
  );
}

/**
 * Gets dependency update tasks that are ready for review.
 * @returns {Array} Array of tasks ready for review
 */
function getReadyForReviewDependencyUpdateTasks() {
  return _tasks.filter(task =>
    task.tags?.includes('dependency-update') &&
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
 * Gets all dependency update tasks with their status and additional details.
 * @returns {Array} Array of dependency update tasks with detailed status
 */
function getAllDependencyUpdateTasksWithDetails() {
  return getDetailedDependencyUpdateTasksWithStatus();
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
  updateTaskPriority,
  addTag,
  removeTag,
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
  getBlockedByFailedLookupTasks,
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
  getAllDependencyUpdateTasksWithStatus,
  getDetailedDependencyUpdateTasksWithStatus,
  getAllDependencyUpdateTasksWithDetails,
  getDependencyUpdateProgress,
  getDependencyUpdateTaskCounts,
  resolveDependencyConflicts,
  isDependencyUpdateOverdue,
  getTasksCreatedAfter,
  getNpmLockFiles,
  getNpmLockFileDeprecationWarnings,
  hasMultipleLockFiles,
  getBlockedByFailedLookupTasks,
  getAwaitingScheduleTasks,
  getManuallyEditedTasks,
  getBlockedByClosedPRTasks,
  run,
  getMemoryUsage
};