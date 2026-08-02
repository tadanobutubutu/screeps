/**
 * Memory Visualizer Module
 * Handles visualization and tracking of memory usage
 */

const memoryHistory = [];
const MAX_HISTORY_SIZE = 100;

/**
 * Get current memory usage statistics
 * @returns {Object} Memory usage data
 */
function getMemoryUsage() {
    if (typeof performance !== 'undefined' && performance.memory) {
        return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
    }
    return {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0
    };
}

/**
 * Record current memory state to history
 * @param {string} label - Optional label for this snapshot
 */
function recordSnapshot(label = 'snapshot') {
    const usage = getMemoryUsage();
    const snapshot = {
        timestamp: Date.now(),
        label: label,
        ...usage
    };
    
    memoryHistory.push(snapshot);
    
    if (memoryHistory.length > MAX_HISTORY_SIZE) {
        memoryHistory.shift();
    }
    
    return snapshot;
}

/**
 * Get memory history
 * @returns {Array} Array of memory snapshots
 */
function getHistory() {
    return [...memoryHistory];
}

/**
 * Clear memory history
 */
function clearHistory() {
    memoryHistory.length = 0;
}

/**
 * Calculate memory growth between two snapshots
 * @param {number} index1 - First snapshot index
 * @param {number} index2 - Second snapshot index
 * @returns {Object|null} Growth data or null if indices invalid
 */
function calculateGrowth(index1, index2) {
    if (index1 < 0 || index2 < 0) {
        return null;
    }
    if (index1 >= memoryHistory.length || index2 >= memoryHistory.length) {
        return null;
    }
    
    const snapshot1 = memoryHistory[index1];
    const snapshot2 = memoryHistory[index2];
    
    return {
        usedChange: snapshot2.usedJSHeapSize - snapshot1.usedJSHeapSize,
        totalChange: snapshot2.totalJSHeapSize - snapshot1.totalJSHeapSize,
        timeDelta: snapshot2.timestamp - snapshot1.timestamp
    };
}

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted string
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

module.exports = {
    getMemoryUsage,
    recordSnapshot,
    getHistory,
    clearHistory,
    calculateGrowth,
    formatBytes
};