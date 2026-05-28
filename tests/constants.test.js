/**
 * src/constants.js のユニットテスト
 */

const constants = require('../src/constants');

describe('constants', () => {
    describe('ROLES', () => {
        test('すべてのロールが定義されている', () => {
            expect(constants.ROLES).toBeDefined();
            expect(constants.ROLES.HARVESTER).toBe('harvester');
            expect(constants.ROLES.UPGRADER).toBe('upgrader');
            expect(constants.ROLES.BUILDER).toBe('builder');
            expect(constants.ROLES.REPAIRER).toBe('repairer');
            expect(constants.ROLES.DEFENDER).toBe('defender');
        });
    });

    describe('BODY_COSTS', () => {
        test('各パーツのコストが正しく定義されている', () => {
            expect(constants.BODY_COSTS).toBeDefined();
            expect(Object.keys(constants.BODY_COSTS).length).toBeGreaterThan(0);
        });
    });

    describe('BODY_PRESETS', () => {
        test('ハーベスターのボディプリセットが定義されている', () => {
            expect(constants.BODY_PRESETS[constants.ROLES.HARVESTER]).toBeDefined();
            expect(Array.isArray(constants.BODY_PRESETS[constants.ROLES.HARVESTER])).toBe(true);
            expect(constants.BODY_PRESETS[constants.ROLES.HARVESTER].length).toBeGreaterThan(0);
        });

        test('各プリセットにbodyとcostが含まれる', () => {
            const harvesterPresets = constants.BODY_PRESETS[constants.ROLES.HARVESTER];
            for (const preset of harvesterPresets) {
                expect(preset.body).toBeDefined();
                expect(preset.cost).toBeGreaterThan(0);
                expect(Array.isArray(preset.body)).toBe(true);
            }
        });
    });

    describe('SPAWN_PRIORITY', () => {
        test('ハーベスターの優先度が最も高い', () => {
            expect(constants.SPAWN_PRIORITY[constants.ROLES.HARVESTER]).toBe(1);
        });

        test('すべてのロールに優先度が設定されている', () => {
            expect(constants.SPAWN_PRIORITY).toBeDefined();
            expect(constants.SPAWN_PRIORITY[constants.ROLES.UPGRADER]).toBeGreaterThan(0);
        });
    });

    describe('TARGET_CREEPS_BY_RCL', () => {
        test('RCLごとのターゲット数が定義されている', () => {
            expect(constants.TARGET_CREEPS_BY_RCL[1]).toBeDefined();
            expect(constants.TARGET_CREEPS_BY_RCL[8]).toBeDefined();
        });

        test('RCL1でハーベスター2体が設定されている', () => {
            expect(constants.TARGET_CREEPS_BY_RCL[1][constants.ROLES.HARVESTER]).toBe(2);
        });
    });

    describe('MEMORY_KEYS', () => {
        test('必要なメモリキーが定義されている', () => {
            expect(constants.MEMORY_KEYS.ROLE).toBe('role');
            expect(constants.MEMORY_KEYS.SOURCE_ID).toBe('sourceId');
            expect(constants.MEMORY_KEYS.WORKING).toBe('working');
        });
    });

    describe('CACHE_TTL', () => {
        test('キャッシュTTLが正の数で定義されている', () => {
            expect(constants.CACHE_TTL.SOURCES).toBeGreaterThan(0);
            expect(constants.CACHE_TTL.STRUCTURES).toBeGreaterThan(0);
            expect(constants.CACHE_TTL.ENEMIES).toBeGreaterThan(0);
        });
    });

    describe('REPAIR_THRESHOLD', () => {
        test('修復閾値が0-1の範囲で定義されている', () => {
            expect(constants.REPAIR_THRESHOLD[STRUCTURE_ROAD]).toBeGreaterThanOrEqual(0);
            expect(constants.REPAIR_THRESHOLD[STRUCTURE_ROAD]).toBeLessThanOrEqual(1);
            expect(constants.REPAIR_THRESHOLD.OTHER).toBeGreaterThanOrEqual(0);
        });
    });

    describe('WALL_HP_TARGET', () => {
        test('RCLごとのウォールHP目標が定義されている', () => {
            expect(constants.WALL_HP_TARGET[1]).toBe(1000);
            expect(constants.WALL_HP_TARGET[8]).toBe(10000000);
        });
    });

    describe('タワー関連定数', () => {
        test('タワー設定値が正しい範囲で定義されている', () => {
            expect(constants.TOWER_ATTACK_PRIORITY_HP).toBeGreaterThan(0);
            expect(constants.TOWER_REPAIR_THRESHOLD).toBeGreaterThan(0);
            expect(constants.TOWER_REPAIR_THRESHOLD).toBeLessThan(1);
            expect(constants.TOWER_HEAL_THRESHOLD).toBeGreaterThan(0);
            expect(constants.TOWER_ENERGY_PRIORITY).toBeGreaterThan(0);
        });
    });

    describe('LOG_LEVEL', () => {
        test('ログレベルが昇順で定義されている', () => {
            expect(constants.LOG_LEVEL.DEBUG).toBe(0);
            expect(constants.LOG_LEVEL.INFO).toBe(1);
            expect(constants.LOG_LEVEL.WARN).toBe(2);
            expect(constants.LOG_LEVEL.ERROR).toBe(3);
            expect(constants.LOG_LEVEL.NONE).toBe(4);
        });

        test('デフォルトログレベルが設定されている', () => {
            expect(constants.DEFAULT_LOG_LEVEL).toBeDefined();
        });
    });

    describe('CPU閾値', () => {
        test('CPU閾値が0-1の範囲で定義されている', () => {
            expect(constants.CPU_EMERGENCY_THRESHOLD).toBeGreaterThan(0);
            expect(constants.CPU_EMERGENCY_THRESHOLD).toBeLessThanOrEqual(1);
            expect(constants.CPU_NORMAL_THRESHOLD).toBeGreaterThan(0);
            expect(constants.CPU_NORMAL_THRESHOLD).toBeLessThan(constants.CPU_EMERGENCY_THRESHOLD);
        });
    });

    describe('ROOM_BOUNDS', () => {
        test('ルームの有効範囲が定義されている', () => {
            expect(constants.ROOM_BOUNDS.MIN).toBe(1);
            expect(constants.ROOM_BOUNDS.MAX).toBe(48);
        });
    });
});
