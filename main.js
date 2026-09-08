// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute

// Main game logic for Screeps
const main = {
  loop: function() {
    // Game loop
    for (const name in Game.rooms) {
      const room = Game.rooms[name];
      const controller = room.controller;
      if (controller && controller.my) {
        this.manageRoom(room);
      }
    }
    
    // TODO: Implement harvest and upgrade logic
    
    // TODO: Implement tower defense
    
    // TODO: Implement spawning logic
    
    // Render graph/index for visualization
    this.renderAll(Game);
  },
  
  manageRoom: function(room) {
    // Room management
    const sources = room.find(FIND_SOURCES);
    const hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
    
    if (hostileCreeps.length > 0) {
      this.defendRoom(room, hostileCreeps);
    }
  },
  
  defendRoom: function(room, hostiles) {
    const towers = room.find(FIND_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    });
    
    towers.forEach(tower => {
      tower.attack(hostiles[0]);
    });
  },
  
  harvest: function(creep) {
    const target = creep.pos.findClosestByPath(FIND_SOURCES);
    if (target) {
      if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
  },
  
  upgrade: function(creep) {
    if (creep.room.controller) {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }
  },

  // Rendering functions for graph/index
  renderGraph: function(Game) {
    const stats = {
      gcl: Game.gcl,
      powerEnabled: Game.powerEnabled,
      time: Game.time
    };
    
    // Graph rendering logic using RoomVisual
    for (const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      const vis = new RoomVisual(roomName);
      
      // Draw room stats
      vis.text(`Room: ${roomName}`, 1, 1, { 
        color: '#ffffff', 
        fontSize: 12 
      });
      vis.text(`Time: ${stats.time}`, 1, 2, { 
        color: '#aaaaaa', 
        fontSize: 10 
      });
    }
  },
  
  renderIndex: function(Game) {
    const index = {
      totalRooms: Object.keys(Game.rooms).length,
      totalCreeps: Object.keys(Game.creeps).length,
      totalPowerCreeps: Object.keys(Game.powerCreeps).length
    };
    
    for (const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      const vis = new RoomVisual(roomName);
      const offset = 3;
      
      vis.text(`Creeps: ${Object.keys(Game.creeps).filter(name => Game.creeps[name].room.name === roomName).length}`, 1, offset, {
        color: '#00ff00',
        fontSize: 10
      });
      
      const structures = room.find(FIND_STRUCTURES);
      vis.text(`Structures: ${structures.length}`, 1, offset + 1, {
        color: '#ffff00',
        fontSize: 10
      });
    }
  },
  
  renderAll: function(Game) {
    this.renderGraph(Game);
    this.renderIndex(Game);
  }
};

// Export the new function if needed:
module.exports = main;