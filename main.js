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
  if (!task.tags || !task.tags.includes(tag)) task.tags = task.tags || [];
  task.tags.push(tag);
  return true;
}
function removeTag(taskId, tag) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  const idx = task.tags ? task.tags.indexOf(tag) : -1;
  if (idx !== -1) {
    task.tags.splice(idx, 1);
    return true;
  }
  return false;
}

// ---------- Task CRUD ----------
function addTask(title, priority = 'medium', tags = [], dependencies = {}) {
  const task = {
    id: _state.nextId++,
    title: title,
    completed: false,
    createdAt: Date.now(),
    tags: [...tags],
    priority: priority,
    dependencies
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
  if (!task.dependencies[dependencyName]) task.dependencies[dependencyName] = {};
  task.dependencies[dependencyName].version = newVersion;
  return true;
}
function updateTaskPriority(taskId, newPriority) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  if (typeof newPriority === 'string') return updateDependencyVersions(taskId, { [task.priority]: '' });
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
// (Rest of the code remains the same as the original from the HEAD)