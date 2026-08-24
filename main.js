// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
//
const fs = require('fs');

function fixFakeLinkIssue(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Change the anchor tag to a button for better accessibility
  const updatedContent = content.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate" aria-label="rotate back">rotate back</button>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Changed anchor tag to button for better accessibility in ${filePath}`);
}

function addAriaAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Add an ARIA attribute to the button for accessibility
  const updatedContent = content.replace(/<button id="unrotate">rotate back<\/button>/g, '<button id="unrotate" aria-label="rotate back">rotate back</button>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added ARIA attribute to button for better accessibility in ${filePath}`);
}

// New Function: Add language attribute to HTML element
function addLangAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<html>/g, '<html lang="en">');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added lang attribute to HTML element in ${filePath}`);
}

// New Function: Fix table structure issues
function fixTableStructure(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Add proper table headers and structure
  let updatedContent = content.replace(/<table>/g, '<table role="table">');
  updatedContent = updatedContent.replace(/<td>/g, '<td scope="col">');
  // Ensure proper table markup with thead and tbody
  updatedContent = updatedContent.replace(/(<tr>)\s*(<td>)/g, '$1<th scope="col">');
  updatedContent = updatedContent.replace(/(<\/td>)\s*(<\/tr>)/g, '</th>$1');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Fixed table structure for better accessibility in ${filePath}`);
}

// New Function: Add main landmark
function addMainLandmark(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Wrap main content in main element for landmark
  let updatedContent = content.replace(/<body>/g, '<body>\n<main>');
  updatedContent = updatedContent.replace(/<\/body>/g, '</main>\n</body>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added main landmark for better accessibility in ${filePath}`);
}

// New Function: Ensure unique landmarks
function ensureUniqueLandmarks(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Remove duplicate nav landmarks by adding aria-labels
  let updatedContent = content.replace(/<nav>/g, '<nav aria-label="main-navigation">');
  // Count occurrences and make them unique
  let navCount = (updatedContent.match(/<nav aria-label="main-navigation">/g) || []).length;
  if (navCount > 1) {
    const navLabels = ['main-navigation', 'secondary-navigation', 'footer-navigation'];
    let index = 0;
    updatedContent = updatedContent.replace(/<nav aria-label="main-navigation">/g, () => {
      return `<nav aria-label="${navLabels[index++] || 'navigation-' + index}">`;
    });
  }
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Ensured unique landmarks for better accessibility in ${filePath}`);
}

// New Function: Add accessible names to SVGs
function addSvgAccessibleNames(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Add title elements inside SVGs for accessible names
  let updatedContent = content.replace(/<svg([^>]*)>/g, (match, attrs) => {
    if (!attrs.includes('aria-label') && !attrs.includes('role=')) {
      return `<svg${attrs} role="img" aria-label="SVG icon">`;
    }
    return match;
  });
  updatedContent = updatedContent.replace(/<svg([^>]*)>/g, (match, attrs) => {
    if (!attrs.includes('<title')) {
      return match.replace(/>\s*</, '><title>Icon</title><');
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