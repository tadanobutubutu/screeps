const fs = require('fs')

if (!fs.existsSync('last-role-creation.json')) {
  console.log('No new role created')
  process.exit(0)
}

const report = JSON.parse(fs.readFileSync('last-role-creation.json', 'utf8'))
const roleName = report.role
if (!roleName) {
  console.log('No new role generated')
  process.exit(0)
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
