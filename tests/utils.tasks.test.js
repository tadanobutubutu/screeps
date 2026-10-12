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

  test('registerTask sanitizes non-numeric or invalid interval values to 1', () => {
    TaskQueue.registerTask('badInterval1', -5, () => {})
    TaskQueue.registerTask('badInterval2', 'invalid', () => {})
    TaskQueue.registerTask('badInterval3', NaN, () => {})

    expect(TaskQueue.tasks.get('badInterval1').interval).toBe(1)
    expect(TaskQueue.tasks.get('badInterval2').interval).toBe(1)
    expect(TaskQueue.tasks.get('badInterval3').interval).toBe(1)
  })

  test('run catches errors thrown in condition callback without crashing TaskQueue', () => {
    const action = jest.fn()
    const throwingCondition = () => {
      throw new Error('Condition Exception')
    }

    TaskQueue.registerTask('throwingCondTask', 1, action, throwingCondition)

    expect(() => TaskQueue.run()).not.toThrow()
    expect(action).not.toHaveBeenCalled()

    const task = TaskQueue.tasks.get('throwingCondTask')
    expect(task.failures).toBe(1)
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error running periodic task throwingCondTask: Condition Exception')
    )
  })

  test('registerTask sanitizes non-positive or invalid intervals to integers >= 1', () => {
    TaskQueue.registerTask('zeroInterval', 0, () => {})
    TaskQueue.registerTask('negativeInterval', -5, () => {})
    TaskQueue.registerTask('nanInterval', 'invalid', () => {})

    expect(TaskQueue.tasks.get('zeroInterval').interval).toBe(1)
    expect(TaskQueue.tasks.get('negativeInterval').interval).toBe(1)
    expect(TaskQueue.tasks.get('nanInterval').interval).toBe(1)
  })

  test('run handles condition evaluation exceptions gracefully and increments failures', () => {
    const action = jest.fn()
    const throwingCondition = () => {
      throw new Error('Condition failure')
    }

    TaskQueue.registerTask('badConditionTask', 1, action, throwingCondition)

    expect(() => TaskQueue.run()).not.toThrow()
    expect(action).not.toHaveBeenCalled()

    const task = TaskQueue.tasks.get('badConditionTask')
    expect(task.failures).toBe(1)
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error running periodic task badConditionTask: Condition failure')
    )
  })

  test('registerTask sanitizes non-positive or invalid interval values', () => {
    TaskQueue.registerTask('invalid1', 0, () => {})
    expect(TaskQueue.tasks.get('invalid1').interval).toBe(1)

    TaskQueue.registerTask('invalid2', -5, () => {})
    expect(TaskQueue.tasks.get('invalid2').interval).toBe(1)

    TaskQueue.registerTask('invalid3', 'invalid', () => {})
    expect(TaskQueue.tasks.get('invalid3').interval).toBe(1)
  })

  test('run handles condition callback errors gracefully without crashing queue', () => {
    const buggyCondition = () => {
      throw new Error('Condition Fault')
    }
    const action = jest.fn()

    TaskQueue.registerTask('failingConditionTask', 1, action, buggyCondition)

    expect(() => TaskQueue.run()).not.toThrow()
    expect(action).not.toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error running periodic task failingConditionTask: Condition Fault')
    )
  })
})
