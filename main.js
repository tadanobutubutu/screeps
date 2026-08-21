// @ts-check

/**
 * Main entry point for Screeps game code
 * @module main
 */

const { profiler } = require('./profiler');

// Import components
const components = require('./components');

/**
 * Main Game class handling the game loop and rendering
 */
class Main {
  constructor() {
    this.room = Game.rooms['W0N0'];
    this.memory = Memory;
  }

  /**
   * Initialize the game state
   */
  init() {
    // Initialize game state
    if (!Memory.initialized) {
      Memory.rooms = {};
      Memory.initialized = true;
    }
  }

  /**
   * Main loop execution
   */
  loop() {
    this.init();
    
    // Run game logic
    for (const name in Game.rooms) {
      const room = Game.rooms[name];
      this.processRoom(room);
    }
    
    // Clean up dead creeps
    this.cleanup();
  }

  /**
   * Process a single room
   * @param {Room} room - The room to process
   */
  processRoom(room) {
    // Room processing logic
    const terrain = room.getTerrain();
    const sources = room.find(FIND_SOURCES);
    
    // Find containers near sources
    for (const source of sources) {
      const containers = source.pos.findInRange(FIND_STRUCTURES, 2, {
        filter: s => s.structureType === STRUCTURE_CONTAINER
      });
      
      if (containers.length > 0) {
        Memory.rooms[room.name] = Memory.rooms[room.name] || {};
        Memory.rooms[room.name].sourceContainers = Memory.rooms[room.name].sourceContainers || {};
        Memory.rooms[room.name].sourceContainers[source.id] = containers[0].id;
      }
    }
  }

  /**
   * Clean up dead creeps from memory
   */
  cleanup() {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
  }
}

// Export for testing
module.exports = { Main };

// Run main loop if executed directly
if (require.main === module) {
  const main = new Main();
  main.loop();
}