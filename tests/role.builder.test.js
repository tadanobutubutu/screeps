/**
 * role.builder.js のユニットテスト
 */

global.Game = { time: 10 };
global.Memory = {};
global.RESOURCE_ENERGY = 'energy';
global.OK = 0;
global.ERR_NOT_IN_RANGE = -9;
global.FIND_CONSTRUCTION_SITES = 8;
global.FIND_SOURCES_ACTIVE = 5;

jest.mock('../gamification', () => ({
  trackAction: jest.fn(),
  addXP: jest.fn(),
}), { virtual: true });

jest.mock('../visual.effects', () => ({
  rainbowTrail: jest.fn(),
  particles: jest.fn(),
  scorePopup: jest.fn(),
  stars: jest.fn(),
}), { virtual: true });

const roleBuilder = require('../role.builder');

describe('role.builder', () => {
  test('モジュールが正しく読み込める', () => {
    expect(roleBuilder).toBeDefined();
    expect(typeof roleBuilder.run).toBe('function');
  });

  test('エネルギーが0のときharvestingモードに切换わる', () => {
    const creep = {
      memory: { building: true },
      store: { [global.RESOURCE_ENERGY]: 0, getFreeCapacity: jest.fn().mockReturnValue(50) },
      say: jest.fn(),
      build: jest.fn(),
      upgradeController: jest.fn(),
      moveTo: jest.fn(),
      pos: { findClosestByPath: jest.fn().mockReturnValue(null) },
      room: {
        _constructionSitesTick: undefined,
        _constructionSites: [],
        find: jest.fn().mockReturnValue([]),
        controller: { pos: { x: 5, y: 5 } },
      },
    };

    roleBuilder.run(creep);
    expect(creep.memory.building).toBe(false);
  });

  test('storeが満杯のときbuildingモードに切换わる', () => {
    const creep = {
      memory: { building: false },
      store: { [global.RESOURCE_ENERGY]: 50, getFreeCapacity: jest.fn().mockReturnValue(0) },
      say: jest.fn(),
      build: jest.fn(),
      upgradeController: jest.fn(),
      moveTo: jest.fn(),
      pos: { findClosestByPath: jest.fn().mockReturnValue(null) },
      room: {
        _constructionSitesTick: undefined,
        _constructionSites: [],
        find: jest.fn().mockReturnValue([]),
        controller: { pos: { x: 5, y: 5 } },
      },
    };

    roleBuilder.run(creep);
    expect(creep.memory.building).toBe(true);
  });

  test('buildingモードで建設サイトがあるときbuildを呼ぶ', () => {
    const mockSite = { id: 'site1', pos: { x: 10, y: 10 } };
    const creep = {
      memory: { building: true },
      store: { [global.RESOURCE_ENERGY]: 50, getFreeCapacity: jest.fn().mockReturnValue(0) },
      say: jest.fn(),
      build: jest.fn().mockReturnValue(global.OK),
      upgradeController: jest.fn(),
      moveTo: jest.fn(),
      pos: { findClosestByPath: jest.fn().mockReturnValue(mockSite) },
      room: {
        _constructionSitesTick: undefined,
        _constructionSites: [mockSite],
        find: jest.fn().mockReturnValue([mockSite]),
        controller: { pos: { x: 5, y: 5 } },
      },
    };

    roleBuilder.run(creep);
    expect(creep.build).toHaveBeenCalled();
  });

  test('buildingモードで建設サイトがないときupgradeControllerを呼ぶ', () => {
    const creep = {
      memory: { building: true },
      store: { [global.RESOURCE_ENERGY]: 50, getFreeCapacity: jest.fn().mockReturnValue(0) },
      say: jest.fn(),
      build: jest.fn(),
      upgradeController: jest.fn().mockReturnValue(global.OK),
      moveTo: jest.fn(),
      pos: { findClosestByPath: jest.fn().mockReturnValue(null) },
      room: {
        _constructionSitesTick: undefined,
        _constructionSites: [],
        find: jest.fn().mockReturnValue([]),
        controller: { pos: { x: 5, y: 5 } },
      },
    };

    roleBuilder.run(creep);
    expect(creep.upgradeController).toHaveBeenCalled();
  });
});
