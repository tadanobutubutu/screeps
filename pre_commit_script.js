const { execFileSync } = require('child_process')
const path = require('path')
try {
  execFileSync(process.execPath, [path.join(__dirname, 'node_modules', 'eslint', 'bin', 'eslint.js'), '.'], { stdio: 'inherit' })
  execFileSync(process.execPath, [path.join(__dirname, 'node_modules', 'jest', 'bin', 'jest.js')], { stdio: 'inherit' })
} catch (error) {
  console.error('Pre-commit checks failed:', error.message)
  process.exit(1)
}
