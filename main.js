const _tasks = [];
const _state = {
    nextId: 1
};

/**
 * User Safety: unsafe
 * Safety Categories: Needs Caution
 */

/**
 * Adds a new task.
 *
 * @param {string} title
 * @returns {number} The ID of the created task.
 */
function addTask(title) {
    const task = {
        id: _state.nextId++,
        title,
        completed: false,
        createdAt: Date.now(),
        tags: [],
        priority: 'edium'
    };
    _tasks.push(task);
    return task.id;
}

/**
 * Resets the task ID counter.
 */
function resetTaskIdCounter() {
    _state.nextId = 1;
}

/**
 * Gets tasks sorted by title.
 *
 * @returns {Array} Array of tasks sorted by title
 */
function getTasksSortedByTitle() {
    return [..._tasks].sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Gets tasks sorted by creation date.
 *
 * @returns {Array} Array of tasks sorted by creation date
 */
function getTasksSortedByCreatedAt() {
    return [..._tasks].sort((a, b) => a.createdAt - b.createdAt);
}

/**
 * Gets tasks by priority.
 *
 * @param {string} priority
 * @returns {Array} Array of tasks with the specified priority
 */
function getTasksByPriority(priority) {
    return _tasks.filter(task => task.priority === priority);
}

/**
 * Lists all tasks.
 *
 * @returns {Array} Array of all tasks
 */
function listTasks() {
    return [..._tasks];
}

/**
 * Marks a task as completed.
 *
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
 *
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
 *
 * @param {string} searchTerm
 * @returns {Array} Array of tasks matching the search term
 */
function findTasks(searchTerm) {
    return _tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

/**
 * Gets a task by ID.
 *
 * @param {number} taskId
 * @returns {Object|null} The task or null if not found
 */
function getTaskById(taskId) {
    return _tasks.find(t => t.id === taskId) || null;
}

/**
 * Updates a task's title.
 *
 * @param {number} taskId
 * @param {string} newTitle
 * @returns {boolean} True if the title was updated
 */
function updateTaskTitle(taskId, newTitle) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        task.title = newTitle;
        return true;
    }
    return false;
}

/**
 * Gets completed tasks.
 *
 * @returns {Array} Array of completed tasks
 */
function getCompletedTasks() {
    return _tasks.filter(task => task.completed);
}

/**
 * Gets incomplete tasks.
 *
 * @returns {Array} Array of incomplete tasks
 */
function getIncompleteTasks() {
    return _tasks.filter(task => !task.completed);
}

/**
 * Adds a tag to a task.
 *
 * @param {number} taskId
 * @param {string} tag
 * @returns {boolean} True if the tag was added
 */
function addTagToTask(taskId, tag) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        if (!task.tags) task.tags = [];
        if (!task.tags.includes(tag)) {
            task.tags.push(tag);
            return true;
        }
    }
    return false;
}

/**
 * Removes a tag from a task.
 *
 * @param {number} taskId
 * @param {string} tag
 * @returns {boolean} True if the tag was removed
 */
function removeTagFromTask(taskId, tag) {
    const task = _tasks.find(t => t.id === taskId);
    if (task && task.tags) {
        const index = task.tags.indexOf(tag);
        if (index !== -1) {
            task.tags.splice(index, 1);
            return true;
        }
    }
    return false;
}

/**
 * Adds a tag to a task.
 *
 * @param {number} taskId
 * @param {string} tag
 * @returns {boolean} True if the tag was added
 */
function addTagsToTask(taskId, tag) {
    return addTagToTask(taskId, tag);
}

/**
 * Removes a tag from a task.
 *
 * @param {number} taskId
 * @param {string} tag
 * @returns {boolean} True if the tag was removed
 */
function removeTagsFromTask(taskId, tag) {
    return removeTagFromTask(taskId, tag);
}

/**
 * Clears all tags from a task.
 *
 * @param {number} taskId
 * @returns {boolean} True if all tags were removed
 */
