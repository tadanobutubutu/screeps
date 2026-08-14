// memory.visualizer.js

class MemoryVisualizer {
  constructor(options = {}) {
    this.maxMemory = options.maxMemory || 1000;
    this.currentMemory = 0;
    this.history = [];
    this.threshold = options.threshold || 0.8;
  }

  allocate(bytes) {
    if (bytes <= 0) {
      throw new Error('Allocation size must be positive');
    }
    
    const previousMemory = this.currentMemory;
    this.currentMemory += bytes;
    
    if (this.currentMemory > this.maxMemory) {
      this.currentMemory = this.maxMemory;
      this.history.push({
        timestamp: Date.now(),
        type: 'overflow',
        value: bytes
      });
      return false;
    }
    
    this.history.push({
      timestamp: Date.now(),
      type: 'allocate',
      value: bytes
    });
    
    return {
      success: true,
      previousMemory,
      currentMemory: this.currentMemory
    };
  }

  deallocate(bytes) {
    if (bytes <= 0) {
      throw new Error('Deallocation size must be positive');
    }
    
    const previousMemory = this.currentMemory;
    this.currentMemory = Math.max(0, this.currentMemory - bytes);
    
    this.history.push({
      timestamp: Date.now(),
      type: 'deallocate',
      value: bytes
    });
    
    return {
      previousMemory,
      currentMemory: this.currentMemory
    };
  }

  getUtilization() {
    return this.currentMemory / this.maxMemory;
  }

  isAboveThreshold() {
    return this.getUtilization() > this.threshold;
  }

  reset() {
    this.currentMemory = 0;
    this.history = [];
  }

  getHistory() {
    return [...this.history];
  }

  getStats() {
    return {
      current: this.currentMemory,
      max: this.maxMemory,
      utilization: this.getUtilization(),
      aboveThreshold: this.isAboveThreshold(),
      historyLength: this.history.length
    };
  }
}

module.exports = MemoryVisualizer;