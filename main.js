// memory.visualizer.js

class MemoryVisualizer {
  constructor() {
    this.memory = [];
    this.maxSize = 1000;
  }

  add(entry) {
    if (this.memory.length >= this.maxSize) {
      this.memory.shift();
    }
    this.memory.push({
      timestamp: Date.now(),
      data: entry
    });
  }

  getLatest() {
    if (this.memory.length === 0) {
      return null;
    }
    return this.memory[this.memory.length - 1];
  }

  clear() {
    this.memory = [];
  }

  getAll() {
    return this.memory.slice();
  }

  visualize() {
    const container = document.getElementById('memory-container');
    if (!container) {
      return;
    }
    
    container.innerHTML = '';
    
    this.memory.forEach(function(entry) {
      const div = document.createElement('div');
      div.className = 'memory-entry';
      div.textContent = 'Data: ' + entry.data;
      container.appendChild(div);
    });
  }

  toJSON() {
    return JSON.stringify(this.memory);
  }

  fromJSON(json) {
    try {
      this.memory = JSON.parse(json);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
    }
  }
}

module.exports = MemoryVisualizer;