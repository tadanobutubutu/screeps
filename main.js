// main.js
// Memory Visualizer implementation

(function (global) {
  'use strict';

  function MemoryVisualizer(options) {
    this.options = options || {};
    this.elements = [];
    this.values = [];
  }

  MemoryVisualizer.prototype.init = function (selector) {
    this.container = document.querySelector(selector);
    return this;
  };

  MemoryVisualizer.prototype.setData = function (data) {
    this.values = Array.isArray(data) ? data : [];
    return this;
  };

  MemoryVisualizer.prototype.compute = function () {
    this.total = this.values.reduce(function (acc, curr) {
      return acc + Number(curr || 0);
    }, 0);
    return this;
  };

  MemoryVisualizer.prototype.draw = function () {
    if (!this.container) {
      return this;
    }
    this.container.innerHTML = '';
    var self = this;
    this.values.forEach(function (val) {
      var el = document.createElement('div');
      el.className = 'memory-segment';
      var pct = self.total ? (val / self.total) * 100 : 0;
      el.style.width = pct + '%';
      self.container.appendChild(el);
    });
    return this;
  };

  MemoryVisualizer.prototype.render = function (selector, data) {
    this.init(selector).setData(data).compute().draw();
    return this;
  };

  global.MemoryVisualizer = MemoryVisualizer;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemoryVisualizer;
  }
})(typeof window !== 'undefined' ? window : this);