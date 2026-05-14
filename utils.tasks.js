const utilsMemory = require('./utils.memory');
const logger = require('./utils.logging');

/**
 * Security: Limits for task queue to prevent Memory DoS.
 */
const MAX_TASKS = 50;
const MAX_TASK_NAME_LENGTH = 100;
const MAX_TASK_FAILURES = 5;

const TaskQueue = {
    tasks: [],

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
        const existingTask = this.tasks.find((t) => t.name === sanitizedName);
        if (existingTask) {
            existingTask.interval = interval;
            existingTask.action = action;
            existingTask.condition = condition;
            // Security: Reset failure count when task is updated
            existingTask.failures = 0;
            return;
        }

        // Check queue capacity
        if (this.tasks.length >= MAX_TASKS) {
            // Security: Use safe logging to prevent console injection
            logger.warn(`TaskQueue: Maximum task limit reached. Skipping ${sanitizedName}`);
            return;
        }

        this.tasks.push({ name: sanitizedName, interval, action, condition, failures: 0 });
    },

    /**
     * Runs all tasks that are due for execution in the current tick.
     */
    run: function () {
        // ⚡ PERFORMANCE: Store tasks length and avoid resolving condition on each iteration if possible.
        const tasksLen = this.tasks.length;
        for (let i = 0; i < tasksLen; i++) {
            const task = this.tasks[i];

            // Security: Failure Circuit Breaker
            // If a task fails repeatedly, disable it to prevent log spam and CPU DoS.
            if ((task.failures || 0) >= MAX_TASK_FAILURES) {
                continue;
            }

            if (task.interval === 1 || Game.time % task.interval === 0) {
                if (task.condition()) {
                    try {
                        task.action();
                    } catch (e) {
                        // Record failure count
                        task.failures = (task.failures || 0) + 1;

                        // Security: Final warning before disabling task
                        if (task.failures === MAX_TASK_FAILURES) {
                            logger.error(
                                `TaskQueue: Task ${task.name} failed ${MAX_TASK_FAILURES} times and has been disabled.`
                            );
                        } else {
                            // Security: Use logger.error for safe stack traces and HTML escaping
                            logger.error(`Error running periodic task ${task.name}: ${e.message}`);
                        }
                    }
                }
            }
        }
    },

    /**
     * Unregisters a task by name.
     * @param {string} name - The name of the task to remove.
     */
    removeTask: function (name) {
        if (!name) return;
        const sanitizedName = String(name).substring(0, MAX_TASK_NAME_LENGTH);
        this.tasks = this.tasks.filter((t) => t.name !== sanitizedName);
    },
};

module.exports = TaskQueue;
