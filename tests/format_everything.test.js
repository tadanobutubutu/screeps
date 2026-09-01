jest.mock('child_process', () => ({
  execSync: jest.fn()
}))

describe('format_everything.js', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('executes prettier and eslint successfully', () => {
    const child_process = require('child_process')
    child_process.execSync = jest.fn()

    jest.doMock('child_process', () => child_process)

    require('../format_everything.js')

    expect(child_process.execSync).toHaveBeenCalledWith(
      expect.stringContaining('prettier --write'),
      expect.any(Object)
    )
    expect(child_process.execSync).toHaveBeenCalledWith(
      expect.stringContaining('eslint'),
      expect.any(Object)
    )
  })

  it('catches and ignores errors from execSync', () => {
    const child_process = require('child_process')
    child_process.execSync = jest.fn().mockImplementation(() => {
      throw new Error('Mock error')
    })

    jest.doMock('child_process', () => child_process)

    expect(() => {
      require('../format_everything.js')
    }).not.toThrow()

    expect(child_process.execSync).toHaveBeenCalledWith(
      expect.stringContaining('prettier --write'),
      expect.any(Object)
    )
    expect(child_process.execSync).toHaveBeenCalledWith(
      expect.stringContaining('eslint'),
      expect.any(Object)
    )
  })
})
