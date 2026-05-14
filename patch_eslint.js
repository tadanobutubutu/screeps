const fs = require('fs')

let content = fs.readFileSync('role.attacker.js', 'utf8')
content = content.replace(
  'STRUCTURE_INVADER_CORE',
  '/* global STRUCTURE_INVADER_CORE */ STRUCTURE_INVADER_CORE'
)
content = content.replace(
  'FIND_HOSTILE_STRUCTURES',
  '/* global FIND_HOSTILE_STRUCTURES */ FIND_HOSTILE_STRUCTURES'
)
fs.writeFileSync('role.attacker.js', content)
