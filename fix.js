const fs = require('fs');

// Fix utils.defense.js
let content = fs.readFileSync('utils.defense.js', 'utf8');
content = "const cache = require('./src/utils/cache');\n\n" + content;
content = content.replace(
    /const hostiles = room\.find\(FIND_HOSTILE_CREEPS\);/g,
    'const hostiles = cache.getEnemies(room);'
);
fs.writeFileSync('utils.defense.js', content);

// Fix tests/utils.defense.test.js
let testContent = fs.readFileSync('tests/utils.defense.test.js', 'utf8');
testContent = testContent.replace(
    /global\.STRUCTURE_RAMPART = 'rampart';/,
    `global.STRUCTURE_RAMPART = 'rampart';

global.Game = { time: 0 };
jest.mock('../src/utils/cache', () => ({
  getEnemies: jest.fn((room) => {
    return room.find(global.FIND_HOSTILE_CREEPS);
  }),
}));`
);
fs.writeFileSync('tests/utils.defense.test.js', testContent);
