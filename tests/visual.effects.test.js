/**
 * visual.effects.js のユニットテスト
 */

global.Game = { time: 10 };
global.Memory = { adaptive: { currentMode: 'normal' } };
global.RoomVisual = class {
  constructor(roomName) {}
  circle(x, y, options) {
    this.lastCircle = { x, y, options };
  }
  line(x1, y1, x2, y2, options) {
    this.lastLine = { x1, y1, x2, y2, options };
  }
  text(text, x, y, options) {
    this.lastText = { text, x, y, options };
  }
  rect(x, y, width, height, options) {
    this.lastRect = { x, y, width, height, options };
  }
};

jest.mock('system.adaptive', () => ({
  isEnabled: jest.fn().mockReturnValue(true),
}));

const visualEffects = require('../visual.effects');

describe('visual.effects', () => {
  let mockPos;

  beforeEach(() => {
    visualEffects.reset();
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
      pos: { x: 25, y: 25 },
      room: { name: 'W0N0' },
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

  test('particles with different colors and counts', () => {
    expect(() => visualEffects.particles(mockPos, '#FF0000', 10)).not.toThrow();
    expect(() => visualEffects.particles(mockPos, '#00FF00', 15)).not.toThrow();
    expect(() => visualEffects.particles(mockPos, '#0000FF', 20)).not.toThrow();
  });

  test('successExplosion with different positions', () => {
    expect(() => visualEffects.successExplosion({ x: 10, y: 10, roomName: 'W0N0' })).not.toThrow();
    expect(() => visualEffects.successExplosion({ x: 40, y: 40, roomName: 'W0N0' })).not.toThrow();
  });

  test('levelUp with different levels', () => {
    expect(() => visualEffects.levelUp(mockPos, 1)).not.toThrow();
    expect(() => visualEffects.levelUp(mockPos, 10)).not.toThrow();
    expect(() => visualEffects.levelUp(mockPos, 100)).not.toThrow();
  });

  test('combo with different counts', () => {
    expect(() => visualEffects.combo(mockPos, 1)).not.toThrow();
    expect(() => visualEffects.combo(mockPos, 5)).not.toThrow();
    expect(() => visualEffects.combo(mockPos, 10)).not.toThrow();
  });

  test('achievement with different names', () => {
    expect(() => visualEffects.achievement(mockPos, 'First')).not.toThrow();
    expect(() => visualEffects.achievement(mockPos, 'First Harvest')).not.toThrow();
  });

  test('progressBar with different values', () => {
    expect(() => visualEffects.progressBar(mockPos, 0, 100)).not.toThrow();
    expect(() => visualEffects.progressBar(mockPos, 25, 100, '25%')).not.toThrow();
    expect(() => visualEffects.progressBar(mockPos, 75, 100, '75%')).not.toThrow();
    expect(() => visualEffects.progressBar(mockPos, 100, 100, '100%')).not.toThrow();
  });

  test('rainbowTrail with different creeps', () => {
    const creep1 = {
      pos: { x: 25, y: 25 },
      room: { name: 'W0N0' },
      memory: { trail: [] }
    };
    expect(() => visualEffects.rainbowTrail(creep1)).not.toThrow();
  });

  test('damageNumber with critical flag', () => {
    expect(() => visualEffects.damageNumber(mockPos, 50, false)).not.toThrow();
    expect(() => visualEffects.damageNumber(mockPos, 150, true)).not.toThrow();
    expect(() => visualEffects.damageNumber(mockPos, 500, false)).not.toThrow();
  });

  test('healEffect with different positions', () => {
    expect(() => visualEffects.healEffect({ x: 10, y: 10, roomName: 'W0N0' })).not.toThrow();
  });

  test('stars with different counts', () => {
    expect(() => visualEffects.stars(mockPos, 1)).not.toThrow();
    expect(() => visualEffects.stars(mockPos, 5)).not.toThrow();
    expect(() => visualEffects.stars(mockPos, 10)).not.toThrow();
  });

  test('streak with different counts', () => {
    expect(() => visualEffects.streak(mockPos, 1)).not.toThrow();
    expect(() => visualEffects.streak(mockPos, 10)).not.toThrow();
  });

  test('scorePopup with different scores and types', () => {
    expect(() => visualEffects.scorePopup(mockPos, 10, 'XP')).not.toThrow();
    expect(() => visualEffects.scorePopup(mockPos, 100, 'POINTS')).not.toThrow();
    expect(() => visualEffects.scorePopup(mockPos, 1000, 'GEMS')).not.toThrow();
  });

  test('rankBadge with all rank types', () => {
    expect(() => visualEffects.rankBadge(mockPos, 'Novice')).not.toThrow();
    expect(() => visualEffects.rankBadge(mockPos, 'Apprentice')).not.toThrow();
    expect(() => visualEffects.rankBadge(mockPos, 'Expert')).not.toThrow();
    expect(() => visualEffects.rankBadge(mockPos, 'Master')).not.toThrow();
    expect(() => visualEffects.rankBadge(mockPos, 'Grandmaster')).not.toThrow();
  });

  test('achievement with different icons', () => {
    expect(() => visualEffects.achievement(mockPos, 'Test', '🏆')).not.toThrow();
    expect(() => visualEffects.achievement(mockPos, 'Test', '⭐')).not.toThrow();
    expect(() => visualEffects.achievement(mockPos, 'Test', '💎')).not.toThrow();
  });

  test('rainbowTrailがVFX無効時にtrailPositionsを削除する', () => {
    const { isEnabled } = require('system.adaptive');
    isEnabled.mockReturnValueOnce(false);
    // isVfxEnabled()のper-tickキャッシュをリセットするために異なるGame.timeを使用
    global.Game.time = 999;
    const mockCreep = {
      pos: { x: 25, y: 25 },
      room: { name: 'W0N0' },
      memory: { trailPositions: [{ x: 1, y: 1 }] }
    };
    expect(() => visualEffects.rainbowTrail(mockCreep)).not.toThrow();
    expect(mockCreep.memory.trailPositions).toBeUndefined();
    // 次のテストのためにmockをリセットし、新しいGame.timeでキャッシュを更新
    isEnabled.mockReturnValue(true);
    global.Game.time = 1000; // 1000: 次のテスト用のキャッシュリセット値
  });

  test('rainbowTrailのtrailPositionsが10件を超えた場合に古い位置を削除する', () => {
    const mockCreep = {
      pos: { x: 25, y: 25 },
      room: { name: 'W0N0' },
      memory: {
        trailPositions: Array.from({ length: 10 }, (_, i) => ({ x: i, y: i }))
      }
    };
    global.Game.time = 2000; // 2000: 前のテストと異なるtickでキャッシュをリセット
    expect(() => visualEffects.rainbowTrail(mockCreep)).not.toThrow();
    expect(mockCreep.memory.trailPositions.length).toBeLessThanOrEqual(10);
  });
});
