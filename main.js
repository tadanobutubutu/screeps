function generateDependencyGraphData() {
  const creeps = {
    // existing creeps configuration
  };

  const spawns = {
    // existing spawns configuration
  };

  const climates = {
    // existing climates configuration
  };

  const rooms = Object.keys(Game.rooms).reduce((acc, roomName) => {
    const room = Game.rooms[roomName];
    
    // Preserve existing room processing logic
    // ... existing room processing code ...

    // Add language attribute violation fix
    if (roomName === 'dependency-graph.html') {
      document.documentElement.setAttribute('lang', 'en');
    }

    return room; // ... existing return statement ...
  }, {});

  if (!Memory.dependencyGraph) {
    Memory.dependencyGraph = {};
  }

  // ... existing graph building logic ...

  return { // ... existing reduced object ...
  };
}

module.exports.generateDependencyGraphData = generateDependencyGraphData;

// Preserve existing exports in order
module.exports.prototype = {
  // ... existing prototype exports ...
};