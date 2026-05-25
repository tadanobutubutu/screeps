const { execSync } = require('child_process');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  execSync('npm test', { stdio: 'inherit' });
  console.log('Pre-commit checks passed.');
} catch (error) {
  console.error('Pre-commit checks failed:', error.message);
  process.exit(1);
}
