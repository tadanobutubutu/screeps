// Import required modules
const http = require('http');
const path = require('path');

// Accessibility functions

function addLangAttribute(doc, lang = 'en') {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return null;
    }
  }
  const html = doc.documentElement;
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
  return html;
}

function fixTableStructure(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return 0;
    }
  }
  const tables = doc.querySelectorAll('table');
  tables.forEach((table) => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = doc.createElement('thead');
        const tbody = table.querySelector('tbody');
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, tbody || table.firstChild);
        firstRow.remove();
      }
    }
  });
  return tables.length;
}

function addMainLandmark(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return null;
    }
  }
  const existingMain = doc.querySelector('main');
  if (!existingMain) {
    const body = doc.body;
    if (body) {
      const main = doc.createElement('main');
      main.setAttribute('role', 'main');
      while (body.firstChild) {
        main.appendChild(body.firstChild);
      }
      body.appendChild(main);
    }
  }
  return doc.querySelector('main');
}

function addLandmarkRegions(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return;
    }
  }
  const landmarkMap = {
    header: 'banner',
    nav: 'navigation',
    main: 'main',
    footer: 'contentinfo'
  };

  Object.keys(landmarkMap).forEach((landmark) => {
    const elements = doc.querySelectorAll(landmark);
    elements.forEach((el) => {
      if (!el.getAttribute('role')) {
        el.setAttribute('role', landmarkMap[landmark]);
      }
    });
  });
}

function ensureUniqueLandmarks(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return [];
    }
  }
  const landmarks = doc.querySelectorAll('[role], header, nav, main, aside, footer');
  const seen = new Map();
  const duplicates = [];
  
  landmarks.forEach((el) => {
    const role = el.getAttribute('role') || el.tagName.toLowerCase();
    if (seen.has(role)) {
      duplicates.push({ element: el, role });
      if (el.hasAttribute('role')) {
        el.removeAttribute('role');
      }
    } else {
      seen.set(role, el);
    }
  });
  
  return duplicates;
}

function uniqueLandmarks(doc) {
  return ensureUniqueLandmarks(doc);
}

function fixLandmarkIssues(doc) {
  addMainLandmark(doc);
  addLandmarkRegions(doc);
  ensureUniqueLandmarks(doc);
}

function addSvgAccessibleNames(svg, name) {
  if (svg && svg.tagName && svg.tagName.toLowerCase() === 'svg') {
    svg.setAttribute('aria-label', name);
    if (!svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = name;
      svg.insertBefore(title, svg.firstChild);
    }
  }
}

function addAccessibleNamesToSVGs(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return 0;
    }
  }
  const svgs = doc.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      addSvgAccessibleNames(svg, `SVG Icon ${index + 1}`);
    }
  });
  return svgs.length;
}

function fixFakeLinkIssues(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return 0;
    }
  }
  const links = doc.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  links.forEach((link) => {
    const onclick = link.getAttribute('onclick');
    const role = link.getAttribute('role');
    if ((onclick && !link.hasAttribute('href')) || role === 'link') {
      link.setAttribute('role', 'button');
    }
  });
  return links.length;
}

function fixFakeLinkIssue(link) {
  if (link && link.tagName.toLowerCase() === 'a') {
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.setAttribute('role', 'button');
    }
  }
  return link;
}

function googleSignIn(options = {}) {
  return new Promise((resolve, reject) => {
    const { buttonId = 'google-signin-button' } = options;
    let button;
    if (typeof document !== 'undefined') {
      button = document.getElementById(buttonId);
    }
    if (button) {
      if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', 'Sign in with Google');
      }
      if (!button.textContent.trim()) {
        button.textContent = 'Sign in with Google';
      }
    }
    
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize(options);
      if (button) {
        google.accounts.id.renderButton(button, options);
      }
      resolve({ success: true, button });
    } else {
      reject(new Error('Google Sign-In not available'));
    }
  });
}

