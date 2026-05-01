const fs = require('fs');
const file = 'tests/spawnManager.test.js';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('/* global describe, test, expect, beforeEach, jest */')) {
    content = content.replace('/**\\n * src/managers/spawnManager.js のユニットテスト\\n */', '/**\\n * src/managers/spawnManager.js のユニットテスト\\n */\\n\\n/* global describe, test, expect, beforeEach, jest */');
}

fs.writeFileSync(file, content);
console.log('Patched');
