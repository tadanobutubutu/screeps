const fs = require('fs')
const path = require('path')

describe('update-main.js script', () => {
  const lastRoleFile = 'last-role-creation.json'
  const mainFile = 'main.js'
  let originalLastRole = null
  let originalMain = null

  beforeEach(() => {
    if (fs.existsSync(lastRoleFile)) {
      originalLastRole = fs.readFileSync(lastRoleFile, 'utf8')
      fs.unlinkSync(lastRoleFile)
    }
    if (fs.existsSync(mainFile)) {
      originalMain = fs.readFileSync(mainFile, 'utf8')
    }
  })

  afterEach(() => {
    if (fs.existsSync(lastRoleFile)) fs.unlinkSync(lastRoleFile)
    if (originalLastRole !== null) fs.writeFileSync(lastRoleFile, originalLastRole)
    if (originalMain !== null) fs.writeFileSync(mainFile, originalMain)
  })

  test('exits gracefully if last-role-creation.json does not exist', () => {
    const spyExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called')
    })
    expect(() => require('../scripts/update-main.js')).toThrow('process.exit called')
    expect(spyExit).toHaveBeenCalledWith(0)
    spyExit.mockRestore()
  })

  test('exits with error if last-role-creation.json contains malformed JSON', () => {
    fs.writeFileSync(lastRoleFile, '{ malformed json }')
    const spyExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called')
    })
    jest.resetModules()
    expect(() => require('../scripts/update-main.js')).toThrow('process.exit called')
    expect(spyExit).toHaveBeenCalledWith(1)
    spyExit.mockRestore()
  })

  test('exits with error if roleName contains invalid code injection characters', () => {
    fs.writeFileSync(lastRoleFile, JSON.stringify({ role: "defender'; process.exit(0); //" }))
    fs.writeFileSync(mainFile, 'const roleHarvester = require("role.harvester");\n')
    const spyExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called')
    })
    jest.resetModules()
    expect(() => require('../scripts/update-main.js')).toThrow('process.exit called')
    expect(spyExit).toHaveBeenCalledWith(1)
    spyExit.mockRestore()
  })

  test('successfully adds valid role import to main.js', () => {
    fs.writeFileSync(lastRoleFile, JSON.stringify({ role: 'defender' }))
    fs.writeFileSync(mainFile, 'const roleHarvester = require("role.harvester");\n')
    jest.resetModules()
    require('../scripts/update-main.js')
    const updatedMain = fs.readFileSync(mainFile, 'utf8')
    expect(updatedMain).toContain("const roleDefender = require('role.defender');")
  })
})
