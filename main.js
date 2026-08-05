// Screeps AI Entry Point

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
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RAVIG_RANGE) {
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

const roleManager = {
  run: function () {
    // ... The main.js code that uses the roles goes here ...
  }
}

module.exports = roleManager.run