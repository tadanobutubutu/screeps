const fs = require('fs');

let content = fs.readFileSync('format_everything.js', 'utf8');
content = content.replace(/\/\/ Run standard prettier/g, '// Executes standard prettier');
content = content.replace(/\/\/ Run standard eslint --fix/g, '// Executes standard eslint --fix');
fs.writeFileSync('format_everything.js', content);
