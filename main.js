// TODO: This is the existing code that needs to be preserved
// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs, fix fake links
const primaryContent = (typeof document !== 'undefined') ? (document.querySelector('.primary-content') || document.querySelector('[role="main"]') || document.getElementById('main-content') || document.querySelector('#content')) : null;

  // Moved the renderDependencyGraphs function to the init function
};

function addLangAttribute() {
  // Add lang attribute to HTML element if missing
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

function fixTableStructure() {
  // Fix table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure proper role
    if (!table.hasAttribute('role')) {
      table.setAttribute('role', 'table');
    }
    
    // Ensure caption if missing
    if (!table.querySelector('caption') && table.hasAttribute('aria-label')) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('aria-label');
      table.insertBefore(caption, table.firstChild);
    }
    
    // Check for proper header structure
    const rows = table.querySelectorAll('tr');
    if (rows.length > 0) {
      const firstRowCells = rows[0].querySelectorAll('td, th');
      let hasHeader = false;
      firstRowCells.forEach(cell => {
        if (cell.tagName === 'TH') hasHeader = true;
      });
      
      if (!hasHeader) {
        firstRowCells.forEach(cell => {
          const th = document.createElement('th');
          th.setAttribute('scope', 'col');
          th.textContent = cell.textContent;
          th.setAttribute('role', 'columnheader');
          cell.parentNode.replaceChild(th, cell);
        });
      }
    }
  });
}

const ensureUniqueLandmarks = () => uniqueLandmarks();

function addMainLandmark() {
  // Ensure main content has proper landmark
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  
  // If no main element exists, create one or use div with role
  if (!main) {
    const mainContent = document.querySelector('#main-content, .main-content, [contentmain]');
    if (mainContent && !mainContent.hasAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }
  }
}

function addLandmarkRegions() {
  // Add landmark roles to common regions
  const regions = {
    'header': 'banner',
    'footer': 'contentinfo',
    'nav': 'navigation',
    'aside': 'complementary',
    'section[aria-label]': 'region',
    'section[aria-labelledby]': 'region'
  };
  
  Object.entries(regions).forEach(([selector, role]) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (!el.hasAttribute('role') && !el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
        el.setAttribute('role', role);
      }
    });
  });
}

function ensureUniqueLandmarks() {
  uniqueLandmarks();
}

function uniqueLandmarks() {
  // Ensure landmarks have unique accessible names if duplicates exist
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"]');
  const landmarkCounts = {};
  
  landmarks.forEach(landmark => {
    const type = landmark.getAttribute('role');
    const name = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || landmark.tagName.toLowerCase();
    const key = `${type}-${name}`;
    
    if (landmarkCounts[key]) {
      landmarkCounts[key]++;
      // Make unique by adding a suffix
      const uniqueName = `${name} (${landmarkCounts[key]})`;
      landmark.setAttribute('aria-label', uniqueName);
    } else {
      landmarkCounts[key] = 1;
    }
  });
}

function addAccessibleNamesToSVGs() {
  addSvgAccessibleNames();
}

function fixFakeLinkIssues() {
  // Fix fake link issues - elements that look like links but aren't
  const fakeLinks = document.querySelectorAll('.fake-link, [data-fake-link]');
  fakeLinks.forEach(link => {
    // Convert to proper button if it's interactive
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.removeAttribute('href');
      if (link.tagName === 'A') {
        const button = document.createElement('button');
        button.innerHTML = link.innerHTML;
        button.addEventListener('click', () => {
          // Handle click event
        });
        link.parentNode.replaceChild(button, link);
      }
    }
  });
}

function googleSignIn() {
  // Google sign-in logic
  const googleButtons = document.querySelectorAll('[data-google-signin]');
  googleButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Initiate Google sign-in flow
      console.log('Google sign-in initiated');
    });
  });
}

function fixButtonIdentifiers() {
  // Replace my-button with actual button id for accessibility
  const myButtons = document.querySelectorAll('my-button');
  myButtons.forEach(customButton => {
    const button = document.createElement('button');
    button.id = customButton.getAttribute('id') || `button-${Math.random().toString(36).substr(2, 9)}`;
    button.textContent = customButton.textContent;
    button.setAttribute('type', customButton.getAttribute('type') || 'button');
    
    // Copy attributes
    Array.from(customButton.attributes).forEach(attr => {
      if (attr.name !== 'id') {
        button.setAttribute(attr.name, attr.value);
      }
    });
    
    customButton.parentNode.replaceChild(button, customButton);
  });
}

