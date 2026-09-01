// ⚡ PERFORMANCE: Hoisted constant path styles to reduce per-tick object allocation.
const PATH_STYLE_EXPLORE = { visualizePathStyle: { stroke: '#ffffff', opacity: 0.5 } }

/**
 * Generates a secure random integer between 0 and max-1.
 * Uses crypto for security with a fallback to Math.random() for sandbox environments.
 * @param {number} max
 * @returns {number}
 */
function secureRandomInt (max) {
  try {
    const crypto = require('crypto')
    if (crypto && crypto.randomBytes) {
      const buf = crypto.randomBytes(4)
      return buf.readUInt32LE(0) % max
    }
  } catch (e) {
    // Fallback
  }
  return Math.floor(Math.random() * max)
}

const roleExplorer = {
  run: function (creep) {
    // メモリにターゲットの部屋がなければ設定（例: 隣の部屋）
    if (!creep.memory.targetRoom) {
      const exits = Game.map.describeExits(creep.room.name)

      // Check if exits is valid
      if (!exits || Object.keys(exits).length === 0) {
        // No exits available, stay in current room
        creep.say('🤔 No exits')
        creep.moveTo(25, 25)
        return
      }

      const exitDir = Object.keys(exits)[0]
      creep.memory.targetRoom = exits[exitDir]
    }

    if (creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
      // ⚡ PERFORMANCE: Direct moveTo to room name center is efficient and handles findExit internally.
      // Avoid redundant Game.map.findExit and creep.room.findExitTo calls which are O(N) or worse.
      const result = creep.moveTo(
        new RoomPosition(25, 25, creep.memory.targetRoom),
        PATH_STYLE_EXPLORE
      )

      // Check if movement is valid
      if (result === ERR_NO_PATH || result === ERR_INVALID_ARGS) {
        // Cannot find exit or invalid path, reset target
        creep.say('❌ No path')
        delete creep.memory.targetRoom
      }
    } else {
      // 部屋に着いたら適当に動いて視界を確保
      creep.moveTo(25, 25)
      creep.say('👀 scouting')

      // After exploring, find new target
      if (creep.pos.x === 25 && creep.pos.y === 25) {
        const exits = Game.map.describeExits(creep.room.name)
        if (exits && Object.keys(exits).length > 0) {
          // Pick a random exit
          const exitDirs = Object.keys(exits)
          const randomDir = exitDirs[secureRandomInt(exitDirs.length)]
          creep.memory.targetRoom = exits[randomDir]
        }
      }
    }
  }
}
module.exports = roleExplorer
