/**
 * memory.visualizer.js のユニットテスト
 */

global.Game = {
    time: 100,
    cpu: { getUsed: jest.fn().mockReturnValue(10), bucket: 10000 },
    gcl: { level: 1 },
    rooms: {},
    creeps: {},
    flags: {},
};
global.Memory = {};
global.FIND_SOURCES = 'findSources';
global.FIND_MINERALS = 'findMinerals';
global.FIND_HOSTILE_CREEPS = 'findHostileCreeps';
global.FIND_STRUCTURES = 'findStructures';

jest.mock(
    '../utils.memory',
    () => ({
        isSafeKey: jest.fn().mockReturnValue(true),
        cleanMemory: jest.fn().mockReturnValue(0),
    }),
    { virtual: true }
);

const memoryVisualizer = require('../memory.visualizer');

describe('memory.visualizer', () => {
    beforeEach(() => {
        delete Memory.timeMachine;
        delete Memory.leaderboard;
        delete Memory.map;
        delete Memory.creeps;
        delete Memory.flags;
        delete Memory.backups;
    });

    test('モジュールが正しく読み込める', () => {
        expect(memoryVisualizer).toBeDefined();
    });

    test('showStatsが統計を返す', () => {
        global.Memory = { creeps: {}, rooms: {}, flags: {}, spawns: {} };
        const stats = memoryVisualizer.showStats();
        expect(stats).toBeDefined();
        expect(typeof stats.totalSize).toBe('number');
    });

    test('initTimeMachineが初期化', () => {
        memoryVisualizer.initTimeMachine();
        expect(Memory.timeMachine).toBeDefined();
        expect(Memory.timeMachine.snapshots).toEqual([]);
    });

    test('recordSnapshotがスナップショットを記録', () => {
        global.Game.rooms = {
            W1N1: { energyAvailable: 300 },
        };
        memoryVisualizer.recordSnapshot();
        expect(Memory.timeMachine.snapshots.length).toBe(1);
    });

    test('showHistoryが履歴を返す', () => {
        memoryVisualizer.initTimeMachine();
        Memory.timeMachine.snapshots = [{ time: 100, creeps: 5, cpu: 10, energy: 300 }];
        const history = memoryVisualizer.showHistory(10);
        expect(Array.isArray(history)).toBe(true);
    });

    test('initLeaderboardが初期化', () => {
        memoryVisualizer.initLeaderboard();
        expect(Memory.leaderboard).toBeDefined();
    });

    test('recordAchievementが記録', () => {
        memoryVisualizer.initLeaderboard();
        memoryVisualizer.recordAchievement('creep1', 'harvested', 100);
        expect(Memory.leaderboard.harvested.creep1).toBe(100);
    });

    test('showLeaderboardがソートされた結果を返す', () => {
        memoryVisualizer.initLeaderboard();
        Memory.leaderboard.harvested = {
            creep1: 100,
            creep2: 200,
        };
        const board = memoryVisualizer.showLeaderboard('harvested', 10);
        expect(board[0][0]).toBe('creep2');
    });

    test('recordAchievementが容量制限と追い出しロジックを遵守する', () => {
        memoryVisualizer.initLeaderboard();

        // 50個の既存エントリを作成 (スコア 10から590)
        for (let i = 0; i < 50; i++) {
            memoryVisualizer.recordAchievement(`creep_${i}`, 'harvested', (i + 1) * 10);
        }
        expect(Object.keys(Memory.leaderboard.harvested).length).toBe(50);

        // 最小スコア(creep_0: 10)より小さいスコアで追加試行 -> 追加されないはず
        memoryVisualizer.recordAchievement('new_creep_fail', 'harvested', 5);
        expect(Object.keys(Memory.leaderboard.harvested).length).toBe(50);
        expect(Memory.leaderboard.harvested.new_creep_fail).toBeUndefined();

        // 最小スコア(creep_0: 10)より大きいスコアで追加試行 -> creep_0が削除され、新しいものが追加されるはず
        memoryVisualizer.recordAchievement('new_creep_success', 'harvested', 15);
        expect(Object.keys(Memory.leaderboard.harvested).length).toBe(50);
        expect(Memory.leaderboard.harvested.creep_0).toBeUndefined();
        expect(Memory.leaderboard.harvested.new_creep_success).toBe(15);
    });

    test('recordAchievementがリーダーボードタイプの制限を遵守する', () => {
        memoryVisualizer.initLeaderboard();

        // 10個のタイプを作成 (初期化時に5個作成されているので、あと5個)
        const types = ['t1', 't2', 't3', 't4', 't5', 't6'];
        types.forEach((t) => memoryVisualizer.recordAchievement('c', t, 1));

        // 5(default) + 5 = 10 types
        expect(Object.keys(Memory.leaderboard).length).toBe(10);

        // 11個目のタイプを追加試行 -> 追加されないはず
        memoryVisualizer.recordAchievement('c', 't7', 1);
        expect(Object.keys(Memory.leaderboard).length).toBe(10);
        expect(Memory.leaderboard.t7).toBeUndefined();
    });

    test('initDiaryが日記を初期化', () => {
        global.Memory.creeps = {
            creep1: {},
        };
        memoryVisualizer.initDiary('creep1');
        expect(Memory.creeps.creep1.diary).toBeDefined();
    });

    test('addDiaryEntryがエントリを追加', () => {
        global.Memory.creeps = {
            creep1: { diary: { entries: [], maxEntries: 20 } },
        };
        memoryVisualizer.addDiaryEntry('creep1', 'Test message');
        expect(Memory.creeps.creep1.diary.entries.length).toBe(1);
    });

    test('readDiaryがエントリを返す', () => {
        global.Memory.creeps = {
            creep1: {
                diary: {
                    entries: [{ time: 100, message: 'Test' }],
                },
            },
        };
        const entries = memoryVisualizer.readDiary('creep1');
        expect(entries.length).toBe(1);
    });

    test('initMemoryMapが初期化', () => {
        memoryVisualizer.initMemoryMap();
        expect(Memory.map).toBeDefined();
        expect(Memory.map.rooms).toEqual({});
        expect(Memory.map.explored).toEqual([]);
    });

    test('cleanupがメモリをクリア', () => {
        global.Memory.flags = { oldFlag: null };
        global.Game.flags = {};
        const cleaned = memoryVisualizer.cleanup();
        expect(cleaned).toBeGreaterThanOrEqual(0);
    });

    test('backupがバックアップを作成', () => {
        global.Memory.test = 'data';
        memoryVisualizer.backup();
        expect(Memory.backups).toBeDefined();
        expect(Memory.backups.length).toBe(1);
    });

    test('restoreがリストア', () => {
        global.Memory.backups = [{ time: 100, data: { restored: 'data' } }];
        const result = memoryVisualizer.restore(0);
        expect(result).toBe(true);
        expect(Memory.restored).toBe('data');
    });
});
