// TODO: Existing code remains here

const { add, subtract, multiply, divide, power, squareRoot, factorial, fibonacci, sum, average, max, min, mode, median } = require('./mathHelpers');
const { class1, function1, Object1 } = require('./path/to/module');
const path = require('path');
const fs = require('fs');

function addLangAttribute(document, lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.lang = lang;
  }
  return document;
}

// Function to fix table structure issues
function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');

    if (rows.length > 0 && !existingThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }

    if (!existingTbody) {
      const remainingRows = rows.length > 0 ? Array.from(rows).slice(0) : [];
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }

    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length > 0) {
        if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
          const firstCell = cells[0];
          const th = document.createElement('th');
          th.textContent = firstCell.textContent;
          th.scope = 'col';
          row.insertBefore(th, firstCell);
        }
      }
    });
  });

  return document;
}

// Function to add/main landmark
function addMainLandmark(document) {
  let mainElement = null;

  if (!mainElement) {
    const body = document.body;
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('id', 'main-content');
    }

    const children = body.children;
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && 
          child.tagName !== 'LINK' && child.tagName !== 'META') {
        main.appendChild(child);
        break;
      }
    }

    if (mainElement && mainElement.tagName !== 'MAIN') {
      mainElement.setAttribute('role', 'main');
    }

    mainElement = main;
  }

  return mainElement;
}

// Function to ensure unique landmarks (combined approach)
function ensureUniqueLandmarks(document) {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];

  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', `${role} ${index + 1}`);
        }
      });
    }
  });

  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    mains.forEach((main, index) => {
      main.setAttribute('aria-label', `Main content ${index + 1}`);
    });
  }

  return document;
}

