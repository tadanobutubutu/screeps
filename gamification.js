/**
 * Gamification System - ドーパミン爆発システム
 */

const vfx = require('visual.effects')
const logger = require('utils.logging')
const utilsMemory = require('utils.memory')
const dailyChallenge = require('daily-challenge')
const adaptiveSystem = require('system.adaptive')

/**
 * Security: Limits for memory-intensive structures to prevent Memory DoS.
 * Screeps memory is limited to 2MB; unbounded arrays can crash the AI.
 */
const MAX_ACHIEVEMENTS = 50
const MAX_STRING_LENGTH = 100

// ⚡ PERFORMANCE OPTIMIZATION: Hoisted defaults and per-tick cache
const GAMIFICATION_DEFAULTS = {
  level: 1,
  xp: 0,
  xpToNext: 100,
  totalScore: 0,
  achievements: [],
  streakDays: 0,
  lastActiveDay: 0,
  combos: {},
  milestones: []
}

let _initTick = -1

const gamification = {
  /**
     * 初期化
     */
  init: function () {
    // ⚡ PERFORMANCE: Per-tick guard to avoid redundant initialization checks
    if (Game.time === _initTick && Memory.gamification && Memory.gamification.achievements) {
      return
    }
    _initTick = Game.time

    if (!Memory.gamification) {
      Memory.gamification = {}
    }

    for (const key in GAMIFICATION_DEFAULTS) {
      if (Memory.gamification[key] === undefined) {
        // For arrays and objects, we must create new copies to avoid shared references
        if (Array.isArray(GAMIFICATION_DEFAULTS[key])) {
          Memory.gamification[key] = [...GAMIFICATION_DEFAULTS[key]]
        } else if (
          typeof GAMIFICATION_DEFAULTS[key] === 'object' &&
                    GAMIFICATION_DEFAULTS[key] !== null
        ) {
          Memory.gamification[key] = { ...GAMIFICATION_DEFAULTS[key] }
        } else {
          Memory.gamification[key] = GAMIFICATION_DEFAULTS[key]
        }
      }
    }
  },

  /**
     * XP獲得
     */
  addXP: function (amount, reason) {
    // ⚡ PERFORMANCE: Respect adaptive system status
    if (!adaptiveSystem.isEnabled('gamification')) {
      return
    }

    this.init()

    // Security: Validate XP amount to prevent corruption or DoS via massive values
    const numericAmount = Number(amount)
    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
      return
    }

    // Security: Truncate reason to avoid Memory DoS
    const sanitizedReason = String(reason || '').substring(0, MAX_STRING_LENGTH)

    Memory.gamification.xp += numericAmount
    Memory.gamification.totalScore += numericAmount

    // ⚡ PERFORMANCE: Throttle console logging for high-frequency low-value XP gains
    if (numericAmount >= 5) {
      // Security: Use logging system to prevent console injection
      logger.info(
        '✨ +' +
                    numericAmount +
                    ' XP ' +
                    (sanitizedReason ? '(' + sanitizedReason + ')' : '')
      )
    }

    this.checkLevelUp()
  },

  /**
     * レベルアップチェック
     */
  checkLevelUp: function () {
    const gm = Memory.gamification

    // Security: Ensure xpToNext is positive to prevent infinite loops
    if (gm.xpToNext <= 0) {
      gm.xpToNext = 100
    }

    while (gm.xp >= gm.xpToNext) {
      gm.xp -= gm.xpToNext
      gm.level++
      gm.xpToNext = Math.max(1, Math.floor(gm.xpToNext * 1.5))

      // Security: Use logging system to prevent console injection
      logger.info('🎉 LEVEL UP! Now level ' + gm.level + '!')

      // ⚡ PERFORMANCE: Use tick-cached primary spawn initialized in main.js
      const spawn = global._primarySpawn
      if (spawn && global._primarySpawnTick === Game.time) {
        vfx.levelUp(spawn.pos, gm.level)
      }

      this.unlockAchievement('level_' + gm.level, 'Reached Level ' + gm.level)
    }
  },

  /**
     * 達成解除
     */
  unlockAchievement: function (id, title, icon) {
    this.init()

    // Security: Sanitize and truncate inputs to prevent Prototype Pollution and Memory DoS
    const sanitizedId = String(id || '').substring(0, MAX_STRING_LENGTH)
    const sanitizedTitle = String(title || '').substring(0, MAX_STRING_LENGTH)
    const sanitizedIcon = String(icon || '🏆').substring(0, 10)

    if (!Memory.gamification.achievements.includes(sanitizedId)) {
      Memory.gamification.achievements.push(sanitizedId)

      // Security: Enforce achievement count limit to prevent Memory DoS
      if (Memory.gamification.achievements.length > MAX_ACHIEVEMENTS) {
        Memory.gamification.achievements.shift()
      }

      // Security: Use logging system to prevent console injection
      logger.info('🏆 ACHIEVEMENT UNLOCKED: ' + sanitizedTitle)

      // ⚡ PERFORMANCE: Use tick-cached primary spawn initialized in main.js
      const spawn = global._primarySpawn
      if (spawn && global._primarySpawnTick === Game.time) {
        vfx.achievement(spawn.pos, sanitizedTitle, sanitizedIcon)
      }

      // XP bonus for achievement
      const gm = Memory.gamification
      gm.xp += 50
      gm.totalScore += 50
      logger.info('✨ +50 XP (Achievement Bonus)')
      this.checkLevelUp()
    }
  },

  /**
     * コンボシステム
     */
  addCombo: function (type) {
    this.init()

    // Security: Validate and truncate type to prevent Prototype Pollution and Memory DoS
    if (!utilsMemory.isSafeKey(type)) {
      return 0
    }
    const sanitizedType = String(type).substring(0, 32)

    if (!Memory.gamification.combos[sanitizedType]) {
      // Security: Cap the number of combo types to prevent Memory DoS
      if (Object.keys(Memory.gamification.combos).length >= 10) {
        return 0
      }
      Memory.gamification.combos[sanitizedType] = {
        count: 0,
        lastTick: 0
      }
    }

    const combo = Memory.gamification.combos[sanitizedType]

    if (Game.time - combo.lastTick <= 10) {
      combo.count++
    } else {
      combo.count = 1
    }

    combo.lastTick = Game.time

    if (combo.count >= 3) {
      const bonusXP = combo.count * 2
      this.addXP(bonusXP, combo.count + 'x ' + sanitizedType + ' combo!')
    }

    return combo.count
  },

  /**
     * ストリーク更新
     */
  updateStreak: function () {
    this.init()

    const today = Math.floor(Game.time / 1000)
    const lastDay = Memory.gamification.lastActiveDay

    if (today > lastDay) {
      if (today === lastDay + 1) {
        Memory.gamification.streakDays++
      } else {
        Memory.gamification.streakDays = 1
      }

      Memory.gamification.lastActiveDay = today

      if (Memory.gamification.streakDays >= 7) {
        this.unlockAchievement('streak_7', '7 Day Streak!', '🔥')
      }
    }
  },

  /**
     * マイルストーンチェック
     */
  checkMilestones: function () {
    // ⚡ PERFORMANCE: Use tick-cached global._creeps initialized in main.js
    const creepCount = global._creeps ? global._creeps.length : Object.keys(Game.creeps).length
    const gcl = Game.gcl.level

    if (creepCount >= 10) {
this.unlockAchievement('creeps_10', '10 Creeps!', '👥')
}
    if (creepCount >= 20) {
this.unlockAchievement('creeps_20', '20 Creeps!', '👥')
}
    if (creepCount >= 50) {
this.unlockAchievement('creeps_50', '50 Creeps!', '👥')
}

    if (gcl >= 2) {
this.unlockAchievement('gcl_2', 'GCL 2!', '⬆️')
}
    if (gcl >= 3) {
this.unlockAchievement('gcl_3', 'GCL 3!', '⬆️')
}
    if (gcl >= 5) {
this.unlockAchievement('gcl_5', 'GCL 5!', '⬆️')
}
  },

  /**
     * ランク計算
     */
  getRank: function () {
    const level = Memory.gamification?.level ?? 1

    if (level >= 20) {
return 'Master'
}
    if (level >= 15) {
return 'Expert'
}
    if (level >= 10) {
return 'Advanced'
}
    if (level >= 5) {
return 'Intermediate'
}
    if (level >= 2) {
return 'Beginner'
}
    return 'Newbie'
  },

  /**
     * ダッシュボード表示
     */
  showDashboard: function () {
    this.init()
    const gm = Memory.gamification

    // Security: Use logging system to prevent console injection
    logger.info('🎮 === GAMIFICATION DASHBOARD === 🎮')
    logger.info('Level: ' + gm.level + ' | Rank: ' + this.getRank())
    logger.info(
      'XP: ' +
                gm.xp +
                ' / ' +
                gm.xpToNext +
                ' (' +
                Math.floor((gm.xp / gm.xpToNext) * 100) +
                '%)'
    )
    logger.info('Total Score: ' + gm.totalScore)
    logger.info('Achievements: ' + gm.achievements.length)
    logger.info('Streak: ' + gm.streakDays + ' days 🔥')

    if (gm.achievements.length > 0) {
      logger.info('🏆 Recent Achievements:')
      gm.achievements.slice(-5).forEach(function (a) {
        logger.info('  - ' + a)
      })
    }
  },

  /**
     * ビジュアルダッシュボード
     */
  renderDashboard: function () {
    // ⚡ PERFORMANCE: Early return if visual effects are disabled to save CPU
    if (!adaptiveSystem.isEnabled('visualEffects')) {
      return
    }

    this.init()
    const gm = Memory.gamification

    // ⚡ PERFORMANCE: Use tick-cached primary spawn initialized in main.js
    const spawn = global._primarySpawn
    if (!spawn || global._primarySpawnTick !== Game.time) {
      return
    }

    const visual = spawn.room.visual
    const x = spawn.pos.x + 5
    const y = spawn.pos.y - 3

    visual.rect(x - 3, y - 2, 6, 11, {
      fill: '#000000',
      opacity: 0.7,
      stroke: '#FFD700',
      strokeWidth: 0.1
    })

    visual.text('🎮 STATS 🎮', x, y - 1.3, {
      color: '#FFD700',
      font: 0.8,
      stroke: '#000000',
      strokeWidth: 0.05
    })

    visual.text('Lv.' + gm.level, x - 2, y - 0.3, {
      color: '#00FF00',
      font: 0.7,
      align: 'left',
      stroke: '#000000',
      strokeWidth: 0.05
    })

    vfx.progressBar({ x, y: y + 0.5, roomName: spawn.room.name }, gm.xp, gm.xpToNext, 'XP')

    visual.text('Score: ' + gm.totalScore, x - 2, y + 1.3, {
      color: '#FFD700',
      font: 0.6,
      align: 'left',
      stroke: '#000000',
      strokeWidth: 0.05
    })

    visual.text('🏆 ' + gm.achievements.length, x - 2, y + 2, {
      color: '#FFFFFF',
      font: 0.6,
      align: 'left',
      stroke: '#000000',
      strokeWidth: 0.05
    })

    if (gm.streakDays > 0) {
      visual.text('🔥 ' + gm.streakDays + ' days', x - 2, y + 2.7, {
        color: '#FF69B4',
        font: 0.6,
        align: 'left',
        stroke: '#000000',
        strokeWidth: 0.05
      })
    }

    // Daily Challenge info
    const challenge = dailyChallenge.getChallenge()
    visual.text('🎯 CHALLENGE 🎯', x, y + 3.8, {
      color: '#FFD700',
      font: 0.7,
      stroke: '#000000',
      strokeWidth: 0.05
    })

    vfx.progressBar(
      { x, y: y + 4.8, roomName: spawn.room.name },
      challenge.progress,
      challenge.challenge.target,
      challenge.challenge.name
    )

    vfx.rankBadge({ x: x + 1.5, y: y + 6.5, roomName: spawn.room.name }, this.getRank())
  },

  /**
     * Creepアクション追跡
     */
  trackAction: function (creep, action) {
    // ⚡ PERFORMANCE: Early return if gamification is disabled to save CPU in low-power modes
    if (!adaptiveSystem.isEnabled('gamification')) {
      return
    }

    switch (action) {
      case 'harvest': {
        this.addXP(1, 'harvest')
        const harvestCombo = this.addCombo('harvest')
        if (harvestCombo && harvestCombo >= 5) {
          vfx.combo(creep.pos, harvestCombo)
        }
        break
      }
      case 'build':
        this.addXP(3, 'build')
        vfx.scorePopup(creep.pos, 3, 'BUILD')
        break

      case 'upgrade': {
        this.addXP(2, 'upgrade')
        const upgradeCombo = this.addCombo('upgrade')
        if (upgradeCombo && upgradeCombo >= 3) {
          vfx.combo(creep.pos, upgradeCombo)
        }
        break
      }
      case 'repair':
        this.addXP(2, 'repair')
        vfx.healEffect(creep.pos)
        break

      case 'attack':
        this.addXP(10, 'attack')
        vfx.damageNumber(creep.pos, 10, true)
        break
    }
  },

  /**
     * リセット
     */
  reset: function () {
    delete Memory.gamification
    _initTick = -1
    logger.info('🔄 Gamification reset!')
  }
}

module.exports = gamification
