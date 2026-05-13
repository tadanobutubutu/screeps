const fs = require('fs')

let content = fs.readFileSync('tests/src.roles.behavior.test.js', 'utf8')

// The file tests/src.roles.behavior.test.js does not define STRUCTURE_ROAD, let's fix that.
if (!content.includes('global.STRUCTURE_ROAD')) {
  content = content.replace(
    /global\.FIND_SOURCES = 105;/,
    'global.FIND_SOURCES = 105;\nglobal.STRUCTURE_ROAD = "road";'
  )
}

// Prettier complains about some manual lines
content = content.replace(/ \}\)/g, '  });')
content = content.replace(/ {3}\}/g, '      };')

fs.writeFileSync('tests/src.roles.behavior.test.js', content)
