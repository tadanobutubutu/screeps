const fs = require('fs');
const files = ['tests/utils.defense.test.js', 'tests/spawnManager.test.js', 'tests/src.roles.miner.test.js'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Prettier might be converting 2 spaces to 4 spaces due to .prettierrc.json
    // But since the original files were 2 spaces, CodeFactor expects them to be preserved?
    // Actually, CodeFactor was complaining about formatting issues that Prettier can fix.
});
