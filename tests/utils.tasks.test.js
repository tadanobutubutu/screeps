jest.mock('../utils.memory')

// Import after mocking
const TaskQueue = require('../utils.tasks')
const utilsMemory = require('../utils.memory')
const logger = require('../utils.logging')

describe('utils.tasks', () => {
  beforeEach(() => {
    global.Memory = { logs: [] }
    TaskQueue.tasks.clear()
    global.Game = { time: 100 }
    // Use spyOn instead of jest.mock for logger to avoid issues with mock application
    jest.spyOn(logger, 'error').mockImplementation(() => {})
    jest.spyOn(logger, 'warn').mockImplementation(() => {})
    jest.spyOn(logger, 'log').mockImplementation(() => {})
    utilsMemory.isSafeKey.mockReturnValue(true)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('registerTask correctly adds a task', () => {
    TaskQueue.registerTask('testTask', 10, () => {})
    expect(TaskQueue.tasks.size).toBe(1)
    expect(Array.from(TaskQueue.tasks.values())[0].name).toBe('testTask')
    expect(Array.from(TaskQueue.tasks.values())[0].interval).toBe(10)
  })

  test('registerTask detects and updates duplicates', () => {
    const action1 = () => {}
    const action2 = () => {}
    TaskQueue.registerTask('task1', 10, action1)
    expect(TaskQueue.tasks.size).toBe(1)
    expect(Array.from(TaskQueue.tasks.values())[0].interval).toBe(10)

    TaskQueue.registerTask('task1', 20, action2)
    expect(TaskQueue.tasks.size).toBe(1)
    expect(Array.from(TaskQueue.tasks.values())[0].interval).toBe(20)
    expect(Array.from(TaskQueue.tasks.values())[0].action).toBe(action2)
  })

  test('registerTask rejects unsafe keys', () => {
    utilsMemory.isSafeKey.mockReturnValue(false)
    TaskQueue.registerTask('__proto__', 10, () => {})
    expect(TaskQueue.tasks.size).toBe(0)
  })

  test('registerTask enforces task limit', () => {
    for (let i = 0; i < 50; i++) {
      TaskQueue.registerTask(`task${i}`, 1, () => {})
    }
    expect(TaskQueue.tasks.size).toBe(50)

    TaskQueue.registerTask('overflow', 1, () => {})
    expect(TaskQueue.tasks.size).toBe(50)
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Maximum task limit reached')
    )
  })

  test('run executes task at correct tick', () => {
    const action = jest.fn()
    TaskQueue.registerTask('task10', 10, action)

    // Tick 100: (100 % 10 === 0) -> 実行
    TaskQueue.run()
    expect(action).toHaveBeenCalledTimes(1)

    // Tick 101: (101 % 10 !== 0) -> 実行されない
    global.Game.time = 101
    TaskQueue.run()
    expect(action).toHaveBeenCalledTimes(1)

    // interval 1 のタスクは毎ティック実行
    const everyTickAction = jest.fn()
    TaskQueue.registerTask('everyTick', 1, everyTickAction)
    TaskQueue.run()
    expect(everyTickAction).toHaveBeenCalledTimes(1)
  })

  test('run skips tasks that do not meet condition', () => {
    const action = jest.fn()
    TaskQueue.registerTask('conditional', 1, action, () => false)
    TaskQueue.run()
    expect(action).not.toHaveBeenCalled()
  })

  test('run catches errors and sends them to secure logger', () => {
    const errorAction = () => {
      throw new Error('Boom')
    }
    TaskQueue.registerTask('buggy', 1, errorAction)

    expect(() => TaskQueue.run()).not.toThrow()
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error running periodic task buggy: Boom')
    )
  })

  test('run does not execute tasks exceeding failure limit (Circuit Breaker)', () => {
    const errorAction = jest.fn(() => {
      throw new Error('Boom')
    })
    TaskQueue.registerTask('broken', 1, errorAction)

    // 5回失敗させる
    for (let i = 0; i < 5; i++) {
      TaskQueue.run()
    }

    expect(errorAction).toHaveBeenCalledTimes(5)
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Task broken failed 5 times and has been disabled')
    )

    // 6回目は実行されないはず
    errorAction.mockClear()
    TaskQueue.run()
    expect(errorAction).not.toHaveBeenCalled()
  })

  test('registerTask resets failure count on re-registration', () => {
    const errorAction = jest.fn(() => {
      throw new Error('Boom')
    })
    TaskQueue.registerTask('broken', 1, errorAction)

    // 5回失敗させて無効化
    for (let i = 0; i < 5; i++) {
      TaskQueue.run()
    }
    expect(Array.from(TaskQueue.tasks.values())[0].failures).toBe(5)

    // 再登録
    TaskQueue.registerTask('broken', 1, errorAction)
    expect(Array.from(TaskQueue.tasks.values())[0].failures).toBe(0)

    // 再度実行されるようになる
    errorAction.mockClear()
    TaskQueue.run()
    expect(errorAction).toHaveBeenCalledTimes(1)
  })

  test('run increments failures count on task failure', () => {
    const errorAction = () => {
      throw new Error('Failure Increment Test')
    }
    TaskQueue.registerTask('failTask', 1, errorAction)

    const task = TaskQueue.tasks.get('failTask')

    // Initial failures should be 0 (as initialized in registerTask)
    expect(task.failures).toBe(0)

    TaskQueue.run()

    // After 1 run with error, failures should be 1
    expect(task.failures).toBe(1)

    TaskQueue.run()

    // After 2 runs with error, failures should be 2
    expect(task.failures).toBe(2)
  })

  test('removeTask removes an existing task', () => {
    TaskQueue.registerTask('taskToRemove', 10, () => {})
    expect(TaskQueue.tasks.size).toBe(1)
    TaskQueue.removeTask('taskToRemove')
    expect(TaskQueue.tasks.size).toBe(0)
  })

  test('removeTask does not throw when removing a non-existent task', () => {
    TaskQueue.registerTask('existingTask', 10, () => {})
    expect(TaskQueue.tasks.size).toBe(1)
    TaskQueue.removeTask('nonExistentTask')
    expect(TaskQueue.tasks.size).toBe(1)
  })

  test('removeTask does nothing when given an empty name or null', () => {
    TaskQueue.registerTask('task1', 10, () => {})
    expect(TaskQueue.tasks.size).toBe(1)
    TaskQueue.removeTask('')
    TaskQueue.removeTask(null)
    TaskQueue.removeTask(undefined)
    expect(TaskQueue.tasks.size).toBe(1)
  })

  test('removeTask correctly sanitizes and removes a long task name', () => {
    const longName = 'a'.repeat(200)

    TaskQueue.registerTask(longName, 10, () => {})
    expect(TaskQueue.tasks.size).toBe(1)

    TaskQueue.removeTask(longName)
    expect(TaskQueue.tasks.size).toBe(0)
  })
})
