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
 * Finds tasks by tag.
 *
 * @param {string} tag
 * @returns {Array} Array of tasks with the specified tag
 */
function findTasksByTag(tag) {
    return _tasks.filter(task => task.tags && task.tags.includes(tag));
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
 * Gets tasks by priority filter.
 *
 * @param {string} priority
 * @returns {Array} Array of tasks with the specified priority
 */
function getTasksByPriorityFilter(priority) {
    return _tasks.filter(task => task.priority === priority);
}

/**
 * Gets tasks by creation date range.
 *
 * @param {number} startDate
 * @param {number} endDate
 * @returns {Array} Array of tasks created within the date range
 */
function getTasksByCreationDate(startDate, endDate) {
    return _tasks.filter(task =>
        task.createdAt >= startDate && task.createdAt <= endDate
    );
}

/**
 * Gets the total number of tasks.
 *
 * @returns {number} The total number of tasks
 */
function getTaskCount() {
    return _tasks.length;
}

/**
 * Gets the number of completed tasks.
 *
 * @returns {number} The number of completed tasks
 */
function getCompletedTaskCount() {
    return _tasks.filter(task => task.completed).length;
}

/**
 * Gets tasks by status.
 *
 * @param {boolean} completed
 * @returns {Array} Array of tasks with the specified status
 */
function getTasksByStatus(completed) {
    return _tasks.filter(task => task.completed === completed);
}

/**
 * Marks a task as incomplete.
 *
 * @param {number} taskId
 * @returns {boolean} True if the task was marked as incomplete
 */
function incompleteTask(taskId) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = false;
        return true;
    }
    return false;
}

/**
 * Toggles a task's completion status.
 *
 * @param {number} taskId
 * @returns {boolean} True if the task's status was toggled
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
 * Adds multiple tags to a task.
 *
 * @param {number} taskId
 * @param {Array} tags
 * @returns {boolean} True if any tags were added
 */
function addTagsToTask(taskId, tags) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        if (!task.tags) task.tags = [];
        let added = false;
        tags.forEach(tag => {
            if (!task.tags.includes(tag)) {
                task.tags.push(tag);
                added = true;
            }
        });
        return added;
    }
    return false;
}

/**
 * Removes multiple tags from a task.
 *
 * @param {number} taskId
 * @param {Array} tags
 * @returns {boolean} True if any tags were removed
 */
function removeTagsFromTask(taskId, tags) {
    const task = _tasks.find(t => t.id === taskId);
    if (task && task.tags) {
        const initialLength = task.tags.length;
        task.tags = task.tags.filter(t => t !== tag);
        return task.tags.length !== initialLength;
    }
    return false;
}

/**
 * Clears all tags from a task.
 *
 * @param {number} taskId
 * @returns {boolean} True if tags were cleared
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
 * Gets all unique tags across all tasks.
 *
 * @returns {Array} Array of all unique tags
 */
function getAllTags() {
    const tags = new Set();
    _tasks.forEach(task => {
        if (task.tags) {
            task.tags.forEach(tag => tags.add(tag));
        }
    });
    return Array.from(tags);
}

/**
 * Finds tasks that have any of the specified tags.
 *
 * @param {Array} tags
 * @returns {Array} Array of tasks with any of the specified tags
 */
function findTasksByAnyTag(tags) {
    return _tasks.filter(task =>
        task.tags && task.tags.some(tag => tags.includes(tag))
    );
}

/**
 * Finds tasks that have all of the specified tags.
 *
 * @param {Array} tags
 * @returns {Array} Array of tasks that have all of the specified tags
 */
function findTasksByAllTags(tags) {
    return _tasks.filter(task =>
        task.tags && tags.every(tag => task.tags.includes(tag))
    );
}

/**
 * Gets tasks that have a specific tag (alias for findTasksByTag).
 *
 * @param {string} tag
 * @returns {Array} Array of tasks with the specified tag
 */
function getTasksByTag(tag) {
    return findTasksByTag(tag);
}

/**
 * Gets tasks that have all of the specified tags (alias for findTasksByAllTags).
 *
 * @param {Array} tags
 * @returns {Array} Array of tasks with all of the specified tags
 */
function getTasksByTags(tags) {
    return findTasksByAllTags(tags);
}

