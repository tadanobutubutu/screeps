const utilsMemory = require('./utils.memory');
const logger = require('./utils.logging');

/**
 * Security: Limits for task queue to prevent Memory DoS.
 */
const MAX_TASKS = 50;
const MAX_TASK_NAME_LENGTH = 100;
const MAX_TASK_FAILURES = 5;

const TaskQueue = {
    tasks: new Map(),

    /**
     * Registers a new task to be executed periodically.
     * @param {string} name - The name of the task.
     * @param {number} interval - How often (in ticks) the task should run.
     * @param {function} action - The function to execute.
     * @param {function} condition - An optional function that must return true for the task to run.
     */
    registerTask: function (name, interval, action, condition = () => true) {
        // Security: Validate task name
        if (!utilsMemory.isSafeKey(name)) return;
        const sanitizedName = String(name).substring(0, MAX_TASK_NAME_LENGTH);

        // Check for duplicates to prevent queue bloating
        const existingTask = this.tasks.get(sanitizedName);
        if (existingTask) {
            existingTask.interval = interval;
            existingTask.action = action;
            existingTask.condition = condition;
            // Security: Reset failure count when task is updated
            existingTask.failures = 0;
            return;
        }

        // Check queue capacity
        if (this.tasks.size >= MAX_TASKS) {
            // Security: Use safe logging to prevent console injection
            logger.warn(`TaskQueue: Maximum task limit reached. Skipping ${sanitizedName}`);
            return;
        }

        this.tasks.set(sanitizedName, { name: sanitizedName, interval, action, condition, failures: 0 });
    },

    /**
     * Unregisters a task by name.
     * @param {string} name - The name of the task to remove.
     */
    removeTask: function (name) {
        if (!name || typeof name !== 'string') return;
        const sanitizedName = name.substring(0, MAX_TASK_NAME_LENGTH);
        this.tasks.delete(sanitizedName);
    },

    /**
     * Runs all registered tasks whose intervals align with Game.time and conditions are met.
     */
    run: function () {
        for (const [name, task] of this.tasks.entries()) {
            if (task.failures >= MAX_TASK_FAILURES) {
                continue;
            }

            if (Game.time % task.interval !== 0 && task.interval !== 1) {
                continue;
            }

            if (task.condition && typeof task.condition === 'function') {
                try {
                    if (!task.condition()) {
                        continue;
                    }
                } catch (e) {
                    continue;
                }
            }

            try {
                task.action();
            } catch (e) {
                task.failures++;
                logger.error(`Error running periodic task ${name}: ${e.message}`);
                if (task.failures >= MAX_TASK_FAILURES) {
                    logger.error(`Task ${name} failed 5 times and has been disabled`);
                }
            }
        }
    }
};

module.exports = TaskQueue;