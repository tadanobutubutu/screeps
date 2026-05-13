const fs = require('fs');

function formatFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/^  /gm, '    ').replace(/^    /gm, '        ').replace(/^      /gm, '            ');
    content = content.replace(/^        /gm, '    ').replace(/^            /gm, '        ').replace(/^                /gm, '            ');
    fs.writeFileSync(file, content);
}

formatFile('tests/utils.defense.test.js');
formatFile('utils.defense.js');
