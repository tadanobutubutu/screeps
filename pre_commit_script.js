const { execFileSync } = require('child_process');
try {
    execFileSync('npx', ['eslint', '.'], { stdio: 'inherit' });
    execFileSync('npx', ['jest', '--reporters=default'], { stdio: 'inherit' });
} catch (error) {
    console.error('Pre-commit checks failed:', error.message);
    process.exit(1);
}