function clearTagsFromTask(taskId) {
    const task = _tasks.find(t => t.id === taskId);
    if (task && task.tags) {
        task.tags = [];
        return true;
    }
    return false;
}

/**
 * Gets all tags used across tasks.
 *
 * @returns {Array} Array of unique tags
 */
function getAllTags() {
    const tagSet = new Set();
    _tasks.forEach(t => t.tags?.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
}

/**
 * Finds tasks by any of the given tags.
 *
 * @param {string|string[]} tags
 * @returns {Array} Array of tasks matching any of the tags
 */
function findTasksByAnyTag(tags) {
    if (!Array.isArray(tags)) tags = [tags];
    return _tasks.filter(task =>
        tags.some(tag => task.tags?.includes(tag))
    );
}

/**
 * Finds tasks by all of the given tags.
 *
 * @param {string|string[]} tags
 * @returns {Array} Array of tasks matching all of the tags
 */
function findTasksByAllTags(tags) {
    if (!Array.isArray(tags)) tags = [tags];
    return _tasks.filter(task =>
        tags.every(tag => task.tags?.includes(tag))
    );
}

/**
 * Gets tasks by a specific tag.
 *
 * @param {string} tag
 * @returns {Array} Array of tasks that have the given tag
 */
function getTasksByTag(tag) {
    return _tasks.filter(task => task.tags?.includes(tag));
}

/**
 * Gets tasks by all of the given tags.
 *
 * @param {string|string[]} tags
 * @returns {Array} Array of tasks that have all of the given tags
 */
function getTasksByAllTags(tags) {
    if (!Array.isArray(tags)) tags = [tags];
    return _tasks.filter(task =>
        tags.every(tag => task.tags?.includes(tag))
    );
}

/**
 * Updates a task's priority.
 *
 * @param {number} taskId
 * @param {string} newPriority
 * @returns {boolean} True if the priority was updated
 */
function updateTaskPriority(taskId, newPriority) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        task.priority = newPriority;
        return true;
    }
    return false;
}

/**
 * Gets tasks filtered by priority.
 *
 * @param {string} priority
 * @returns {Array} Array of tasks with the specified priority
 */
function getTasksByPriorityFilter(priority) {
    return _tasks.filter(task => task.priority === priority);
}

/**
 * Clears all tasks.
 */
function clearAllTasks() {
    _tasks.length = 0;
}

/**
 * Returns the total number of tasks.
 *
 * @returns {number} Total task count
 */
function getTaskCount() {
    return _tasks.length;
}

/**
 * Returns the number of completed tasks.
 *
 * @returns {number} Completed task count
 */
function getCompletedTaskCount() {
    return _tasks.filter(task => task.completed).length;
}

/**
 * Groups tasks by their status (completed / incomplete).
 *
 * @returns {Object} Object with completed and incomplete arrays
 */
function getTasksByStatus() {
    return {
        completed: _tasks.filter(task => task.completed),
        incomplete: _tasks.filter(task => !task.completed)
    };
}

/**
 * Toggles a task's completion status.
 *
 * @param {number} taskId
 * @returns {boolean} True if the task was toggled
 */
function toggleTaskCompletion(taskId) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        return true;
    }
    return false;
}

/**
 * Incomplete task count (alias for getIncompleteTasks length).
 *
 * @returns {number} Number of incomplete tasks
 */
function incompleteTask() {
    return getIncompleteTasks().length;
}

/**
 * Updates multiple properties of a task.
 *
 * @param {number} taskId
 * @param {Object} updates
 * @returns {boolean} True if updates were applied
 */
function updateTaskProperties(taskId, updates) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        Object.assign(task, updates);
        return true;
    }
    return false;
}

/**
 * Duplicates a task.
 *
 * @param {number} taskId
 * @returns {number} ID of the newly created duplicated task
 */
