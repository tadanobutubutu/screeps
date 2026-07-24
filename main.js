const logging = {
  info(message) {
    console.info(`[INFO] ${message}`);
  },
  warn(message) {
    console.warn(`[WARN] ${message}`);
  },
  error(message) {
    console.error(`[ERROR] ${message}`);
  },
  debug(message) {
    console.debug(`[DEBUG] ${message}`);
  },
  formatLogEntry(level, message) {
    const timestamp = new Date().toISOString();
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
  },
  log(level, message, data) {
    const entry = this.formatLogEntry(level, message);
    if (data !== undefined) {
      console.log(entry, data);
    } else {
      console.log(entry);
    }
  },
};

const _tasks = [];
let _nextId = 1;

// ---------- Task CRUD ----------
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

function resetTaskIdCounter() {
  _nextId = 1;
}

function getTasksSortedByTitle() {
  return _tasks.slice().sort((a, b) => a.title.localeCompare(b.title));
}

function getTasksSortedByCreatedAt() {
  return _tasks.slice().sort((a, b) => a.createdAt - b.createdAt);
}

function getTasksByPriority(priority) {
  return _tasks.filter(task => task.priority === priority);
}

function listTasks() {
  return _tasks.slice();
}

function completeTask(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = true;
    return true;
  }
  return false;
}

function removeTask(taskId) {
  const index = _tasks.findIndex(t => t.id === taskId);
  if (index !== -1) {
    _tasks.splice(index, 1);
    return true;
  }
  return false;
}

function findTasks(searchTerm) {
  return _tasks.filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
}

function getTaskById(taskId) {
  return _tasks.find(t => t.id === taskId) || null;
}

function updateTaskPriority(taskId, newPriority) {
  const task = _tasks.find(t => t.id === taskId);
  if (task) {
    task.priority = newPriority;
    return true;
  }
  return false;
}

/**
 * Finds tasks by dependency name.
 * @param {string} dependencyName
 * @returns {Array} Array of tasks with the specified dependency
 */
function getTasksByDependency(dependencyName) {
  return _tasks.filter(task => task.dependencies && task.dependencies[dependencyName]);
}

/**
 * Updates a specific dependency's version for a task.
 * @param {number} taskId
 * @param {string} dependencyName
 * @param {string} newVersion
 * @returns {boolean} True if update successful
 */
function updateDependencyVersion(taskId, dependencyName, newVersion) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.dependencies) return false;
  if (!task.dependencies[dependencyName]) {
    logging.warn(`Dependency ${dependencyName} not found in task ${taskId}`);
    return false;
  }
  const oldVersion = task.dependencies[dependencyName];
  task.dependencies[dependencyName] = newVersion;
  logging.info(`Updated ${dependencyName} from ${oldVersion} to ${newVersion} in task ${taskId}`);
  return true;
}

/**
 * Adds a dependency update task.
 * @param {string} title
 * @param {Object} dependencies
 * @param {string} [priority]
 * @returns {number} The id of the created task
 */
function addDependencyUpdateTask(title, dependencies, priority) {
  const task = {
    id: _nextId++,
    title,
    completed: false,
    createdAt: Date.now(),
    tags: ['dependency-update'],
    priority: priority || 'medium',
    dependencies
  };
  _tasks.push(task);
  return task.id;
}

/**
 * Gets all dependencies across all tasks.
 * @returns {Object} Map of dependency names to versions
 */
function getAllDependencies() {
  const allDeps = {};
  _tasks.forEach(task => {
    if (task.dependencies) {
      Object.entries(task.dependencies).forEach(([name, version]) => {
        if (!allDeps[name]) {
          allDeps[name] = [];
        }
        if (typeof version === 'string') {
          allDeps[name].push(version);
        } else if (version.current) {
          allDeps[name].push(version.current);
        }
      });
    }
  });
  return allDeps;
}

/**
 * Gets all dependency update tasks.
 * @returns {Array} Array of dependency update tasks
 */
function getDependencyUpdateTasks() {
  return _tasks.filter(task => task.tags && task.tags.includes('dependency-update'));
}

/**
 * Completes a dependency update task.
 * @param {number} taskId
 * @returns {boolean} True if successful
 */
function completeDependencyUpdateTask(taskId) {
  return completeTask(taskId);
}

/**
 * Gets dependency version tasks for a specific dependency.
 * @param {string} dependencyName
 * @returns {Array} Array of tasks with the specified dependency
 */
function getDependencyVersionTasks(dependencyName) {
  return _tasks.filter(task => task.dependencies && task.dependencies[dependencyName]);
}

/**
 * Gets dependency versions for a specific dependency.
 * @param {string} dependencyName
 * @returns {Array} Array of version strings
 */
function getDependencyVersions(dependencyName) {
  const versions = [];
  _tasks.forEach(task => {
    if (task.dependencies && task.dependencies[dependencyName]) {
      const version = task.dependencies[dependencyName];
      if (typeof version === 'string') {
        versions.push(version);
      } else if (version.current) {
        versions.push(version.current);
      }
    }
  });
  return [...new Set(versions)];
}

