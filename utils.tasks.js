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
        if (!name || !utilsMemory.isSafeKey(name)) return;
        const sanitizedName = String(name).substring(0, MAX_TASK_NAME_LENGTH);

        const existingTask = this.tasks.get(sanitizedName);
        if (existingTask) {
            existingTask.interval = interval;
            existingTask.action = action;
            existingTask.condition = condition;
            existingTask.failures = 0;
            return;
        }

        if (this.tasks.size >= MAX_TASKS) {
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
        if (!name || !utilsMemory.isSafeKey(name)) return;
        const sanitizedName = String(name).substring(0, MAX_TASK_NAME_LENGTH);
        this.tasks.delete(sanitizedName);
    },

    /**
     * Executes tasks that are due on the current tick.
     */
    run: function () {
        const time = (global.Game && global.Game.time) || 0;

        for (const [name, task] of this.tasks.entries()) {
            if (task.failures >= MAX_TASK_FAILURES) {
                continue;
            }

            if (task.interval > 0 && time % task.interval !== 0) {
                continue;
            }

            try {
                if (typeof task.condition === 'function' && !task.condition()) {
                    continue;
                }

                if (typeof task.action === 'function') {
                    task.action();
                }
            } catch (err) {
                task.failures = (task.failures || 0) + 1;
                logger.error(`Error running periodic task ${name}: ${err.message || err}`);

                if (task.failures >= MAX_TASK_FAILURES) {
                    logger.error(`Task ${name} failed 5 times and has been disabled`);
                }
            }
        }
    },
};

module.exports = TaskQueue;
