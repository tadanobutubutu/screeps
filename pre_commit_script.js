const { execFileSync } = require('child_process');
try {
    execFileSync('npm', ['run', 'test', 'tests/spawnManager.test.js'], { stdio: 'inherit' });
} catch (error) {
    console.error('Pre-commit checks failed:', error.message);
    process.exit(1);
}
