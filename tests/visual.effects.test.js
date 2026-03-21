/**
 * visual.effects.js のユニットテスト
 */

global.Game = { time: 10 };
global.Memory = { adaptive: { currentMode: 'normal' } };
global.RoomVisual = class {
  constructor(roomName) {}
  circle() {}
  line() {}
  text() {}
  rect() {}
};

jest.mock('../system.adaptive', () => ({
  isEnabled: jest.fn().mockReturnValue(true),
}), { virtual: true });

const visualEffects = require('../visual.effects');

describe('visual.effects', () => {
  let mockPos;

  beforeEach(() => {
    global.Memory = { adaptive: { currentMode: 'normal' } };
    global.Game.time = 10;
    mockPos = { x: 25, y: 25, roomName: 'W0N0' };
  });

  test('モジュールが正しく読み込める', () => {
    expect(visualEffects).toBeDefined();
    expect(typeof visualEffects.particles).toBe('function');
    expect(typeof visualEffects.successExplosion).toBe('function');
    expect(typeof visualEffects.levelUp).toBe('function');
    expect(typeof visualEffects.combo).toBe('function');
  });

  test('particlesがエラーなく実行される', () => {
    expect(() => visualEffects.particles(mockPos, '#FFD700', 5)).not.toThrow();
  });

  test('successExplosionがエラーなく実行される', () => {
    expect(() => visualEffects.successExplosion(mockPos)).not.toThrow();
  });

  test('levelUpがエラーなく実行される', () => {
    expect(() => visualEffects.levelUp(mockPos, 5)).not.toThrow();
  });

  test('comboがエラーなく実行される', () => {
    expect(() => visualEffects.combo(mockPos, 3)).not.toThrow();
  });

  test('achievementがエラーなく実行される', () => {
    expect(() => visualEffects.achievement(mockPos, 'Test Achievement')).not.toThrow();
  });

  test('progressBarがエラーなく実行される', () => {
    expect(() => visualEffects.progressBar(mockPos, 50, 100, 'Test')).not.toThrow();
  });

  test('rainbowTrailがエラーなく実行される', () => {
    const mockCreep = {
      pos: { x: 25, y: 25, room: { name: 'W0N0' } },
      memory: {}
    };
    expect(() => visualEffects.rainbowTrail(mockCreep)).not.toThrow();
  });

  test('damageNumberがエラーなく実行される', () => {
    expect(() => visualEffects.damageNumber(mockPos, 100)).not.toThrow();
    expect(() => visualEffects.damageNumber(mockPos, 200, true)).not.toThrow();
  });

  test('healEffectがエラーなく実行される', () => {
    expect(() => visualEffects.healEffect(mockPos)).not.toThrow();
  });

  test('starsがエラーなく実行される', () => {
    expect(() => visualEffects.stars(mockPos, 3)).not.toThrow();
  });

  test('streakがエラーなく実行される', () => {
    expect(() => visualEffects.streak(mockPos, 5)).not.toThrow();
  });

  test('scorePopupがエラーなく実行される', () => {
    expect(() => visualEffects.scorePopup(mockPos, 100, 'POINTS')).not.toThrow();
  });

  test('rankBadgeがエラーなく実行される', () => {
    expect(() => visualEffects.rankBadge(mockPos, 'Master')).not.toThrow();
    expect(() => visualEffects.rankBadge(mockPos, 'InvalidRank')).not.toThrow();
  });
});
