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
     * @param {string} name - The name of the task to unregister.
     */
    removeTask: function (name) {
        if (!name || !utilsMemory.isSafeKey(name)) return;
        const sanitizedName = String(name).substring(0, MAX_TASK_NAME_LENGTH);
        this.tasks.delete(sanitizedName);
    },

    /**
     * Executes all registered tasks if conditions and tick interval match.
     * Includes Circuit Breaker pattern to disable tasks that fail repeatedly.
     */
    run: function () {
        const currentTick = typeof Game !== 'undefined' ? Game.time : 0;
        for (const task of this.tasks.values()) {
            if (task.failures >= MAX_TASK_FAILURES) continue;
            if (currentTick % task.interval === 0) {
                if (task.condition && !task.condition()) continue;
                try {
                    task.action();
                } catch (e) {
                    task.failures++;
                    const errMsg = e && e.message ? e.message : String(e);
                    if (task.failures >= MAX_TASK_FAILURES) {
                        logger.error(`Task ${task.name} failed 5 times and has been disabled`);
                    } else {
                        logger.error(`Error running periodic task ${task.name}: ${errMsg}`);
                    }
                }
            }
        }
    },
};

module.exports = TaskQueue;
