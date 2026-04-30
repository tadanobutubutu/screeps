/**
 * utils.tasks.js のユニットテスト
 */

/* global describe, test, expect, beforeEach, jest */

const TaskQueue = require('../utils.tasks');
const utilsMemory = require('../utils.memory');
const logger = require('../utils.logging');

jest.mock('../utils.memory');
jest.mock('../utils.logging');

describe('utils.tasks', () => {
  beforeEach(() => {
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
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Maximum task limit reached'));
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
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error running periodic task buggy: Boom'));
  });
});
