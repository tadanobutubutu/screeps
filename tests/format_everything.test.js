const child_process = require('child_process')
const { formatEverything } = require('../format_everything.js')

jest.mock('child_process', () => ({
  execFileSync: jest.fn()
}))

describe('format_everything.js', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('executes prettier and eslint successfully', () => {
    formatEverything()

    expect(child_process.execFileSync).toHaveBeenCalledWith(
      'npx',
      ['prettier', '--write', 'utils.defense.js', 'tests/utils.defense.test.js'],
      expect.any(Object)
    )
    expect(child_process.execFileSync).toHaveBeenCalledWith(
      'npx',
      ['eslint@8.57.0', '--fix', 'utils.defense.js', 'tests/utils.defense.test.js'],
      expect.any(Object)
    )
  })

  it('catches and ignores errors from execFileSync', () => {
    child_process.execFileSync.mockImplementationOnce(() => {
      throw new Error('Mock error')
    })

    expect(() => {
      formatEverything()
    }).not.toThrow()

    expect(child_process.execFileSync).toHaveBeenCalledWith(
      'npx',
      ['prettier', '--write', 'utils.defense.js', 'tests/utils.defense.test.js'],
      expect.any(Object)
    )
    expect(child_process.execFileSync).toHaveBeenCalledWith(
      'npx',
      ['eslint@8.57.0', '--fix', 'utils.defense.js', 'tests/utils.defense.test.js'],
      expect.any(Object)
    )
  })
})
