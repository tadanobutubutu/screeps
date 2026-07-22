const _tasks = [];
const _state = {
    nextId: 1
};




// [All task management functions as in the original code snippet - omitted for brevity but included in full in resolution] 


/**

 * Updates the version of a dependency in the task list.

 * @param {string} dependencyName - The name of the dependency to update.
 * @param {string} newVersion - The new version number.
 * @returns {number} The number of tasks that were updated.
 */
function updateDependencyVersion(dependencyName, newVersion) {
    let updatedCount = 0;
    const versionRegex = new RegExp(`${dependencyName}@\\d+\\.\\d+\\.\\d+`, 'i');

    _tasks.forEach(task => {
        if (versionRegex.test(task.title)) {
            task.title = task.title.replace(versionRegex, `${dependencyName}@${newVersion}`);
            updatedCount++;
        }
    });

    return updatedCount;
}

/**
 * Gets tasks that reference a specific dependency.

 * @param {string} dependencyName - The name of the dependency to search for.
 * @returns {Array} Array of tasks that reference the specified dependency.
 */
function getTasksByDependency(dependencyName) {
    const dependencyRegex = new RegExp(`${dependencyName}@\\d+\\.\\d+\\.\\d+`, 'i');
    return _tasks.filter(task => dependencyRegex.test(task.title));
}

/**
 * Adds a dependency update task to the task list.

 * @param {string} dependencyName - The name of the dependency to update.
 * @param {string} currentVersion - The current version of the dependency.
 * @param {string} newVersion - The new version to update to.
 * @param {string} [priority='medium'] - The priority of the update task.
 * @returns {number} The ID of the created task.
 */
function addDependencyUpdateTask(dependencyName, currentVersion, newVersion, priority = 'medium') {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
        throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
    }

    const task = {
        id: _state.nextId++,
        title: `Update ${dependencyName} from ${currentVersion} to ${newVersion}`,
        completed: false,
        createdAt: Date.now(),
        tags: ['dependency', 'update'],
        priority: priority
    };

    _tasks.push(task);
    return task.id;
}


// Export all functions
module.exports = {
  addTask,
  resetTaskIdCounter,
  getTasksSortedByTitle,
  getTasksSortedAlphabetically,
  getTasksByMultipleCriteriaOr,
  getTasksByMultipleCriteriaAnd,
  getTasksByMultipleCriteria,
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
  getTasksByPriority,
  getTasksByCreationDate,
  clearAllTasks,
  getTaskCount,
  getCompletedTaskCount,
  getIncompleteTaskCount,
  getTasksGroupedByPriority,
  getTasksGroupedByCompletion,
  getTasksByCompletion,
  getTasksByPriorityFilter,
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
  getTasksByCompletionAndPriority,
  getTasksByMultiplePriorities,
  getTasksByMultipleCompletionStatuses,
  getTasksByTagAndPriority,
  getTasksByTagAndCompletion,
  getTasksByPriorityAndDateRange,
  getTasksByCompletionAndDateRange,
  getTasksByTagPriorityAndCompletion,
  getTasksByTagPriorityAndDateRange,
  getTasksByTagCompletionAndDateRange,
  getTasksByPriorityCompletionAndDateRange,
  getTasksByAllCriteria,
  updateTaskProperties,
  duplicateTask,
  moveTask,
  getTasksSorted,
  getTasksPaginated,
  searchTasks,
  updateDependencyVersion,
  getTasksByDependency,
  addDependencyUpdateTask
};