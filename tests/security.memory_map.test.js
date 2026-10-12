/**
 * Security Memory Map and Diary Protection Tests
 */

const memVis = require('../memory.visualizer')

describe('Security: Memory Map and Diary Protections', () => {
  beforeEach(() => {
    global.Game = {
      time: 100,
      rooms: {},
      creeps: {},
      cpu: { getUsed: () => 1.0, limit: 20, bucket: 10000 },
      gcl: { level: 1 }
    }
    global.Memory = {
      creeps: {},
      rooms: {},
      map: {
        rooms: {},
        explored: []
      }
    }
    // Mock FIND_SOURCES, etc.
    global.FIND_SOURCES = 1
    global.FIND_MINERALS = 2
    global.FIND_HOSTILE_CREEPS = 3

    // Mock console.log
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Memory Map: Prototype Pollution Protection', () => {
    test('recordRoom() should not allow dangerous keys', () => {
      const dangerousKey = '__proto__'
      global.Game.rooms[dangerousKey] = {
        find: () => []
      }

      memVis.recordRoom(dangerousKey)

      // Use hasOwnProperty to check if it was explicitly set
      expect(Object.prototype.hasOwnProperty.call(Memory.map.rooms, dangerousKey)).toBe(
        false
      )
      expect(Memory.map.explored).not.toContain(dangerousKey)
    })
  })

  describe('Memory Map: Size Limit Protection', () => {
    test('recordRoom() should limit explored rooms array to 100', () => {
      for (let i = 0; i < 110; i++) {
        const roomName = `W${i}N${i}`
        global.Game.rooms[roomName] = {
          find: () => []
        }
        memVis.recordRoom(roomName)
      }

      expect(Memory.map.explored.length).toBe(100)
      expect(Memory.map.explored[0]).toBe('W10N10') // Oldest should be shifted out
      expect(Memory.map.explored[99]).toBe('W109N109')
    })

    test('recordRoom() should limit room data object to 50', () => {
      for (let i = 0; i < 60; i++) {
        const roomName = `E${i}S${i}`
        global.Game.rooms[roomName] = {
          find: () => []
        }
        global.Game.time = 100 + i // Increment time for lastVisit
        memVis.recordRoom(roomName)
      }

      const roomKeys = Object.keys(Memory.map.rooms)
      expect(roomKeys.length).toBe(50)
      // E0S0 should be deleted as it was the oldest visit
      expect(Memory.map.rooms.E0S0).toBeUndefined()
      expect(Memory.map.rooms.E59S59).toBeDefined()
    })
  })

  describe('Creep Diary: Prototype Pollution Protection', () => {
    test('addDiaryEntry() should not allow dangerous creep names', () => {
      const dangerousKey = 'constructor'
      memVis.addDiaryEntry(dangerousKey, 'Hack attempt')

      // Use hasOwnProperty to check if it was explicitly set
      expect(Object.prototype.hasOwnProperty.call(Memory.creeps, dangerousKey)).toBe(false)
    })

    test('readDiary() should handle dangerous creep names safely', () => {
      const dangerousKey = 'toString'
      const result = memVis.readDiary(dangerousKey)

      expect(result).toEqual([])
    })
  })

  describe('Creep Diary: DoS Protection', () => {
    test('addDiaryEntry() should truncate long messages', () => {
      const creepName = 'testCreep'
      Memory.creeps[creepName] = {}
      const longMessage = 'a'.repeat(500)

      memVis.addDiaryEntry(creepName, longMessage)

      const entries = Memory.creeps[creepName].diary.entries
      expect(entries[0].message.length).toBe(200)
      expect(entries[0].message).toBe('a'.repeat(200))
    })
  })
})
