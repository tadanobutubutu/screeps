// ⚡ PERFORMANCE: Hoisted constant path styles to reduce per-tick object allocation.
const PATH_STYLE_HEAL = { visualizePathStyle: { stroke: '#00ff00' } }

const roleHealer = {
  run: function (creep) {
    // ⚡ PERFORMANCE: Use pre-warmed room caches for injured creeps and defenders.
    const injured = creep.room._injuredCreeps || []
    const defenders = creep.room._defenders || []

    // ⚡ PERFORMANCE: Cache heal target ID and use closest by range
    let target = Game.getObjectById(creep.memory.healTargetId)

    // If target is invalid or fully healed, find a new one
    if (!target || target.hits === target.hitsMax || target.room.name !== creep.room.name) {
      if (injured.length > 0) {
        target = creep.pos.findClosestByRange(injured)
        if (target) {
          creep.memory.healTargetId = target.id
        } else {
          delete creep.memory.healTargetId
        }
      } else {
        delete creep.memory.healTargetId
        target = null
      }
    }

    if (target) {
      // 回復
      const result = creep.heal(target)
      if (result === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, PATH_STYLE_HEAL)
        // 移動中も遠隔回復
        creep.rangedHeal(target)
      }
    } else {
      // 傷ついたクリープがいない場合は防衛ポイントへ
      const flag = Game.flags.HealPoint
      if (flag) {
        creep.moveTo(flag)
      } else {
        // ⚡ PERFORMANCE: Cache standby target ID
        let standbyTarget = Game.getObjectById(creep.memory.standbyTargetId)

        if (!standbyTarget || standbyTarget.room.name !== creep.room.name) {
          if (defenders.length > 0) {
            standbyTarget = creep.pos.findClosestByRange(defenders)
            if (standbyTarget) {
              creep.memory.standbyTargetId = standbyTarget.id
            } else {
              delete creep.memory.standbyTargetId
            }
          } else {
            delete creep.memory.standbyTargetId
            standbyTarget = null
          }
        }

        if (standbyTarget) {
          creep.moveTo(standbyTarget)
        }
      }
    }
  }
}

module.exports = roleHealer
