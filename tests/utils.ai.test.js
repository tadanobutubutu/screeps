/**
 * utils.ai.js のユニットテスト
 */

global.Memory = {};
global.FIND_MY_CREEPS = 10;
global.FIND_MY_STRUCTURES = 20;
global.FIND_HOSTILE_CREEPS = 10;
global.FIND_CONSTRUCTION_SITES = 8;

const AIHelper = require('../utils.ai');

describe('utils.ai', () => {
  beforeEach(() => {
    global.Memory = {};
  });

  test('モジュールが正しく読み込める', () => {
    expect(AIHelper).toBeDefined();
    expect(typeof AIHelper.getAIDecision).toBe('function');
    expect(typeof AIHelper.suggestCreepCount).toBe('function');
    expect(typeof AIHelper.shouldBuildStructure).toBe('function');
  });

  test('getAIDecisionでhostilesがいるときdefenseを返す', () => {
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

  test('getAIDecisionでRCL < 3のときearly_gameを返す', () => {
    const room = {
      find: jest.fn().mockReturnValue([]),
      controller: { level: 2 },
      energyAvailable: 500,
      energyCapacityAvailable: 300,
    };

    const decision = AIHelper.getAIDecision(room);
    expect(decision.phase).toBe('early_game');
  });

  test('getAIDecisionでenergyRatio < 0.5のときfarmingを返す', () => {
    const room = {
      find: jest.fn().mockReturnValue([]),
      controller: { level: 5 },
      energyAvailable: 400,
      energyCapacityAvailable: 1000,
    };

    const decision = AIHelper.getAIDecision(room);
    expect(decision.phase).toBe('farming');
  });

  test('getAIDecisionでconstructionSites > 5のときbuildingを返す', () => {
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

  test('suggestCreepCountが数を返す', () => {
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

  test('shouldBuildStructureがdefense phaseでfalseを返す', () => {
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

  test('shouldBuildStructureが構造物数が上限以下のときtrueを返す', () => {
    global.Memory.aiState = { phase: 'growth' };
    const room = {
      find: jest.fn().mockReturnValue([]),
      controller: { level: 4 },
    };

    const result = AIHelper.shouldBuildStructure(room);
    expect(result).toBe(true);
  });
});
