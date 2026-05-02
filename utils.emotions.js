/**
 * 😊 Creep Emotion System
 *
 * Creeps have emotions based on their experiences!
 * They express their feelings through emojis.
 */

const utilsMemory = require('./utils.memory')

const EMOTIONS = {
  HAPPY: '😊',
  EXCITED: '🤩',
  PROUD: '😎',
  LOVE: '😍',
  ENERGETIC: '⚡',
  SUCCESSFUL: '⭐',
  WORKING: '🛠️',
  THINKING: '🤔',
  FOCUSED: '🎯',
  WALKING: '🚶',
  TIRED: '😫',
  CONFUSED: '😵',
  WORRIED: '😟',
  HURT: '🤕',
  STUCK: '😨',
  HUNGRY: '🍔',
  HARVESTING: '⛏️',
  BUILDING: '🛠️',
  UPGRADING: '⬆️',
  REPAIRING: '🔧',
  HEALING: '💊',
  FIGHTING: '⚔️',
  TRANSPORTING: '🚚',
  BIRTHDAY: '🎉',
  LEVELUP: '🎆',
  CELEBRATING: '🎊'
}

const MOOD_LEVELS = {
  VERY_HAPPY: 5,
  HAPPY: 4,
  NEUTRAL: 3,
  SAD: 2,
  VERY_SAD: 1
}

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted constants and static result objects to avoid redundant allocations.
 */
const PERSONALITY_TRAITS = ['cheerful', 'serious', 'energetic', 'calm', 'curious', 'determined']
const RESULT_HUNGRY = { emoji: EMOTIONS.HUNGRY, moodChange: -1 }
const RESULT_ENERGETIC = { emoji: EMOTIONS.ENERGETIC, moodChange: 1 }
const RESULT_HURT = { emoji: EMOTIONS.HURT, moodChange: -2 }
const RESULT_STUCK = { emoji: EMOTIONS.STUCK, moodChange: -1 }

/**
 * Security: Limits for memory-intensive structures to prevent Memory DoS.
 * Screeps memory is limited to 2MB; unbounded arrays can crash the AI.
 */
const MAX_ACHIEVEMENTS = 10
const MAX_ACHIEVEMENT_NAME_LENGTH = 100

class EmotionSystem {
  /**
   * ⚡ PERFORMANCE OPTIMIZATION: Refactored initialization to avoid redundant object allocation
   * and loops. Added an early return for already initialized creeps.
   */
  static initialize (creep) {
    if (creep.memory.emotions && creep.memory.emotions.birthTick !== undefined) {
      return
    }

    if (!creep.memory.emotions) {
      creep.memory.emotions = {
        mood: MOOD_LEVELS.NEUTRAL,
        lastEmotion: EMOTIONS.HAPPY,
        experiencePoints: 0,
        achievements: [],
        personalityTraits: this.generatePersonality(),
        birthTick: Game.time
      }
    } else {
      const emotions = creep.memory.emotions
      if (emotions.mood === undefined) emotions.mood = MOOD_LEVELS.NEUTRAL
      if (emotions.lastEmotion === undefined) emotions.lastEmotion = EMOTIONS.HAPPY
      if (emotions.experiencePoints === undefined) emotions.experiencePoints = 0
      if (emotions.achievements === undefined) emotions.achievements = []
      if (emotions.personalityTraits === undefined) emotions.personalityTraits = this.generatePersonality()
      if (emotions.birthTick === undefined) emotions.birthTick = Game.time
    }
  }

  static generatePersonality () {
    return PERSONALITY_TRAITS[Math.floor(Math.random() * PERSONALITY_TRAITS.length)]
  }

  /**
     * エネルギーレベルに基づく感情を取得
     */
  static _getEnergyEmotion (creep) {
    const store = creep.store
    const energyPercent =
            store.getUsedCapacity(RESOURCE_ENERGY) / store.getCapacity(RESOURCE_ENERGY)
    if (energyPercent < 0.1) return RESULT_HUNGRY
    if (energyPercent > 0.9) return RESULT_ENERGETIC
    return null
  }

  /**
     * 健康状態に基づく感情を取得
     */
  static _getHealthEmotion (creep) {
    if (creep.hits < creep.hitsMax * 0.5) return RESULT_HURT
    return null
  }

