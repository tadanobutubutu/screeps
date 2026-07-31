// Task utility functions for the project

const taskUtils = {
  /**
   * Process a task and return the result
   * @param {Object} task - The task to process
   * @returns {Promise<Object>} Processed task result
   */
  async processTask(task) {
    if (!task || typeof task !== 'object') {
      throw new Error('Invalid task provided');
    }

    // Validate task has required properties
    if (!task.id || !task.name) {
      throw new Error('Task must have id and name properties');
    }

    // Execute task processing logic
    const result = await this.executeTask(task);
    
    return {
      ...result,
      processedAt: new Date().toISOString()
    };
  },

  /**
   * Execute the actual task
   * @param {Object} task - Task to execute
   * @returns {Promise<Object>} Execution result
   */
  async executeTask(task) {
    // Simulate async task execution
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          taskId: task.id,
          status: 'completed',
          output: `Processed: ${task.name}`
        });
      }, 100);
    });
  },

  /**
   * Validate task configuration
   * @param {Object} config - Configuration object
   * @returns {boolean} Whether configuration is valid
   */
  validateConfig(config) {
    if (!config) return false;
    
    const requiredFields = ['timeout', 'retries'];
    return requiredFields.every(field => field in config);
  }
};

// Export task utilities
module.exports = taskUtils;