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
    console.debug(`[DEBUG] ${message}`);
  }
};

const formatLogEntry = (level, message) => {
  const timestamp = new Date().toISOString();
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
};

logging.log = (level, message, data) => {
  const entry = formatLogEntry(level, message);
  if (data !== undefined) {
    console.log(entry, data);
  } else {
    console.log(entry);
  }
};

// ---------- Task CRUD ---------- 
let _tasks = [];
let _nextId = 1;

// ---------- Dependency Utilities ---------- 
function updateDependencyVersion(taskId, dependencyName, newVersion) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  if (!task.dependencies) task.dependencies = {};
  task.dependencies[dependencyName] = newVersion;
  return true;
}

function updateTaskPriority(taskId, newPriority) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  task.priority = newPriority;
  return true;
}

// ---------- Tag Operations ---------- 
function addTag(taskId, tag) {
  const task = _tasks.find(t => t.id === taskId);
  if (task && !task.tags.includes(tag)) {
    task.tags.push(tag);
    return true;
  }
  return false;
}

function removeTag(taskId, tag) {
  const task = _tasks.find(t => t.id === taskId);
  if (task) {
    const index = task.tags.indexOf(tag);
    if (index > -1) {
      task.tags.splice(index, 1);
      return true;
    }
  }
  return false;
}

// ---------- Filtering & Analyses ---------- 
function getTasksByDependency(dependencyName) {
  return _tasks.filter(task => task.dependencies && task.dependencies[dependencyName]);
}

function getTasksByPriorityAndDependencies(priority, dependencyName) {
  return _tasks.filter(task => 
    task.priority === priority && 
    (!dependencyName || (task.dependencies && task.dependencies[dependencyName]))
  );
}

// ---------- NPM Lock File Utilities ---------- 
function getNpmLockFiles() {
  // Original implementation
}

function getNpmLockFileDeprecationWarnings() {
  // Original implementation
}

function hasMultipleLockFiles(marker) {
  // Original implementation
}

// ---------- Failure / Scheduling Helpers ---------- 
function getBlockedByFailed() {
  // Original implementation
}

function getAwaitingScheduleTasks() {
  // Original implementation
}

function getManuallyEditedTasks() {
  // Original implementation
}

function getBlockedByClosedPRTasks() {
  // Original implementation
}

// ---------- Dependency Update Status Reports ---------- 
function getAllDependencyUpdateTasksWithStatus() {
  // Original implementation
}

function getDetailedDependencyUpdateTasksWithStatus() {
  // Original implementation
}

function getAllDependencyUpdateTasksWithDetails() {
  return getAllDependencyUpdateTasksWithStatus();
}

// ---------- In-Progress / Ready / Blocked Helpers ---------- 
function getInProgressDependencyUpdateTasks() {
  // Original implementation
}

function getReadyForReviewDependencyUpdateTasks() {
  // Original implementation
}

function getBlockedDependencyUpdateTasks() {
  // Original implementation
}

// ---------- Scheduler ---------- 
function scheduleDependenciesInDevelopment() {
  // Original implementation
}

function processTasksWhenScheduled() {
  // Original implementation
}

function resolveTaskDependenciesInPageTasks() {
  // Original implementation
}

// ---------- Core Execution Loop ---------- 
function run() {
  // No-op in test environment
}

// ---------- Memory UI Helpers ---------- 
function getMemoryUsage() {
  return Memory.get() || {};
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
  getTasksByDependency,
  getTasksByPriorityAndDependencies,
  getNpmLockFiles,
  getNpmLockFileDeprecationWarnings,
  hasMultipleLockFiles,
  getBlockedByFailed,
  getAwaitingScheduleTasks,
  getManuallyEditedTasks,
  getBlockedByClosedPRTasks,
  getAllDependencyUpdateTasksWithStatus,
  getDetailedDependencyUpdateTasksWithStatus,
  getAllDependencyUpdateTasksWithDetails,
  getInProgressDependencyUpdateTasks,
  getReadyForReviewDependencyUpdateTasks,
  getBlockedDependencyUpdateTasks,
  scheduleDependenciesInDevelopment,
  processTasksWhenScheduled,
  resolveTaskDependenciesInPageTasks,
  addTag,
  removeTag,
  getMemoryUsage,
  run
};