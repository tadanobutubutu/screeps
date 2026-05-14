jest.mock('../utils.memory');
jest.mock('../utils.logging', () => ({
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
    tryCatch: jest.fn((fn, context, ...args) => {
        try {
            return fn(...args);
        } catch (e) {
            return null;
        }
    }),
}));

// Import after mocking
const TaskQueue = require('../utils.tasks');
const utilsMemory = require('../utils.memory');
const logger = require('../utils.logging');

describe('utils.tasks', () => {
    beforeEach(() => {
        global.Memory = { logs: [] };
        TaskQueue.tasks = [];
        global.Game = { time: 100 };
        jest.clearAllMocks();
        utilsMemory.isSafeKey.mockReturnValue(true);
    });

    test('registerTaskが正しくタスクを追加する', () => {
        TaskQueue.registerTask('testTask', 10, () => {});
        expect(TaskQueue.tasks.length).toBe(1);
        expect(TaskQueue.tasks[0].name).toBe('testTask');
        expect(TaskQueue.tasks[0].interval).toBe(10);
    });

    test('registerTaskが重複を検知して更新する', () => {
        const action1 = () => {};
        const action2 = () => {};
        TaskQueue.registerTask('task1', 10, action1);
        expect(TaskQueue.tasks.length).toBe(1);
        expect(TaskQueue.tasks[0].interval).toBe(10);

        TaskQueue.registerTask('task1', 20, action2);
        expect(TaskQueue.tasks.length).toBe(1);
        expect(TaskQueue.tasks[0].interval).toBe(20);
        expect(TaskQueue.tasks[0].action).toBe(action2);
    });

    test('registerTaskが安全でないキーを拒否する', () => {
        utilsMemory.isSafeKey.mockReturnValue(false);
        TaskQueue.registerTask('__proto__', 10, () => {});
        expect(TaskQueue.tasks.length).toBe(0);
    });

    test('registerTaskがタスク上限を強制する', () => {
        for (let i = 0; i < 50; i++) {
            TaskQueue.registerTask(`task${i}`, 1, () => {});
        }
        expect(TaskQueue.tasks.length).toBe(50);

        TaskQueue.registerTask('overflow', 1, () => {});
        expect(TaskQueue.tasks.length).toBe(50);
        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining('Maximum task limit reached')
        );
    });

    test('runが正しいティックでタスクを実行する', () => {
        const action = jest.fn();
        TaskQueue.registerTask('task10', 10, action);

        // Tick 100: (100 % 10 === 0) -> 実行
        TaskQueue.run();
        expect(action).toHaveBeenCalledTimes(1);

        // Tick 101: (101 % 10 !== 0) -> 実行されない
        global.Game.time = 101;
        TaskQueue.run();
        expect(action).toHaveBeenCalledTimes(1);

        // interval 1 のタスクは毎ティック実行
        const everyTickAction = jest.fn();
        TaskQueue.registerTask('everyTick', 1, everyTickAction);
        TaskQueue.run();
        expect(everyTickAction).toHaveBeenCalledTimes(1);
    });

    test('runが条件を満たさないタスクをスキップする', () => {
        const action = jest.fn();
        TaskQueue.registerTask('conditional', 1, action, () => false);
        TaskQueue.run();
        expect(action).not.toHaveBeenCalled();
    });

    test('runがエラーをキャッチしてセキュアロガーに送る', () => {
        const errorAction = () => {
            throw new Error('Boom');
        };
        TaskQueue.registerTask('buggy', 1, errorAction);

        expect(() => TaskQueue.run()).not.toThrow();
        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining('Error running periodic task buggy: Boom')
        );
    });

    test('runが失敗回数上限を超えたタスクを実行しない (Circuit Breaker)', () => {
        const errorAction = jest.fn(() => {
            throw new Error('Boom');
        });
        TaskQueue.registerTask('broken', 1, errorAction);

        // 5回失敗させる
        for (let i = 0; i < 5; i++) {
            TaskQueue.run();
        }

        expect(errorAction).toHaveBeenCalledTimes(5);
        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining('Task broken failed 5 times and has been disabled')
        );

        // 6回目は実行されないはず
        errorAction.mockClear();
        TaskQueue.run();
        expect(errorAction).not.toHaveBeenCalled();
    });

    test('registerTaskが再登録時に失敗カウントをリセットする', () => {
        const errorAction = jest.fn(() => {
            throw new Error('Boom');
        });
        TaskQueue.registerTask('broken', 1, errorAction);

        // 5回失敗させて無効化
        for (let i = 0; i < 5; i++) {
            TaskQueue.run();
        }
        expect(TaskQueue.tasks[0].failures).toBe(5);

        // 再登録
        TaskQueue.registerTask('broken', 1, errorAction);
        expect(TaskQueue.tasks[0].failures).toBe(0);

        // 再度実行されるようになる
        errorAction.mockClear();
        TaskQueue.run();
        expect(errorAction).toHaveBeenCalledTimes(1);
    });
});
