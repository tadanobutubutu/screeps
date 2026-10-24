const { roleTemplates, isValidRoleName } = require('../scripts/generate-role')

describe('Sentinel Security: generate-role.js Role Name Validation', () => {
  test('all role templates have valid alphanumeric names', () => {
    roleTemplates.forEach((template) => {
      expect(isValidRoleName(template.name)).toBe(true)
    })
  })

  test('rejects path traversal or unsafe role names', () => {
    const unsafeNames = [
      '../malicious',
      'role/test',
      '..\\win',
      'role;cmd',
      '',
      null,
      undefined,
      123
    ]
    unsafeNames.forEach((name) => {
      expect(isValidRoleName(name)).toBe(false)
    })
  })
})
