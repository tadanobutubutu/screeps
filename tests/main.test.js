/**
 * main.js のユニットテスト
 */

global.Game = {
  time: 100,
  cpu: { getUsed: jest.fn().mockReturnValue(10), limit: 100, bucket: 10000 },
  gcl: { level: 1 },
  rooms: {},
  creeps: {},
  spawns: {},
};
global.Memory = { helpShown: true };
global.RawMemory = {
  get: jest.fn().mockReturnValue('{}'),
};
global.OK = 0;
global.ERR_NOT_ENOUGH_ENERGY = -6;
global.ERR_NOT_IN_RANGE = -9;
global.WORK = 'work';
global.CARRY = 'carry';
global.MOVE = 'move';
global.HEAL = 'heal';
global.STRUCTURE_TOWER = 'tower';
global.RESOURCE_ENERGY = 'energy';
global.FIND_HOSTILE_CREEPS = 'findHostileCreeps';

jest.mock('../role.harvester', () => ({ run: jest.fn() }), { virtual: true });
jest.mock('../role.upgrader', () => ({ run: jest.fn() }), { virtual: true });
jest.mock('../role.builder', () => ({ run: jest.fn() }), { virtual: true });
jest.mock('../role.repairer', () => ({ run: jest.fn() }), { virtual: true });
jest.mock('../role.explorer', () => ({ run: jest.fn() }), { virtual: true });
jest.mock('../role.medic', () => ({ run: jest.fn() }), { virtual: true });
jest.mock('../role.transporter', () => ({ run: jest.fn() }), { virtual: true });
jest.mock('../role.scout', () => ({ run: jest.fn() }), { virtual: true });
jest.mock('../defense.manager', () => ({ run: jest.fn() }), { virtual: true });
jest.mock('../utils.memory', () => ({ cleanMemory: jest.fn().mockReturnValue(0) }), { virtual: true });
jest.mock('../utils.logging', () => ({
  init: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  tryCatch: jest.fn((fn) => fn()),
  getStats: jest.fn().mockReturnValue({ errors: 0 }),
  getSafeStack: jest.fn((s) => s),
}), { virtual: true });
jest.mock('../utils.emotions', () => ({
  display: jest.fn(),
  getStats: jest.fn().mockReturnValue({ veryHappy: 0, happy: 0, neutral: 0 }),
  interact: jest.fn(),
}), { virtual: true });
jest.mock('../memory.visualizer', () => ({
  recordSnapshot: jest.fn(),
  cleanup: jest.fn(),
  backup: jest.fn(),
  showStats: jest.fn(),
  showHistory: jest.fn(),
  showLeaderboard: jest.fn(),
  readDiary: jest.fn(),
  showMap: jest.fn(),
}), { virtual: true });
jest.mock('../tutorial.auto', () => ({
  isTutorial: jest.fn().mockReturnValue(false),
  run: jest.fn(),
  showProgress: jest.fn(),
}), { virtual: true });
jest.mock('../gamification', () => ({
  init: jest.fn(),
  updateStreak: jest.fn(),
  checkMilestones: jest.fn(),
  renderDashboard: jest.fn(),
  addXP: jest.fn(),
  showDashboard: jest.fn(),
  reset: jest.fn(),
}), { virtual: true });
jest.mock('../visual.effects', () => ({
  progressBar: jest.fn(),
  stars: jest.fn(),
  successExplosion: jest.fn(),
}), { virtual: true });
jest.mock('../auto.evolution', () => ({
  run: jest.fn(),
  showDashboard: jest.fn(),
  reset: jest.fn(),
}), { virtual: true });
jest.mock('../system.adaptive', () => ({
  evaluate: jest.fn().mockReturnValue(2),
  isEnabled: jest.fn().mockReturnValue(true),
  emergencyCleanup: jest.fn(),
  showDashboard: jest.fn(),
  setMode: jest.fn(),
  MODE: { EMERGENCY: 0, MINIMAL: 1, NORMAL: 2, FULL: 3 },
}), { virtual: true });
jest.mock('../utils.dashboard', () => ({ displayVisuals: jest.fn() }), { virtual: true });

describe('main.js', () => {
  test('モジュールが正しく読み込める', () => {
    const main = require('../main');
    expect(main).toBeDefined();
    expect(typeof main.loop).toBe('function');
  });

  test('loop関数が例外を投げない', () => {
    global.Game.creeps = {};
    global.Game.spawns = {};
    const main = require('../main');
    expect(() => main.loop()).not.toThrow();
  });

  test('help関数が存在する', () => {
    require('../main');
    expect(typeof global.help).toBe('function');
  });

  test('adaptiveグローバルが存在する', () => {
    require('../main');
    expect(typeof global.adaptive).toBe('function');
  });

  test('modeグローバルが存在する', () => {
    require('../main');
    expect(typeof global.mode).toBe('function');
  });
});
