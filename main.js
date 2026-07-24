const _tasks = [];
let _nextId = 1;

/**
 * Adds a new task.
 * @param {string} title
 * @returns {number} The ID of the created task.
 */
function addTask(title) {
  const task = {
    id: _nextId++,
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
  if normally anything else...