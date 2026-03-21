/**
 * utils.missions.js のユニットテスト
 */

global.Game = { time: 10 };
global.Memory = {};

const MissionSystem = require('../utils.missions');

describe('utils.missions', () => {
  beforeEach(() => {
    global.Memory = {};
  });

  test('モジュールが正しく読み込める', () => {
    expect(MissionSystem).toBeDefined();
    expect(typeof MissionSystem.initMemory).toBe('function');
    expect(typeof MissionSystem.createMission).toBe('function');
    expect(typeof MissionSystem.getMissionsForCreep).toBe('function');
    expect(typeof MissionSystem.completeMission).toBe('function');
  });

  test('initMemoryがMemory.missionsを初期化する', () => {
    MissionSystem.initMemory();
    expect(Memory.missions).toBeDefined();
    expect(Memory.missions.active).toEqual([]);
    expect(Memory.missions.completed).toBe(0);
  });

  test('initMemoryが既存の上書きしない', () => {
    Memory.missions = { active: [{ id: '1' }], completed: 5 };
    MissionSystem.initMemory();
    expect(Memory.missions.active.length).toBe(1);
    expect(Memory.missions.completed).toBe(5);
  });

  test('createMissionがミッションを作成して返す', () => {
    MissionSystem.initMemory();
    const mission = MissionSystem.createMission('scout', 'W0N0', 100);
    expect(mission).toBeDefined();
    expect(mission.type).toBe('scout');
    expect(mission.target).toBe('W0N0');
    expect(mission.reward).toBe(100);
    expect(mission.status).toBe('active');
    expect(Memory.missions.active.length).toBe(1);
  });

  test('getMissionsForCreepがアクティブなミッションを返す', () => {
    Memory.missions = {
      active: [
        { id: '1', status: 'active' },
        { id: '2', status: 'completed' },
        { id: '3', status: 'active' },
      ],
      completed: 0,
    };
    const missions = MissionSystem.getMissionsForCreep({});
    expect(missions.length).toBe(2);
  });

  test('completeMissionがミッションを完了させる', () => {
    Memory.missions = {
      active: [{ id: '1', status: 'active' }],
      completed: 0,
    };
    MissionSystem.completeMission('1');
    expect(Memory.missions.active[0].status).toBe('completed');
    expect(Memory.missions.completed).toBe(1);
  });

  test('completeMissionが存在しないmissionのとき何もしない', () => {
    Memory.missions = {
      active: [{ id: '1', status: 'active' }],
      completed: 0,
    };
    MissionSystem.completeMission('nonexistent');
    expect(Memory.missions.completed).toBe(0);
  });

  test('getActiveMissionsがアクティブなミッションのみ返す', () => {
    Memory.missions = {
      active: [
        { id: '1', status: 'active' },
        { id: '2', status: 'completed' },
      ],
      completed: 0,
    };
    const missions = MissionSystem.getActiveMissions();
    expect(missions.length).toBe(1);
    expect(missions[0].id).toBe('1');
  });
});
