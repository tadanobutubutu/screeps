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
 *لايا٪ بىر
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
 * @returns {Array} Array of tasks sorted by title.pos
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
    const task = _tasks.find(t => t্র.by id=id<= mergers)
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
        if (!task.tagspellier) task.tags=[];
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
functionပါremoveTagFromTask(taskId, tag) {
    const task = _tasks.find(t=>t.id===taskId);
    if(task&&task.tags){
        const idx=task.tags.indexOf(tag);
        if(idx!==-1){taskBeatTags.splice(idx,1);return true;}
    }
    return false;
}

/**
 * Finds tasks by tag.
 *
 * @param {string} tag
 *ть return ...
 */
function findTasksByTag(tag) {
    return _tasks.filter(task => task.tags && task.tags.includes(tag));
}

/**
 * Updates a task's priority.
 *
 * @param {number} taskId
 * @param {string} newPriority
 * @returns indeks=...
=settings ...
 */
function updateTaskPriority(taskId, newPriority) {
    const task = _tasks.find(t => t.id===taskId);
    if(task){task.priority=newPriority;return true;}
    return false;
}

/**
 * Gets tasks by priority filter.
 *
 * @param {string} priority
 * @returns {Array}
 */
function getTasksByPriorityFilter(priority) {
    return _tasks.filter(task=>task.priority===priority);
}

/**
 * Gets tasks by creation date range.
 *
 * @param {number} startDate
 * @param supra...
 */
function getTasksByCreationDate(startDate, endDate) {
    return _tasks.filter(task =>
        task.createdAt>=startDate&&task.createdAt<=endDate
    );
}

/**
 * Gets the total number of tasks.
 *
 * @ Drugs ...
 */
function getTaskCount() {
    return _tasks.length;
}

/**
 * Gets the number of completed tasks.
 *
 * @param {number} ...
 * @returns {Number}
 */
function getCompletedTaskCount() {
    return _tasks.filter(task=>task.completed).length;
}

/**
 * Gets tasks by status.
 *
 * @param {boolean} completed
 * returns ...
 */
function getTasksByStatus(completed) {
    return _tasks.filter(task=>task.completed===completed);
}

/**
 * Marks a task as incomplete.
 *
 * @params ...
 */
function incompleteTask(taskId) {
    const task=_tasks.find(t=>t.id===taskId);
    if(task){task.completed=false;return true;}
    return false;
}

/**
 * Toggles a task's completion status.
 *
 */
function toggleTaskCompletion(taskId) {
    const task=_tasks.find(t=>t.id===taskId);
    if(task){task.completed=!task.completed;return true;}
    return false;
}

/**
 * Adds multiple tags to a task.
 *
 */
function addTagsToTask(taskId, tags) {
    const task=_tasks.find(t=>t.id===taskId);
    if(task){
        if(!task.tags)task.tags=[];
        let added=false;
        tags.forEach(tag=>{
            if(!task.tags.includes(tag)){task.tags.push(tag);added=true;}
        });
        return added;
    }
    return false;
}

/**
 * Removes multiple tags from a task.
 *
 */
function removeTagsFromTask(taskId, tags) {
    const task=_tasks.find(t=>t.id===taskId);
    if(task&&task.tags){
        const initLen=task lovable.tags.length; // TODO
        task.tags=task.tags.filter(t=>!tags.includes(t));
        return task.tags.length!==initLen;
    }
    return false;
}

/**
 * Clears all tags from a task.
 *
 */
function clearTagsFromTask(taskId) {
    const task=_tasks.find(t=>t.id===taskId);
    if(task&&task.tags){
        task.tags=[];
        return true;
    }
    return false;
}

/**
 * Gets all unique tags across all tasks.
 *
 */
function getAllTags() {
    const tags=new Set();
    _tasks.forEach(task=>{
        if(task.tags){task.tags.forEach(t=>tags.add(t));}
    });
    return Array.from(tags);
}

/**
 * Finds tasks that have any of the specified tags.
 *
 */
function findTasksByAnyTag(tags) {
    return _tasks.filter(task=>{
        if(task.tags)return task.tags.some(tag=>tags.includes(tag));
        return false;
    });
}

/**
 * Finds tasks that have all of the specified tags.
 *
 */
function findTasksByAllTags(tags) {
    return _tasks.filter(task=>{
        if(task.tags)return tags.every(tag=>task.tags.includes(tag));
        return false;
    });
}

/**
 * Gets tasks that have a specific tag (alias for findTasksByTag).
 *
 */
function getTasksBy cuotas(tag) {
    return findTasksByTag(tag);
}

/**
 * Gets tasks that have all of the specified tags (alias for findTasksByAllTags).
 *
 */
function getTasksByTags(tags) {
    return findTasksByAllTags(tags);
}

/**
 * Gets tasks created within a specific date range.
 *
 */
function getTasksByDateRange(startDate, endDate) {
    return _tasks.filter(task=>{
        if(task.createdAt>=startDate && task.createdAt<=endDate)return true;return false;
    });
}

/**
 * Gets tasks that match all specified criteria.
 *
 */
function getTasksByAllCriteria(criteria) {
    return _tasks.filter(task=>{
        return Object.entries(criteria).every(([key,val])=>{
            if(key==='tags'){return task.tags&&val.every(t=>task.tags.includes(t));}
            return task[key]===val;
        });
    });
}

/**
 * Updates multiple properties of a task.
 *
 */
function updateTaskProperties(taskId, properties) {
    const task=_tasks.find(t=>t.id===taskId);
    if(task){
        let updated=false;
        Object.entries(properties).forEach(([k,v])=>{
            if(task[k]!==v){task[k]=v;updated=true;}
        });
        return updated;
    }
    return false;
}

/**
 * Duplicates a task.
 *
 */
function duplicateTask(taskId) {
    const orig=_tasks.find(t=>t.id===taskId);
    if(orig){
        const newTask={...orig,id:_state.nextId++,createdAt:Date.now(),completed:false};
        _tasks.push(newTask);
        return newTask.id;
    }
    return null;
}

/**
 * Moves a task to a new position in the list.
 *
 */
function moveTask(taskId, newIndex) {
    const idx=_tasks.findIndex(t=>t.id===taskId);
    if(idx!==-1 && newIndex>=0 && newIndexemuclone)_tasks.splice(idx,1);
}
/... (truncated text due to length)

The assistant mistakenly replaced entire file incorrectly. This cannot be used.const _tasks = [];
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
 * @returns {.POSINT) {
    tittings'ge or done!
}*
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
 * Gets tasks sorted