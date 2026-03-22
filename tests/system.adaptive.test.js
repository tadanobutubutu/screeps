/**
 * system.adaptive.js のユニットテスト
 */

global.Game = {
  time: 100,
  cpu: { getUsed: jest.fn().mockReturnValue(10), limit: 100, bucket: 10000 },
};
global.Memory = {};
global.RawMemory = {
  get: jest.fn().mockReturnValue('{}'),
};

const adaptiveSystem = require('../system.adaptive');

describe('system.adaptive', () => {
  beforeEach(() => {
    delete Memory.adaptive;
  });

  test('モジュールが正しく読み込める', () => {
    expect(adaptiveSystem).toBeDefined();
  });

  test('MODE定数が定義されている', () => {
    expect(adaptiveSystem.MODE.EMERGENCY).toBe(0);
    expect(adaptiveSystem.MODE.MINIMAL).toBe(1);
    expect(adaptiveSystem.MODE.NORMAL).toBe(2);
    expect(adaptiveSystem.MODE.FULL).toBe(3);
  });

  test('initがMemory.adaptiveを初期化', () => {
    adaptiveSystem.init();
    expect(Memory.adaptive).toBeDefined();
    expect(Memory.adaptive.currentMode).toBe(2);
  });

  test('evaluateがモードを返す', () => {
    adaptiveSystem.init();
    const mode = adaptiveSystem.evaluate();
    expect([0, 1, 2, 3]).toContain(mode);
  });

  test('evaluateが高bucketでFULLを返す', () => {
    global.Game.cpu.getUsed = jest.fn().mockReturnValue(10);
    global.Game.cpu.bucket = 10000;
    global.RawMemory.get = jest.fn().mockReturnValue('{}');
    adaptiveSystem.init();
    Memory.adaptive.lastCheck = 0;
    const mode = adaptiveSystem.evaluate();
    expect(mode).toBe(adaptiveSystem.MODE.FULL);
  });

  test('evaluateが低bucketでEMERGENCYを返す', () => {
    global.Game.cpu.getUsed = jest.fn().mockReturnValue(10);
    global.Game.cpu.bucket = 500;
    global.RawMemory.get = jest.fn().mockReturnValue('{}');
    adaptiveSystem.init();
    Memory.adaptive.lastCheck = 0;
    const mode = adaptiveSystem.evaluate();
    expect(mode).toBe(adaptiveSystem.MODE.EMERGENCY);
  });

  test('getModeNameが正しい名前を返す', () => {
    expect(adaptiveSystem.getModeName(0)).toBe('emergency');
    expect(adaptiveSystem.getModeName(1)).toBe('minimal');
    expect(adaptiveSystem.getModeName(2)).toBe('normal');
    expect(adaptiveSystem.getModeName(3)).toBe('full');
    expect(adaptiveSystem.getModeName(99)).toBeNull();
  });

  test('isEnabledが機能をチェック', () => {
    adaptiveSystem.init();
    Memory.adaptive.currentMode = adaptiveSystem.MODE.FULL;
    expect(adaptiveSystem.isEnabled('logging')).toBe(true);
    expect(adaptiveSystem.isEnabled('gamification')).toBe(true);
  });

  test('isEnabledがMINIMALモードで正しく動作', () => {
    adaptiveSystem.init();
    Memory.adaptive.currentMode = adaptiveSystem.MODE.MINIMAL;
    expect(adaptiveSystem.isEnabled('logging')).toBe(true);
    expect(adaptiveSystem.isEnabled('visualEffects')).toBe(false);
  });

  test('setModeがモードを変更', () => {
    adaptiveSystem.init();
    adaptiveSystem.setMode(3);
    expect(Memory.adaptive.currentMode).toBe(3);
  });

  test('setModeが無効なモードを拒否', () => {
    adaptiveSystem.init();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    adaptiveSystem.setMode(99);
    expect(Memory.adaptive.currentMode).not.toBe(99);
    consoleSpy.mockRestore();
  });

  test('resetがMemory.adaptiveを削除', () => {
    adaptiveSystem.init();
    adaptiveSystem.reset();
    expect(Memory.adaptive).toBeUndefined();
  });

  test('emergencyCleanupがクリーンアップ', () => {
    Memory.evolution = { test: 'data' };
    Memory.backups = [];
    Memory.timeMachine = { test: 'data' };
    Memory.gamification = { achievements: ['a', 'b', 'c'] };
    Memory.creeps = {
      creep1: { diary: {}, emotions: {}, trailPositions: [] },
    };
    adaptiveSystem.emergencyCleanup();
    expect(Memory.evolution).toBeUndefined();
    console.log('Emergency cleanup completed');
  });

  test('getModeChangeReasonが理由を返す', () => {
    const reason = adaptiveSystem.getModeChangeReason(0, 90, 500, 50);
    expect(typeof reason).toBe('string');
  });
});
