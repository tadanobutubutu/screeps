// Task management and dependency handling for the Screeps bot
// ------------------------------------------------------------
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
  if (!task) return false;
  task.completed = true;
  return true;
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

function listTasks() {
  return _tasks.slice();
}

// ---------- Dependency Utilities ----------
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

function getDependencyUpdateTasksWithVersions(dependencyName) {
  return _tasks
    .filter(task =>
      task.tags?.includes('dependency-update') &&
      task.dependencies &&
      task.dependencies[dependencyName]
    )
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
 * Gets detailed dependency update tasks grouped by status.
 * @returns {Object}
 */
function getAllDependencyUpdateTasksWithDetails() {
  const pending = _tasks.filter(t =>
    t.dependencies && Object.keys(t.dependencies).length > 0 && !t.completed
  );
  const completed = _tasks.filter(t =>
    t.dependencies && Object.keys(t.dependencies).length > 0 && t.completed
  );
  return { pending, completed };
}

/**
 * Gets in-progress dependency update tasks.
 * @returns {Array}
 */
function getInProgressDependencyUpdateTasks() {
  return _tasks.filter(t =>
    t.dependencies && Object.keys(t.dependencies).length > 0 && !t.completed &&
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

function getDependencyUpdateTasksByStatus() {
  const result = { completed: [], pending: [] };
  const now = Date.now();
  const overdueTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  _tasks.forEach(task => {
    if (task.tags?.includes('dependency-update')) {
      const taskInfo = {
        id: task.id,
        title: task.title,
        createdAt: task.createdAt,
        dependencies: task.dependencies || {},
        priority: task.priority
      };
      if (task.completed) {
        result.completed.push(taskInfo);
      } else if (now - task.createdAt > overdueTime) {
        result.pending.push(taskInfo);
      }
    }
  });
  return result;
}

function getTasksCreatedAfter(timestamp) {
  return _tasks.filter(task => (task.createdAt || 0) > timestamp);
}

function getTasksMissingDependencyAndNotCompleted(dependencyName) {
  return _tasks.filter(task =>
    !task.completed &&
    (!task.dependencies || !task.dependencies[dependencyName])
  );
}

function getDependencyUpdateProgress(dependencyName) {
  const tasks = getDependencyUpdateTasksWithVersions(dependencyName);
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return (completed / tasks.length) * 100;
}

function getDependencyUpdateTaskCounts() {
  const counts = {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  };
  const now = Date.now();
  const overdueTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  _tasks.forEach(task => {
    if (task.tags?.includes('dependency-update')) {
      counts.total++;
      if (task.completed) counts.completed++;
      else if (now - task.createdAt > overdueTime) counts.overdue++;
      else counts.pending++;
    }
  });
  return counts;
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

/**
 * Gets tasks awaiting schedule (placeholder).
 * @returns {Array}
 */
function getAwaitingScheduleTasks() {
  return _tasks.filter(t => t.tags.includes('awaiting-schedule'));
}

/**
 * Gets tasks manually edited (placeholder).
 * @returns {Array}
 */
function getManuallyEditedTasks() {
  return _tasks.filter(t => t.tags.includes('manually-edited'));
}

/**
 * Gets tasks blocked by closed PRs (placeholder).
 * @returns {Array}
 */
function getBlockedByClosedPRTasks() {
  return _tasks.filter(t => t.tags.includes('blocked-closed-pr'));
}

// ---------- Scheduler ----------
/**
 * Schedules dependencies in development (placeholder).
 * @returns {void}
 */
function scheduleDependenciesInDevelopment() {
  logging.info('Scheduling dependencies in development...');
}

/**
 * Processes tasks when scheduled (placeholder).
 * @returns {void}
 */
function processTasksWhenScheduled() {
  logging.info('Processing scheduled tasks...');
}

/**
 * Resolves task dependencies in page tasks (placeholder).
 * @returns {void}
 */
function resolveTaskDependenciesInPageTasks() {
  logging.info('Resolving task dependencies in page tasks...');
}

/**
 * Main game loop placeholder for Screeps (does nothing in tests).
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
    nextId: _nextId,
    memory: typeof process !== 'undefined' ? process.memoryUsage() : {}
  };
}

// ---------- Exports ----------
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
  removeDependencyFromTask,
  addTag,
  removeTag,
  getTasksByDependency,
  getTasksByPriorityAndDependencies,
  getAllDependencyUpdateTasksWithStatus,
  getAllDependencyUpdateTasksWithDetails,
  getInProgressDependencyUpdateTasks,
  getReadyForReviewDependencyUpdateTasks,
  getBlockedDependencyUpdateTasks,
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
  run,
  getMemoryUsage,
  getDependencyUpdateTasksByStatus,
  getTasksCreatedAfter,
  getTasksMissingDependencyAndNotCompleted,
  getDependencyUpdateProgress,
  getDependencyUpdateTaskCounts
};