function duplicateTask(taskId) {
    const original = _tasks.find(t => t.id === taskId);
    if (!original) return null;
    const newTask = {
        ...original,
        id: _state.nextId++,
        createdAt: Date.now()
    };
    _tasks.push(newTask);
    return newTask.id;
}

/**
 * Moves a task to a different position in the array (reorders tasks).
 *
 * @param {number} taskId
 * @param {number} newIndex
 * @returns {boolean} True if the task was moved
 */
function moveTask(taskId, newIndex) {
    const task = _tasks.find(t => t.id === taskId);
    if (!task) return false;
    const oldIndex = _tasks.indexOf(task);
    if (oldIndex === -1 || oldIndex === newIndex) return false;
    _tasks.splice(oldIndex, 1);
    _tasks.splice(newIndex, 0, task);
    return true;
}

/**
 * Sorts tasks by a specified criterion.
 *
 * @param {string} criterion - e.g., 'title', 'createdAt', 'priority'
 * @returns {Array} Sorted array of tasks
 */
function getTasksSorted(criterion) {
    const comparators = {
        title: (a, b) => a.title.localeCompare(b.title),
        createdAt: (a, b) => a.createdAt - b.createdAt,
        priority: (a, b) => {
            const order = { low: 0, medium: 1, high: 2 };
            return (order[a.priority] || 0) - (order[b.priority] || 0);
        }
    };
    const compare = comparators[criterion];
    if (!compare) return [..._tasks];
    return [..._tasks].sort(compare);
}

/**
 * Paginates tasks.
 *
 * @param {number} page - 1-based page index
 * @param {number} pageSize - number of items per page
 * @returns {Array} Page of tasks
 */
function getTasksPaginated(page = 1, pageSize = 10) {
    const start = (page - 1) * pageSize;
    return [..._tasks].slice(start, start + pageSize);
}

/**
 * Searches tasks by title or tags.
 *
 * @param {string} term
 * @returns {Array} Matching tasks
 */
function searchTasks(term) {
    const lower = term.toLowerCase();
    return _tasks.filter(task =>
        task.title.toLowerCase().includes(lower) ||
        (task.tags?.some(t => t.toLowerCase().includes(lower)))
    );
}

/**
 * Updates a dependency version for a task.
 *
 * @param {number} taskId
 * @param {string} dependencyName
 * @param {string} newVersion
 * @returns {boolean} True if updated
 */
function updateDependencyVersion(taskId, dependencyName, newVersion) {
    const task = _tasks.find(t => t.id === taskId);
    if (!task) return false;
    if (!task.dependencies) task.dependencies = {};
    task.dependencies[dependencyName] = newVersion;
    return true;
}

/**
 * Adds a task specifically for dependency updates.
 *
 * @param {string} dependencyName
 * @param {string} newVersion
 * @returns {number} ID of the created dependency update task
 */
function addDependencyUpdateTask(dependencyName, newVersion) {
    const task = {
        id: _state.nextId++,
        title: `Update ${dependencyName} to ${newVersion}`,
        completed: false,
        createdAt: Date.now(),
        tags: ['dependency-update'],
        priority: 'low'
    };
    _tasks.push(task);
    return task.id;
}

/**
 * Retrieves all dependencies across tasks.
 *
 * @returns {Object} Mapping of dependency name to version
 */
function getAllDependencies() {
    const deps = {};
    _tasks.forEach(t => {
        if (t.dependencies) {
            Object.entries(t.dependencies).forEach(([name, version]) => {
                if (!deps[name] || deps[name].version < version) {
                    deps[name] = { version, taskId: t.id };
                }
            });
        }
    });
    return deps;
}

/**
 * Retrieves tasks that have pending dependency updates.
 *
 * @returns {Array} Tasks needing dependency version updates
 */
function getDependencyUpdateTasks() {
    return _tasks.filter(t => t.tags?.includes('dependency-update'));
}

/**
 * Completes a dependency update task.
 *
 * @param {number} taskId
 * @returns {boolean} True if completed
 */
