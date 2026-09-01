// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report
// ----- END ORIGINAL CODE-----

/**
 * Main entry point for the Screeps bot.
 * Handles core game logic and integration points.
 */
class ScreepsBot {
  constructor() {
    this.network = null;
    this.tasks = [];
    this.config = {};
  }

  async start() {
    // Initialize network connection
    await this.network.connect();

    // Load initial data
    await this.loadData();

    console.log('Screenspider bot started');
  }

  loadData() {
    // Placeholder for data loading logic
    // Implement actual data fetching here
  }

  // Accessibility enhancement: Ensure all UI elements are properly labeled
  setElementLabel(elementId, label) {
    const el = document.getElementById(elementId);
    if (el) {
      el.setAttribute('aria-label', label);
      el.setAttribute('role', 'button');
    }
  }

  // New feature: Priority-based task scheduling
  addTaskWithPriority(taskFn, priority = 'medium') {
    this.tasks.push({ task: taskFn, priority });
    this.scheduleTasks();
  }

  scheduleTasks() {
    // Sort tasks by priority (high > medium > low)
    this.tasks.sort((a, b) => {
      const prioOrder = { high: 0, medium: 1, low: 2 };
      return prioOrder[b.priority] - prioOrder[a.priority];
    });

    // Execute highest priority task
    if (this.tasks.length > 0) {
      const nextTask = this.tasks[0];
      try {
        nextTask.task();
      } catch (err) {
        console.error(`Task failed: ${err.message}`);
      }
    }
  }

  // TODO: Implement the new function as per the issue requirements
  /**
   * New function to process tasks in batches
   * @param {number} batchSize - Number of tasks to process in each batch
   * @returns {Promise<void>} Resolves when all batches are processed
   */
  async processTasksInBatches(batchSize = 5) {
    if (this.tasks.length === 0) return;

    // Sort tasks by priority before processing
    this.scheduleTasks();

    // Process tasks in batches
    for (let i = 0; i < this.tasks.length; i += batchSize) {
      const batch = this.tasks.slice(i, i + batchSize);

      await Promise.all(batch.map(async (taskItem) => {
        try {
          await taskItem.task();
        } catch (err) {
          console.error(`Batch task failed: ${err.message}`);
        }
      }));
    }

    // Clear processed tasks
    this.tasks = [];
  }
}

// Helper function for UI updates with accessibility
function updateUI(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
    element.setAttribute('aria-live', 'polite');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ScreepsBot, updateUI };
}