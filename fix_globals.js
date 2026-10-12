const fs = require('fs')

function fixGlobals (filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  content = content.replace(
    "ERR_BUSY: 'readonly'",
    "ERR_BUSY: 'readonly',\n        ERR_FULL: 'readonly'"
  )
  fs.writeFileSync(filePath, content)
}

if (require.main === module) {
  fixGlobals('eslint.config.js')
}

module.exports = { fixGlobals }