/**
 * Gets tasks created within a specific date range.
 *
 * @param {number} startDate
 * @param {number} endDate
 * @returns {Array} Array of tasks created within the date range
 */
function getTasksByDateRange(startDate, endDate) {
    return _tasks.filter(task =>
        task.createdAt >= startDate && task.createdAt <= endDate
    );
}

/**
 * Gets tasks that match all specified criteria.
 *
 * @param {Object} criteria - Object with criteria to match
 * @returns {Array} Array of tasks matching all criteria
 */
function getTasksByAllCriteria(criteria) {
    return _tasks.filter(task => {
        return Object.entries(criteria).every(([key, value]) => {
            if (key === 'tags') {
                return task.tags && value.every(tag => task.tags.includes(tag));
            }
            return task[key] === value;
        });
    });
}

/**
 * Updates multiple properties of a task.
 *
 * @param {number} taskId
 * @param {Object} properties - Object with properties to update
 * @returns {boolean} True if any properties were updated
 */
function updateTaskProperties(taskId, properties) {
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        let updated = false;
        Object.entries(properties).forEach(([key, value]) => {
            if (task[key] !== value) {
                task[key] = value;
                updated = true;
            }
        });
        return updated;
    }
    return false;
}

/**
 * Duplicates a task.
 *
 * @param {number} taskId
 * @returns {number|null} The ID of the duplicated task or null if failed
 */
function duplicateTask(taskId) {
    const originalTask = _tasks.find(t => t.id === taskId);
    if (originalTask) {
        const newTask = {
            ...originalTask,
            id: _state.nextId++,
            createdAt: Date.now(),
            completed: false
        };
        _tasks.push(newTask);
        return newTask.id;
    }
    return null;
}

/**
 * Moves a task to a new position in the list.
 *
 * @param {number} taskId
 * @param {number} newIndex
 * @returns {boolean} True if the task was moved
 */
function moveTask(taskId, newIndex) {
    const taskIndex = _tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1 && newIndex >= 0 && newIndex < _tasks.length) {
        const [task] = _tasks.splice(taskIndex, 1);
        _tasks.splice(newIndex, 0, task);
        return true;
    }
    return false;
}

/**
 * Gets tasks sorted by a specific property.
 *
 * @param {string} property
 * @param {boolean} descending
 * @returns {Array} Array of tasks sorted by the specified property
 */
function getTasksSorted(property, descending = false) {
    const sorted = [..._tasks].sort((a, b) => {
        if (a[property] < b[property]) return descending ? 1 : -1;
        if (a[property] > b[property]) return descending ? -1 : 1;
        return 0;
    });
    return sorted;
}

/**
 * Gets a paginated list of tasks.
 *
 * @param {number} page
 * @param {number} pageSize
 * @returns {Array} Array of tasks for the specified page
 */
function getTasksPaginated(page, pageSize) {
    const startIndex = (page - 1) * pageSize;
    return _tasks.slice(startIndex, startIndex + pageSize);
}

/**
 * Searches tasks by title or tags.
 *
 * @param {string} searchTerm
 * @returns {Array} Array of tasks matching the search term
 */
function searchTasks(searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    return _tasks.filter(task =>
        task.title.toLowerCase().includes(lowerSearch) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(lowerSearch)))
    );
}

/**
 * Updates the version of a dependency in a task.
 *
 * @param {number} taskId
 * @param {string} dependencyName
 * @param {string} newVersion
 * @returns {boolean} True if the update was successful
 */
function updateDependencyVersion(taskId, dependencyName, newVersion) {
    const task = _tasks.find(t => t.id === taskId);
    if (task === undefined || task === null) return false;

    if (!task.dependencies) {
        task.dependencies = {};
    }

    task.dependencies[dependencyName] = newVersion;
    return true;
}

/**
 * Gets tasks that have a specific dependency.
 *
 * @param {string} dependencyName
 * @returns {Array} Array of tasks with the specified dependency
 */
function getTasksByDependency(dependencyName) {
    return _tasks.filter(task =>
        task.dependencies && task.dependencies[dependencyName]
    );
}

/**
 * Adds a task to update a specific dependency.
 *
 * @param {string} dependencyName
 * @param {string} currentVersion
 * @param {string} targetVersion
 * @returns {number} The ID of the created task
 */