function ensureDependencyGraphAriaRole() {
  // Ensure dependencyGraph container has proper ARIA role
  const depGraph = document.querySelector('#dependencyGraph, .dependency-graph, [data-dependency-graph]');
  if (depGraph && !depGraph.hasAttribute('role')) {
    depGraph.setAttribute('role', 'region');
    depGraph.setAttribute('aria-label', 'Dependency Graph');
  }
}

function setupAriaLiveRegions() {
  const liveRegion = document.querySelector('#aria-live-region');
  if (!liveRegion) {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-relevant', 'all');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
}

function setupFocusManagement() {
  // Trap focus within modal dialogs
  const modals = document.querySelectorAll('.modal, [role="dialog"]');
  modals.forEach((modal) => {
    modal.addEventListener('keydown', trapFocus);
  });

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]'
  );
  interactiveElements.forEach(element => {
    if (element.getAttribute('tabindex') === '-1') {
      element.setAttribute('tabindex', '0');
    }
  });
}

function enhanceSemanticMarkup() {
  // Add skip link if not present
  if (!document.querySelector('#skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  const uniqueElements = [];
  const seen = new Map();

  elements.forEach(element => {
    const key = element.id || element.name || JSON.stringify(element);
    if (!seen.has(key)) {
      seen.set(key, true);
      uniqueElements.push(element);
    }
  });

  // Ensure form inputs have associated labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    input.id = id;
    if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
}

const getSvgAccessibleName = (svgElement, name) => {
  // Try to get accessible name from various attributes
  return svgElement.getAttribute('aria-label') ||
         svgElement.getAttribute('title') ||
         svgElement.getAttribute('alt') ||
         svgElement.getAttribute('data-name') || name || null;
};

const setSvgAttributes = (svg) => {
  // Set default SVG attributes for accessibility
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.hasAttribute('focusable')) {
    svg.setAttribute('focusable', 'true');
  }
}

function calculateDifference(a, b) {
  return a - b;
}

function calculateProduct(a, b) {
  return a * b;
}

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createInPageButton(buttonId, buttonText) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  return button;
}

function handleFakeLinks(issues) {
  if (!Array.isArray(issues)) return;
  
  issues.forEach(issue => {
    const element = document.querySelector(`[data-issue-id="${issue.id}"]`);
    if (element && element.tagName === 'A' && element.getAttribute('href') === '#') {
      element.removeAttribute('href');
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
    }
  });
}

// Accessibility utilities
const hello = () => {
  return 'Hello from main.js';
};

const init = () => {
  addLangAttribute();
  addressInsightIssues(); // Integrated function from the first branch
  enforceAccessibility(); // Integrated function from the second branch
};

const addressInsightIssues = () => {
  getLandmarkElements();
  ensureLandmarkUniqueness(landmarks);
  validateTableAccessibility();
  validateTableStructure();

  getSvgAccessibleName();

  createInPageButton();
  createAccessibleLink();
  handleAccessibilityIssues();

  validateLandmark();
  validateLandmarkStructure();
};

const enforceAccessibility = () => {
  renderDependencyGraphs(); // From the second branch
  fixButtonIdentifiers(); // From the second branch
  fixFakeLinkIssues(); // From the second branch
  ensureDependencyGraphAriaRole(); // From the second branch
  setupAriaLiveRegions(); // From the second branch
  setupFocusManagement(); // From the second branch
  enhanceSemanticMarkup(); // From the second branch
};

// Preserve other exports and utility functions
const checkTableStructure = function checkTableStructure() {
  /* existing code */
};
const countDependencies = function countDependencies() {
  /* existing code */
};
const handleCredentialResponse = function handleCredentialResponse(response) {
  /* existing code */
};

// Utility functions from origin/main
const getLandmarkElements = () => {
  // Your implementation for accessing landmarks
};

const createInPageButton = () => {
  // Your implementation for creating an accessible in-page button
};

const createAccessibleLink = () => {
  // Your implementation for creating an accessible link
};

const handleAccessibilityIssues = () => {
  // Your implementation for handling accessibility issues
};

const validateLandmark = () => {
  // Your implementation for validating landmarks
};

const validateLandmarkStructure = () => {
  // Your implementation for validating landmark structure
};

// Export the init function and the combined functions from both source code branches
export {
  init,
  checkLandmarkElements,
  countDependencies,
  handleCredentialResponse,
  getSvgAccessibleName,
  setSvgAttributes,
  renderDependencyGraphs,
  checkTableStructure,
  checkFakeLinks,
  fixButtonIdentifiers,
  newBranchFunction
};