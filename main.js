/**
 * Memory Visualizer Module
 * Handles visualization of memory management and heap allocation
 */

class MemoryVisualizer {
  constructor(options = {}) {
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.heapData = [];
    this.stackData = [];
  }

  /**
   * Visualizes heap memory allocation
   * @param {Object} memoryData - Memory allocation data
   */
  visualizeHeap(memoryData) {
    if (!memoryData) {
      return null;
    }
    
    const canvas = this.createCanvas();
    const ctx = canvas.getContext('2d');
    
    // Draw heap blocks
    memoryData.blocks.forEach((block, index) => {
      this.drawHeapBlock(ctx, block, index);
    });
    
    return canvas;
  }

  /**
   * Creates a canvas element for visualization
   * @returns {HTMLCanvasElement}
   */
  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    return canvas;
  }

  /**
   * Draws a single heap block on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} block - Heap block data
   * @param {number} index - Block index
   */
  drawHeapBlock(ctx, block, index) {
    const x = (index % 10) * 80 + 10;
    const y = Math.floor(index / 10) * 60 + 10;
    const width = 70;
    const height = 50;
    
    ctx.fillStyle = this.getBlockColor(block.type);
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
    
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.fillText(`Addr: ${block.address}`, x + 5, y + 20);
    ctx.fillText(`Size: ${block.size}`, x + 5, y + 35);
  }

  /**
   * Returns color based on memory block type
   * @param {string} type - Block type
   * @returns {string} Color hex code
   */
  getBlockColor(type) {
    const colors = {
      'object': '#ff6b6b',
      'array': '#4ecdc4',
      'string': '#45b7d1',
      'function': '#96ceb4',
      'number': '#ffeaa7',
      'boolean': '#dfe6e9',
      'undefined': '#b2bec3',
      'null': '#636e72'
    };
    return colors[type] || '#ffffff';
  }

  /**
   * Updates the visualizer with new memory state
   * @param {Object} memoryState - Current memory state
   */
  updateVisualization(memoryState) {
    if (memoryState && memoryState.heap) {
      this.heapData = memoryState.heap;
    }
    if (memoryState && memoryState.stack) {
      this.stackData = memoryState.stack;
    }
  }

  /**
   * Clears all memory visualization data
   */
  clearData() {
    this.heapData = [];
    this.stackData = [];
  }

  /**
   * Gets current visualization data
   * @returns {Object} Current visualization state
   */
  getData() {
    return {
      heap: this.heapData,
      stack: this.stackData,
      timestamp: Date.now()
    };
  }

  /**
   * Exports visualization as image
   * @param {string} format - Image format (png, jpeg)
   * @returns {string} Base64 encoded image data
   */
  exportAsImage(format = 'png') {
    const canvas = this.createCanvas();
    const ctx = canvas.getContext('2d');
    
    // Redraw all data
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, this.width, this.height);
    
    this.heapData.forEach((block, index) => {
      this.drawHeapBlock(ctx, block, index);
    });
    
    return canvas.toDataURL(`image/${format}`);
  }
}

module.exports = MemoryVisualizer;