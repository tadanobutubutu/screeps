const fs = require('fs')

function fixEslintGlobals (filePath) {
  let content = fs.readFileSync(filePath, 'utf8')

  content = content.replace(
    '/* global Game, Memory, Room, FIND_HOSTILE_CREEPS, FIND_SOURCES_ACTIVE, STRUCTURE_WALL, STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_LAB, RESOURCE_ENERGY, STRUCTURE_CONTAINER, _ */',
    '/* global Game, Memory, Room, FIND_HOSTILE_CREEPS, FIND_SOURCES_ACTIVE, STRUCTURE_WALL, STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_LAB, RESOURCE_ENERGY, STRUCTURE_CONTAINER, STRUCTURE_RAMPART, _ */'
  )

  fs.writeFileSync(filePath, content, 'utf8')
}

if (require.main === module) {
  const file = 'main.js'
  fixEslintGlobals(file)
}

module.exports = { fixEslintGlobals }
