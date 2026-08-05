const MemoryVisualizer = require('./memory.visualizer.js');

function initializeVisualizer(config) {
  if (!config) {
    throw new Error('Configuration object is required');
  }

  const visualizer = new MemoryVisualizer(config);

  visualizer.render();

  return visualizer;
}

function formatMemorySnapshot(snapshot) {
  if (snapshot === null || snapshot === undefined) {
    return 'No snapshot available';
  }

  const entries = snapshot.entries || [];
  const formatted = entries.map(function(entry) {
    return {
      address: entry.address,
      size: entry.size,
      type: entry.type
    };
  });

  return formatted;
}

function getMemoryStats(memoryBlock) {
  if (memoryBlock === null || memoryBlock === undefined) {
    return { total: 0, used: 0, free: 0 };
  }

  const total = memoryBlock.total || 0;
  const used = memoryBlock.used || 0;
  const free = total - used;

  return { total: total, used: used, free: free };
}

function visualizeMemory(memoryData) {
  if (!memoryData) {
    console.warn('No memory data provided');
    return;
  }

  const visualizer = initializeVisualizer({
    target: 'memory-canvas',
    showAddresses: true,
    showSizes: true
  });

  const snapshot = formatMemorySnapshot(memoryData.snapshot);
  const stats = getMemoryStats(memoryData.block);

  visualizer.update(snapshot, stats);
  visualizer.render();

  return visualizer;
}

module.exports = {
  initializeVisualizer,
  formatMemorySnapshot,
  getMemoryStats,
  visualizeMemory
};