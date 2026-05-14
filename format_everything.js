const fs = require('fs');
const { execSync } = require('child_process');

// Run standard prettier
try {
    execSync('npx prettier --write utils.defense.js tests/utils.defense.test.js', {
        stdio: 'inherit',
    });
} catch (e) {
    console.log('Prettier failed');
}

// Run standard eslint --fix
try {
    execSync('npx eslint@8.57.0 --fix utils.defense.js tests/utils.defense.test.js', {
        stdio: 'inherit',
    });
} catch (e) {
    console.log('ESLint failed');
}
