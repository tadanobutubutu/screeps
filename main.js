const roleHarvester = {
  run: function (creep) {
    if (creep.carry.energy === 0) {
      const sources = creep.room.find(FIND_SOURCES)
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0])
      }
    } else {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                        structure.energy < structure.energyCapacity
          )
        }
      })
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0])
        }
      }
    }
  }
}

const roleUpgrader = {
  run: function (creep) {
    if (creep.carry.energy === 0) {
      const sources = creep.room.find(FIND_SOURCES)
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0])
      }
    } else {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller)
      }
    }
  }
}

const roleBuilder = {
  run: function (creep) {
    if (creep.carry.energy === 0) {
      const sources = creep.room.find(FIND_SOURCES)
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0])
      }
    } else {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES)
      if (targets.length) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0])
        }
      }
    }
  }
}

const roleMaintenance = {
  run: function (creep) {
    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.hits < structure.hitsMax / 2 ||
          (structure.structureType === STRUCTURE_WALL && structure.hits < 5000) ||
          (structure.structureType === STRUCTURE_RAMPART && structure.hits < 10000)
        )
      }
    })
    if (targets.length) {
      if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0])
      }
    } else {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax / 4
      })
      if (targets.length) {
        if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0])
        }
      }
    }
  }
}

// Main loop
module.exports.loop = function () {
  if (!Memory.creeps || !Memory.lastCleanup || Game.time - Memory.lastCleanup > 1500) {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) { delete Memory.creeps[name]; }
    }
    Memory.lastCleanup = Game.time;
  }

  // Clean up dead creeps from memory
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name]
    }
  }

  // Dynamic role thresholds
  const energy = Game.getResourceRoomResources('energy').amount
  const neededHarvesters = Math.min(5, Math.floor(energy / 500 + 1))
  const neededUpgraders = Math.min(3, Math.ceil(energy / 1000))
  const neededBuilders = Math.min(3, Math.ceil(Game.getRoomCreepCount('builder') / 200))

  // Spawn logic
  if (harvesters.length < neededHarvesters) {
    const newName = 'Harvester' + Game.time
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'harvester' }
    })
  }

  if (upgraders.length < neededUpgraders) {
    const newName = 'Upgrader' + Game.time
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'upgrader' }
    })
  }

  if (builders.length < neededBuilders) {
    const newName = 'Builder' + Game.time
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'builder' }
    })
  }

  // Maintenance spawning logic (optional, based on energy scarcity)
  const maintenanceThreshold = Math.min(2, Math.floor(energy / 2000))
  if (maintenanceCreeps.length < maintenanceThreshold) {
    const newName = 'Maintenance' + Game.time
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'maintenance' }
    })
  }

  // Run roles
  for (const name in Game.creeps) {
    const creep = Game.creeps[name]
    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep)
    } else if (creep.memory.role === 'upgrader') {
      roleUpgrader.run(creep)
    } else if (creep.memory.role === 'builder') {
      roleBuilder.run(creep)
    } else if (creep.memory.role === 'maintenance') {
      roleMaintenance.run(creep)
    }
  }
}