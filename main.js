const fs = require('fs');

// TODO: This is the existing code that needs to be preserved
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

exports.addAltAttribute = function addAltAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<img(?![^>]*alt=)[^>]*>/g, '<img alt="Description of image"$1>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added alt attribute to images for better accessibility in ${filePath}`);
};

function fixFakeLinkIssue(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<a href="#"(?![^>]*role="button")>/g, '<a href="#" role="button">');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Fixed fake link issue in ${filePath}`);
}

function addAriaAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate" aria-label="rotate back">rotate back</button>');
  // Add ARIA attribute to existing 'button' without id (if present)
  updatedContent = updatedContent.replace(/<button>rotate back<\/button>/g, '<button aria-label="rotate back">rotate back</button>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Changed anchor tag to button for better accessibility and added ARIA attribute in ${filePath}`);
}

function addLangAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<html>/, '<html lang="en">');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added lang attribute to HTML element in ${filePath}`);
}

function fixTableStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<table>/g, '<table role="table">');
  updatedContent = updatedContent.replace(/<td(?![^>]*scope="col")>/g, '<td scope="col">');
  updatedContent = updatedContent.replace(/<th(?![^>]*scope="col")>/g, '<th scope="col">');
  updatedContent = updatedContent.replace(/<th>/g, '</th>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Fixed table structure for better accessibility in ${filePath}`);
}

function addMainLandmark(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<body>/, '<body>\n<main>');
  updatedContent = updatedContent.replace(/<\/body>/, '</main>\n</body>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added main landmark for better accessibility in ${filePath}`);
}

function ensureUniqueLandmarks(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<nav aria-label="main-navigation">/g, '<nav aria-label="navigation-0">');
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
  let updatedContent = content.replace(/<svg([^>]*)>/g, (match, attrs) => {
    if (!attrs.includes('aria-label') && !attrs.includes('aria-labelledby')) {
      return `<svg${attrs} role="img" aria-label="SVG icon">`;
    }
    return match;
  });
  updatedContent = updatedContent.replace(/(<svg[^>]*>)(<title>.*?<\/title>)/g, (match, before, after) => {
    if (!before.includes('aria-label') && !before.includes('aria-labelledby')) {
      return `${before}<desc id="${Math.random().toString(36).substr(2, 9)}" aria-label="SVG icon"></desc>`;
    }
    return match;
  });
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added accessible names to SVGs for better accessibility in ${filePath}`);
}

module.exports = exports;