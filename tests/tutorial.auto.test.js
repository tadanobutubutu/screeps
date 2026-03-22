/**
 * tutorial.auto.js のユニットテスト
 */

global.Game = {
  time: 100,
  tutorial: undefined,
  creeps: {},
  spawns: {},
  rooms: {},
};
global.Memory = {};
global._ = {
  filter: jest.fn((arr) => arr),
};
global.WORK = 'work';
global.CARRY = 'carry';
global.MOVE = 'move';
global.STRUCTURE_TOWER = 'tower';
global.RESOURCE_ENERGY = 'energy';
global.FIND_SOURCES = 'findSources';
global.FIND_CONSTRUCTION_SITES = 'findConstructionSites';
global.FIND_HOSTILE_CREEPS = 'findHostileCreeps';
global.FIND_STRUCTURES = 'findStructures';
global.ERR_NOT_IN_RANGE = -9;

const autoTutorial = require('../tutorial.auto');

describe('tutorial.auto', () => {
  test('モジュールが正しく読み込める', () => {
    expect(autoTutorial).toBeDefined();
  });

  test('isTutorialがチュートリアル外ではfalseを返す', () => {
    global.Game.tutorial = undefined;
    expect(autoTutorial.isTutorial()).toBeFalsy();
  });

  test('isTutorialがチュートリアル中ではtrueを返す', () => {
    global.Game.tutorial = { currentStep: 1 };
    expect(autoTutorial.isTutorial()).toBe(true);
  });

  test('runがチュートリアル外ではfalseを返す', () => {
    global.Game.tutorial = undefined;
    expect(autoTutorial.run()).toBe(false);
  });

  test('runがチュートリアル中ではtrueを返す', () => {
    global.Game.tutorial = { currentStep: 1 };
    global.Game.spawns = {};
    expect(autoTutorial.run()).toBe(true);
  });

  test('showProgressがステップを表示', () => {
    global.Game.tutorial = { currentStep: 1 };
    global.Game.creeps = { creep1: {} };
    global.Game.spawns = { Spawn1: { store: { energy: 100 } } };
    expect(() => autoTutorial.showProgress()).not.toThrow();
  });

  test('skipIfPossibleが.skipを呼び出す', () => {
    global.Game.tutorial = { skip: jest.fn() };
    const result = autoTutorial.skipIfPossible();
    expect(result).toBe(true);
  });

  test('skipIfPossibleが.skipがない場合falseを返す', () => {
    global.Game.tutorial = {};
    const result = autoTutorial.skipIfPossible();
    expect(result).toBe(false);
  });

  test('step1_createHarvesterが処理を完了', () => {
    global.Game.spawns = {
      Spawn1: {
        spawning: null,
        spawnCreep: jest.fn().mockReturnValue(0),
      },
    };
    global.Game.creeps = {};
    expect(() => autoTutorial.step1_createHarvester()).not.toThrow();
  });

  test('autoStepが処理を完了', () => {
    global.Game.creeps = {};
    global.Game.spawns = { Spawn1: { spawning: null, spawnCreep: jest.fn() } };
    global.Game.structures = [];
    expect(() => autoTutorial.autoStep()).not.toThrow();
  });
});
