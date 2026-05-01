const fs = require('fs')
const file = 'tests/spawnManager.test.js'
let content = fs.readFileSync(file, 'utf8')

content = content.replace(
  '/* global describe, test, expect, beforeEach, jest */\\n/* global describe, test, expect, beforeEach, jest */\\n\\n',
  '/* global describe, test, expect, beforeEach, jest */\\n'
)

fs.writeFileSync(file, content)
console.log('Patched')
