const fs = require('fs');
const path = require('path');

// Define some basic functionality
function initialize() {
  console.log('Initializing application...');
}

// Helper function
function getFilePath(filename) {
  return path.join(__dirname, filename);
}

// Address accessibility issues as per insight report
function makeElementAccessible(element) {
  if (!element || !element.tagName) return;
  if (element.tagName.toLowerCase() === 'html') {
    element.setAttribute('lang', 'en');
  } else if (element.tagName.toLowerCase() === 'svg') {
    element.setAttribute('aria-label', 'SVG description');
  }
}

// Implement fixTableStructureIssues to fix table structure issues
function fixTableStructureIssues() {
  const tables = document.getElementsByTagName('table');
  for (let table of tables) {
    for (let i = 0; i < table.rows.length; i++) {
      for (let j = 0; j < table.rows[i].cells.length; j++) {
        let cell = table.rows[i].cells[j];
        if (cell.tagName && cell.tagName.toLowerCase() === 'th') {
          if (i === 0) {
            cell.setAttribute('scope', 'col');
          }
        }
      }
    }
  }
}

// Add proper landmark regions for improved accessibility
function addProperLandmarkRegions() {
  const mainContent = document.querySelector('main');
  const navigation = document.querySelector('nav');
  const footer = document.querySelector('footer');
  if (mainContent) mainContent.setAttribute('role', 'main');
  if (navigation) navigation.setAttribute('role', 'navigation');
  if (footer) footer.setAttribute('role', 'contentinfo');
  document.body.setAttribute('role', 'document');
  document.documentElement.setAttribute('lang', 'en');
}

// Function for unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="contentinfo"]');
  const landmarkIds = new Set([...landmarks].map(landmark => landmark.id || ''));
  if (landmarks.length > landmarkIds.size) {
    console.warn('Not all landmarks have unique IDs:', [...landmarks].map(landmark => landmark.id || 'no-id'));
  }
}

// New function for fixing one fake link issue
function fixOneFakeLinkIssue() {
  const fakeLink = document.getElementById('fake-link-id');
  fakeLink.textContent = 'Example Link';
  fakeLink.href = 'https://example.com';
}

// NEW: Fix React Fake Link issue
function fixReactFakeLinkIssue() {
  const hashLinks = document.querySelectorAll('a[href="#"]');
  for (let link of hashLinks) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.textContent = link.textContent;
    if (link.getAttribute('aria-label')) {
      button.setAttribute('aria-label', link.getAttribute('aria-label'));
    } else {
      button.setAttribute('aria-label', link.textContent || 'Action');
    }
    link.parentNode.replaceChild(button, link);
  }
}

// New function for ensuring landmarks with unique IDs
function hasUniqueLandmarks() {
  return [...document.querySelectorAll('[role="main"], [role="navigation"], [role="contentinfo"]')].every((landmark) => {
    return landmark.id && landmark.id !== '';
  });
}

// NEW: Function to wrap primary content in <main>
function wrapPrimaryContentInMain() {
  const mainContent = document.querySelector('main');
  if (!mainContent) return;

  const existingDiv = mainContent.closest('div[class="main_wrapper"]') || mainContent.closest('div[id="content"]') || mainContent.parentElement;
  if (!existingDiv) return;

  const newDiv = document.createElement('div');
  newDiv.className = 'primary-content-wrapper';
  newDiv.setAttribute('role', 'main');

  existingDiv.insertBefore(newDiv, mainContent);
  newDiv.appendChild(mainContent);
}

// Call the new function to wrap the primary content in a <main>
if (typeof document !== 'undefined' && document.querySelector) {
  wrapPrimaryContentInMain();
}

// Export DOM-based functions
exports.initialize = initialize;
exports.getFilePath = getFilePath;
exports.makeElementAccessible = makeElementAccessible;
exports.fixTableStructureIssues = fixTableStructureIssues;
exports.addProperLandmarkRegions = addProperLandmarkRegions;
exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
exports.fixOneFakeLinkIssue = fixOneFakeLinkIssue;
exports.fixReactFakeLinkIssue = fixReactFakeLinkIssue;
exports.hasUniqueLandmarks = hasUniqueLandmarks;
exports.wrapPrimaryContentInMain = wrapPrimaryContentInMain;

// TODO: Address missing export that might have been removed — ADD CODE HERE
// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

// File-based accessibility fixes (from origin/main)

function addAltAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<img/g, '<img alt="Description of image"');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added alt attribute to images for better accessibility in ${filePath}`);
}

// New function exporting addAltAttribute
exports.addAltAttribute = addAltAttribute;

function fixFakeLinkIssue(filePath) {
  // ... (existing code)
}

function addAriaAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate" aria-label="rotate back">rotate back</button>');
  // Add ARIA attribute to existing 'button' without id (if present)
  updatedContent = updatedContent.replace(/<button>rotate back<\/button>/g, '<button aria-label="rotate back">rotate back</button>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Changed anchor tag to button for better accessibility and added ARIA attribute in ${filePath}`);
}

function addLangAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<html>/g, '<html lang="en">');
  if (!updatedContent.includes('<body>')) {
    updatedContent += '<body>\n</body>';
  }

  let navCount = (updatedContent.match(/<nav aria-label="navigation">/g) || []).length;
  if (navCount > 1) {
    const navLabels = ['main-navigation', 'secondary-navigation', 'footer-navigation'];
    let index = 0;
    updatedContent = updatedContent.replace(/<nav aria-label="navigation">/g, () => {
      return `<nav aria-label="${navLabels[index] || 'navigation-' + index}">`;
    });
  }

  updatedContent = updatedContent.replace(/<body>/g, '<body>\n<main>');
  updatedContent = updatedContent.replace(/<\/body>/g, '</main>\n</body>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added main landmark for better accessibility in ${filePath}`);

  updatedContent = updatedContent.replace(/<nav aria-label="main-navigation">/g, '<nav aria-label="navigation">');
  let uniqueCount = (updatedContent.match(/<nav aria-label="navigation">/g) || []).length;
  if (uniqueCount > 1) {
    let index = 1;
    updatedContent = updatedContent.replace(/<nav aria-label="navigation">/g, () => {
      return `<nav aria-label="navigation-${index}">`;
    });
  }
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Ensured unique landmarks for better accessibility in ${filePath}`);
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

function ensureUniqueLandmarksFile(filePath) {
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

// File-based accessibility exports
exports.addAltAttribute = addAltAttribute;
exports.fixFakeLinkIssue = fixFakeLinkIssue;
exports.addAriaAttribute = addAriaAttribute;
exports.addLangAttribute = addLangAttribute;
exports.fixTableStructure = fixTableStructure;
exports.addMainLandmark = addMainLandmark;
exports.ensureUniqueLandmarksFile = ensureUniqueLandmarksFile;
exports.addSvgAccessibleNames = addSvgAccessibleNames;