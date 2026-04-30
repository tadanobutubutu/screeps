const fs = require('fs');

const content = fs.readFileSync('tests/utils.tasks.test.js', 'utf8');

const newContent = content
    .replace(/  \}\);/g, '    });')
    .replace(/  test\(/g, '    test(')
    .replace(/    \/\/ Tick 100/g, '        // Tick 100')
    .replace(/    \/\/ Tick 101/g, '        // Tick 101')
    .replace(/    \/\/ interval/g, '        // interval');
fs.writeFileSync('tests/utils.tasks.test.js', newContent);
