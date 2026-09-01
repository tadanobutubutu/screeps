const main = require('../main')

describe('Task Manager - Sorting and Management Performance', () => {
  beforeEach(() => {
    main.clearAllTasks()
    main.resetTaskIdCounter()
  })

  test('addTask correctly registers a task and increments ID', () => {
    const id1 = main.addTask('Buy Milk')
    const id2 = main.addTask('Clean Room')

    expect(id1).toBe(1)
    expect(id2).toBe(2)
    expect(main.getTaskCount()).toBe(2)
  })

  test('getTasksSortedByTitle sorts tasks alphabetically using fast direct string comparison', () => {
    main.addTask('Zebra task')
    main.addTask('Apple task')
    main.addTask('Banana task')

    const sorted = main.getTasksSortedByTitle()
    expect(sorted[0].title).toBe('Apple task')
    expect(sorted[1].title).toBe('Banana task')
    expect(sorted[2].title).toBe('Zebra task')
  })

  test('getTasksSortedAlphabetically sorts tasks alphabetically case-insensitive and supports descending', () => {
    main.addTask('zebra task')
    main.addTask('Apple task')
    main.addTask('banana task')

    const sortedAsc = main.getTasksSortedAlphabetically(true)
    expect(sortedAsc[0].title).toBe('Apple task')
    expect(sortedAsc[1].title).toBe('banana task')
    expect(sortedAsc[2].title).toBe('zebra task')

    const sortedDesc = main.getTasksSortedAlphabetically(false)
    expect(sortedDesc[0].title).toBe('zebra task')
    expect(sortedDesc[1].title).toBe('banana task')
    expect(sortedDesc[2].title).toBe('Apple task')
  })

  test('completeTask and removeTask modify list state correctly', () => {
    const id = main.addTask('Laundry')
    expect(main.getIncompleteTasks().length).toBe(1)
    expect(main.getCompletedTasks().length).toBe(0)

    main.completeTask(id)
    expect(main.getIncompleteTasks().length).toBe(0)
    expect(main.getCompletedTasks().length).toBe(1)

    main.removeTask(id)
    expect(main.getTaskCount()).toBe(0)
  })
})
