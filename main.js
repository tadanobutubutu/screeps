// memory.visualizer.js
// Visualizer for memory-related data

class MemoryVisualizer {
  constructor() {
    this.memoryData = [];
    this.maxSize = 1000;
  }

  addMemoryEntry(entry) {
    if (this.memoryData.length >= this.maxSize) {
      this.memoryData.shift();
    }
    this.memoryData.push(entry);
    return this;
  }

  getMemorySnapshot() {
    return this.memoryData.slice();
  }

  getRecentEntries(count = 10) {
    return this.memoryData.slice(-count);
  }

  clearMemory() {
    this.memoryData = [];
    return this;
  }

  getMemoryStats() {
    return {
      count: this.memoryData.length,
      maxSize: this.maxSize
    };
  }
}

module.exports = MemoryVisualizer;