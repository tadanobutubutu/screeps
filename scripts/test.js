const { spawnSync } = require('node:child_process')
const path = require('node:path')

let jestEntryPoint
try {
  jestEntryPoint = require.resolve('jest/bin/jest', { paths: [process.cwd(), __dirname] })
} catch {
  console.error('Jest is not installed. Run npm install before npm test.')
  process.exit(1)
}

const jestResult = spawnSync(process.execPath, [jestEntryPoint, ...process.argv.slice(2)], { stdio: 'inherit' })
let exitCode = 0
if (jestResult.error) {
  console.error(`Could not start Jest: ${jestResult.error.message}`)
  exitCode = 1
}
if (jestResult.status !== 0) exitCode = jestResult.status ?? 1

const badgeTestPath = path.join(__dirname, 'update-docs-badges.node-test.cjs')
const badgeResult = spawnSync(process.execPath, ['--test', badgeTestPath], { stdio: 'inherit' })
if (badgeResult.error) {
  console.error(`Could not start README badge tests: ${badgeResult.error.message}`)
  exitCode = 1
}
if (badgeResult.status !== 0) exitCode = badgeResult.status ?? 1
process.exitCode = exitCode
