const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')

StructureSpawn.prototype.createCustomCreep = function (energy) {
  let body = []
  const totalEnergy = this.room.energyCapacityAvailable
  const cost = 0

  if (totalEnergy >= 300) {
    // Large harvester
    body = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE]
  } else if (totalEnergy >= 200) {
    // Medium harvester
    body = [WORK, WORK, WORK, CARRY, MOVE, MOVE]
  } else {
    // Small harvester based on available energy
    const workCount = Math.floor(energy / 200)
    const carryCount = 1
    const moveCount = Math.ceil((workCount + carryCount) / 2)

    for (let i = 0; i < workCount; i++) {
      body.push(WORK)
    }
    body.push(CARRY)
    for (let j = 0; j < moveCount; j++) {
      body.push(MOVE)
    }
  }

  const creepName = 'Harvester' + Game.time
  const result = this.createCreep(body, creepName, { role: 'harvester' })

  if (result === OK || result === name) {
    console.log('Spawned new harvester: ' + creepName)
  } else {
    console.log('Failed to spawn harvester: ' + result)
  }

  return result
}

module.exports = {
  createCustomCreep: StructureSpawn.prototype.createCustomCreep
}
