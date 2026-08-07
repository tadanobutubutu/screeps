// utils.tasks.js

/**
 * Task utilities for managing async operations
 * @module utils/tasks
 */

/**
 * Default task options
 */
const DEFAULT_OPTIONS = {
  timeout: 5000,
  retries: 3,
  retryDelay: 1000
};

/**
 * Creates a new task with the given configuration
 * @param {Object} config - Task configuration
 * @param {Function} config.handler - Task handler function
 * @param {Object} [config.options] - Task options
 * @returns {Object} Task instance
 */
function createTask(config) {
  if (!config || typeof config.handler !== 'function') {
    throw new Error('Task handler must be a function');
  }

  const options = { ...DEFAULT_OPTIONS, ...config.options };

  return {
    id: Date.now(),
    handler: config.handler,
    options,
    status: 'pending'
  };
}

/**
 * Executes a task with retry logic
 * @param {Object} task - Task to execute
 * @returns {Promise<any>} Task result
 */
async function executeTask(task) {
  const { retries, timeout } = task.options;
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      task.status = 'running';
      const result = await Promise.race([
        task.handler(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Task timeout')), timeout)
        )
      ]);
      task.status = 'completed';
      return result;
    } catch (error) {
      lastError = error;
      task.status = 'retrying';
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, task.options.retryDelay));
      }
    }
  }

  task.status = 'failed';
  throw lastError;
}

/**
 * Cancels a running task
 * @param {Object} task - Task to cancel
 */
function cancelTask(task) {
  if (task.status === 'running' || task.status === 'pending') {
    task.status = 'cancelled';
  }
}

/**
 * Gets the current status of a task
 * @param {Object} task - Task to check
 * @returns {string} Task status
 */
function getTaskStatus(task) {
  return task.status || 'unknown';
}

// Process emotion data and returns formatted results
/**
 * Processes emotion data and returns formatted results
 * @param {Object} emotionData - The emotion data to process
 * @returns {Object} Formatted emotion results
 */
function processEmotionData(emotionData) {
  // Ensure all string constants are properly terminated
  const result = {
    primaryEmotion: emotionData.primary || 'neutral',
    secondaryEmotions: emotionData.secondary || [],
    intensity: emotionData.intensity || 0.5,
    metadata: {
      source: emotionData.source || 'unknown',
      timestamp: emotionData.timestamp || new Date().toISOString()
    }
  };

  // Fixed unterminated string by properly closing the string
  const statusMessage = `Processed emotion data for ${emotionData.userId || 'anonymous'}`;

  return {
    ...result,
    status: statusMessage
  };
}

// ... (rest of the file remains unchanged)

module.exports = {
  createTask,
  executeTask,
  cancelTask,
  getTaskStatus,
  DEFAULT_OPTIONS,
  processEmotionData
};