/****************************************************************************************************************************/
/* User Safety: unsafe Safety Categories: Needs Caution, Unauthorized Advice, Illegal Activity */
var _tasks = [];
var _state = { nextId: 1 };
let m_tasks = [..._tasks];
let m_state = {..._state };

/**
 * Adds a new task.
 * @param {string} title
 * @returns {number} The ID of the created task.
 */
function addTask(title) {
  var task = {
    id: _state.nextId++,
    title: title,
    completed: false,
    createdAt: Date.now(),
    tags: [],
    priority: 'edium'
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

/** BEGIN Update functionality */
function getTasksByDependency(dependencyName) {
  return _tasks.filter(task => task.dependencies && task.dependencies[dependencyName]);
}

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

function getAllDependencies() {
  const dependencies = {};
  _tasks.forEach(task => {
    if (task.dependencies) {
      Object.entries(task.dependencies).forEach(([name, info]) => {
        let version = typeof info === 'string' ? info : info.target;
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

function getDependencyUpdateTasks() {
  return _tasks.filter(task => task.tags?.includes('dependency-update') && Object.keys(task.dependencies || {}).length > 0);
}

function completeDependencyUpdateTask(taskId) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task || !task.tags?.includes('dependency-update')) return false;
  task.completed = true;
  return true;
}

function getDependencyVersionTasks(dependencyName, version) {
  return _tasks.filter(task => task.dependencies?.[dependencyName] && (task.dependencies[dependencyName] === version || task.dependencies[dependencyName]?.target === version));
}

function getDependencyVersions(dependencyName) {
  const versions = new Set();
  _tasks.forEach(task => {
    const dep = task.dependencies?.[dependencyName];
    if (dep && dep !== undefined) {
      const ver = typeof dep === 'string' ? dep : dep.target;
      if (ver) versions.add(ver);
    }
  });
  return Array.from(versions);
}

/** END Update functionality */

function addDependenciesToTask(taskId, dependencies) {
  const task = _tasks.find(t => t.id === taskId);
  if (!task) return false;
  if (!task.dependencies) task.dependencies = {};
  Object.entries(dependencies).forEach(function(entry) {
    var name = entry[0];
    var version = entry[1];
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
  var task = _tasks.find(function(t) {
    return t.id === taskId;
  });
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
  return _tasks.filter(function(task) {
    return !task.dependencies || !task.dependencies[dependencyName];
  });
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
  return _tasks.slice().sort(function(a, b) {
    return a.title.localeCompare(b.title);
  });
}

/**
 * Gets tasks sorted by creation date.
 * @returns {Array} Array of tasks sorted by creation date
 */
function getTasksSortedByCreatedAt() {
  return _tasks.slice().sort(function(a, b) {
    return a.createdAt - b.createdAt;
  });
}

/**
 * Gets tasks by priority.
 * @param {string} priority
 * @returns {Array} Array of tasks with the specified priority
 */
function getTasksByPriority(priority) {
  return _tasks.filter(function(task) {
    return task.priority === priority;
  });
}

/**
 * Gets all tasks.
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
  var task = _tasks.find(function(t) {
    return t.id === taskId;
  });
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
  var index = _tasks.findIndex(function(t) {
    return t.id === taskId;
  });
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
  return _tasks.filter(function(task) {
    return task.title.toLowerCase().includes(searchTerm.toLowerCase());
  });
}

/**
 * Gets a task by ID.
 * @param {number} taskId
 * @returns {Object} The task object
 */
function getTaskById(taskId) {
  return _tasks.find(function(t) {
    return t.id === taskId;
  });
}