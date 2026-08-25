// TODO: This is the existing code that needs to be preserved

// Define some basic functionality
function initialize() {
  console.log('Initializing application...');
}

// Helper function
function getFilePath(filename) {
  return path.join(__dirname, filename);
}

// ==========================================
// FILE-BASED ACCESSIBILITY TRANSFORMATIONS (from HEAD)
// These functions read/write files directly using fs
// ==========================================

const fs = require('fs');
const path = require('path');

// Function for adding alt attributes to images
function addAltAttributeToFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<img/g, '<img alt="Description of image"');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added alt attribute to images for better accessibility in ${filePath}`);
}

// Function for adding ARIA attributes to anchor tags
function addAriaAttributeToFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate" aria-label="rotate back">rotate back</button>');
  // Add ARIA attribute to existing 'button' without id (if present)
  updatedContent = updatedContent.replace(/<button>rotate back<\/button>/g, '<button aria-label="rotate back">rotate back</button>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Changed anchor tag to button for better accessibility and added ARIA attribute in ${filePath}`);
}

function addLangAttributeToFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<html>/g, '<html lang="en">');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added lang attribute to HTML element in ${filePath}`);
}

function fixTableStructureInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<table>/g, '<table role="table">');
  updatedContent = updatedContent.replace(/<td>/g, '<td scope="col">');
  updatedContent = updatedContent.replace(/<th>/g, '<th scope="col">');
  updatedContent = updatedContent.replace(/<\/th>/g, '</th>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Fixed table structure for better accessibility in ${filePath}`);
}

function addMainLandmarkToFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<body>/g, '<body>\n<main>');
  updatedContent = updatedContent.replace(/<\/body>/g, '</main>\n</body>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added main landmark for better accessibility in ${filePath}`);
}

// Function for ensuring unique landmarks in file
function ensureUniqueLandmarksInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<nav aria-label="main-navigation">/g, '<nav aria-label="navigation">');
  let navCount = (updatedContent.match(/<nav aria-label="main-navigation">/g) || []).length;
  if (navCount > 1) {
    const navLabels = ['main-navigation', 'secondary-navigation', 'footer-navigation'];
    let index = 0;
    updatedContent = updatedContent.replace(/<nav aria-label="main-navigation">/g, () => {
      return `<nav aria-label="${navLabels[index] || 'navigation-' + index}">`;
      index++;
    });
  }
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Ensured unique landmarks in ${filePath}`);
}

// ==========================================
// DOM-BASED ACCESSIBILITY FUNCTIONS (from HEAD)
// These work on live DOM elements in browser environment
// ==========================================

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
function fixTableStructureIssuesDOM() {
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
function ensureUniqueLandmarksDOM() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="contentinfo"]');
  const landmarkIds = new Set([...landmarks].map(landmark => landmark.id || ''));
  if (landmarks.length > landmarkIds.size) {
    console.warn('Not all landmarks have unique IDs:', [...landmarks].map(landmark => landmark.id || 'no-id'));
  }
}

// New function for fixing one fake link issue
function fixOneFakeLinkIssue() {
  const fakeLink = document.getElementById('fake-link-id');
  if (fakeLink) {
    fakeLink.textContent = 'Example Link';
    fakeLink.href = 'https://example.com';
  }
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

  const existingDiv = mainContent.closest('div[class="main-wrapper"]') || mainContent.closest('div[id="content"]') || mainContent.parentElement;
  if (!existingDiv) return;

  const newDiv = document.createElement('div');
  newDiv.className = 'primary-content-wrapper';
  newDiv.setAttribute('role', 'main');

  existingDiv.insertBefore(newDiv, mainContent);
  newDiv.appendChild(mainContent);
}

// ==========================================
// PURE TRANSFORMATION FUNCTIONS (from origin/main)
// These work on HTML strings or DOM element arrays, no file I/O
// ==========================================

// Add lang attribute to HTML element (REACT_015)
const addLangAttribute = function(html) {
    if (html && !html.includes('lang=')) {
        return html.replace(/<html/, '<html lang="en"');
    }
    return html;
};

// Fix table structure issues (REACT_027)
const fixTableStructureIssues = function(tables) {
    return tables.map(table => {
        if (!table.querySelector('thead')) {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const thead = document.createElement('thead');
                thead.appendChild(firstRow.cloneNode(true));
                table.insertBefore(thead, table.firstChild);
                firstRow.remove();
            }
        }
        return table;
    });
};

// Add main landmark (REACT_017)
const addMainLandmark = function(content) {
    if (content && !content.includes('<main')) {
        return `<main id="main-content" role="main">${content}</main>`;
    }
    return content;
};

// Add accessible names to SVGs (REACT_041)
const addSvgAccessibleNames = function(svgs) {
    return svgs.map((svg, index) => {
        const existingTitle = svg.querySelector('title');
        if (!existingTitle) {
            const title = document.createElement('title');
            title.textContent = `SVG Icon ${index + 1}`;
            svg.insertBefore(title, svg.firstChild);
        }
        if (!svg.getAttribute('role')) {
            svg.setAttribute('role', 'img');
        }
        if (!svg.getAttribute('aria-labelledby')) {
            const title = svg.querySelector('title');
            if (title) {
                const titleId = `svg-title-${index}`;
                title.id = titleId;
                svg.setAttribute('aria-labelledby', titleId);
            }
        }
        return svg;
    });
};

// Ensure unique landmarks (REACT_025)
const ensureUniqueLandmarks = function(landmarks) {
    const seenTypes = {};
    landmarks.forEach(landmark => {
        const type = landmark.tagName.toLowerCase();
        const role = landmark.getAttribute('role') || type;
        
        if (seenTypes[role]) {
            if (type === 'nav') {
                const label = landmark.getAttribute('aria-label');
                if (!label) {
                    landmark.setAttribute('aria-label', `Navigation ${Object.keys(seenTypes).filter(k => k.includes('nav')).length + 1}`);
                }
            }
        }
        seenTypes[role] = true;
    });
    return landmarks;
};

// Fix fake link issue (REACT_036)
const fixFakeLinkIssue = function(elements) {
    return elements.map(el => {
        const isFakeLink = el.tagName === 'a' && !el.href && !el.getAttribute('role');
        if (isFakeLink) {
            el.setAttribute('role', 'button');
        }
        return el;
    });
};

// ==========================================
// DEPENDENCY GRAPH RENDERING (from origin/main)
// ==========================================

const renderDependencyGraph1 = function() {
    // Your implementation here
};
const renderDependencyGraph2 = function() {
    // Your implementation here
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  // File-based transformations (build-time)
  addAltAttributeToFile,
  addAriaAttributeToFile,
  addLangAttributeToFile,
  fixTableStructureInFile,
  addMainLandmarkToFile,
  ensureUniqueLandmarksInFile,
  
  // DOM-based functions (runtime/browser)
  initialize,
  getFilePath,
  makeElementAccessible,
  fixTableStructureIssuesDOM,
  addProperLandmarkRegions,
  ensureUniqueLandmarksDOM,
  fixOneFakeLinkIssue,
  fixReactFakeLinkIssue,
  hasUniqueLandmarks,
  wrapPrimaryContentInMain,
  
  // Pure transformation functions (HTML strings/DOM arrays)
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  
  // Dependency graph rendering
  renderDependencyGraph1,
  renderDependencyGraph2,
};