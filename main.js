/**
 * Memory Visualizer Module
 * Tracks and visualizes memory state changes over time
 */

class MemoryVisualizer {
  constructor(maxDepth = 10) {
    this.maxDepth = maxDepth;
    this.memoryHistory = [];
    this.currentSnapshot = null;
  }

  push(snapshot) {
    if (this.memoryHistory.length >= this.maxDepth) {
      this.memoryHistory.shift();
    }
    this.currentSnapshot = snapshot;
    this.memoryHistory.push({
      timestamp: Date.now(),
      data: snapshot
    });
    return this;
  }

  getCurrent() {
    return this.currentSnapshot;
  }

  getHistory() {
    return [...this.memoryHistory];
  }

  clear() {
    this.memoryHistory = [];
    this.currentSnapshot = null;
    return this;
  }

  visualize() {
    return this.memoryHistory.map((entry, index) => ({
      step: index + 1,
      timestamp: entry.timestamp,
      data: entry.data
    }));
  }
}

module.exports = MemoryVisualizer;