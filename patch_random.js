const fs = require('fs')
let content = fs.readFileSync('visual.effects.js', 'utf8')

content = content.replace('return secureRandomFloat();\n}', 'return Math.random();\n}')

fs.writeFileSync('visual.effects.js', content)
