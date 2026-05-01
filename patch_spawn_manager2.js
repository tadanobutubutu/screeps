const fs = require('fs')
const file = 'tests/spawnManager.test.js'
let content = fs.readFileSync(file, 'utf8')

content = '/* global describe, test, expect, beforeEach, jest */\n\n' + content

fs.writeFileSync(file, content)
console.log('Patched')
