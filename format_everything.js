const fs = require('fs')

function formatEverything () {
  const { execFileSync } = require('child_process')

  // Run standard prettier
  try {
    execFileSync('npx', ['prettier', '--write', 'utils.defense.js', 'tests/utils.defense.test.js'], {
      stdio: 'inherit'
    })
  } catch (e) {}

  // Execute standard eslint --fix
  try {
    execFileSync('npx', ['eslint@8.57.0', '--fix', 'utils.defense.js', 'tests/utils.defense.test.js'], {
      stdio: 'inherit'
    })
  } catch (e) {}
}

if (require.main === module) {
  formatEverything()
}

module.exports = { formatEverything }
