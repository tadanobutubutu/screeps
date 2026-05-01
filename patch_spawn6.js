const fs = require('fs')
const file = 'tests/spawnManager.test.js'
let content = fs.readFileSync(file, 'utf8')

// The file literally starts with /* global describe, test, expect, beforeEach, jest */\n/* global describe, test, expect, beforeEach, jest */
if (
  content.startsWith(
    '/* global describe, test, expect, beforeEach, jest */\\n/* global describe, test, expect, beforeEach, jest */'
  )
) {
  content = content.replace(
    '/* global describe, test, expect, beforeEach, jest */\\n/* global describe, test, expect, beforeEach, jest */',
    '/* global describe, test, expect, beforeEach, jest */'
  )
}

fs.writeFileSync(file, content)
console.log('Patched')
