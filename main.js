const fs = require('fs');

// TODO: Address missing export that might have been removed — ADD CODE HERE
const exports = {
  fixFakeLinkIssue,
  addAriaAttribute,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addAltAttribute
};

// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)
exports.addAltAttribute = function addAltAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<img/g, '<img alt="Description of image"');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added alt attribute to images for better accessibility in ${filePath}`);
};

function fixFakeLinkIssue(filePath) {
  // ... (existing code)
}

function addAriaAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate" aria-label="rotate back">rotate back</button>');
  // Add ARIA attribute to existing 'button' without id (if present)
  updatedContent = updatedContent.replace(/<button(?![^>]*aria-label)([^>]*)>/gi, '<button$1 aria-label="rotate back">');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Changed anchor tag to button for better accessibility and added ARIA attribute in ${filePath}`);
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
  updatedContent = updatedContent.replace(/<td>/g, '<td scope="col">');
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
  const matches = content.match(/<nav aria-label="main-navigation">/g) || [];
  let updatedContent;
  if (matches.length > 1) {
    const navLabels = ['main-navigation', 'secondary-navigation', 'footer-navigation'];
    let index = 0;
    updatedContent = content.replace(/<nav aria-label="main-navigation">/g, () => {
      const label = navLabels[index] || 'navigation-' + index;
      index++;
      return `<nav aria-label="${label}">`;
    });
  } else {
    updatedContent = content.replace(/<nav aria-label="main-navigation">/g, '<nav aria-label="navigation">');
  }
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Ensured unique landmarks for better accessibility in ${filePath}`);
}

function addSvgAccessibleNames(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<svg([^>]*)>/gi, (match, attrs) => {
    if (!attrs.includes('aria-label') && !attrs.includes('aria-labelledby')) {
      return `<svg${attrs} role="img" aria-label="SVG icon">`;
    }
    return match;
  });
  updatedContent = updatedContent.replace(/<svg([^>]*)role="img"([^>]*)>/gi, (match, before, after) => {
    if (!before.includes('aria-label') && !before.includes('aria-labelledby')) {
      return `<svg${before}role="img"${after} aria-label="SVG icon">`;
    }
    return match;
  });
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added accessible names to SVGs for better accessibility in ${filePath}`);
}

// New method for adding ARIA attribute to buttons without id
function addAriaToButtonsWithoutId(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<button([^>]*)>/gi, (match, attrs) => {
    if (match.includes('aria-label')) return match;
    return `<button${attrs} aria-label="default button">`;
  });
  fs.writeFileSync(filePath, updatedContent);
}

module.exports = {
  ...exports,
  addAriaToButtonsWithoutId
};