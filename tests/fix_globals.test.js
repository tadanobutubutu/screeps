const fs = require('fs')
const { fixGlobals } = require('../fix_globals')

jest.mock('fs')

describe('fix_globals.js', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should replace the target global comment with ERR_FULL included', () => {
    const filePath = 'dummy.js'
    const originalContent =
            "export default {\n  rules: {},\n  globals: {\n    ERR_BUSY: 'readonly'\n  }\n};"
    const expectedContent =
            "export default {\n  rules: {},\n  globals: {\n    ERR_BUSY: 'readonly',\n        ERR_FULL: 'readonly'\n  }\n};"

    fs.readFileSync.mockReturnValue(originalContent)

    fixGlobals(filePath)

    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8')
    expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, expectedContent)
  })

  it('should not modify the content if the target global comment is not found', () => {
    const filePath = 'dummy.js'
    const originalContent = 'export default {\n  rules: {}\n};'

    fs.readFileSync.mockReturnValue(originalContent)

    fixGlobals(filePath)

    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8')
    expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, originalContent)
  })
})
