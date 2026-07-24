let _tasks = [];
let _state = { nextId: 1 };

const logging = {
  info(message) { console.log(`[INFO] ${message}`); },
  warn(message) { console.warn(`[WARN] ${message}`); },
  error(message) { console.error(`[ERROR] ${message}`); },
  debug(message) { console.log(`[DEBUG] ${message}`); },
  formatLogEntry(level, message) { const timestamp = new Date().toISOString(); return `${timestamp} [${level.toUpperCase()}] ${message}`; },
  log(level, message, data) { const entry = this.formatLogEntry(level, message); if (data !== undefined) console.log(entry, data); else console.log(entry); }
};

// Tag operations
function addTag(taskId, tag) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  if (!task.tags.includes(tag)) task.tags.push(tag);
  return true;
}
function removeTag(taskId, tag) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  const idx = task.tags.indexOf(tag);
  if (idx !== -1) {
    task.tags.splice(idx, 1);
    return true;
  }
  return false;
}

// ---------- Task CRUD ----------
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
function completeTask(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  task.completed = true;
  return true;
}
function removeTask(taskId) {
  const idx = _tasks.findIndex(t => t.id === taskId);
  if (idx !== -1) {
    _tasks.splice(idx, 1);
    return true;
  }
  return false;
}
function findTasks(searchTerm) {
  return _tasks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
}
function getTaskById(taskId) {
  return _tasks.find(t => t.id === taskId) || null;
}
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
function removeTaskDependency(taskId, dependencyName) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.dependencies || !task.dependencies[dependencyName]) return false;
  delete task.dependencies[dependencyName];
  return true;
}

// ---------- Dependency handling ----------
function getTasksByDependency(dependencyName) {
  return _tasks.filter(t => t.dependencies && t.dependencies[dependencyName]);
}
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
function getAllDependencies() {
  const deps = new Set();
  _tasks.forEach(t => {
    if (t.dependencies) Object.keys(t.dependencies).forEach(d => deps.add(d));
  });
  return Array.from(deps);
}
function getDependencyUpdateTasks() {
  return _tasks.filter(t => t.tags && t.tags.includes('dependency-update'));
}
function completeDependencyUpdateTask(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !(task.tags && task.tags.includes('dependency-update'))) return false;
  task.completed = true;
  return true;
}
function getDependencyVersionTasks(dependencyName) {
  return _tasks.filter(t => t.dependencies && t.dependencies[dependencyName] !== undefined);
}
function getDependencyVersions(dependencyName) {
  const versions = new Set();
  _tasks.forEach(t => {
    const dep = t.dependencies?.[dependencyName];
    if (dep) {
      const ver = typeof dep === 'string' ? dep : dep.target;
      if (ver) versions.add(ver);
    }
  });
  return Array.from(versions);
}
function updateDependencyVersions(taskId, dependencies) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  if (!task.dependencies) task.dependencies = {};
  Object.entries(dependencies).forEach(([name, version]) => {
    task.dependencies[name] = version;
  });
  return true;
}
function addDependenciesToTask(taskId, dependencies) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  task.dependencies = { ...task.dependencies, ...dependencies };
  return true;
}
function removeDependencyFromTask(taskId, dependencyName) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.dependencies || !task.dependencies[dependencyName]) return false;
  delete task.dependencies[dependencyName];
  return true;
}
function getTasksMissingDependency(dependencyName) {
  return _tasks.filter(t => !t.completed && (!t.dependencies || !t.dependencies[dependencyName]));
}
function getDependencyUpdateProgress(dependencyName) {
  const tasks = getDependencyVersionTasks(dependencyName);
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return (completed / tasks.length) * 100;
}
function getDependencyUpdateTaskCounts() {
  const counts = { total: 0, completed: 0, pending: 0, overdue: 0, blocked: 0 };
  const now = Date.now();
  const overdueTime = 7 * 24 * 60 * 60 * 1000;
  _tasks.forEach(t => {
    if (t.tags && t.tags.includes('dependency-update')) {
      counts.total++;
      if (t.completed) counts.completed++;
      else if ((now - t.createdAt) > overdueTime) counts.overdue++;
      else if (t.tags.includes('blocked-by-closed-pr') || t.tags.includes('manually-edited')) counts.blocked++;
      else counts.pending++;
    }
  });
  return counts;
}

