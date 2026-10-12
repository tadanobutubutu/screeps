const { execFileSync } = require('child_process')
try {
  execFileSync('npm', ['run', 'lint'], { stdio: 'inherit' })
  execFileSync('npm', ['test'], { stdio: 'inherit' })
} catch (error) {
  console.error('Pre-commit checks failed:', error.message)
  process.exit(1)
}
