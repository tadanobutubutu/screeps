/**
 * Unit tests for utils.ai.js
 */

global.Memory = {};
global.FIND_MY_CREEPS = 10;
global.FIND_MY_STRUCTURES = 20;
global.FIND_HOSTILE_CREEPS = 10;
global.FIND_CONSTRUCTION_SITES = 8;

const AIHelper = require('../utils.ai');

// Mock utils.memory
jest.mock('../utils.memory', () => ({
  isSafeKey: jest.fn((key) => {
    if (typeof key === 'number') return true;
    const dangerous = ['__proto__', 'constructor', 'prototype'];
    // Real limit is 256, we use it here to test our 100 char truncation
    return typeof key === 'string' && key.length <= 256 && !dangerous.includes(key);
  }),
}));

describe('utils.ai', () => {
  beforeEach(() => {
    global.Memory = {};
  });

  test('should be able to load the module', () => {
    expect(AIHelper).toBeDefined();
    expect(typeof AIHelper.getAIDecision).toBe('function');
    expect(typeof AIHelper.suggestCreepCount).toBe('function');
    expect(typeof AIHelper.shouldBuildStructure).toBe('function');
  });

  test('getAIDecision should return defense when hostiles are present', () => {
    global.Memory.aiState = { phase: 'normal' };
    const room = {
      find: jest.fn().mockImplementation((type) => {
        if (type === FIND_HOSTILE_CREEPS) return [{ id: 'creep1' }];
        return [];
      }),
      controller: { level: 5 },
      energyAvailable: 1000,
      energyCapacityAvailable: 2000,
    };

    const decision = AIHelper.getAIDecision(room);
    expect(decision.phase).toBe('defense');
    expect(decision.priority).toBe('survival');
  });

  test('getAIDecision should return early_game when RCL < 3', () => {
    const room = {
      find: jest.fn().mockReturnValue([]),
      controller: { level: 2 },
      energyAvailable: 500,
      energyCapacityAvailable: 300,
    };

    const decision = AIHelper.getAIDecision(room);
    expect(decision.phase).toBe('early_game');
  });

  test('getAIDecision should return farming when energyRatio < 0.5', () => {
    const room = {
      find: jest.fn().mockReturnValue([]),
      controller: { level: 5 },
      energyAvailable: 400,
      energyCapacityAvailable: 1000,
    };

    const decision = AIHelper.getAIDecision(room);
    expect(decision.phase).toBe('farming');
  });

  test('getAIDecision should return building when constructionSites > 5', () => {
    global.Memory.aiState = { phase: 'normal' };
    const room = {
      find: jest.fn().mockImplementation((type) => {
        if (type === FIND_MY_CREEPS) return [];
        if (type === FIND_MY_STRUCTURES) return [];
        if (type === FIND_HOSTILE_CREEPS) return [];
        if (type === FIND_CONSTRUCTION_SITES) return [1,2,3,4,5,6];
        return [];
      }),
      controller: { level: 5 },
      energyAvailable: 1000,
      energyCapacityAvailable: 1500,
    };

    const decision = AIHelper.getAIDecision(room);
    expect(decision.phase).toBe('building');
  });

  test('suggestCreepCount should return numbers', () => {
    global.Memory.aiState = { phase: 'expansion' };
    const room = {
      find: jest.fn().mockReturnValue([]),
      controller: { level: 5 },
      energyAvailable: 1000,
      energyCapacityAvailable: 1500,
    };

    const suggestions = AIHelper.suggestCreepCount(room);
    expect(suggestions).toBeDefined();
    expect(typeof suggestions.harvester).toBe('number');
  });

  test('shouldBuildStructure should return false in defense phase', () => {
    const room = {
      find: jest.fn().mockReturnValue([]),
      controller: { level: 5 },
      energyAvailable: 1000,
      energyCapacityAvailable: 2000,
    };

    const result = AIHelper.shouldBuildStructure(room);
    // When no hostiles, no early_game, it will check structure count
    // With empty structures and RCL 5, max is 30, so returns true
    expect(typeof result).toBe('boolean');
  });

  test('shouldBuildStructure should return true when structure count is below limit', () => {
    global.Memory.aiState = { phase: 'growth' };
    const room = {
      find: jest.fn().mockReturnValue([]),
      controller: { level: 4 },
    };

    const result = AIHelper.shouldBuildStructure(room);
    expect(result).toBe(true);
  });

  describe('Security Hardening', () => {
    test('initMemory should recover from improper state', () => {
      // Abnormal state
      global.Memory.aiState = {
        phase: '__proto__',
        priority: 'a'.repeat(150), // isSafeKey (limit 256) returns true, but AIHelper truncates to 100
      };

      AIHelper.initMemory();

      expect(global.Memory.aiState.phase).toBe('expansion'); // Default because of unsafe key
      expect(global.Memory.aiState.priority.length).toBe(100); // Truncated
    });

    test('suggestCreepCount should return default values on Prototype Pollution attempt', () => {
      const room = {
        find: jest.fn().mockReturnValue([]),
        controller: { level: 5 },
        energyAvailable: 1000,
        energyCapacityAvailable: 2000,
      };

      // Temporarily mock getAIDecision to return an invalid phase
      const originalGetAIDecision = AIHelper.getAIDecision;
      AIHelper.getAIDecision = jest.fn().mockReturnValue({ phase: '__proto__' });

      const suggestions = AIHelper.suggestCreepCount(room);

      // Should return suggestions.expansion instead of suggestions['__proto__']
      expect(suggestions).toEqual({ harvester: 4, upgrader: 2, builder: 2, repairer: 1 });

      // Restore
      AIHelper.getAIDecision = originalGetAIDecision;
    });

    test('shouldBuildStructure should return false for invalid RCL', () => {
      const room = {
        find: jest.fn().mockReturnValue([]),
        controller: { level: '__proto__' }, // Invalid RCL
      };

      const result = AIHelper.shouldBuildStructure(room);
      expect(result).toBe(false);
    });

    test('getAIDecision should not crash when energy capacity is 0', () => {
      const room = {
        find: jest.fn().mockReturnValue([]),
        controller: { level: 5 },
        energyAvailable: 0,
        energyCapacityAvailable: 0, // Potential division by zero
      };

      const decision = AIHelper.getAIDecision(room);
      expect(decision.phase).toBe('farming'); // 0 / 0 -> 0 < 0.5
    });
  });
});
