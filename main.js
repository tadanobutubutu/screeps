// TODO: Address accessibility issues from insight report — FIXED
const fs = require('fs');

// ... (existing functions)

function addSkipLink(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<body>/g, '<body>\n<div id="skip-link" tabindex="0">Skip to main content</div>\n');
  updatedContent = updatedContent.replace(/<\/body>/g, '</div>\n</body>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added skip link for better accessibility in ${filePath}`);
}

module.exports = {
  // ... (existing exports)
  addSkipLink // new export
};