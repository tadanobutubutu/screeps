Here is the resolved file content:

```javascript
// utils.tasks.js

/**
 * Task utility functions for the application
 */

/**
 * Default task configuration
 */
const DEFAULT_CONFIG = {
  timeout: 5000,
  retries: 3,
  priority: 'normal'
};

/**
 * Executes a task with the given options
 * @param {Object} options - Task options
 * @param {Function} callback - Task callback
 */
function executeTask(options, callback) {
  const config = Object.assign({}, DEFAULT_CONFIG, options);

  try {
    const result = callback(config);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Creates a new task with the given parameters
 * @param {string} name - Task name
 * @param {Object} params - Task parameters
 * @returns {Object} Task object
 */
function createTask(name, params) {
  return {
    id: Date.now(),
    name: name,
    params: params,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
}

/**
 * Updates an existing task
 * @param {Object} task - Task to update
 * @param {Object} updates - Updates to apply
 * @returns {Object} Updated task
 */
function updateTask(task, updates) {
  return Object.assign({}, task, updates, {
    updatedAt: new Date().toISOString()
  });
}

/**
 * Deletes a task by ID
 * @param {Array} tasks - Array of tasks
 * @param {number} taskId - Task ID to delete
 * @returns {Array} Filtered tasks array
 */
function deleteTask(tasks, taskId) {
  return tasks.filter(task => task.id !== taskId);
}

/**
 * Role for healing creeps.
 * Heals self if damaged and then heals the closest wounded allied creep. Also, it contains an additional IF condition to heal creeps with the 'healer' role.
 */
const roleHealer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // Heal self if damaged
        if (creep.hits < creep.hitsMax || creep.memory.role === 'healer') {
            creep.heal(creep);
        }

        // Find wounded allies to heal
        var target = creep.pos.findClosestByRange(FIND_CREEPS, {
            filter: function(ally) {
                return ally.hits < ally.hitsMax && ally.my && ally.memory.role !== 'healer';
            }
        });

        if (target) {
            if (creep.heal(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    }
};

// Export utility functions and roleHealer
module.exports = {
  executeTask,
  createTask,
  updateTask,
  deleteTask,
  DEFAULT_CONFIG,
  roleHealer
};
```

In this resolution, I kept both changes. The first change was about adding a condition to heal the creep with the 'healer' role added. The second change was about filtering the wounded allies by not selecting creeps with the 'healer' role. To reconcile these two changes, I added an additional condition in `roleHealer.run` function to check if the creep hits are low or if the creep has the 'healer' role. Also, I filtered the wounded allies to exclude creeps with the 'healer' role in the `findClosestByRange` call. I preserved comments and style in this solution.