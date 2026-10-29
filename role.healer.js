const cache = require('./src/utils/cache')
// ⚡ PERFORMANCE: Hoisted constant path styles to reduce per-tick object allocation.
const PATH_STYLE_HEAL = { visualizePathStyle: { stroke: '#00ff00' } }

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Module-scoped closest target finder using inlined Chebyshev
 * distance on scalar coordinates (Math.abs(dx), Math.abs(dy)) to eliminate prototype method lookup
 * and native engine marshalling overhead per iteration, with early exit on exact tile match (range === 0).
 * @param {Creep} creep
 * @param {Array} targets
 * @returns {Object|null}
 */
function _findClosestTarget (creep, targets) {
  if (!targets || targets.length === 0) return null

  if (creep.pos) {
    const originPos = creep.pos
    if (typeof originPos.x === 'number' && typeof originPos.y === 'number') {
      let closest = null
      let minDist = Infinity
      for (let i = 0; i < targets.length; i++) {
        const t = targets[i]
        if (!t) continue
        const targetPos = t.pos || t
        if (typeof targetPos.x === 'number' && typeof targetPos.y === 'number') {
          if (originPos.roomName && targetPos.roomName && originPos.roomName !== targetPos.roomName) {
            continue
          }
          const dx = Math.abs(originPos.x - targetPos.x)
          const dy = Math.abs(originPos.y - targetPos.y)
          const range = dx > dy ? dx : dy
          if (range < minDist) {
            minDist = range
            closest = t
            if (range === 0) break
          }
        }
      }
      if (closest) return closest
    }
  }

  if (creep.pos && typeof creep.pos.findClosestByRange === 'function') {
    return creep.pos.findClosestByRange(targets)
  }
  return targets[0] || null
}

const roleHealer = {
  _findClosestTarget,

  run: function (creep) {
    let damagedCreep = null

    // ⚡ PERFORMANCE: Check if cached target is still valid and needs healing
    if (creep.memory.healTargetId) {
      damagedCreep = Game.getObjectById(creep.memory.healTargetId)
      if (damagedCreep && damagedCreep.hits >= damagedCreep.hitsMax) {
        damagedCreep = null
        delete creep.memory.healTargetId
      }
    }

    // ⚡ PERFORMANCE: If no cached target, find one using pre-warmed cache or fallback
    if (damagedCreep === undefined || damagedCreep === null) {
      let injured = creep.room && creep.room._injuredCreeps
      if (!Array.isArray(injured)) {
        const myCreeps = creep.room ? cache.getMyCreeps(creep.room) : []
        injured = []
        for (let i = 0; i < myCreeps.length; i++) {
          const c = myCreeps[i]
          if (c && c.hits < c.hitsMax) {
            injured.push(c)
          }
        }
        if (creep.room) creep.room._injuredCreeps = injured
      }
      if (injured.length > 0) {
        damagedCreep = _findClosestTarget(creep, injured)
      }

      // Gracefully handle target ID caching if id property exists
      if (damagedCreep && damagedCreep.id) {
        creep.memory.healTargetId = damagedCreep.id
      }
    }

    if (damagedCreep) {
      // 回復
      if (creep.heal(damagedCreep) === ERR_NOT_IN_RANGE) {
        creep.moveTo(damagedCreep, PATH_STYLE_HEAL)
        // 移動中も遠隔回復
        creep.rangedHeal(damagedCreep)
      }
    } else {
      // 傷ついたクリープがいない場合は防衛ポイントへ
      const flag = Game.flags.HealPoint
      if (flag) {
        creep.moveTo(flag)
      } else {
        // 戦闘クリープの近くに待機
        // ⚡ PERFORMANCE: Use pre-warmed defenders cache or fallback
        let defender = null
        let defenders = creep.room && creep.room._defenders
        if (!Array.isArray(defenders)) {
          if (creep.room) {
            const myCreeps = cache.getMyCreeps(creep.room)
            defenders = []
            for (let i = 0; i < myCreeps.length; i++) {
              if (myCreeps[i].memory.role === 'defender') {
                defenders.push(myCreeps[i])
              }
            }
            creep.room._defenders = defenders
          } else {
            defenders = []
          }
        }
        if (defenders.length > 0) {
          defender = _findClosestTarget(creep, defenders)
        }
        if (defender) {
          creep.moveTo(defender)
        }
      }
    }
  }
}

module.exports = roleHealer