  /**
     * スタック状態に基づく感情を取得
     */
  static _getStuckEmotion (creep) {
    const pos = creep.pos
    const lastPos = creep.memory.lastPos
    if (
      lastPos &&
            pos.x === lastPos.x &&
            pos.y === lastPos.y
    ) {
      creep.memory.stuckCounter = (creep.memory.stuckCounter || 0) + 1
      if (creep.memory.stuckCounter > 3) {
        return RESULT_STUCK
      }
    } else {
      creep.memory.stuckCounter = 0
    }
    creep.memory.lastPos = { x: pos.x, y: pos.y }
    return null
  }

  /**
     * ロールに基づく感情を取得
     */
  static _getRoleEmotion (creep) {
    switch (creep.memory.role) {
      case 'harvester':
        return creep.harvest ? EMOTIONS.HARVESTING : null
      case 'builder':
        return creep.build ? EMOTIONS.BUILDING : null
      case 'upgrader':
        return EMOTIONS.UPGRADING
      case 'repairer':
        return EMOTIONS.REPAIRING
      case 'medic':
        return EMOTIONS.HEALING
      default:
        return null
    }
  }

  static updateEmotion (creep) {
    let emotions = creep.memory.emotions
    if (!emotions || emotions.birthTick === undefined) {
      this.initialize(creep)
      emotions = creep.memory.emotions
    }

    const updateOffset = creep.name.length % 5
    if ((Game.time + updateOffset) % 5 !== 0 && emotions.lastEmotion) {
      return emotions.lastEmotion
    }

    let emoji = EMOTIONS.WORKING
    let moodChange = 0

    // ⚡ PERFORMANCE: Avoid array allocation by checking results individually
    const energyResult = this._getEnergyEmotion(creep)
    if (energyResult) {
      emoji = energyResult.emoji
      moodChange += energyResult.moodChange
    }

    const healthResult = this._getHealthEmotion(creep)
    if (healthResult) {
      emoji = healthResult.emoji
      moodChange += healthResult.moodChange
    }

    const stuckResult = this._getStuckEmotion(creep)
    if (stuckResult) {
      emoji = stuckResult.emoji
      moodChange += stuckResult.moodChange
    }

    const roleEmoji = this._getRoleEmotion(creep)
    if (roleEmoji) {
      emoji = roleEmoji
    }

    if (Game.time - emotions.birthTick === 1500) {
      emoji = EMOTIONS.BIRTHDAY
      this.celebrate(creep, 'Lived 1500 ticks!')
      moodChange = 3
    }

    // Security: Ensure mood is a finite number before arithmetic to prevent NaN propagation.
    const currentMood = Number.isFinite(emotions.mood) ? emotions.mood : MOOD_LEVELS.NEUTRAL
    emotions.mood = Math.max(1, Math.min(5, currentMood + moodChange))

    if (emotions.personalityTraits === 'cheerful' && Math.random() > 0.7) {
      emoji = EMOTIONS.HAPPY
    }

    emotions.lastEmotion = emoji
    return emoji
  }

  static display (creep) {
    const emoji = this.updateEmotion(creep)
    creep.say(emoji, true)
  }

  static celebrate (creep, achievement) {
    if (!creep.memory.emotions.achievements) {
      creep.memory.emotions.achievements = []
    }

    // Security: Truncate achievement name to avoid Memory DoS
    const sanitizedName = String(achievement).substring(0, MAX_ACHIEVEMENT_NAME_LENGTH)

    creep.memory.emotions.achievements.push({
      name: sanitizedName,
      tick: Game.time
    })

    // Security: Immediate rotation to prevent Memory DoS
    if (creep.memory.emotions.achievements.length > MAX_ACHIEVEMENTS) {
      creep.memory.emotions.achievements.shift()
    }

    creep.memory.emotions.mood = MOOD_LEVELS.VERY_HAPPY

    for (let i = 0; i < 5; i++) {
      creep.say(EMOTIONS.CELEBRATING, true)
    }
  }

  static getMoodDescription (creep) {
    if (!creep.memory.emotions || creep.memory.emotions.birthTick === undefined) {
      this.initialize(creep)
    }
    const mood = creep.memory.emotions.mood

    if (mood >= 5) return 'Very Happy 😄'
    if (mood >= 4) return 'Happy 😊'
    if (mood >= 3) return 'Neutral 😐'
    if (mood >= 2) return 'Sad 😟'
    return 'Very Sad 😭'
  }

