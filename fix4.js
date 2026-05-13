const fs = require('fs');
let content = fs.readFileSync('tests/src.roles.behavior.test.js', 'utf8');

if (!content.includes('global.STRUCTURE_ROAD')) {
    content = content.replace(/global\.FIND_SOURCES = 105;/, 'global.FIND_SOURCES = 105;\nglobal.STRUCTURE_ROAD = "road";');
}

fs.writeFileSync('tests/src.roles.behavior.test.js', content);