function completeDependencyUpdateTask(taskId) {
    const task = _tasks.find(t => t.id === taskId);
    if (task && task.tags?.includes('dependency-update')) {
        task.completed = true;
        return true;
    }
    return false;
}

/**
 * Retrieves tasks sorted by dependency version.
 *
 * @param {string} dependencyName
 * @returns {Array} Tasks sorted by that dependency's version
 */
function getTasksByDependencyVersion(dependencyName) {
    return _tasks
        .filter(t => t.dependencies?.[dependencyName])
        .sort((a, b) => {
            const vA = a.dependencies[dependencyName];
            const vB = b.dependencies[dependencyName];
            // Simple string comparison for version; replace with semver logic if needed
            return vA.localeCompare(vB);
        });
}

/**
 * Retrieves all dependency versions across tasks.
 *
 * @returns {Object} Mapping of dependency name to latest version
 */
function getDependencyVersions() {
    const versions = {};
    _tasks.forEach(t => {
        if (t.dependencies) {
            Object.entries(t.dependencies).forEach(([name, version]) => {
                if (!versions[name] || versions[name] < version) {
                    versions[name] = version;
                }
            });
        }
    });
    return versions;
}

/**
 * Updates multiple dependency versions at once.
 *
 * @param {Object} updates - { dependencyName: newVersion }
 * @returns {boolean} True if any update was applied
 */
function updateMultipleDependencyVersions(updates) {
    let applied = false;
    for (const [dep, version] of Object.entries(updates)) {
        applied = applied || updateDependencyVersion(null, dep, version);
    }
    return applied;
}

/**
 * Removes a dependency from a task.
 *
 * @param {number} taskId
 * @param {string} dependencyName
 * @returns {boolean} True if removed
 */
function removeDependencyFromTask(taskId, dependencyName) {
    const task = _tasks.find(t => t.id === taskId);
    if (task && task.dependencies && task.dependencies[dependencyName]) {
        delete task.dependencies[dependencyName];
        return true;
    }
    return false;
}

/**
 * Retrieves tasks missing a specific dependency.
 *
 * @param {string} dependencyName
 * @returns {Array} Tasks that do not have the dependency
 */
function getTasksMissingDependency(dependencyName) {
    return _tasks.filter(task => !task.dependencies?.[dependencyName]);
}

/**
 * Gets memory usage statistics.
 *
 * @returns {Object} Memory usage data
 */
function getMemoryUsage() {
    const memoryUsage = process.memoryUsage();
    return {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
        arrayBuffers: memoryUsage.arrayBuffers
    };
}

/**
 * Export all functions
 */
module.exports = {
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
  updateTaskTitle,
  getCompletedTasks,
  getIncompleteTasks,
  addTagToTask,
  removeTagFromTask,
  findTasksByTag,
  updateTaskPriority,
  getTasksByPriorityFilter,
  getTasksByCreationDate,
  clearAllTasks,
  getTaskCount,
  getCompletedTaskCount,
  getTasksByPriorityFilter,
  getTasksByStatus,
  incompleteTask,
  toggleTaskCompletion,
  addTagsToTask,
  removeTagsFromTask,
  clearTagsFromTask,
  getAllTags,
  findTasksByAnyTag,
  findTasksByAllTags,
  getTasksByTag,
  getTasksByAllCriteria,
  updateTaskProperties,
  duplicateTask,
  moveTask,
  getTasksSorted,
  getTasksPaginated,
  searchTasks,
  updateDependencyVersion,
  getTasksByDependency,
  addDependencyUpdateTask,
  getAllDependencies,
  getDependencyUpdateTasks,
  completeDependencyUpdateTask,
  getTasksByDependencyVersion,
  getDependencyVersions,
  updateMultipleDependencyVersions,
  removeDependencyFromTask,
  getTasksMissingDependency,
  getAllTasks,
  getDependencyVersionTasks,
  getMemoryUsage
};