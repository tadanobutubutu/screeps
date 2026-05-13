const fs = require('fs');

function formatFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/    /g, '  '); // Replace 4 spaces with 2 spaces
    fs.writeFileSync(file, content);
}

formatFile('tests/utils.defense.test.js');
formatFile('utils.defense.js');
