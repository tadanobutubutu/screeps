const fs = require('fs')

function formatFile (file) {
  let content = fs.readFileSync(file, 'utf8')
  content = content
    .replace(/^ {2}/gm, '    ')
    .replace(/^ {4}/gm, '        ')
    .replace(/^ {6}/gm, '            ')
  content = content
    .replace(/^ {8}/gm, '    ')
    .replace(/^ {12}/gm, '        ')
    .replace(/^ {16}/gm, '            ')
  fs.writeFileSync(file, content)
}

formatFile('tests/utils.defense.test.js')
formatFile('utils.defense.js')
