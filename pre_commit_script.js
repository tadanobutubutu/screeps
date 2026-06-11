const { execSync } = require('child_process')
try {
  execSync('npm run lint', { stdio: 'inherit' })
  execSync('npm test', { stdio: 'inherit' })
} catch (error) {
  console.error('Pre-commit checks failed:', error.message)
  process.exit(1)
}
