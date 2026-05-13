const fs = require('fs')

// Add ERR_FULL to eslint config
let content = fs.readFileSync('eslint.config.js', 'utf8')
content = content.replace(
  "ERR_BUSY: 'readonly'",
  "ERR_BUSY: 'readonly',\n        ERR_FULL: 'readonly'"
)
fs.writeFileSync('eslint.config.js', content)
