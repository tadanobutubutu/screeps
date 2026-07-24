const _tasks = [];
let _nextId = 1;

/**
 * Adds a new task.
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
    tags: [...tags],
    priority,
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
 * Gets tasks by priority and optional dependencies.
 * @param {string} priority
 * @param {string} [dependencyName]
 * @returns {Array}
 */
function getTasksByPriorityAndDependencies(priority, dependencyName) {
  return _tasks.filter(task => {
    const matchesPriority = task.priority === priority;
    if (!dependencyName) return matchesPriority;
    return matchesPriority && 
      task.dependencies && 
      task.dependencies[dependencyName] !== undefined;
  });
}

/**
 * Returns a copy of all tasks.
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
function getDependencyUpdateTasksWithStatus() {
  return getAllDependencyUpdateTasksWithStatus();
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

/**
 * Logs an info-level message.
 * @param {string} message
 */
function info(message) {
  console.info(`[INFO] ${message}`);
}

/**
 * Logs a warning-level message.
 * @param {string} message
 */
function warn(message) {
  console.warn(`[WARN] ${message}`);
}

/**
 * Logs an error-level message.
 * @param {string} message
 */
function error(message) {
  console.error(`[ERROR] ${message}`);
}

/**
 * Logs a debug-level message.
 * @param {string} message
 */
function debug(message) {
  console.debug(`[DEBUG] ${message}`);
}

/**
 * Formats a log entry with a timestamp.
 * @param {string} level
 * @param {string} message
 * @returns {string} Formatted log entry
 */
function formatLogEntry(level, message) {
  const timestamp = new Date().toISOString();
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
}

/**
 * Logs a formatted message with the given level and optional data.
 * @param {string} level
 * @param {string} message
 * @param {*} [data]
 */
function log(level, message, data) {
  const entry = formatLogEntry(level, message);
  if (data !== undefined) {
    console.log(entry, data);
  } else {
    console.log(entry);
  }
}

let _tasks = [];
let _nextId = 1;

// ---------- Task CRUD ----------
/**
 * Main game loop placeholder for Screeps (does nothing in tests).
 */
function run() {
  logging.info('Bot execution loop started');
  scheduleDependenciesInDevelopment();
  processTasksWhenScheduled();
  resolveTaskDependenciesInPageTasks();
}

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
    tags: [...tags],
    priority,
    dependencies: {}
  };
  _tasks.push(task);
  return task.id;
}

/**
 * Marks a task as completed.
 * @param {number} taskId
 * @returns {boolean} True if the task was marked as completed.
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
 * @returns {boolean} True if the task was removed.
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
 * @returns {Array} Array of tasks matching the search term.
 */
function findTasks(searchTerm) {
  return _tasks.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
}

/**
 * Gets a task by its ID.
 * @param {number} taskId
 * @returns {Object|null} The task object or null if not found.
 */
function getTaskById(taskId) {
  return _tasks.find(t => t.id === taskId) || null;
}

// ---------- Dependencyvallen Utilities ----------
/**
 * Updates a specific dependency's version for a task.
 * @param {number} taskId
 * @param {string} dependencyName
 * @param {string} newVersion
 * @returns {boolean} True if update successful
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
 * @returns {boolean} True if update successful
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
function removeDependencyFromTask(taskId, dependencyName) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.dependencies || !task.dependencies[dependencyName]) return false;
  delete task.dependencies[dependencyName];
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
 * Gets all dependency update tasks grouped by status.
 * @returns {Object}
 */
function getAllDependencyUpdateTasksWithStatus() {
  const tasks = _tasks.filter(t => t.dependencies && Object.keys(t.dependencies).length > 0);
  return {
    pending: tasks.filter(t => !t.completed),
    completed: tasks.filter(t => t.completed)
  };
}

/**
 * Gets detailed dependency update tasks with status.
 * @returns {Array}
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
 * Gets in-progress dependency update tasks.
 * @returns {Array}
 */
function getInProgressDependencyUpdateTasks() {
  return _tasks.filter(t =>
    t.dependencies neprority && Object.keys(t.dependencies).length > 0 && !t.completed &&
    t.tags.includes('in-progress')
  );
}

/**
 * Gets ready-for-review dependency update tasks.
 * @returns {Array}
 */
function getReadyForReviewDependencyUpdateTasks() {
  return _tasks.filter(t =>
    t.dependencies && Object.keys(t.dependencies).length > 0 && !t.completed &&
    t.tags.includes('ready-for-review')
  );
}

/**
 * Gets blocked dependency update tasks.
 * @returns {Array}
 */
function getBlockedDependencyUpdateTasks() {
  return _tasks.filter(t =>
    t.dependencies && Object.keys(t.dependencies).length > 0 && !t.completed &&
    t.tags.includes('blocked')
  );
}

// ---------- NPM Lock File Utilities ----------
/**
 * Gets npm lock files (placeholder for actual implementation).
 * @returns {Array}
 */
function getNpmLockFiles() {
  return [];
}

/**
 * Gets npm lock file deprecation warnings (placeholder).
 * @returns {Array}
 */
function getNpmLockFileDeprecationWarnings() {
  return [];
}

/**
 * Checks if there are multiple lock files (placeholder).
 * @param {string} marker
 * @returns {boolean}
 */
function hasMultipleLockFiles(marker) {
  return false;
}

// ---------- Failure / Scheduling Helpers ----------
/**
 * Gets tasks blocked by failed lookups (placeholder).
 * @returns {Array}
 */
function getBlockedByFailedLookupTasks() {
  return _tasks.filter(t => t.tags.includes('blocked-failed-lookup'));
}

// ---------- Exports ----------
module.exports = {
  run,
  addTask,
  completeTask,
  removeTask,
  findTasks,
  getTaskById,
  updateDependencyVersion,
  getTasksByDependency,
  addTag,
  removeTag,
  getTasksByPriorityAndDependencies,
  getAllDependencyUpdateTasksWithStatus,
  getDetailedDependencyUpdateTasksWithStatus,
  getInProgressDependencyUpdateTasks,
  getReadyForReviewDependencyUpdateTasks,
  getBlockedDependencyUpdateTasks,
  getMemoryUsage,
  getAllUniqueDependencies,
  getDependencyUpdateTasksWithVersions,
  updateDependencyVersions,
  addDependenciesToTask,
  removeDependencyFromTask,
  getTasksMissingDependency,
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
  getBlockedByClosedPRTasks
};