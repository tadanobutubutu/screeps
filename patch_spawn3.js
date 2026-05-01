const fs = require('fs')
const file = 'tests/spawnManager.test.js'
let content = fs.readFileSync(file, 'utf8')

// Ensure the globals comment is exactly what eslint expects if it's there
content = content.replace('/* global describe, test, expect, beforeEach, jest */\\n\\n', '')
content = '/* global describe, test, expect, beforeEach, jest */\\n' + content

fs.writeFileSync(file, content)
console.log('Patched')