function addDependencyUpdateTask(dependencyName, currentVersion, targetVersion) {
    const title = `Update ${dependencyName} from ${currentVersion} to ${targetVersion}`;
    const taskId = addTask(title);

    // Add dependency information to the task
    const task = _tasks.find(t => t.id === taskId);
    if (task) {
        task.dependencies = {
            [dependencyName]: {
                current: currentVersion,
                target: targetVersion
            }
        };
        // Add dependency-update tag
        if (!task.tags) task.tags = [];
        task.tags.push('dependency-update');
    }

    return taskId;
}

/**
 * Gets all dependencies across all tasks.
 *
 * @returns {Object} An object with all dependencies and their versions
 */
function getAllDependencies() {
    const dependencies = {};

    _tasks.forEach(task => {
        if (task.dependencies) {
            Object.entries(task.dependencies).forEach(([name, version]) => {
                if (!dependencies[name]) {
                    dependencies[name] = new Set();
                }
                dependencies[name].add(version);
            });
        }
    });

    // Convert sets to arrays for easier consumption
    Object.keys(dependencies).forEach(name => {
        const set = dependencies[name];
        dependencies[name] = Array.from(set);
    });

    return dependencies;
}

/**
 * Gets tasks that need dependency updates.
 *
 * @returns {Array} Array of tasks with dependency updates
 */
function getDependencyUpdateTasks() {
    return _tasks.filter(task =>
        task.tags && task.tags.includes('dependency-update') &&
        task.dependencies && Object.keys(task.dependencies).length > 0
    );
}

/**
 * Marks a dependency update task as completed.
 *
 * @param {number} taskId
 * @returns {boolean} True if the task was marked as completed
 */
function completeDependencyUpdateTask(taskId) {
    const task = _tasks.find(t => t.id === taskId);
    if (!task || !task.tags || !task.tags.includes('dependency-update')) {
        return false;
    }

    task.completed = true;
    return true;
}

/**
 * Gets tasks that have a specific dependency version.
 *
 * @param {string} dependencyName
 * @param {string} version
 * @returns {Array} Array of tasks with the specified dependency version
 */
function getTasksByDependencyVersion(dependencyName, version) {
    return _tasks.filter(task =>
        task.dependencies &&
        task.dependencies[dependencyName] &&
        task.dependencies[dependencyName] === version
    );
}

/**
 * Gets all versions of a specific dependency across all tasks.
 *
 * @param {string} dependencyName
 * @returns {Array} Array of all versions of the specified dependency
 */
function getDependencyVersions(dependencyName) {
    const versions = new Set();

    _tasks.forEach(task => {
        if (task.dependencies && task.dependencies[dependencyName]) {
            versions.add(task.dependencies[dependencyName]);
        }
    });

    return Array.from(versions);
}

/**
 * Updates multiple dependency versions in a task.
 *
 * @param {number} taskId
 * @param {Object} dependencies - Object with dependency names as keys and versions as values
 * @returns {boolean} True if the update was successful
 */
function updateMultipleDependencyVersions(taskId, dependencies) {
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
 * Removes a dependency from a task.
 *
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
 *
 * @param {string} dependencyName
 * @returns {Array} Array of tasks that don't have the specified dependency
 */
function getTasksMissingDependency(dependencyName) {
    return _tasks.filter(task =>
        !task.dependencies || !task.dependencies[dependencyName]
    );
}

// Add this function to help with testing
function getAllTasks() {
    return [..._tasks];
}

// Add this function to help with testing
function clearAllTasks() {
    _tasks.length = 0;
    _state.nextId = 1;
}

/**
 * Gets tasks that have a specific dependency version (alias for getTasksByDependencyVersion).
 *
 * @param {string} dependencyName
 * @param {string} version
 * @returns {Array} Array of tasks with the specified dependency version
 */
function getDependencyVersionTasks(dependencyName, version) {
    return getTasksByDependencyVersion(dependencyName, version);
}

/**
 * Logs a message with a timestamp.
 *
 * @param {string} message - The message to log
 * @param {string} [level='info'] - The log level (info, warn, error)
 */
function log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

// Export all functions
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
  getTasksByTags,
  getTasksByDateRange,
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
  log
};