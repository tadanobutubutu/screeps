// utils.tasks.js

// ... other task-related code ...

/**
 * Task priority levels
 * @enum {number}
 */
const Priority = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3
};

// ... other task-related code ...

/**
 * Creates a new task object
 * @param {string} name - The name of the task
 * @param {number} priority - The priority level
 * @param {Function} [callback] - Optional callback function
 * @returns {Object} A task object
 */
function createTask(name, priority, callback) {
    return {
        name: name || 'unnamed',
        priority: priority || Priority.LOW,
        callback: typeof callback === 'function' ? callback : null,
        created: Date.now()
    };
}

// ... resolve the syntax error by ensuring proper syntax at the end of functions ...
// ... other task-related code ...

module.exports = {
    Priority,
    createTask
    // ... other exports ...
};