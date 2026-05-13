const fs = require('fs');

function applyRegexReplace(file) {
    let content = fs.readFileSync(file, 'utf8');

    // tests/utils.planning.test.js replacements
    if (file === 'tests/utils.planning.test.js') {
        content = content.replace(/this\.y = y/g, 'this.y = y;');
        content = content.replace(/expect\(typeof utilsPlanning\.findOpenSpaces\)\.toBe\('function'\)/g, 'expect(typeof utilsPlanning.findOpenSpaces).toBe(\'function\');');
        content = content.replace(/mockRoom\.find\.mockReturnValue\(\[\{ id: 'source1' \}\]\)/g, 'mockRoom.find.mockReturnValue([{ id: \'source1\' }]);');
        content = content.replace(/expect\(pos\)\.toBeNull\(\)/g, 'expect(pos).toBeNull();');
        content = content.replace(/const tiles = utilsPlanning\.getTilesAtDistance\(mockRoom, centerPos, 3\)/g, 'const tiles = utilsPlanning.getTilesAtDistance(mockRoom, centerPos, 3);');
    }

    // utils.planning.js replacements
    if (file === 'utils.planning.js') {
        content = content.replace(/openSpaces\.push\(\{ x, y, size: minSize \}\)/g, 'openSpaces.push({ x, y, size: minSize });');
        content = content.replace(/const sourceDist = Math\.min\(\.\.\.sources\.map\(\(s\) => pos\.getRangeTo\(s\)\)\)/g, 'const sourceDist = Math.min(...sources.map((s) => pos.getRangeTo(s)));');
        content = content.replace(/let bestPos = null/g, 'let bestPos = null;');
        content = content.replace(/return roadPositions/g, 'return roadPositions;');
        content = content.replace(/console\.log\(`···Open spaces \(5x5\+\): \$\{openSpaces\.length\}`\)/g, 'console.log(`   Open spaces (5x5+): ${openSpaces.length}`);');
        content = content.replace(/console\.log\(`\\n🏗️ Room Planning \[\$\{room\.name\}\]:`\)/g, 'console.log(`\\n🏗️ Room Planning [${room.name}]:`);');
        content = content.replace(/console\.log\(`   Best spawn position: \$\{bestSpawnPos\}`\)/g, 'console.log(`   Best spawn position: ${bestSpawnPos}`);');
        content = content.replace(/return \{ openSpaces, bestSpawnPos \}/g, 'return { openSpaces, bestSpawnPos };');
        content = content.replace(/bestScore = score/g, 'bestScore = score;');
        content = content.replace(/bestPos = pos/g, 'bestPos = pos;');
        content = content.replace(/return bestPos/g, 'return bestPos;');
    }

    // tests/spawnManager.test.js
    if (file === 'tests/spawnManager.test.js') {
        content = content.replace(/global\.Game\.creeps = \{\}/g, 'global.Game.creeps = {};');
        content = content.replace(/isSafeKey: jest\.fn\(\)\.mockReturnValue\(true\)/g, 'isSafeKey: jest.fn().mockReturnValue(true),');
    }

    fs.writeFileSync(file, content);
}

['tests/utils.planning.test.js', 'utils.planning.js', 'tests/spawnManager.test.js'].forEach(applyRegexReplace);
