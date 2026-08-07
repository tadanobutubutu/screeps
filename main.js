/**
 * Memory Visualizer Module
 * Provides visualization of browser memory usage
 */

class MemoryVisualizer {
  constructor(containerId) {
    this.containerId = containerId;
    this.data = null;
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error('Container not found:', this.containerId);
      return false;
    }
    return true;
  }

  updateData() {
    if (performance.memory) {
      this.data = {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
      return true;
    }
    return false;
  }

  getStatistics() {
    if (!this.data) {
      this.updateData();
    }
    if (!this.data) {
      throw new Error('Memory API not available');
    }
    return {
      used: this.data.usedJSHeapSize,
      total: this.data.jsHeapSizeLimit,
      percentage: Math.round((this.data.usedJSHeapSize / this.data.jsHeapSizeLimit) * 100)
    };
  }

  formatBytes(bytes) {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1048576) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else if (bytes < 1073741824) {
      return (bytes / 1048576).toFixed(2) + ' MB';
    } else {
      return (bytes / 1073741824).toFixed(2) + ' GB';
    }
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      return;
    }

    container.innerHTML = '';

    const stats = this.getStatistics();

    const wrapper = document.createElement('div');
    wrapper.className = 'memory-visualizer';

    const title = document.createElement('h3');
    title.textContent = 'Memory Usage';
    wrapper.appendChild(title);

    const statsDiv = document.createElement('div');
    statsDiv.className = 'memory-stats';
    statsDiv.innerHTML = 
      '<p>Used: ' + this.formatBytes(stats.used) + '</p>' +
      '<p>Total: ' + this.formatBytes(stats.total) + '</p>' +
      '<p>Percentage: ' + stats.percentage + '%</p>';
    wrapper.appendChild(statsDiv);

    const barContainer = document.createElement('div');
    barContainer.className = 'memory-bar-container';

    const bar = document.createElement('div');
    bar.className = 'memory-bar';
    bar.style.width = stats.percentage + '%';

    if (stats.percentage > 90) {
      bar.className += ' memory-bar-critical';
    } else if (stats.percentage > 70) {
      bar.className += ' memory-bar-warning';
    } else {
      bar.className += ' memory-bar-normal';
    }

    barContainer.appendChild(bar);
    wrapper.appendChild(barContainer);

    container.appendChild(wrapper);
  }

  startMonitoring(intervalMs) {
    const interval = intervalMs || 1000;
    this.monitorInterval = setInterval(() => {
      this.updateData();
      this.render();
    }, interval);
    return this.monitorInterval;
  }

  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MemoryVisualizer;
}