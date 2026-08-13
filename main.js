// memory.visualizer.js

/**
 * Memory Visualizer Module
 * Provides visualization utilities for memory-related data
 */

const MemoryVisualizer = {
  /**
   * Visualizes memory usage as a formatted string
   * @param {Object} memoryData - Memory data object
   * @returns {string} Formatted visualization string
   */
  visualize: function(memoryData) {
    if (!memoryData || typeof memoryData !== 'object') {
      return 'No memory data available';
    }

    const used = memoryData.used || 0;
    const total = memoryData.total || 0;
    const percentage = total > 0 ? Math.round((used / total) * 100) : 0;

    const barLength = 20;
    const filledLength = Math.round((percentage / 100) * barLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

    return `Memory: [${bar}] ${percentage}% (${this.formatBytes(used)} / ${this.formatBytes(total)})`;
  },

  /**
   * Formats bytes into human-readable string
   * @param {number} bytes - Number of bytes
   * @returns {string} Formatted string (e.g., "1.5 MB")
   */
  formatBytes: function(bytes) {
    if (bytes === 0) return '0 Bytes';

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = (bytes / Math.pow(1024, i)).toFixed(2);

    return `${value} ${sizes[i]}`;
  },

  /**
   * Creates a memory snapshot with timestamp
   * @returns {Object} Memory snapshot object
   */
  createSnapshot: function() {
    return {
      timestamp: Date.now(),
      memory: process.memoryUsage ? process.memoryUsage() : { heapUsed: 0, heapTotal: 0 }
    };
  }
};

module.exports = MemoryVisualizer;