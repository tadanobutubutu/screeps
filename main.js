const MemoryVisualizer = require('./memory.visualizer');

function initializeVisualizer(config) {
  const visualizer = new MemoryVisualizer(config);
  return visualizer;
}

function renderMemorySnapshot(snapshot, options) {
  if (!snapshot || typeof snapshot !== 'object') {
    return { error: 'Invalid snapshot data' };
  }

  const visualizer = initializeVisualizer(options);
  return visualizer.render(snapshot);
}

function getMemoryReport(memoryData) {
  if (!memoryData) {
    return { blocks: [], total: 0 };
  }

  const blocks = memoryData.blocks || [];
  const total = blocks.reduce((sum, block) => sum + (block.size || 0), 0);
  return { blocks, total };
}

module.exports = {
  initializeVisualizer,
  renderMemorySnapshot,
  getMemoryReport,
};