// Function to add accessible names to SVGs
function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.querySelector('title') && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `SVG ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
    }
  });
  return document;
}

// Function to add accessible names to SVG elements
function addAccessibleNamesToSVGs(document) {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const titleElement = svg.querySelector('title');
    if (titleElement && titleElement.textContent.trim()) {
      svg.setAttribute('aria-label', titleElement.textContent.trim());
    } else {
      svg.setAttribute('aria-label', 'Graphic');
    }
  });
  return document;
}

// Function to fix fake link issue (merged fixes)
function fixFakeLinkIssue(document) {
  const clickableElements = document.querySelectorAll('[onclick]');
  let count = 0;

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const onclick = element.getAttribute('onclick') || '';

    if (!isAnchor && (onclick.includes('window.location') || onclick.includes('.href'))) {
      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('onclick', onclick);
      span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          element.click();
        }
      });

      if (element.className) {
        span.className = element.className;
      }

      element.parentNode.replaceChild(span, element);
      count++;
    }
  });

  return document;
}

// Function to fix fake link issues (handles both role="link" elements and anchors with href="#")
function fixFakeLinkIssues(document) {
  // Fix non-anchor elements with role="link"
  const roleLinks = document.querySelectorAll('[role="link"]');
  roleLinks.forEach(link => {
    if (link.tagName !== 'A') {
      link.setAttribute('aria-label', 'This link goes to a section within the page');
    }
  });

  // Fix anchors with href="#" by converting them to accessible buttons
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });

  return document;
}

// Function to fix landmark issues and add Landmark Regions
function fixLandmarkIssues(document) {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
  landmarks.forEach(landmark => {
    if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      const role = landmark.getAttribute('role');
      landmark.setAttribute('aria-label', `${role} region`);
    }
  });
}

// Function to add landmark regions
function addLandmarkRegions(document) {
  const sections = document.querySelectorAll('section:not([role])');
  sections.forEach((section, index) => {
    if (!section.id) {
      section.id = `section-${index + 1}`;
    }
    if (!section.getAttribute('aria-label') && !section.querySelector('h1, h2, h3, h4, h5, h6')) {
      section.setAttribute('role', 'region');
      section.setAttribute('aria-label', `Section ${index + 1}`);
    }
  });
}

// REACT_025: Ensure unique landmarks (by role approach)
function uniqueLandmarks(document) {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];

  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', `${role} ${index + 1}`);
        }
      });
    }
  });

  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    mains.forEach((main, index) => {
      main.setAttribute('aria-label', `Main content ${index + 1}`);
    });
  }

  return document;
}

// Function to add accessible names to SVGs (alias)
function addAccessibleNamesToSVGsAlias(document) {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.querySelector('title')) {
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = 'Accessible SVG';
      svg.insertBefore(title, svg.firstChild);
    }
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
  return document;
}

// REACT_037: Google sign-in logic
function googleSignIn(document) {
  // Check if Google Identity Services is available
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: 'YOUR_CLIENT_ID',
      callback: handleCredentialResponse
    });
    const buttonContainer = document.getElementById('g_id_onload');
    if (buttonContainer) {
      google.accounts.id.renderButton(
        buttonContainer,
        { theme: 'outline', size: 'large' }
      );
    }
  }
}

// Function to handle credential response from Google Sign-In
function handleCredentialResponse(response) {
  console.log('Credential response received:', response);
}

// Function to ensure the element has an id
function ensureElementHasId(document, selector, idPrefix = 'element') {
  if (!selector) return document;
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    if (!element.id) {
      element.id = `${idPrefix}-${index + 1}`;
    }
  });
  return document;
}

// Function to ensure an element has an id with origin/main optimization
function ensureElementHasIdOrigin(document, selector, idPrefix = 'element') {
  if (!selector) return document;
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.id = element.dataset.id && element.dataset.id.length > 0 ? element.dataset.id : `${idPrefix}-${Math.random().toString(36).substr(2, 9)}`;
  });
  return document;
}

// Function to add aria-label to elements
function addAriaLabel(document, selector, label) {
  if (!selector || !label) return document;
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    if (!element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
    }
  });
  return document;
}

// Function to render dependency graphs
function renderDependencyGraphs(document) {
  const graphContainer = document.querySelector('#dependencyGraph') || 
                         document.querySelector('.dependency-graph') || 
                         document.querySelector('[data-graph="dependencies"]') ||
                         document.querySelector('[id*="dependency"]');
  if (graphContainer) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    // Fixed: Added proper attribute setting (previously was empty string)
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    graphContainer.appendChild(svg);
  }
  return document;
}

// Integrated REACT_036 changes and merged accessibility fixes
function addressAccessibilityIssues(document) {
  document = addLangAttribute(document);
  document = fixTableStructure(document);
  document = fixLandmarkIssues(document);
  document = addMainLandmark(document);
  document = addLandmarkRegions(document);
  document = ensureUniqueLandmarks(document);
  document = uniqueLandmarks(document);
  document = addSvgAccessibleNames(document);
  document = addAccessibleNamesToSVGs(document);
  document = fixFakeLinkIssue(document);
  document = fixFakeLinkIssues(document);
  document = fixImageAltTexts(document);
  document = googleSignIn(document);
  document = ensureElementHasId(document, 'div, section, article');
  document = ensureElementHasIdOrigin(document, 'div, section, article');
  document = addAriaLabel(document, '[role="button"]', 'Button');
  document = renderDependencyGraphs(document);
  return document;
}

// Main game loop for Screeps
function run() {
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      updateThScopeAttribute(path.join(viewsDir, file));
    });
}

function updateThScopeAttribute(filePath) {
  // Placeholder for updating th scope attributes in HTML files
}

// Function to fix image alt texts
function fixImageAltTexts(document) {
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.getAttribute('alt') || img.getAttribute('alt').trim() === '') {
      img.setAttribute('alt', `Image ${index + 1}`);
    }
  });
  return document;
}

// Function to get lang attribute
function getLangAttribute(document) {
  const htmlElement = document.documentElement;
  return htmlElement ? htmlElement.lang : null;
}

// Function to get full lang attribute
function getFullLangAttribute(document) {
  const htmlElement = document.documentElement;
  if (!htmlElement) return null;
  return {
    lang: htmlElement.lang,
    dir: htmlElement.dir
  };
}

// Function to validate table accessibility
function validateTableAccessibility(document) {
  const tables = document.querySelectorAll('table');
  const issues = [];
  tables.forEach((table, index) => {
    const hasThead = table.querySelector('thead');
    const hasTbody = table.querySelector('tbody');
    const hasCaption = table.querySelector('caption');
    const headers = table.querySelectorAll('th');
    
    if (!hasThead && !hasCaption) {
      issues.push(`Table ${index + 1}: Missing thead or caption`);
    }
    if (headers.length > 0) {
      headers.forEach((header, headerIndex) => {
        if (!header.getAttribute('scope') && !header.getAttribute('aria-label')) {
          issues.push(`Table ${index + 1}, Header ${headerIndex + 1}: Missing scope or aria-label`);
        }
      });
    }
  });
  return issues;
}

// Function to validate table structure
function validateTableStructure(document) {
  const tables = document.querySelectorAll('table');
  const issues = [];
  tables.forEach((table, index) => {
    const rows = table.querySelectorAll('tr');
    const firstRowCells = rows[0] ? rows[0].querySelectorAll('td, th') : [];
    let consistentCellCount = true;
    
    for (let i = 1; i < rows.length; i++) {
      const cellCount = rows[i].querySelectorAll('td, th').length;
      if (cellCount !== firstRowCells.length) {
        consistentCellCount = false;
        break;
      }
    }
    
    if (!consistentCellCount) {
      issues.push(`Table ${index + 1}: Inconsistent cell count across rows`);
    }
  });
  return issues;
}

// Function to validate landmark structure
function validateLandmarkStructure(document) {
  const landmarks = document.querySelectorAll('[role], main, nav, header, footer, aside');
  const issues = [];
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];
  
  landmarks.forEach((landmark, index) => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (!landmarkRoles.includes(role)) {
      issues.push(`Landmark ${index + 1}: Invalid role "${role}"`);
    }
    if (role === 'main' && document.querySelectorAll('[role="main"], main').length > 1) {
      issues.push(`Landmark ${index + 1}: Multiple main landmarks detected`);
    }
  });
  return issues;
}

// Function to get SVG accessible name
function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  const ariaLabel = svg.getAttribute('aria-label');
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  
  if (ariaLabel) return ariaLabel;
  if (title && title.textContent.trim()) return title.textContent.trim();
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent.trim();
  }
  return 'SVG';
}

// Function to create in-page button
function createInPageButton(document, options = {}) {
  const {
    text = 'Button',
    onClick = null,
    className = '',
    id = null
  } = options;
  
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('role', 'button');
  button.setAttribute('tabindex', '0');
  
  if (className) button.className = className;
  if (id) button.id = id;
  
  if (onClick) {
    button.addEventListener('click', onClick);
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(e);
      }
    });
  }
  
  return button;
}

// Function to create accessible link
function createAccessibleLink(document, options = {}) {
  const {
    text = 'Link',
    href = '#',
    onClick = null,
    className = '',
    id = null,
    ariaLabel = null
  } = options;
  
  const link = document.createElement('a');
  link.textContent = text;
  link.href = href;
  link.setAttribute('role', 'link');
  link.setAttribute('tabindex', '0');
  
  if (className) link.className = className;
  if (id) link.id = id;
  if (ariaLabel) link.setAttribute('aria-label', ariaLabel);
  
  if (onClick) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      onClick(e);
    });
  }
  
  return link;
}

// New Function 1 (Add this below existing code)
function newFunction1() {
  // New Function 1 implementation
}

// New Function 2 (Add this below newFunction1)
function newFunction2() {
  // New Function 2 implementation
}

// New function that needs to be preserved in the exports
const newFunction = () => {
  // Implementation of newFunction
};

function checkLandmarkElements(htmlContent) {
  // Implementation for landmark check
}

function validateLandmark(landmark) {
  // Implementation for landmark validation
}

function fixButtonIdentifiers(button, buttonId) {
  // Implementation for replacing my-button with actual button id for accessibility
}

// Utility functions
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function generateId() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

module.exports = {
  loop: function() {
    // Clean up memory of dead creeps
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }

    // Your game logic here
  },

  run,

  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  addressAccessibilityIssues,

  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,

  // New functions from origin/main
  newFunction1,
  newFunction2,
  newFunction,
  checkLandmarkElements,
  validateLandmark,
  fixButtonIdentifiers,
  formatDate,
  debounce,
  generateId
};