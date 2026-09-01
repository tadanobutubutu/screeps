jest.mock('system.adaptive', () => ({
  isEnabled: jest.fn(() => true)
}))
jest.mock('visual.effects', () => ({
  levelUp: jest.fn(),
  achievement: jest.fn(),
  combo: jest.fn(),
  scorePopup: jest.fn(),
  healEffect: jest.fn(),
  damageNumber: jest.fn(),
  progressBar: jest.fn(),
  rankBadge: jest.fn()
}))
jest.mock('utils.logging', () => ({
  info: jest.fn()
}))
jest.mock('utils.memory', () => ({
  isSafeKey: jest.fn(() => true)
}))
jest.mock('daily-challenge', () => ({
  getChallenge: jest.fn(() => ({
    progress: 10,
    challenge: { target: 100, name: 'Test Challenge' }
  }))
}))

const gamification = require('../gamification')
const vfx = require('visual.effects')
const logger = require('utils.logging')
const adaptiveSystem = require('system.adaptive')

describe('Gamification System', () => {
  beforeEach(() => {
    global.Game = {
      time: 100,
      spawns: {
        Spawn1: {
          pos: { x: 25, y: 25, roomName: 'W1N1' },
          room: { name: 'W1N1', visual: { rect: jest.fn(), text: jest.fn() } }
        }
      },
      creeps: {},
      gcl: { level: 1 }
    }
    global._primarySpawn = global.Game.spawns.Spawn1
    global._primarySpawnTick = 100
    global.Memory = {}
    jest.clearAllMocks()
  })

  test('init should setup default memory', () => {
    gamification.init()
    expect(Memory.gamification).toBeDefined()
    expect(Memory.gamification.level).toBe(1)
    expect(Memory.gamification.xp).toBe(0)
    expect(Memory.gamification.achievements).toEqual([])
  })

  test('addXP should add xp and check level up', () => {
    gamification.init()
    gamification.addXP(50, 'test')
    expect(Memory.gamification.xp).toBe(50)
    expect(Memory.gamification.totalScore).toBe(50)
    expect(logger.info).toHaveBeenCalledWith('✨ +50 XP (test)')
  })

  test('checkLevelUp should level up when xp reaches xpToNext', () => {
    gamification.init()
    Memory.gamification.xp = 150
    Memory.gamification.xpToNext = 100

    gamification.checkLevelUp()

    expect(Memory.gamification.level).toBe(2)
    expect(Memory.gamification.xp).toBe(100)
    expect(Memory.gamification.xpToNext).toBeGreaterThan(100)
    expect(vfx.levelUp).toHaveBeenCalled()
    expect(Memory.gamification.achievements).toContain('level_2')
  })

  test('unlockAchievement should add achievement and grant bonus XP', () => {
    gamification.init()
    gamification.unlockAchievement('test_ach', 'Test Achievement', '🏅')

    expect(Memory.gamification.achievements).toContain('test_ach')
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('ACHIEVEMENT UNLOCKED'))
    expect(vfx.achievement).toHaveBeenCalled()
    expect(Memory.gamification.xp).toBe(50)
  })

  test('addCombo should track combos and add bonus XP on threshold', () => {
    gamification.init()

    // 1st time
    gamification.addCombo('harvest')
    expect(Memory.gamification.combos.harvest.count).toBe(1)

    // 2nd time
    gamification.addCombo('harvest')
    expect(Memory.gamification.combos.harvest.count).toBe(2)

    // 3rd time (threshold)
    gamification.addCombo('harvest')
    expect(Memory.gamification.combos.harvest.count).toBe(3)
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('3x harvest combo!'))
    expect(Memory.gamification.xp).toBe(6) // bonus xp = count * 2
  })

  test('addCombo should reset count if timeout exceeded', () => {
    gamification.init()
    gamification.addCombo('harvest')
    expect(Memory.gamification.combos.harvest.count).toBe(1)

    global.Game.time = 120 // +20 ticks (> 10)

    gamification.addCombo('harvest')
    expect(Memory.gamification.combos.harvest.count).toBe(1)
  })

  test('updateStreak should increment streak correctly', () => {
    gamification.init()
    Memory.gamification.lastActiveDay = 9
    global.Game.time = 10000 // today = 10

    gamification.updateStreak()

    expect(Memory.gamification.streakDays).toBe(1)

    // next day
    global.Game.time = 11000 // today = 11
    gamification.updateStreak()

    expect(Memory.gamification.streakDays).toBe(2)
  })

  test('checkMilestones should unlock achievements for creep count and GCL', () => {
    gamification.init()
    global._creeps = new Array(10) // 10 creeps
    global.Game.gcl.level = 2 // GCL 2

    gamification.checkMilestones()

    expect(Memory.gamification.achievements).toContain('creeps_10')
    expect(Memory.gamification.achievements).toContain('gcl_2')
  })

  test('trackAction should grant correct XP for different actions', () => {
    gamification.init()
    const creep = { pos: { x: 10, y: 10, roomName: 'W1N1' } }

    gamification.trackAction(creep, 'harvest')
    expect(Memory.gamification.xp).toBe(1)

    gamification.trackAction(creep, 'build')
    expect(Memory.gamification.xp).toBe(4) // 1 + 3
    expect(vfx.scorePopup).toHaveBeenCalled()

    gamification.trackAction(creep, 'upgrade')
    expect(Memory.gamification.xp).toBe(6) // 4 + 2

    gamification.trackAction(creep, 'repair')
    expect(Memory.gamification.xp).toBe(8) // 6 + 2
    expect(vfx.healEffect).toHaveBeenCalled()

    gamification.trackAction(creep, 'attack')
    expect(Memory.gamification.xp).toBe(18) // 8 + 10
    expect(vfx.damageNumber).toHaveBeenCalled()
  })

  test('trackAction should trigger combo effects on threshold', () => {
    gamification.init()
    const creep = { pos: { x: 10, y: 10, roomName: 'W1N1' } }

    for (let i = 0; i < 5; i++) {
      gamification.trackAction(creep, 'harvest')
    }

    expect(vfx.combo).toHaveBeenCalled()
  })

  test('showDashboard should log gamification stats', () => {
    gamification.init()
    gamification.addXP(50, 'test')
    gamification.unlockAchievement('test', 'test', '🏅')

    gamification.showDashboard()

    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('GAMIFICATION DASHBOARD'))
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Level: 2'))
  })

  test('renderDashboard should call room visual methods', () => {
    gamification.init()
    const visual = global._primarySpawn.room.visual

    gamification.renderDashboard()

    expect(visual.rect).toHaveBeenCalled()
    expect(visual.text).toHaveBeenCalled()
    expect(vfx.progressBar).toHaveBeenCalled()
    expect(vfx.rankBadge).toHaveBeenCalled()
  })

  test('reset should clear memory', () => {
    gamification.init()
    gamification.reset()

    expect(Memory.gamification).toBeUndefined()
  })
})
