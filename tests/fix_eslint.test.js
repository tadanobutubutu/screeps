const fs = require('fs')
const { fixEslintGlobals } = require('../fix_eslint')

jest.mock('fs')

describe('fix_eslint.js', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should replace the target global comment with STRUCTURE_RAMPART included', () => {
    const filePath = 'dummy.js'
    const originalContent =
            '/* global Game, Memory, Room, FIND_HOSTILE_CREEPS, FIND_SOURCES_ACTIVE, STRUCTURE_WALL, STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_LAB, RESOURCE_ENERGY, STRUCTURE_CONTAINER, _ */\nconst foo = 1;'
    const expectedContent =
            '/* global Game, Memory, Room, FIND_HOSTILE_CREEPS, FIND_SOURCES_ACTIVE, STRUCTURE_WALL, STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_LAB, RESOURCE_ENERGY, STRUCTURE_CONTAINER, STRUCTURE_RAMPART, _ */\nconst foo = 1;'

    fs.readFileSync.mockReturnValue(originalContent)

    fixEslintGlobals(filePath)

    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8')
    expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, expectedContent, 'utf8')
  })

  it('should not modify the content if the target global comment is not found', () => {
    const filePath = 'dummy.js'
    const originalContent = '/* global Game, Memory, Room */\nconst foo = 1;'

    fs.readFileSync.mockReturnValue(originalContent)

    fixEslintGlobals(filePath)

    expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8')
    expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, originalContent, 'utf8')
  })
})
