const fs = require('fs')

let file1 = fs.readFileSync('utils.defense.js', 'utf8')
// Fix missing trailing commas to fix prettier
file1 = file1.replace(
  /filter: \(s\) => s\.structureType === STRUCTURE_TOWER,/g,
  'filter: (s) => s.structureType === STRUCTURE_TOWER,'
)
fs.writeFileSync('utils.defense.js', file1)

let file2 = fs.readFileSync('tests/utils.defense.test.js', 'utf8')
// Fix no-unused-vars error for STRUCTURE_WALL by removing the unused const declaration
file2 = file2.replace(/const STRUCTURE_WALL = 'wall';\n/g, '')

fs.writeFileSync('tests/utils.defense.test.js', file2)