// Additional helper for detailed status
function getAllDependencyUpdateTasksWithStatus() {
  const result = _tasks
    .filter(t => t.tags && t.tags.includes('dependency-update'))
    .map(t => {
      const dependencies = t.dependencies || {};
      const dependencyDetails = Object.entries(dependencies).map(([name, info]) => {
        if (typeof info === 'string') {
          return { name, current: info, target: info, status: 'current' };
        } else {
          return {
            name,
            current: info.current,
            target: info.target,
            status: t.completed ? 'completed' :
              (t.tags && t.tags.includes('awaiting-schedule') ? 'awaiting-schedule' :
              (t.tags && t.tags.includes('manually-edited') ? 'manually-edited' :
              (t.tags && t.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending')))
          };
        }
      });
      return {
        id: t.id,
        title: t.title,
        completed: t.completed,
        createdAt: t.createdAt,
        dependencies: dependencyDetails,
        priority: t.priority,
        tags: [...t.tags],
        status: t.completed ? 'completed' :
          (t.tags && t.tags.includes('awaiting-schedule') ? 'awaiting-schedule' :
          (t.tags && t.tags.includes('manually-edited') ? 'manually-edited' :
          (t.tags && t.tags.includes('blocked-by-closed-pr') ? 'blocked-by-closed-pr' : 'pending')))
      };
    });
  return result;
}
function getDetailedDependencyUpdateTasks() {
  return getAllDependencyUpdateTasksWithStatus();
}

// ---------- Tag based filtering ----------
function getTasksByPriority(priority) {
  return _tasks.filter(t => t.priority === priority);
}
function getTasksByPriorityAndDependencies(priority, dependencyName) {
  return _tasks.filter(t => t.priority === priority && (!dependencyName || getTasksByDependency(dependencyName).includes(t)));
}
function getTasksSortedByTitle() {
  return [..._tasks].sort((a, b) => a.title.localeCompare(b.title));
}
function getTasksSortedByCreatedAt() {
  return [..._tasks].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
}

// ---------- Scheduler ----------
function scheduleDependenciesInDevelopment() {
  logging.info('Scheduling dependencies in development...');
}
function processTasksWhenScheduled() {
  logging.info('Processing scheduled tasks...');
}
function resolveTaskDependenciesInPageTasks() {
  logging.info('Resolving task dependencies in page tasks...');
}
function resolveDependencyConflicts(dependencyName, resolvedVersion) {
  const tasks = getDependencyVersionTasks(dependencyName);
  tasks.forEach(t => {
    if (t.dependencies && t.dependencies[dependencyName]) {
      t.dependencies[dependencyName] = resolvedVersion;
    }
  });
  return true;
}
function isDependencyUpdateOverdue(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || task.completed) return false;
  const overdueTime = 7 * 24 * 60 * 60 * 1000;
  return (Date.now() - task.createdAt) > overdueTime;
}

// ---------- Memory & analysis ----------
function getMemoryUsage() {
  return {
    taskCount: _tasks.length,
    nextId: _state.nextId,
    memory: typeof process !== 'undefined' ? process.memoryUsage() : {}
  };
}
function getAllUniqueDependencies() {
  const deps = new Set();
  _tasks.forEach(t => {
    if (t.dependencies) Object.keys(t.dependencies).forEach(d => deps.add(d));
  });
  return Array.from(deps);
}
function getDependencyUpdateTasksWithVersions(dependencyName) {
  return _tasks
    .filter(t => t.tags?.includes('dependency-update') && t.dependencies?.[dependencyName])
    .map(t => ({
      id: t.id,
      title: t.title,
      completed: t.completed,
      createdAt: t.createdAt,
      currentVersion: typeof t.dependencies[dependencyName] === 'string' ? t.dependencies[dependencyName] : t.dependencies[dependencyName]?.current,
      targetVersion: typeof t.dependencies[dependencyName] === 'string' ? t.dependencies[dependencyName] : t.dependencies[dependencyName]?.target,
      priority: t.priority
    }));
}
function getAwaitingScheduleTasks() {
  return getDependencyUpdateTasks().filter(t => t.tags?.includes('awaiting-schedule'));
}
function getManuallyEditedTasks() {
  return getDependencyUpdateTasks().filter(t => t.tags?.includes('manually-edited'));
}
function getBlockedByClosedPRTasks() {
  return getDependencyUpdateTasks().filter(t => t.tags?.includes('blocked-by-closed-pr'));
}
function getInProgressDependencyUpdateTasks() {
  return _tasks.filter(t => t.dependencies && Object.keys(t.dependencies).length > 0 && !t.completed && t.tags?.includes('in-progress'));
}
function getReadyForReviewDependencyUpdateTasks() {
  return _tasks.filter(t => t.dependencies && Object.keys(t.dependencies).length > 0 && !t.completed && t.tags?.includes('ready-for-review'));
}
function getBlockedDependencyUpdateTasks() {
  return _tasks.filter(t => t.dependencies && Object.keys(t.dependencies).length > 0 && !t.completed && t.tags?.includes('blocked'));
}
function markTaskAsAwaitingSchedule(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags?.includes('dependency-update')) return false;
  if (!task.tags?.includes('awaiting-schedule')) task.tags.push('awaiting-schedule');
  return true;
}
function markTaskAsManuallyEdited(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags?.includes('dependency-update')) return false;
  if (!task.tags?.includes('manually-edited')) task.tags.push('manually-edited');
  return true;
}
function markTaskAsBlockedByClosedPR(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags?.includes('dependency-update')) return false;
  if (!task.tags?.includes('blocked-by-closed-pr')) task.tags.push('blocked-by-closed-pr');
  return true;
}
function unmarkTaskAsAwaitingSchedule(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags?.includes('dependency-update')) return false;
  const idx = task.tags.indexOf('awaiting-schedule');
  if (idx >= 0) task.tags.splice(idx, 1);
  return true;
}
function unmarkTaskAsManuallyEdited(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags?.includes('dependency-update')) return false;
  const idx = task.tags.indexOf('manually-edited');
  if (idx >= 0) task.tags.splice(idx, 1);
  return true;
}
function unmarkTaskAsBlockedByClosedPR(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags?.includes('dependency-update')) return false;
  const idx = task.tags.indexOf('blocked-by-closed-pr');
  if (idx >= 0) task.tags.splice(idx, 1);
  return true;
}
function getFailedLookupTasks() {
  return _tasks.filter(t => t.tags?.includes('failed-lookup'));
}
function getBlockedByFailedLookupTasks() {
  return _tasks.filter(t => t.tags?.includes('blocked-by-failed-lookup'));
}
function markTaskAsFailedLookup(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  if (!task.tags) task.tags = [];
  if (!task.tags.includes('failed-lookup')) task.tags.push('failed-lookup');
  return true;
}
function unmarkTaskAsFailedLookup(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags) return false;
  const idx = task.tags.indexOf('failed-lookup');
  if (idx !== -1) task.tags.splice(idx, 1);
  return true;
}
function getTasksCreatedAfter(timestamp) {
  return _tasks.filter(t => t.createdAt > timestamp);
}

