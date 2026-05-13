const fs = require('fs')

const file = 'tests/utils.defense.test.js'
let content = fs.readFileSync(file, 'utf8')

// CodeFactor wants 4-space indentation for everything here
content = content.replace(/  /g, '    ')
fs.writeFileSync(file, content)
