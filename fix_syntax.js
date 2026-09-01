const fs = require('fs')

const content = fs.readFileSync('main.js', 'utf8')

let cleaned = content.replace(/^[\s\S]*?```javascript\n/, '')

// Find last closing brace or statement
const lastIndex = cleaned.lastIndexOf('}')
if (lastIndex !== -1) {
  // Keep everything up to the last brace and then close the string literal and parenthesis
  cleaned = cleaned.substring(0, lastIndex + 1)
} else {
  // If no closing brace is found at the end, just trim
  cleaned = cleaned.trim()
}

fs.writeFileSync('main.js.fixed', cleaned, 'utf8')
