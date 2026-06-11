const fs = require('fs');
const { spawnSync } = require('child_process');

// Run standard prettier
try {
    spawnSync('npx', ['prettier', '--write', 'utils.defense.js', 'tests/utils.defense.test.js'], {
        stdio: 'inherit',
    });
} catch (e) {}

// Run standard eslint --fix
try {
    spawnSync(
        'npx',
        ['eslint@8.57.0', '--fix', 'utils.defense.js', 'tests/utils.defense.test.js'],
        {
            stdio: 'inherit',
        }
    );
} catch (e) {}
