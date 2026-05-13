const fs = require('fs')

function clean (file) {
  let code = fs.readFileSync(file, 'utf8')
  // Prettier seems to misbehave or have different config on CI. Let's just strip trailing spaces
  // and make sure semicolons exist on lines mentioned by CodeFactor.
  if (file === 'tests/utils.planning.test.js') {
    code = code.replace(/this\.y = y\n/, 'this.y = y;\n')
    code = code.replace(/global\.Game = \{ time: 1 \}\n/, 'global.Game = { time: 1 };\n')
    code = code.replace(
      /expect\(typeof utilsPlanning\.findOpenSpaces\)\.toBe\('function'\)\n/,
      "expect(typeof utilsPlanning.findOpenSpaces).toBe('function');\n"
    )
    code = code.replace(
      /mockRoom\.find\.mockReturnValue\(\[\{ id: 'source1' \}\]\)\n/,
      "mockRoom.find.mockReturnValue([{ id: 'source1' }]);\n"
    )
    code = code.replace(/expect\(pos\)\.toBeNull\(\)\n/, 'expect(pos).toBeNull();\n')
    code = code.replace(
      /const tiles = utilsPlanning\.getTilesAtDistance\(mockRoom, centerPos, 3\)\n/,
      'const tiles = utilsPlanning.getTilesAtDistance(mockRoom, centerPos, 3);\n'
    )
    code = code.replace(/\}\)/g, '});').replace(/\}\);\);/g, '});')
  } else if (file === 'tests/spawnManager.test.js') {
    code = code.replace(
      /isSafeKey: jest\.fn\(\)\.mockReturnValue\(true\)\n/,
      'isSafeKey: jest.fn().mockReturnValue(true),\n'
    )
    code = code.replace(/global\.Game\.creeps = \{\}\n/, 'global.Game.creeps = {};\n')
  } else if (file === 'utils.planning.js') {
    code = code.replace(
      /openSpaces\.push\(\{ x, y, size: minSize \}\)\n/,
      'openSpaces.push({ x, y, size: minSize });\n'
    )
    code = code.replace(/let bestPos = null\n/, 'let bestPos = null;\n')
    code = code.replace(
      /const sourceDist = Math\.min\(\.\.\.sources\.map\(\(s\) => pos\.getRangeTo\(s\)\)\)\n/,
      'const sourceDist = Math.min(...sources.map((s) => pos.getRangeTo(s)));\n'
    )
    code = code.replace(/bestScore = score\n/, 'bestScore = score;\n')
    code = code.replace(/bestPos = pos\n/, 'bestPos = pos;\n')
    code = code.replace(/return bestPos\n/, 'return bestPos;\n')
    code = code.replace(
      /const sources = cache\.getSources\(room\) \|\| \[\]\n/,
      'const sources = cache.getSources(room) || [];\n'
    )
    code = code.replace(/return roadPositions\n/, 'return roadPositions;\n')
    code = code.replace(
      /const openSpaces = this\.findOpenSpaces\(room, 3\)\n/,
      'const openSpaces = this.findOpenSpaces(room, 3);\n'
    )
    code = code.replace(
      /const bestSpawnPos = this\.findBestSpawnPosition\(room\)\n/,
      'const bestSpawnPos = this.findBestSpawnPosition(room);\n'
    )
    code = code.replace(
      /console\.log\(`\\n🏗️ Room Planning \[\$\{room\.name\}\]:`\)\n/,
      'console.log(`\\n🏗️ Room Planning [${room.name}]:`);\n'
    )
    code = code.replace(
      /console\.log\(` {3}Open spaces \(5x5\+\): \$\{openSpaces\.length\}`\)\n/,
      'console.log(`   Open spaces (5x5+): ${openSpaces.length}`);\n'
    )
    code = code.replace(
      /console\.log\(` {3}Best spawn position: \$\{bestSpawnPos\}`\)\n/,
      'console.log(`   Best spawn position: ${bestSpawnPos}`);\n'
    )
    code = code.replace(
      /return \{ openSpaces, bestSpawnPos \}\n/,
      'return { openSpaces, bestSpawnPos };\n'
    )
  }
  fs.writeFileSync(file, code)
}

clean('tests/utils.planning.test.js')
clean('tests/spawnManager.test.js')
clean('utils.planning.js')