/**
 * Updates dependency versions for a specific dependency across all tasks.
 * @param {string} dependencyName
 * @param {string} newVersion
 * @returns {number} Number of tasks updated
 */
function updateDependencyVersions(dependencyName, newVersion) {
  let count = 0;
  _tasks.forEach(task => {
    if (task.dependencies && task.dependencies[dependencyName]) {
      task.dependencies[dependencyName] = newVersion;
      count++;
    }
  });
  return count;
}

/**
 * Adds dependencies to a task.
 * @param {number} taskId
 * @param {Object} dependencies
 * @returns {boolean} True if successful
 */
function addDependenciesToTask(taskId, dependencies) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  if (!task.dependencies) {
    task.dependencies = {};
  }
  Object.assign(task.dependencies, dependencies);
  return true;
}

/**
 * Removes a dependency from a task.
 * @param {number} taskId
 * @param {string} dependencyName
 * @returns {boolean} True if successful
 */
function removeDependencyFromTask(taskId, dependencyName) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.dependencies || !task.dependencies[dependencyName]) return false;
  delete task.dependencies[dependencyName];
  return true;
}

/**
 * Gets tasks missing a specific dependency.
 * @param {string} dependencyName
 * @returns {Array} Array of tasks missing the dependency
 */
function getTasksMissingDependency(dependencyName) {
  return _tasks.filter(task => !task.dependencies || !task.dependencies[dependencyName]);
}

/**
 * Gets memory usage information.
 * @returns {Object} Memory usage data
 */
function getMemoryUsage() {
  return process.memoryUsage() || {};
}

/**
 * Gets all dependency update tasks with detailed status.
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
                                    (task.tags && task.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 
                                        (task.tags && task.tags.includes('failed-lookup') ? 'failed-lookup' : 'pending')))
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
                            (task.tags && task.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 
                                (task.tags && task.tags.includes('failed-lookup') ? 'failed-lookup' : 'pending')))
            };
        });
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
 * Gets all dependency update tasks with details.
 * @returns {Array}
 */
function getAllDependencyUpdateTasksWithDetails() {
  return getAllDependencyUpdateTasksWithStatus();
}

/**
 * Gets in‑progress dependency update tasks.
 * @returns {Array}
 */
function getInProgressDependencyUpdateTasks() {
  return _tasks.filter(task => 
    task.tags?.includes('dependency-update') && 
    !task.completed && 
    !task.tags?.includes('awaiting-schedule') && 
    !task.tags?.includes('manually-edited') && 
    !task.tags?.includes('blocked-by-closed-pr') && 
    !task.tags?.includes('failed-lookup')
  );
}

/**
 * Gets ready‑for‑review dependency update tasks.
 * @returns {Array}
 */
function getReadyForReviewDependencyUpdateTasks() {
  return _tasks.filter(task => 
    task.tags?.includes('dependency-update') && 
    !task.completed && 
    task.tags?.includes('awaiting-schedule')
  );
}

/**
 * Gets blocked dependency update tasks.
 * @returns {Array}
 */
function getBlockedDependencyUpdateTasks() {
  return _tasks.filter(task => 
    task.tags?.includes('dependency-update') && 
    !task.completed && 
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
 * Checks if there are multiple lock files (placeholder).
 * @param {string} marker
 * @returns {boolean}
 */
function hasMultipleLockFiles(marker) {
  return false;
}

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

/**
 * Schedules dependencies in development (placeholder).
 */
function scheduleDependenciesInDevelopment() {
  logging.info('Scheduling dependencies in development...');
}

/**
 * Processes tasks when scheduled (placeholder).
 */
function processTasksWhenScheduled() {
  logging.info('Processing scheduled tasks...');
}

/**
 * Resolves task dependencies in page tasks (placeholder).
 */
function resolveTaskDependenciesInPageTasks() {
  logging.info('Resolving task dependencies in page tasks...');
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
 * Gets failed lookup tasks.
 * @returns {Array}
 */
function getFailedLookupTasks() {
  return _tasks.filter(task => 
    task.tags?.includes('dependency-update') && 
    task.tags?.includes('failed-lookup')
  );
}

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

/**
 * Gets tasks by priority and dependency.
 * @param {string} priority
 * @param {string} [dependencyName]
 * @returns {Array} Filtered tasks
 */
function getTasksByPriorityAndDependencies(priority, dependencyName) {
  return _tasks.filter(task =>
    task.priority === priority &&
    (!dependencyName || (task.dependencies && task.dependencies[dependencyName]))
  );
}

/**
 * Main game loop placeholder for Screeps (does nothing in tests).
 */
function run() {
  // Main game loop implementation would go here
}

module.exports = {
  logging,
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
  updateTaskPriority,
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
  getDetailedDependencyUpdateTasksWithStatus,
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
  markTaskAsFailedLookup,
  unmarkTaskAsFailedLookup,
  getFailedLookupTasks,
  run,
  addTag,
  removeTag,
  getTasksByPriorityAndDependencies
};