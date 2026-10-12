describe('pre_commit_script.js', () => {
  let originalConsoleError
  let originalProcessExit
  let execFileSyncMock
  let pathMock

  beforeEach(() => {
    jest.resetModules()
    originalConsoleError = console.error
    originalProcessExit = process.exit

    console.error = jest.fn()
    process.exit = jest.fn()
    execFileSyncMock = jest.fn()

    pathMock = {
      join: jest.fn((...args) => args.join('/'))
    }

    jest.doMock('child_process', () => ({
      execFileSync: execFileSyncMock
    }))
    jest.doMock('path', () => pathMock)
  })

  afterEach(() => {
    console.error = originalConsoleError
    process.exit = originalProcessExit
    jest.dontMock('child_process')
    jest.dontMock('path')
  })

  it('should successfully execute lint and test commands securely via Node', () => {
    require('../pre_commit_script.js')

    // Using expect.stringContaining to be flexible with the __dirname path which is absolute
    expect(execFileSyncMock).toHaveBeenCalledWith(
      process.execPath,
      expect.arrayContaining([expect.stringContaining('eslint.js')]),
      { stdio: 'inherit' }
    )
    expect(execFileSyncMock).toHaveBeenCalledWith(
      process.execPath,
      expect.arrayContaining([expect.stringContaining('jest.js')]),
      { stdio: 'inherit' }
    )
    expect(console.error).not.toHaveBeenCalled()
    expect(process.exit).not.toHaveBeenCalled()
  })

  it('should handle execution errors and exit with code 1', () => {
    execFileSyncMock.mockImplementationOnce(() => {
      throw new Error('Command failed')
    })

    require('../pre_commit_script.js')

    expect(console.error).toHaveBeenCalledWith('Pre-commit checks failed:', 'Command failed')
    expect(process.exit).toHaveBeenCalledWith(1)
  })
})
