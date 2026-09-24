/**
 * Security DoS Protection Tests
 */

const memVis = require('../memory.visualizer')
const logger = require('../utils.logging')
const adaptive = require('../system.adaptive')

describe('Security: DoS Protections', () => {
  beforeEach(() => {
    global.Game = {
      time: 100,
      gcl: { level: 1 },
      cpu: { getUsed: () => 1.0, bucket: 10000 },
      rooms: {},
      creeps: {},
      flags: {},
      spawns: {}
    }
    global.Memory = {
      creeps: {},
      rooms: {},
      flags: {},
      spawns: {}
    }
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Memory Visualizer: Backup Recursion Protection', () => {
    test('backup() should not include the backups array in its snapshot', () => {
      // Initial backup
      memVis.backup()
      expect(Memory.backups).toBeDefined()
      expect(Memory.backups.length).toBe(1)

      // The data in the first backup should NOT contain a 'backups' key
      expect(Memory.backups[0].data.backups).toBeUndefined()

      // Create another backup - if recursive, this would include the first backup
      memVis.backup()
      expect(Memory.backups.length).toBe(2)

      // The data in the second backup should also NOT contain a 'backups' key
      expect(Memory.backups[1].data.backups).toBeUndefined()

      // Verify it didn't strip other important keys
      expect(Memory.backups[1].data.creeps).toBeDefined()
    })
  })

  describe('Logging System: Mid-tick DoS Protection', () => {
    test('log() should rotate logs immediately when exceeding 100 entries', () => {
      // Fill logs to 100
      for (let i = 0; i < 100; i++) {
        logger.info(`Log ${i}`)
      }
      expect(Memory.logs.length).toBe(100)
      expect(Memory.logs[0].message).toBe('Log 0')

      // Add one more log - should trigger rotation immediately
      logger.info('Log 101')
      expect(Memory.logs.length).toBe(100)
      expect(Memory.logs[0].message).toBe('Log 1')
      expect(Memory.logs[99].message).toBe('Log 101')
    })
  })

  describe('Adaptive System: Emergency Cleanup', () => {
    test('emergencyCleanup() should correctly clear all memory-intensive structures', () => {
      Memory.backups = [{ data: {}, time: 100 }]
      Memory.evolution = { history: [] }
      Memory.timeMachine = { snapshots: [] }
      Memory.leaderboard = { harvested: {} }
      Memory.cache = { someKey: {} }
      Memory.memorySnapshots = []
      Memory.diary = { entries: [] } // Root diary

      Memory.creeps = {
        harvester1: {
          role: 'harvester',
          diary: { entries: [] },
          emotions: { mood: 3 },
          trailPositions: [{ x: 1, y: 1 }]
        }
      }

      Memory.gamification = {
        achievements: ['a', 'b', 'c', 'd', 'e', 'f']
      }

      adaptive.emergencyCleanup()

      // Root structures
      expect(Memory.backups).toBeUndefined()
      expect(Memory.evolution).toBeUndefined()
      expect(Memory.timeMachine).toBeUndefined()
      expect(Memory.leaderboard).toBeUndefined()
      expect(Memory.cache).toBeUndefined()
      expect(Memory.memorySnapshots).toBeUndefined()
      expect(Memory.diary).toBeUndefined()

      // Per-creep structures
      expect(Memory.creeps.harvester1.diary).toBeUndefined()
      expect(Memory.creeps.harvester1.emotions).toBeUndefined()
      expect(Memory.creeps.harvester1.trailPositions).toBeUndefined()
      expect(Memory.creeps.harvester1.role).toBe('harvester')

      // Gamification
      expect(Memory.gamification.achievements.length).toBe(5)
    })
  })

  describe('Memory Visualizer: Unsanitized Iteration Protection', () => {
    test('showTopMemoryUsers() should not crash or include inherited properties', () => {
      // Mock Memory.creeps with a dangerous key
      Memory.creeps = {
        harvester1: { role: 'harvester' }
      }

      // In a real environment, __proto__ or constructor might be present if the object is not a null-prototype object
      // Here we simulate it by adding it to the object.
      Object.defineProperty(Memory.creeps, 'constructor', {
        value: { length: 1000 }, // Simulate a large object
        enumerable: true
      })

      // This should not crash and should ideally skip 'constructor' if we add the protection
      const result = memVis.showTopMemoryUsers()

      const constructorEntry = result.find((item) => item.name === 'constructor')
      expect(constructorEntry).toBeUndefined()
    })

    test('showMap() should not crash when Memory.map.rooms contains dangerous keys', () => {
      Memory.map = {
        rooms: {
          E1S1: { lastVisit: 100, sources: 2, hostiles: 0 }
        },
        explored: ['E1S1']
      }

      Object.defineProperty(Memory.map.rooms, 'constructor', {
        value: { lastVisit: 100 },
        enumerable: true
      })

      // This should not crash
      expect(() => memVis.showMap()).not.toThrow()
    })
  })
})
