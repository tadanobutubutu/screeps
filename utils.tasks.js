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
   * Retrieves and removes the next task to execute.
   */
  dequeueTask: function () {
    const entry = this.tasks.entries().next();
    if (entry.done) return null;
    const [name, task] = entry.value;
    this.tasks.delete(name);
    return task;
  },

  /**
   * Adds a task back to the queue for future execution.
   */
  enqueueTask: function (task) {
    if (!this.tasks.has(task.name)) {
      this.tasks.set(task.name, task);
    }
  },

  /**
   * Processes all tasks, executing those whose conditions are met.
   */
  processTasks: function () {
    const allTasks = Array.from(this.tasks.values());
    for (const task of allTasks) {
      if (Date.now() >= task.interval) {
        try {
          if (task.condition()) {
            task.action();
          }
          this.enqueueTask({ ...task, interval: Date.now() + task.interval });
        } catch (err) {
          task.failures += 1;
          logger.error(`TaskQueue: Error executing task ${task.name} - ${err.message}`);
          if (task.failures >= MAX_TASK_FAILURES) {
            this.tasks.delete(task.name);
            logger.warn(`TaskQueue: Removing task ${task.name} after reaching failure limit`);
          }
        }
      }
    }
  }
};

module.exports = TaskQueue;