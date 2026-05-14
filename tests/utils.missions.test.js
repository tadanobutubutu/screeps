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

    test('createMission handles unsafe keys with fallback', () => {
        MissionSystem.initMemory();
        const result = MissionSystem.createMission('__proto__', 'W0N0', 100);
        expect(result).not.toBeNull();
        expect(result.type).toBe('unknown');

        const result2 = MissionSystem.createMission('scout', 'constructor', 100);
        expect(result2).not.toBeNull();
        expect(result2.target).toBe('unknown');
    });

    test('createMission truncates long strings', () => {
        MissionSystem.initMemory();
        const longString = 'a'.repeat(200);
        const mission = MissionSystem.createMission(longString, longString, 100);
        expect(mission.type.length).toBe(100);
        expect(mission.target.length).toBe(100);
        expect(mission.type).toBe('a'.repeat(100));
    });

    test('createMission enforces MAX_MISSIONS_COUNT and evicts missions', () => {
        MissionSystem.initMemory();
        // Fill up to the limit (20)
        for (let i = 0; i < 20; i++) {
            MissionSystem.createMission('type' + i, 'target' + i, 100);
        }
        expect(Memory.missions.active.length).toBe(20);

        // One more should succeed by evicting the oldest active one (since none are completed)
        const extraMission = MissionSystem.createMission('overflow', 'target', 100);
        expect(extraMission).not.toBeNull();
        expect(Memory.missions.active.length).toBe(20);
        expect(Memory.missions.active.some((m) => m.type === 'overflow')).toBe(true);
        // Oldest one ('type0') should be gone
        expect(Memory.missions.active.some((m) => m.type === 'type0')).toBe(false);

        // Complete one mission
        const idToComplete = Memory.missions.active[5].id;
        const typeToComplete = Memory.missions.active[5].type;
        MissionSystem.completeMission(idToComplete);

        // Now it should succeed by evicting the completed one
        const successMission = MissionSystem.createMission('new', 'target', 100);
        expect(successMission).not.toBeNull();
        expect(Memory.missions.active.length).toBe(20);
        expect(Memory.missions.active.some((m) => m.type === 'new')).toBe(true);
        expect(Memory.missions.active.some((m) => m.type === typeToComplete)).toBe(false);
    });
    test('generateMissionId avoids Math.random predictable values when fallback is used', () => {
        MissionSystem.initMemory();
        const mockMath = jest.spyOn(Math, 'random').mockReturnValue(0.5);
        const mission1 = MissionSystem.createMission('test1', 'T1', 100);
        const mission2 = MissionSystem.createMission('test2', 'T2', 100);
        expect(mission1.id).not.toBe(mission2.id);
        mockMath.mockRestore();
    });
});
