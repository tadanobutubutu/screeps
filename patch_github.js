const fs = require('fs');
const file = '.github/workflows/release-drafter.yml';
let code = fs.readFileSync(file, 'utf8');
code = code.replace('          commitish: main\n', '');
fs.writeFileSync(file, code);
console.log('patched');
