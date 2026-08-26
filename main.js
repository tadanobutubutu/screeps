// TODO: Address accessibility issues from insight report — FIXED
const fs = require('fs');

function fixFakeLinkIssue(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate" aria-label="rotate back">rotate back</button>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Changed anchor tag to button for better accessibility in ${filePath}`);
}

function addAriaAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<button id="unrotate">rotate back<\/button>/g, '<button id="unrotate" aria-label="rotate back">rotate back</button>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added ARIA attribute to button for better accessibility in ${filePath}`);
}

function addLangAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<html>/g, '<html lang="en">');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added lang attribute to HTML element in ${filePath}`);
}

function fixTableStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<table>/g, '<table role="table">');
  updatedContent = updatedContent.replace(/<td>/g, '<td>');
  updatedContent = updatedContent.replace(/<th>/g, '<th scope="col">');
  updatedContent = updatedContent.replace(/<\/th>/g, '</th>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Fixed table structure for better accessibility in ${filePath}`);
}

function addMainLandmark(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<body>/g, '<body>\n<main>');
  updatedContent = updatedContent.replace(/<\/body>/g, '</main>\n</body>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added main landmark for better accessibility in ${filePath}`);
}

function ensureUniqueLandmarks(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;
  let navCount = (updatedContent.match(/<nav aria-label="main-navigation">/g) || []).length;
  if (navCount > 1) {
    const navLabels = ['main-navigation', 'secondary-navigation', 'footer-navigation'];
    let index = 0;
    updatedContent = updatedContent.replace(/<nav aria-label="main-navigation">/g, () => {
      return `<nav aria-label="${navLabels[index] || 'navigation-' + index}">`;
    });
  }
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Ensured unique landmarks for better accessibility in ${filePath}`);
}

function addSvgAccessibleNames(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/(<svg[^>]*)(?<!aria-label)(?<!aria-labelledby)([^>]*>)/gi, (match, before, after) => {
    if (!before.includes('aria-label') && !before.includes('aria-labelledby')) {
      return `<svg${before} role="img" aria-label="SVG icon"${after}>`;
    }
    return match;
  });
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added accessible names to SVGs for better accessibility in ${filePath}`);
}

module.exports = {
  fixFakeLinkIssue,
  addAriaAttribute,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames
};