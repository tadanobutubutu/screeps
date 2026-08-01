/**
 * Memory Visualizer Module
 * Visualizes memory usage and statistics
 */

const memory = {
  used: 0,
  total: 0,
  history: []
};

/**
 * Initialize the memory visualizer
 * @param {number} totalMemory - Total available memory
 */
function initialize(totalMemory) {
  memory.total = totalMemory;
  memory.used = 0;
  memory.history = [];
}

/**
 * Update memory usage
 * @param {number} usedMemory - Current memory usage
 */
function updateMemory(usedMemory) {
  memory.used = usedMemory;
  memory.history.push({
    timestamp: Date.now(),
    used: usedMemory,
    total: memory.total
  });
}

/**
 * Get current memory statistics
 * @returns {Object} Memory statistics object
 */
function getStats() {
  return {
    used: memory.used,
    total: memory.total,
    free: memory.total - memory.used,
    percentage: (memory.used / memory.total) * 100
  };
}

/**
 * Clear memory history
 */
function clearHistory() {
  memory.history = [];
}

module.exports = {
  initialize,
  updateMemory,
  getStats,
  clearHistory,
  memory
};