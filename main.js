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
  addAltAttribute,
  addLandmarkRegions
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
  const updatedContent = content.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate" aria-label="rotate back">rotate back</button>');
  // Add ARIA attribute to existing 'button' without id (if present)
  updatedContent = updatedContent.replace(/<button>rotate back<\/button>/g, '<button aria-label="rotate back">rotate back</button>');
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
  let updatedContent = content.replace(/<nav aria-label="main-navigation">/g, '<nav aria-label="navigation">');
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
  let updatedContent = content.replace(/(<svg[^>]*>)/gi, (match, attrs) => {
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

function addLandmarkRegions(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;
  // Wrap top-level content sections in proper landmark regions
  // Add <header> landmark if not present
  if (!/<header[\s>]/i.test(updatedContent)) {
    updatedContent = updatedContent.replace(/(<body[^>]*>)/i, '$1\n<header role="banner">');
    updatedContent = updatedContent.replace(/(<\/header>)/i, '</header>');
  }
  // Add <footer> landmark before </body> if not present
  if (!/<footer[\s>]/i.test(updatedContent) && /<\/body>/i.test(updatedContent)) {
    updatedContent = updatedContent.replace(/<\/body>/i, '<footer role="contentinfo">\n</footer>\n</body>');
  }
  // Add <aside> landmark wrapper for content identified as complementary
  updatedContent = updatedContent.replace(/<div[^>]*class="sidebar"[^>]*>/gi, '<aside role="complementary">');
  updatedContent = updatedContent.replace(/<\/div>\s*(?=<div[^>]*class="sidebar")/gi, '</aside>\n');
  // Ensure <main> landmark is present
  if (!/<main[\s>]/i.test(updatedContent) && /<body[^>]*>/i.test(updatedContent)) {
    updatedContent = updatedContent.replace(/(<body[^>]*>(?:\s*<header[\s\S]*?<\/header>)?)/i, '$1\n<main role="main">');
    updatedContent = updatedContent.replace(/(<\/main>\s*<footer)/i, '</main>\n$1');
    if (!/<\/main>/i.test(updatedContent)) {
      updatedContent = updatedContent.replace(/<\/body>/i, '</main>\n</body>');
    }
  }
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added proper landmark regions for better accessibility in ${filePath}`);
}

module.exports = exports;