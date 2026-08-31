// main.js
// Commit: 3016d1d86b87032d381ba6e7c105e4845fec3987

const renderCreeps = require('renderCreeps');
const renderStructures = require('renderStructures');
const renderRooms = require('renderRooms');

// ------------------------------------------------------------------
// Utilities
// ------------------------------------------------------------------
function getCreepsByRole(role) {
  return _.filter(Game.creeps, c => c.memory.role === role);
}

function cleanupMemory() {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }
}

// ------------------------------------------------------------------
// Rendering helpers
// ------------------------------------------------------------------
function renderCreep(creep) {
  if (!creep) return;
  // Add imported rendering module to this rendering function
  renderCreeps.render(creep);
}

function renderTower(tower) {
  if (!tower) return;
  renderStructures.renderTower(tower);
}

function renderRoomVisual(room) {
  if (!room) return;
  renderRooms.render(room);
}

function renderGameState() {
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    renderCreep(creep);
  }
  for (const id in Game.structures) {
    const structure = Game.structures[id];
    if (structure.structureType === STRUCTURE_TOWER) {
      renderTower(structure);
    }
  }
  for (const roomName in Game.rooms) {
    renderRoomVisual(Game.rooms[roomName]);
  }
}

// ------------------------------------------------------------------
// Role logic
// ------------------------------------------------------------------
function runHarvester(creep) {
  if (creep.store.getFreeCapacity() > 0) {
    const sources = creep.room.find(FIND_SOURCES_ACTIVE);
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
    }
  } else {
    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => (s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });
    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
  }
}

function runUpgrader(creep) {
  if (creep.store[RESOURCE_ENERGY] === 0) {
    const sources = creep.room.find(FIND_SOURCES_ACTIVE);
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
    }
  } else {
    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
    }
  }
}

// ------------------------------------------------------------------
// Tower logic
// ------------------------------------------------------------------
function runTower(tower) {
  const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (closestHostile) {
    tower.attack(closestHostile);
  }
}

// ------------------------------------------------------------------
// Spawn logic
// ------------------------------------------------------------------
function spawnCreeps(spawn) {
  const harvesters = _.filter(Game.creeps, c => c.memory.role === 'harvester');
  if (harvesters.length < 2) {
    const newName = 'Harvester' + Game.time;
    if (spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'harvester' } }) === OK) {
      console.log('Spawning new harvester: ' + newName);
    }
  }
}

// ------------------------------------------------------------------
// Main loop
// ------------------------------------------------------------------
module.exports.loop = function () {
  cleanupMemory();

  // Run towers
  const towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER);
  for (const tower of towers) {
    runTower(tower);
  }

  // Run creeps
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      runHarvester(creep);
    } else if (creep.memory.role === 'upgrader') {
      runUpgrader(creep);
    }
  }

  // Spawn logic
  for (const spawnName in Game.spawns) {
    spawnCreeps(Game.spawns[spawnName]);
  }

  // Rendering functions with imported modules added
  renderGameState();
};

// ------------------------------------------------------------------
// Additional rendering integration (line 484 replacement)
// ------------------------------------------------------------------
function renderVisualOverview() {
  // Previously:
  // // TODO: Add these imported modules to the relevant rendering functions
  // Now using the imported modules in relevant rendering functions
  renderCreeps.init();
  renderStructures.init();
  renderRooms.init();
  renderGameState();
}