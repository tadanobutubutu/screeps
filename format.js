const fs = require('fs')

const content = fs.readFileSync('tests/utils.tasks.test.js', 'utf8')

const newContent = content
  .replace(/ {2}\}\);/g, '    });')
  .replace(/ {2}test\(/g, '    test(')
  .replace(/ {4}\/\/ Tick 100/g, '        // Tick 100')
  .replace(/ {4}\/\/ Tick 101/g, '        // Tick 101')
  .replace(/ {4}\/\/ interval/g, '        // interval')
fs.writeFileSync('tests/utils.tasks.test.js', newContent)