  static interact (creep1, creep2) {
    // Security: Validate creep objects and positions before spatial calculations.
    if (!creep1 || !creep2 || !creep1.pos || !creep2.pos) return

    if (creep1.pos.inRangeTo(creep2, 1)) {
      if (!creep1.memory.emotions || creep1.memory.emotions.birthTick === undefined) {
        this.initialize(creep1)
      }
      if (!creep2.memory.emotions || creep2.memory.emotions.birthTick === undefined) {
        this.initialize(creep2)
      }

      // Security: Ensure mood is a finite number before arithmetic to prevent NaN propagation.
      const mood1 = Number.isFinite(creep1.memory.emotions.mood) ? creep1.memory.emotions.mood : MOOD_LEVELS.NEUTRAL
      const mood2 = Number.isFinite(creep2.memory.emotions.mood) ? creep2.memory.emotions.mood : MOOD_LEVELS.NEUTRAL

      creep1.memory.emotions.mood = Math.min(5, mood1 + 0.5)
      creep2.memory.emotions.mood = Math.min(5, mood2 + 0.5)

      creep1.say('👋', true)
      creep2.say('😊', true)
    }
  }

  static getPerformanceModifier (creep) {
    if (!creep.memory.emotions || creep.memory.emotions.birthTick === undefined) {
      this.initialize(creep)
    }
    const mood = creep.memory.emotions.mood

    if (mood >= 5) return 1.1
    if (mood >= 4) return 1.05
    if (mood >= 3) return 1.0
    if (mood >= 2) return 0.95
    return 0.9
  }

  static getStats () {
    // ⚡ PERFORMANCE: Use pre-aggregated global emotion stats if available for the current tick. (現在のティックの集計済み統計があればそれを使用)
    // This avoids an O(N) creep iteration every time stats are requested. (統計が要求されるたびに実行されるO(N)のループを回避)
    if (global._emotionStatsTick === Game.time && global._emotionStats) {
      return global._emotionStats
    }

    const stats = {
      veryHappy: 0,
      happy: 0,
      neutral: 0,
      sad: 0,
      verySad: 0,
      total: 0
    }

    // ⚡ PERFORMANCE: Use pre-fetched global._creeps if available, otherwise Object.values()
    // This avoids redundant Proxy-to-Array allocations.
    const creeps = global._creeps || Object.values(Game.creeps || {})
    for (let i = 0; i < creeps.length; i++) {
      const creep = creeps[i]
      if (!creep.memory.emotions || creep.memory.emotions.birthTick === undefined) {
        this.initialize(creep)
      }
      const mood = creep.memory.emotions.mood

      if (mood >= 5) stats.veryHappy++
      else if (mood >= 4) stats.happy++
      else if (mood >= 3) stats.neutral++
      else if (mood >= 2) stats.sad++
      else stats.verySad++

      stats.total++
    }

    // ⚡ PERFORMANCE: Cache the result for the current tick to avoid redundant O(N) scans.
    global._emotionStats = stats
    global._emotionStatsTick = Game.time

    return stats
  }

  static checkCreep (creepName) {
    // Security: プロトタイプ汚染対策のため、名前を検証
    if (!utilsMemory.isSafeKey(creepName)) {
      console.log('❌ Invalid creep name')
      return
    }

    const creep = Game.creeps[creepName]
    if (!creep) {
      console.log('❌ Creep not found')
      return
    }

    if (!creep.memory.emotions || creep.memory.emotions.birthTick === undefined) {
      this.initialize(creep)
    }
    const emotions = creep.memory.emotions

    console.log('\n🤖 Creep Emotion Report')
    console.log('Name:', creepName)
    console.log('Mood:', this.getMoodDescription(creep))
    console.log('Current Emotion:', emotions.lastEmotion)
    console.log('Personality:', emotions.personalityTraits)
    console.log('Age:', Game.time - emotions.birthTick, 'ticks')
    console.log('Achievements:', emotions.achievements.length)

    if (emotions.achievements.length > 0) {
      console.log('\n🏆 Achievements:')
      emotions.achievements.forEach((a) => {
        console.log('-', a.name, '(tick', a.tick, ')')
      })
    }
  }
}

module.exports = EmotionSystem
