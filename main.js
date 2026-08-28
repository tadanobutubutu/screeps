const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// Dashboard import - adjust path as needed
// const { Dashboard } = require('./dashboard');

function initialize() {
  console.log('Application initialized');
  return true;
}

function processData(data) {
  if (!data) {
    throw new Error('No data provided');
  }
  return data.map(item => ({
    ...item,
    processed: true
  }));
}

function validateInput(input) {
  if (typeof input !== 'string') {
    return false;
  }
  return input.length > 0;
}

function addressAccessibilityIssues(insightReport) {
  if (insightReport && insightReport.issues) {
    insightReport.issues.forEach(issue => {
      console.log(`Accessibility issue detected: ${issue.message}`);
    });
  }
}

let isInitialized = false;

function ensureInitialized() {
  if (!isInitialized) {
    initialize();
    isInitialized = true;
  }
}

/**
 * Main game loop for the Screeps bot.
 * Runs every tick.
 */
function loop() {
  ensureInitialized();

  // Handle room-level operations
  handleRooms();

  // Render dashboard UI (if available)
  // if (Dashboard) {
  //   Dashboard.render();
  // }
}

/**
 * Execute room-level logic: spawn management, creeps, construction, etc.
 * @param {Room} room - The room to process.
 */
function handleRoomLogic(room) {
  const roomName = room.name;
  const spawn = room.find(FIND_MY_SPAWNS)[0];

  // Spawn creeps based on roles
  if (spawn && !spawn.spawning) {
    manageSpawning(room, spawn);
  }

  // Run all creep logic
  runCreeps(roomName);
}

/**
 * Manage creep spawning based on room needs.
 * @param {Room} room - The room to spawn in.
 * @param {StructureSpawn} spawn - The spawn structure.
 */
function manageSpawning(room, spawn) {
  const energyCapacity = room.energyCapacityAvailable;
  const body = energyCapacity >= 300 ? [WORK, CARRY, MOVE] : [WORK, MOVE];
  const role = room.find(FIND_MY_CREEPS, {
    filter: (c) => c.memory.role === 'harvester'
  }).length < 2 ? 'harvester' : 'worker';

  const existingRoleCount = room.find(FIND_MY_CREEPS, {
    filter: (c) => c.memory.role === role
  }).length;

  if (!spawn.spawning && existingRoleCount < 3) {
    spawn.spawnCreep(body, `${role}_${Game.time}`, {
      memory: { role: role }
    });
  }
}

/**
 * Harvester: collects and transfers energy.
 * @param {Creep} creep
 */
function runHarvester(creep) {
  if (creep.store.getFreeCapacity() > 0) {
    const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (source) {
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  } else {
    const target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (s) => (s.structureType === STRUCTURE_SPAWN ||
                      s.structureType === STRUCTURE_EXTENSION) &&
                     s.store.getFreeCapacity(ENERGY) > 0
    });
    if (target) {
      if (creep.transfer(target, ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
  }
}

/**
 * Builder: repairs structures and builds construction sites.
 * @param {Creep} creep
 */
function runBuilder(creep) {
  if (creep.store.getFreeCapacity() > 0) {
    const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
    return;
  }

  let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL
    });
  }

  if (target) {
    if (target.structureType === STRUCTURE_CONSTRUCTION_SITE) {
      if (creep.build(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    } else {
      if (creep.repair(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
  }
}

/**
 * Default worker: harvests and upgrades controller.
 * @param {Creep} creep
 */
function runWorker(creep) {
  if (creep.store.getFreeCapacity() > 0) {
    const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
  } else if (creep.room.controller) {
    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
    }
  }
}

function handleRooms() {
  for (const roomName in Game.rooms) {
    handleRoomLogic(Game.rooms[roomName]);
  }
}

function runCreeps(roomName) {
  const room = Game.rooms[roomName];
  if (!room) return;

  for (const name in room.creeps) {
    const creep = room.creeps[name];
    const role = creep.memory.role;

    switch (role) {
      case 'harvester':
        runHarvester(creep);
        break;
      case 'builder':
        runBuilder(creep);
        break;
      default:
        runWorker(creep);
    }
  }
}

module.exports = {
  loop,
  initialize,
  processData,
  validateInput,
  addressAccessibilityIssues,
  config
};