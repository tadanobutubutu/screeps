describe('pre_commit_script.js', () => {
  let originalConsoleError
  let originalProcessExit
  let execFileSyncMock

  beforeEach(() => {
    jest.resetModules()
    originalConsoleError = console.error
    originalProcessExit = process.exit

    console.error = jest.fn()
    process.exit = jest.fn()
    execFileSyncMock = jest.fn()

    jest.doMock('child_process', () => ({
      execFileSync: execFileSyncMock
    }))
  })

  afterEach(() => {
    console.error = originalConsoleError
    process.exit = originalProcessExit
    jest.dontMock('child_process')
  })

  it('should successfully execute lint and test commands', () => {
    require('../pre_commit_script.js')

    expect(execFileSyncMock).toHaveBeenCalledWith('npm', ['run', 'lint'], { stdio: 'inherit' })
    expect(execFileSyncMock).toHaveBeenCalledWith('npm', ['test'], { stdio: 'inherit' })
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
