// Screeps Main Module
// This file manages the main game loop for Screeps

// Import necessary modules if needed
// const profiler = require('screeps-profiler');

// Global game state management
const GameState = {
  role: null,
  initialized: false
};

/**
 * Main module function - called every tick
 * @param {function} callback - Optional callback for profiler
 */
function loop(callback) {
  // Clean up dead creeps' memory
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  // Get current tick
  const currentTick = Game.time;

  // Initialize if not done
  if (!GameState.initialized) {
    initialize();
    GameState.initialized = true;
  }

  // Run spawning logic
  runSpawning();

  // Run each creep's task
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    runRole(creep);
  }

  // Tower defense logic
  runTowers();

  // Callback for profiler if provided
  if (typeof callback === 'function') {
    callback();
  }
}

/**
 * Initialize game state and roles
 */
function initialize() {
  // Set default role
  GameState.role = 'harvester';
}

/**
 * Handle spawning of new creeps
 */
function runSpawning() {
  const spawns = Object.values(Game.spawns);
  if (spawns.length === 0) return;

  const spawn = spawns[0];
  const creeps = Object.values(Game.creeps);
  const harvesters = creeps.filter(c => c.memory.role === 'harvester').length;

  if (harvesters < 2) {
    const newName = 'Harvester' + Game.time;
    spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'harvester' }
    });
  }
}

/**
 * Run role-specific behavior for a creep
 * @param {Creep} creep - The creep to run
 */
function runRole(creep) {
  if (!creep || !creep.memory) return;

  const role = creep.memory.role;

  switch (role) {
    case 'harvester':
      runHarvester(creep);
      break;
    case 'builder':
      runBuilder(creep);
      break;
    case 'upgrader':
      runUpgrader(creep);
      break;
    default:
      runHarvester(creep);
  }
}

/**
 * Harvester role - collects energy
 * @param {Creep} creep - The harvester creep
 */
function runHarvester(creep) {
  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    const sources = creep.room.find(FIND_SOURCES);
    if (sources.length > 0) {
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
    }
  } else {
    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_EXTENSION ||
                structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_TOWER) &&
               structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      }
    });
    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
      }
    }
  }
}

/**
 * Builder role - builds structures
 * @param {Creep} creep - The builder creep
 */
function runBuilder(creep) {
  if (creep.store[RESOURCE_ENERGY] === 0) {
    const sources = creep.room.find(FIND_SOURCES);
    if (sources.length > 0) {
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
    }
  } else {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length > 0) {
      if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
      }
    }
  }
}

/**
 * Upgrader role - upgrades room controller
 * @param {Creep} creep - The upgrader creep
 */
function runUpgrader(creep) {
  if (creep.store[RESOURCE_ENERGY] === 0) {
    const sources = creep.room.find(FIND_SOURCES);
    if (sources.length > 0) {
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
    }
  } else {
    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
  }
}

/**
 * Run tower logic
 */
function runTowers() {
  const towers = Object.values(Game.structures).filter(s => s.structureType === STRUCTURE_TOWER);

  towers.forEach(tower => {
    const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax
    });

    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  });
}

// Export for module usage
module.exports = {
  loop,
  initialize,
  runSpawning,
  runRole,
  runHarvester,
  runBuilder,
  runUpgrader,
  runTowers,
  GameState
};

// If running directly (not as module), execute the loop
if (typeof module !== 'undefined' && require.main === module) {
  loop();
}