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
    this.tasks.push({ name, interval, action, condition })
  },

  /**
   * Runs all tasks that are due for execution in the current tick.
   */
  run: function () {
    // ⚡ PERFORMANCE: Store tasks length and avoid resolving condition on each iteration if possible.
    const tasksLen = this.tasks.length
    for (let i = 0; i < tasksLen; i++) {
      const task = this.tasks[i]
      if (task.interval === 1 || Game.time % task.interval === 0) {
        if (task.condition()) {
          try {
            task.action()
          } catch (e) {
            console.log(`Error running periodic task ${task.name}: ${e.message}`)
          }
        }
      }
    }
  }
}

module.exports = TaskQueue
