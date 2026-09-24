const cache = require('./src/utils/cache')

const DefenseManager = {
  findTowerTargets (room) {
    const towers = cache.getMyStructures(room, STRUCTURE_TOWER)
    if (!towers || towers.length === 0) return

    const hostiles = cache.getEnemies(room)
    if (hostiles && hostiles.length > 0) {
      const primaryHostile = hostiles[0]
      for (let i = 0; i < towers.length; i++) {
        towers[i].attack(primaryHostile)
      }
      return
    }

    // ⚡ PERFORMANCE: Lazily evaluate repair targets only when no hostiles are present.
    // Uses a single-pass loop with early termination to avoid unnecessary room structure iterations
    // and array allocations.
    const allStructures = cache.getStructures(room)
    let firstDamagedStructure = null
    let firstDamagedWall = null

    for (let i = 0; i < allStructures.length; i++) {
      const s = allStructures[i]
      if (s.structureType === STRUCTURE_WALL) {
        if (!firstDamagedWall && s.hits < 100000) {
          firstDamagedWall = s
        }
      } else if (!firstDamagedStructure && s.hits && s.hits < s.hitsMax) {
        firstDamagedStructure = s
      }
      if (firstDamagedStructure && firstDamagedWall) break
    }

    const repairTarget = firstDamagedStructure || firstDamagedWall
    if (repairTarget) {
      for (let i = 0; i < towers.length; i++) {
        towers[i].repair(repairTarget)
      }
    }
  },

  getDefenseStatus (room) {
    const towers = cache.getMyStructures(room, STRUCTURE_TOWER)
    const hostiles = cache.getEnemies(room)
    const ramparts = cache.getMyStructures(room, STRUCTURE_RAMPART)

    return {
      towers: towers.length,
      hostiles: hostiles.length,
      ramparts: ramparts.length,
      underAttack: hostiles.length > 0
    }
  }
}

module.exports = DefenseManager
