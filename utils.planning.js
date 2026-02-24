// Room Planning Utilities
// Basic implementations inspired by Distance Transform and Floodfill concepts

module.exports = {
  // Find open spaces in a room (simplified Distance Transform concept)
  findOpenSpaces: function(room, minSize = 3) {
    const terrain = room.getTerrain();
    const openSpaces = [];
    
    // Scan room for open areas
    for (let x = minSize; x < 50 - minSize; x++) {
      for (let y = minSize; y < 50 - minSize; y++) {
        if (this.isOpenArea(room, x, y, minSize, terrain)) {
          openSpaces.push({ x, y, size: minSize });
        }
      }
    }
    
    return openSpaces;
  },
  
  // Check if an area is open (no walls/terrain)
  isOpenArea: function(room, centerX, centerY, size, terrain) {
    terrain = terrain || room.getTerrain();
    
    for (let dx = -size; dx <= size; dx++) {
      for (let dy = -size; dy <= size; dy++) {
        const x = centerX + dx;
        const y = centerY + dy;
        
        if (x < 0 || x >= 50 || y < 0 || y >= 50) return false;
        if (terrain.get(x, y) === TERRAIN_MASK_WALL) return false;
      }
    }
    
    return true;
  },
  
  // Find best position for spawn near controller and sources
  findBestSpawnPosition: function(room) {
    const controller = room.controller;
    const sources = room.find(FIND_SOURCES);
    
    if (!controller || sources.length === 0) return null;
    
    const openSpaces = this.findOpenSpaces(room, 2);
    let bestPos = null;
    let bestScore = Infinity;
    
    openSpaces.forEach(space => {
      const pos = new RoomPosition(space.x, space.y, room.name);
      
      // Calculate distance score (lower is better)
      const controllerDist = pos.getRangeTo(controller);
      const sourceDist = Math.min(...sources.map(s => pos.getRangeTo(s)));
      const score = controllerDist * 2 + sourceDist;
      
      if (score < bestScore) {
        bestScore = score;
        bestPos = pos;
      }
    });
    
    return bestPos;
  },
  
  // Get tiles at a certain distance from a position (Floodfill concept)
  getTilesAtDistance: function(room, centerPos, distance) {
    const tiles = [];
    const terrain = room.getTerrain();
    
    for (let x = Math.max(0, centerPos.x - distance); x <= Math.min(49, centerPos.x + distance); x++) {
      for (let y = Math.max(0, centerPos.y - distance); y <= Math.min(49, centerPos.y + distance); y++) {
        if (Math.abs(x - centerPos.x) + Math.abs(y - centerPos.y) === distance) {
          if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
            tiles.push(new RoomPosition(x, y, room.name));
          }
        }
      }
    }
    
    return tiles;
  },
  
  // Visualize room planning
  visualizePlanning: function(room, positions, color = '#00ff00') {
    if (!positions || positions.length === 0) return;
    
    positions.forEach(pos => {
      room.visual.circle(pos.x, pos.y, {
        radius: 0.4,
        fill: color,
        opacity: 0.5
      });
    });
  },
  
  // Find positions for road network between key structures
  planRoadNetwork: function(room) {
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    const sources = room.find(FIND_SOURCES);
    const controller = room.controller;
    
    if (!spawn) return [];
    
    const roadPositions = [];
    
    // Roads to sources
    sources.forEach(source => {
      const path = spawn.pos.findPathTo(source, { ignoreCreeps: true });
      path.forEach(step => {
        roadPositions.push(new RoomPosition(step.x, step.y, room.name));
      });
    });
    
    // Road to controller
    if (controller) {
      const path = spawn.pos.findPathTo(controller, { ignoreCreeps: true });
      path.forEach(step => {
        roadPositions.push(new RoomPosition(step.x, step.y, room.name));
      });
    }
    
    return roadPositions;
  },
  
  // Display planning info
  displayPlanningInfo: function(room) {
    const openSpaces = this.findOpenSpaces(room, 3);
    const bestSpawnPos = this.findBestSpawnPosition(room);
    
    console.log(`\n🏗️ Room Planning [${room.name}]:`);
    console.log(`   Open spaces (5x5+): ${openSpaces.length}`);
    
    if (bestSpawnPos) {
      console.log(`   Best spawn position: ${bestSpawnPos}`);
    }
    
    return { openSpaces, bestSpawnPos };
  }
};
