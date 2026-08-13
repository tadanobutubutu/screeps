// memory.visualizer.js
// Memory Visualization Module

class MemoryBlock {
  constructor(address, size, type) {
    this.address = address;
    this.size = size;
    this.type = type;
    this.used = false;
  }
}

class MemoryVisualizer {
  constructor(config) {
    this.blocks = [];
    this.totalMemory = 0;
    this.usedMemory = 0;
    this.config = config || {};
    this.init();
  }

  init() {
    if (this.config && typeof this.config.onUpdate === 'function') {
      this.config.onUpdate();
    }
  }

  addBlock(address, size, type) {
    var block = new MemoryBlock(address, size, type);
    this.blocks.push(block);
    this.totalMemory = this.totalMemory + size;
    return block;
  }

  allocate(address, size) {
    for (var i = 0; i < this.blocks.length; i++) {
      var block = this.blocks[i];
      if (block.address === address && block.used === false) {
        block.used = true;
        this.usedMemory = this.usedMemory + block.size;
        return true;
      }
    }
    return false;
  }

  deallocate(address) {
    for (var i = 0; i < this.blocks.length; i++) {
      var block = this.blocks[i];
      if (block.address === address && block.used === true) {
        block.used = false;
        this.usedMemory = this.usedMemory - block.size;
        return true;
      }
    }
    return false;
  }

  getStats() {
    var total = this.totalMemory;
    var used = this.usedMemory;
    var free = total - used;
    var usagePercent = 0;
    
    if (total > 0) {
      usagePercent = (used / total) * 100;
    }
    
    return {
      total: total,
      used: used,
      free: free,
      usagePercent: usagePercent
    };
  }

  render() {
    var stats = this.getStats();
    var output = 'Memory Visualizer\n';
    output += '==================\n';
    output += 'Total: ' + stats.total + ' bytes\n';
    output += 'Used: ' + stats.used + ' bytes\n';
    output += 'Free: ' + stats.free + ' bytes\n';
    output += 'Usage: ' + stats.usagePercent.toFixed(2) + '%\n';
    
    var bar = '[';
    for (var i = 0; i < this.blocks.length; i++) {
      var block = this.blocks[i];
      if (block.used) {
        bar = bar + '#';
      } else {
        bar = bar + '-';
      }
    }
    bar = bar + ']';
    output = output + bar + '\n';
    
    return output;
  }

  clear() {
    this.blocks = [];
    this.totalMemory = 0;
    this.usedMemory = 0;
  }
}

module.exports = MemoryVisualizer;