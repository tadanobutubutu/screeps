const { execFileSync } = require('child_process');
try {
    execFileSync('npx', ['eslint', 'role.transporter.js'], { stdio: 'inherit', shell: true });
    execFileSync('npm', ['test'], { stdio: 'inherit', shell: true });
} catch (error) {
    console.error('Pre-commit checks failed:', error.message);
    process.exit(1);
}
