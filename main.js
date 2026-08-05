const _ = require('lodash')

// Module definitions
const roleHarvester = {
  run: function (creep) {
    if (creep.carry.energy === 0) {
      const sources = creep.room.find(FIND_SOURCES_ACTIVE)
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
      const sources = creep.room.find(FIND_SOURCES_ACTIVE)
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
      const sources = creep.room.find(FIND_SOURCES_ACTIVE)
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

// Main loop
module.exports.loop = function () {
  if (!Memory.lastCleanup || Game.time % 15000 === 0 || Game.time - Memory.lastCleanup > 15000) {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name]
      }
    }
    Memory.lastCleanup = Game.time
  }

  // Clean up dead creeps from memory
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name]
    }
  }

  // Count roles
  const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester')
  const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader')
  const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder')

  // Spawn logic
  if (harvesters.length < 2) {
    const newName = 'Harvester' + Game.time
    Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'harvester' }
    })
  }

  if (upgraders.length < 2) {
    const newName = 'Upgrader' + Game.time
    Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'upgrader' }
    })
  }

  if (builders.length < 2) {
    const newName = 'Builder' + Game.time
    Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'builder' }
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
    }
  }
}