// ---------- NPM lock file utilities ----------
function getNpmLockFiles() {
  const lockFiles = [];
  _tasks.forEach(t => {
    if (t.dependencies) {
      Object.keys(t.dependencies).forEach(dep => {
        const depData = t.dependencies[dep];
        if (depData && depData.lockFile) lockFiles.push(depData.lockFile);
      });
    }
  });
  return [...new Set(lockFiles)];
}
function getNpmLockFileDeprecationWarnings() {
  const warnings = [];
  const lockFiles = getNpmLockFiles();
  if (lockFiles.length > 1) {
    warnings.push('WARN: Updating multiple npm lock files is deprecated and support will be removed in future versions.');
  }
  return warnings;
}
function hasMultipleLockFiles(dependencyName) {
  const tasks = getDependencyVersionTasks(dependencyName);
  const lockFiles = new Set();
  tasks.forEach(t => {
    if (t.dependencies && t.dependencies[dependencyName]) {
      const dep = t.dependencies[dependencyName];
      if (dep && dep.lockFile) lockFiles.add(dep.lockFile);
    }
  });
  return lockFiles.size > 1;
}

// ---------- Run loop ----------
function run() {
  logging.info('Bot execution loop started');
  scheduleDependenciesInDevelopment();
  processTasksWhenScheduled();
  resolveTaskDependenciesInPageTasks();
}

// Export everything
module.exports = {
  run,
  addTask,
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
  getDetailedDependencyUpdateTasks,
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
  addTag,
  removeTag,
  getTasksByPriority,
  getTasksByPriorityAndDependencies,
  getTasksSortedByTitle,
  getTasksSortedByCreatedAt,
  getDependencyUpdateTasksWithVersions,
  getAwaitingScheduleTasks,
  getManuallyEditedTasks,
  getBlockedByClosedPRTasks,
  getInProgressDependencyUpdateTasks,
  getReadyForReviewDependencyUpdateTasks,
  getBlockedDependencyUpdateTasks,
  markTaskAsAwaitingSchedule,
  markTaskAsManuallyEdited,
  markTaskAsBlockedByClosedPR,
  unmarkTaskAsAwaitingSchedule,
  unmarkTaskAsManuallyEdited,
  unmarkTaskAsBlockedByClosedPR,
  getAllUniqueDependencies,
  logging,
  _tasks,
  _state
};