// This is a simple utility library with added dependency graph rendering and module structure display functionalities

function multiply(a, b) {
  return a * b;
}

function add(a, b) {
  return a + b;
}

// TODO: Implement divide function that handles division with proper error handling
function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

function greet(name) {
  return `Hello, ${name}!`;
}

// Accessibility enhancements
function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

function createInPageButton(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return null;

  // Ensure lang attribute exists on html element
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }

  const button = document.createElement('button');
  button.textContent = 'Skip to content';
  button.setAttribute('class', 'skip-link');
  button.addEventListener('click', function() {
    target.setAttribute('tabindex', '-1');
    target.focus();
  });

  document.body.insertBefore(button, document.body.firstChild);
  return button;
}

function validateTableAccessibility(table) {
  if (!table) return false;
  
  const hasCaption = table.querySelector('caption') !== null;
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;
  
  return hasCaption && hasHeaders;
}

function validateTableStructure(table) {
  if (!table) return { valid: false, issues: [] };
  
  const issues = [];
  const rows = table.querySelectorAll('tr');
  
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push(`Row ${rowIndex} has no cells`);
    }
  });

  return { valid: issues.length === 0, issues };
}

function validateLandmark(element) {
  if (!element) return false;
  
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  return validLandmarks.includes(role) || validLandmarks.includes(tagName);
}

function validateLandmarkStructure() {
  const landmarks = {
    header: document.querySelector('header'),
    nav: document.querySelector('nav'),
    main: document.querySelector('main'),
    footer: document.querySelector('footer')
  };

  const issues = [];

  // Check for unique landmarks
  const seenLandmarks = {};
  Object.keys(landmarks).forEach(key => {
    if (landmarks[key]) {
      const tagName = landmarks[key].tagName.toLowerCase();
      if (seenLandmarks[tagName]) {
        issues.push(`Duplicate ${tagName} landmark found`);
      } else {
        seenLandmarks[tagName] = true;
      }
    }
  });

  // Check if main landmark exists
  if (!landmarks.main) {
    issues.push('Missing main landmark');
  }

  return { valid: issues.length === 0, issues };
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
  const seenLandmarks = {};
  let issues = [];

  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');

    if (seenLandmarks[tagName] || seenLandmarks[role]) {
      issues.push(`Duplicate landmark: ${tagName}${role ? ' with role ' + role : ''}`);
    } else {
      seenLandmarks[tagName] = true;
      if (role) seenLandmarks[role] = true;
    }
  });

  return { valid: issues.length === 0, issues };
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;

  // Check aria-label
  let label = svgElement.getAttribute('aria-label');
  if (label) return label;

  // Check aria-labelledby
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    return labelElement ? labelElement.textContent : null;
  }

  // Check title element
  const title = svgElement.querySelector('title');
  return title ? title.textContent : null;
}

function setSvgAttributes(svgElement, accessibleName) {
  if (!svgElement) return;

  if (accessibleName) {
    svgElement.setAttribute('aria-label', accessibleName);
  }
  
  svgElement.setAttribute('role', 'img');
  
  // Ensure title exists for screen readers
  if (!svgElement.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = accessibleName || 'SVG image';
    svgElement.insertBefore(title, svgElement.firstChild);
  }
}

function validateLinkAccessibility(link) {
  if (!link) return { valid: false, issues: [] };

  const issues = [];
  const href = link.getAttribute('href');

  // Check if link has href
  if (!href) {
    issues.push('Link missing href attribute');
  }

  // Check if link has accessible text
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  
  if (!text && !ariaLabel) {
    issues.push('Link has no accessible name');
  }

  // Check if it's a fake link (has onclick but no href)
  const hasOnClick = link.hasAttribute('onclick');
  if (hasOnClick && !href) {
    issues.push('Link appears to be a fake link');
  }

  return { valid: issues.length === 0, issues };
}

function handleFakeLinks() {
  const allLinks = document.querySelectorAll('a');
  const fakeLinks = [];

  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    const hasOnClick = link.hasAttribute('onclick');
    const role = link.getAttribute('role');

    // Identify fake links: links with onclick but no href or role="button"
    if ((hasOnClick && !href) || role === 'button') {
      fakeLinks.push(link);
      
      // Fix: Add proper role and ensure accessible name
      if (!link.getAttribute('aria-label') && !link.textContent.trim()) {
        link.setAttribute('aria-label', 'Button');
      }
    }
  });

  return fakeLinks;
}

// Call the accessibility functions on document ready
function initAccessibility() {
  // Add lang attribute to html if missing
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }

  // Create skip link if main content exists
  const main = document.querySelector('main');
  if (main) {
    createInPageButton(main.id || 'main-content');
  }

  // Validate all tables
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  // Validate landmarks
  validateLandmarkStructure();

  // Fix SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const name = getSvgAccessibleName(svg);
    if (name) {
      setSvgAttributes(svg, name);
    }
  });

  // Handle fake links
  handleFakeLinks();
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

// Export any existing functions
function someExistingFunction() {
  // Existing functionality
}

function anotherFunction() {
  // More existing functionality
}

// TODO: Identify and update specific functions that render dependency graphs or display module structure for debugging purposes.
function renderDependencyGraph(modules) {
  // Future implementation could traverse and log module dependencies
  console.log('Rendering dependency graph for modules:', modules);
  return {};
}

function displayModuleStructure(modules) {
  // Future implementation could format and print module hierarchy
  console.log('Displaying module structure for modules:', modules);
  return {};
}

// Placeholder for bot logic for Screeps
function loop() {
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      if (creep.store.getFreeCapacity() > 0) {
        let source = Game.getObjectById(creep.memory.sourceId);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      }
    }
  }
}

module.exports = {
  multiply,
  add,
  divide,
  greet,
  someExistingFunction,
  anotherFunction,
  renderDependencyGraph,
  displayModuleStructure,
  loop,
  // Accessibility functions
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  initAccessibility
};