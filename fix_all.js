const fs = require('fs')
const { execSync } = require('child_process')

try {
  // Write out a temporary prettierrc that forces 2 spaces, double quotes, no trailing commas etc
  // Or we could just use eslint with fix to do the job properly.
  execSync(
    'npm i -D prettier && npx prettier --write tests/utils.planning.test.js tests/spawnManager.test.js utils.planning.js',
    { stdio: 'inherit' }
  )
} catch (e) {
  console.error(e)
}
