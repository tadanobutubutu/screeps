const fs = require('fs')

if (!fs.existsSync('last-role-creation.json')) {
  console.log('No new role created')
  process.exit(0)
}

let report = {}
try {
  report = JSON.parse(fs.readFileSync('last-role-creation.json', 'utf8'))
} catch (e) {
  console.error('Invalid JSON in last-role-creation.json:', e.message)
  process.exit(1)
}

const roleName = report.role
if (!roleName) {
  console.log('No new role generated')
  process.exit(0)
}

// Security: Validate roleName to allow alphanumeric characters only (prevent code injection)
if (typeof roleName !== 'string' || !/^[a-zA-Z0-9]+$/.test(roleName)) {
  console.error('Invalid role name format in report:', roleName)
  process.exit(1)
}

if (!fs.existsSync('main.js')) {
  console.error('main.js not found')
  process.exit(1)
}

const main = fs.readFileSync('main.js', 'utf8')

// 既にrequireが含まれているかチェック
const requireLine = `const role${roleName.charAt(0).toUpperCase() + roleName.slice(1)} = require('role.${roleName}');`

if (main.includes(requireLine)) {
  console.log('Role already imported in main.js')
} else {
  // main.jsの先頭にrequireを追加
  const lines = main.split('\n')
  const lastRequireIndex = lines.findIndex(
    (line) => line.includes('require') && line.includes('role.')
  )

  if (lastRequireIndex >= 0) {
    lines.splice(lastRequireIndex + 1, 0, requireLine)
  } else {
    lines.unshift(requireLine)
  }

  fs.writeFileSync('main.js', lines.join('\n'))
  console.log(`✅ Added ${roleName} import to main.js`)
}