function fixButtonIdentifiers(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return 0;
    }
  }
  // Replace custom <my-button> elements with <button>
  const customButtons = doc.querySelectorAll('my-button');
  customButtons.forEach((customButton) => {
    const newButton = doc.createElement('button');
    if (customButton.id) {
      newButton.id = customButton.id;
    } else {
      newButton.id = `btn-${Math.random().toString(36).substr(2, 9)}`;
    }
    Array.from(customButton.attributes).forEach((attr) => {
      if (attr.name !== 'id') {
        newButton.setAttribute(attr.name, attr.value);
      }
    });
    while (customButton.firstChild) {
      newButton.appendChild(customButton.firstChild);
    }
    customButton.parentNode.replaceChild(newButton, customButton);
  });

  // Fix buttons with id="my-button"
  const buttons = doc.querySelectorAll('button[id="my-button"], [role="button"][id="my-button"]');
  buttons.forEach((button, index) => {
    const newId = `action-button-${index + 1}`;
    button.setAttribute('id', newId);
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', `Button ${index + 1}`);
    }
  });
  return buttons.length;
}

function ensureDependencyGraphAriaRole(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return null;
    }
  }
  const container = doc.querySelector('#dependencyGraph, .dependency-graph, [data-dependency-graph]');
  if (container) {
    if (!container.getAttribute('role')) {
      container.setAttribute('role', 'region');
    }
    if (!container.getAttribute('aria-label')) {
      container.setAttribute('aria-label', 'Dependency Graph');
    }
  }
  return container;
}

// New functions as per the issue
function newFunction() {
  // Implementation details go here
}

function newExportedFunction() {
  // Function implementation here
}

// Utility function for language attribute
function getLangAttribute() {
  return 'en';
}

// REACT_015: Utility for person name
function personName() {
  return 'User';
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return [];
    }
  }
  const tables = doc.querySelectorAll('table');
  const issues = [];
  tables.forEach((table) => {
    if (!table.querySelector('caption')) {
      issues.push({ element: table, issue: 'missing-caption' });
    }
  });
  return issues;
}

// REACT_027: Validate table structure
function validateTableStructure(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return [];
    }
  }
  const tables = doc.querySelectorAll('table');
  const issues = [];
  tables.forEach((table) => {
    if (!table.querySelector('thead')) {
      issues.push({ element: table, issue: 'missing-thead' });
    }
    if (!table.querySelector('tbody')) {
      issues.push({ element: table, issue: 'missing-tbody' });
    }
  });
  return issues;
}

// REACT_017: Validate landmark
function validateLandmark(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return [];
    }
  }
  const issues = [];
  const landmarks = ['header', 'nav', 'main', 'footer'];
  landmarks.forEach((landmark) => {
    const elements = doc.querySelectorAll(landmark);
    if (elements.length === 0) {
      issues.push({ landmark, issue: 'missing-landmark' });
    }
  });
  return issues;
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure(doc) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return [];
    }
  }
  const issues = [];
  const landmarks = doc.querySelectorAll('header, nav, main, aside, footer');
  landmarks.forEach((el) => {
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
      issues.push({ element: el, issue: 'missing-accessible-name' });
    }
  });
  return issues;
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svg) {
  if (svg && svg.tagName && svg.tagName.toLowerCase() === 'svg') {
    return svg.getAttribute('aria-label') || (svg.querySelector('title') && svg.querySelector('title').textContent) || '';
  }
  return '';
}

// REACT_036: Create in-page button
function createInPageButton(doc, options = {}) {
  if (!doc) {
    if (typeof document !== 'undefined') {
      doc = document;
    } else {
      return null;
    }
  }
  const button = doc.createElement('button');
  if (options.label) {
    button.setAttribute('aria-label', options.label);
    button.textContent = options.label;
  }
  return button;
}

// NEW: Focus trap for keyboard navigation
function newFocusTrap(container) {
  if (!container) {
    return null;
  }
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(event) {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement && lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement && firstElement.focus();
        }
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);
  if (firstElement) {
    firstElement.focus();
  }

  return {
    activate: () => firstElement && firstElement.focus(),
    deactivate: () => container.removeEventListener('keydown', handleKeyDown)
  };
}

// Export all functions
module.exports = {
  // Accessibility functions
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  fixLandmarkIssues,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssues,
  fixFakeLinkIssue,
  googleSignIn,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole,

  // New functions
  newFunction,
  newExportedFunction,

  // Utility
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  newFocusTrap
};

// Start the application if run directly
if (require.main === module) {
  // Note: startApp is not defined in this file, so it's commented out to avoid error.
  // If startApp is defined elsewhere, uncomment the following line.
  // startApp();
}