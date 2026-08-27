// Address accessibility issues from insight report — FIXED (combined with the export code)

const roleHarvester = {
  /** @param {Creep} creep */
  run(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {
          visualizePathStyle: { stroke: '#ffaa00' },
          reusePath: 30
        });
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
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: '#ffffff' },
            reusePath: 30
          });
        }
      }
    }
  }
};

const roleUpgrader = {
  /** @param {Creep} creep */
  run(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {
          visualizePathStyle: { stroke: '#ffaa00' },
          reusePath: 30
        });
      }
    } else {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: { stroke: '#ffffff' },
          reusePath: 30
        });
      }
    }
  }
};

const roleBuilder = {
  /** @param {Creep} creep */
  run(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {
          visualizePathStyle: { stroke: '#ffaa00' },
          reusePath: 30
        });
      }
    } else {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: '#ffffff' },
            reusePath: 30
          });
        }
      }
    }
  }
};

const roleRepairer = {
  /** @param {Creep} creep */
  run(creep) {
    const repairTargets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
    });

    if (repairTargets.length > 0) {
      const target = repairTargets.sort((a, b) => a.hits - b.hits)[0];

      if (creep.repair(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
          visualizePathStyle: { stroke: '#00ff00' },
          reusePath: 30
        });
      }
    }
  }
};

function createHarvester(spawn) {
  const body = [WORK, CARRY, MOVE];
  const name = 'Harvester' + Game.time;
  const memory = { role: 'harvester' };

  if (spawn.canCreateCreep(body, undefined) === OK) {
    spawn.createCreep(body, name, memory);
  }
}

function createUpgrader(spawn) {
  const body = [WORK, CARRY, MOVE, WORK, CARRY, MOVE];
  const name = 'Upgrader' + Game.time;
  const memory = { role: 'upgrader' };

  if (spawn.canCreateCreep(body, undefined) === OK) {
    spawn.createCreep(body, name, memory);
  }
}

function createBuilder(spawn) {
  const body = [WORK, CARRY, MOVE, WORK, CARRY, MOVE];
  const name = 'Builder' + Game.time;
  const memory = { role: 'builder' };

  if (spawn.canCreateCreep(body, undefined) === OK) {
    spawn.createCreep(body, name, memory);
  }
}

function countCreepsByRole(role) {
  return _.sum(Game.creeps, (creep) => creep.memory.role === role);
}

function manageSpawns() {
  const spawn = Game.spawns['Spawn1'];
  if (!spawn) return;

  const harvesterCount = countCreepsByRole('harvester');
  const upgraderCount = countCreepsByRole('upgrader');
  const builderCount = countCreepsByRole('builder');
  const repairerCount = countCreepsByRole('repairer');

  const roomEnergy = spawn.room.energyCapacityAvailable;

  if (harvesterCount < 2) {
    createHarvester(spawn);
  } else if (upgraderCount < 2) {
    createUpgrader(spawn);
  } else if (builderCount < 2) {
    createBuilder(spawn);
  } else if (repairerCount < 1 && roomEnergy >= 200) {
    const body = [WORK, CARRY, MOVE];
    const name = 'Repairer' + Game.time;
    const memory = { role: 'repairer' };
    spawn.createCreep(body, name, memory);
  }
}

module.exports = {
  roleHarvester,
  roleUpgrader,
  roleBuilder,
  roleRepairer,
  createHarvester,
  createUpgrader,
  createBuilder,
  countCreepsByRole,
  manageSpawns
};

module.exports.Harvester = roleHarvester;

module.exports.loop = function() {
  // Clear memory for dead creeps
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  // Manage spawns
  manageSpawns();

  // Run roles for each creep
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    const role = creep.memory.role;

    switch (role) {
      case 'harvester':
        roleHarvester.run(creep);
        break;
      case 'upgrader':
        roleUpgrader.run(creep);
        break;
      case 'builder':
        roleBuilder.run(creep);
        break;
      case 'repairer':
        roleRepairer.run(creep);
        break;
      default:
        roleHarvester.run(creep);
        break;
    }
  }

  // Tower defense
  const towers = _.filter(Game.structures, (s) => s.structureType === STRUCTURE_TOWER);
  for (const tower of towers) {
    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  }
};