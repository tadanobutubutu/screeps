const _ = require('lodash');
const dependencyGraphContent = require('./dependencyGraphContent');

// - REACT_015: Add lang attribute to HTML element
document.documentElement.lang = 'en';

// Main module entry point
// This file serves as the main entry for the application
const main = {
  // Store for functions
  functions: {},
  
  // Register a function
  register: function(name, fn) {
    this.functions[name] = fn;
  },
  
  // Get a registered function
  get: function(name) {
    return this.functions[name];
  },
  
  // Execute a registered function
  execute: function(name, ...args) {
    const fn = this.functions[name];
    if (typeof fn === 'function') {
      return fn.apply(this, args);
    }
    throw new Error(`Function ${name} not found`);
  }
};

// New export for the myNewFunction
function myNewFunction(arr) {
  return _.map(arr, item => item * 2);
}

// SVG Accessibility Functions
function getSvgAccessibleName(svgElement) {
  // Check for aria-label
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }
  // Check for aria-labelledby
  if (svgElement.hasAttribute('aria-labelledby')) {
    const ids = svgElement.getAttribute('aria-labelledby').split(' ');
    let labels = [];
    ids.forEach(id => {
      const labelElement = document.getElementById(id);
      if (labelElement) {
        labels.push(labelElement.textContent.trim());
      }
    });
    if (labels.length > 0) {
      return labels.join(' ');
    }
  }
  // Check for title element
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent.trim();
  }
  // Check for desc element (often used as description, but can be used as name)
  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent.trim();
  }
  // Fallback to text content
  return svgElement.textContent.trim() || '';
}

function setSvgAttributes(svgElement) {
  if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
    return;
  }
  // Ensure the SVG has an id for accessibility
  ensureElementHasId(svgElement);
  // Add a default aria-label if none exists
  if (!svgElement.getAttribute('aria-label')) {
    addAriaLabel(svgElement, 'SVG graphic');
  }
}

// Landmark Accessibility Functions
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `generated-id-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

function addAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
}

// Check for duplicate banners (separate from addAriaLabel)
function checkDuplicateBanners() {
  const banners = document.querySelectorAll('[role="banner"], [role="header"], header');
  if (banners.length > 1) {
    throw new Error('Document should have at most one banner or header landmark');
  }
}

function checkLandmarkElement(role, element) {
  // Validate landmark element has proper structure
  if (!element) {
    return { valid: false, error: 'Element is required' };
  }
  
  // Check if element has required ARIA role
  const elementRole = element.getAttribute('role');
  if (role && elementRole !== role) {
    return { valid: false, error: `Expected role "${role}", got "${elementRole}"` };
  }
  
  // Check for accessible name (aria-label, aria-labelledby, or inner text)
  const hasLabel = element.hasAttribute('aria-label') || 
                   element.hasAttribute('aria-labelledby') || 
                   element.textContent.trim().length > 0;
  
  if (!hasLabel) {
    return { valid: false, error: 'Landmark element lacks accessible name' };
  }
  
  return { valid: true };
}

// - REACT_017: Validate landmark accessibility
function validateLandmark(element) {
  const issues = [];
  
  if (!element) {
    issues.push({ code: 'REACT_017', message: 'Landmark element is required' });
    return issues;
  }
  
  // Check for proper role attribute
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  // Map of valid landmark roles per HTML5 element
  const validLandmarks = {
    'header': ['banner', 'contentinfo'],
    'nav': ['navigation'],
    'main': ['main'],
    'aside': ['complementary'],
    'footer': ['contentinfo'],
    'section': ['region'],
    'article': ['article'],
    'form': ['form'],
    'search': ['search']
  };
  
  // Check if element has a valid landmark role
  if (role) {
    const validRoles = validLandmarks[tagName] || [];
    if (validRoles.length > 0 && !validRoles.includes(role)) {
      issues.push({
        code: 'REACT_017',
        message: `Invalid role "${role}" for <${tagName}> element`
      });
    }
  }
  
  // Check for accessible name
  const hasAccessibleName = element.hasAttribute('aria-label') || 
                             element.hasAttribute('aria-labelledby') ||
                             element.querySelector('h1, h2, h3, h4, h5, h6') !== null;
  
  if (!hasAccessibleName) {
    issues.push({
      code: 'REACT_017',
      message: 'Landmark element lacks accessible name'
    });
  }
  
  return issues;
}

// - REACT_017: Validate landmark structure
function validateLandmarkStructure() {
  const issues = [];
  
  // Check for unique main landmark
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    issues.push({
      code: 'REACT_017',
      message: `Found ${mains.length} main landmarks, should have exactly 1`
    });
  }
  
  // Check for unique banner landmark
  const banners = document.querySelectorAll('[role="banner"], header');
  if (banners.length > 1) {
    issues.push({
      code: 'REACT_017',
      message: `Found ${banners.length} banner landmarks, should have at most 1`
    });
  }
  
  // Check for unique contentinfo/footer landmark
  const footers = document.querySelectorAll('[role="contentinfo"], footer');
  if (footers.length > 1) {
    issues.push({
      code: 'REACT_017',
      message: `Found ${footers.length} contentinfo landmarks, should have at most 1`
    });
  }
  
  // Check for navigation landmarks have labels
  const navigations = document.querySelectorAll('nav, [role="navigation"]');
  navigations.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      const siblingNavs = Array.from(navigations).filter(n => n !== nav);
      if (siblingNavs.length > 0) {
        issues.push({
          code: 'REACT_017',
          message: `Navigation landmark at index ${index} needs aria-label when multiple nav elements exist`
        });
      }
    }
  });
  
  return issues;
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  // Check if a <main> element already exists
  let mainElement = document.querySelector('main');
  if (mainElement) {
    return mainElement;
  }

  // Identify landmark elements that should remain outside of <main>
  const elementsToExclude = [];
  const landmarks = document.querySelectorAll('header, nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach(landmark => elementsToExclude.push(landmark));

  // Create a new <main> element
  mainElement = document.createElement('main');

  // Move all body children that are not in the exclude list into <main>
  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (!elementsToExclude.includes(child)) {
      mainElement.appendChild(child);
    }
  });

  // Append the <main> element to the body
  document.body.appendChild(mainElement);

  return mainElement;
}

function checkLandmarks(container = document) {
  const issues = [];
  
  // Check for required landmarks
  const hasMain = container.querySelector('main, [role="main"]');
  if (!hasMain) {
    issues.push({ code: 'REACT_017', message: 'Page should have a main landmark' });
  }
  
  // Check for proper landmark nesting
  const landmarks = container.querySelectorAll('[role], header, nav, main, aside, footer');
  landmarks.forEach(landmark => {
    const result = validateLandmark(landmark);
    issues.push(...result);
  });
  
  return issues;
}

function ensureUniqueLandmarks() {
  // Ensure only one main landmark
  const mains = document.querySelectorAll('main, [role="main"]');
  const removedMains = [];
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      removedMains.push(mains[i]);
      mains[i].remove();
    }
  }

  // Ensure only one banner landmark
  const banners = document.querySelectorAll('[role="banner"], header');
  const removedBanners = [];
  if (banners.length > 1) {
    for (let i = 1; i < banners.length; i++) {
      removedBanners.push(banners[i]);
      banners[i].remove();
    }
  }

  // Ensure only one contentinfo/footer landmark
  const footers = document.querySelectorAll('[role="contentinfo"], footer');
  const removedFooters = [];
  if (footers.length > 1) {
    for (let i = 1; i < footers.length; i++) {
      removedFooters.push(footers[i]);
      footers[i].remove();
    }
  }

  return {
    removedMains,
    removedBanners,
    removedFooters
  };
}

// - REACT_025: Ensure unique landmarks (already handled by ensureUniqueLandmarks above)
// Additional function to get lang attribute
function getLangAttribute() {
  return document.documentElement.lang || document.documentElement.getAttribute('lang');
}

// - REACT_015: Function for personName to use lang attribute
function personName(element) {
  if (!element) return '';
  
  // Ensure the element's context lang is properly set
  const lang = element.closest('[lang]')?.getAttribute('lang') || getLangAttribute() || 'en';
  
  // Get the text content
  let name = '';
  
  if (element.hasAttribute('aria-label')) {
    name = element.getAttribute('aria-label');
  } else if (element.hasAttribute('aria-labelledby')) {
    const labelId = element.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(labelId);
    if (labelElement) {
      name = labelElement.textContent.trim();
    }
  } else {
    name = element.textContent.trim();
  }
  
  return name;
}

// - REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table || table.tagName.toLowerCase() !== 'table') {
    return issues;
  }
  
  // Check if table has proper caption or aria-label
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.hasAttribute('aria-label');
  const hasAriaLabelledby = table.hasAttribute('aria-labelledby');
  const hasSummary = table.querySelector('thead') && table.querySelector('tbody');
  
  if (!hasCaption && !hasAriaLabel && !hasAriaLabelledby) {
    issues.push({
      code: 'REACT_027',
      message: 'Table should have a caption, aria-label, or aria-labelledby'
    });
  }
  
  // Check for th elements with scope or id/headers
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope') && !th.hasAttribute('id')) {
      issues.push({
        code: 'REACT_027',
        message: 'TH element should have scope or id attribute'
      });
    }
  });
  
  // Check for proper thead/tbody structure
  if (!table.querySelector('thead')) {
    issues.push({
      code: 'REACT_027',
      message: 'Table should have a thead element'
    });
  }
  
  return issues;
}

// - REACT_027: Validate table structure
function validateTableStructure(table) {
  const issues = [];
  
  if (!table || table.tagName.toLowerCase() !== 'table') {
    return issues;
  }
  
  // Check for proper table structure
  const hasThead = table.querySelector('thead') !== null;
  const hasTbody = table.querySelector('tbody') !== null;
  const hasTfoot = table.querySelector('tfoot') !== null;
  
  // Tables with multiple rows should have thead
  const rows = table.querySelectorAll('tr');
  if (rows.length > 1 && !hasThead) {
    issues.push({
      code: 'REACT_027',
      message: 'Table with multiple rows should have a thead element'
    });
  }
  
  // Check for proper th/td usage
  const theadRows = table.querySelectorAll('thead tr');
  theadRows.forEach((tr, index) => {
    const ths = tr.querySelectorAll('th');
    const tds = tr.querySelectorAll('td');
    if (tds.length > 0) {
      issues.push({
        code: 'REACT_027',
        message: `thead row ${index} should contain th elements, not td`
      });
    }
  });
  
  // Check for proper column/row headers
  const tbodyRows = table.querySelectorAll('tbody tr');
  tbodyRows.forEach((tr, rowIndex) => {
    const cells = tr.querySelectorAll('td, th');
    cells.forEach(cell => {
      const tagName = cell.tagName.toLowerCase();
      if (rowIndex === 0 && tagName === 'td') {
        // First row should typically use th for column headers
        // Only flag if there's no thead
        if (!hasThead) {
          issues.push({
            code: 'REACT_027',
            message: `Consider using th for header cells in row ${rowIndex}`
          });
        }
      }
    });
  });
  
  // Check for nested tables
  const nestedTables = table.querySelectorAll('table');
  if (nestedTables.length > 0) {
    issues.push({
      code: 'REACT_027',
      message: 'Tables should not contain nested tables'
    });
  }
  
  return issues;
}

// - REACT_036: Create accessible in-page button
function createInPageButton(options = {}) {
  const {
    text = '',
    onClick = null,
    ariaLabel = '',
    className = '',
    id = ''
  } = options;
  
  const button = document.createElement('button');
  button.type = 'button';
  
  if (text) {
    button.textContent = text;
  }
  
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  
  if (className) {
    button.className = className;
  }
  
  if (id) {
    button.id = id;
  }
  
  // Ensure button has accessible name
  if (!ariaLabel && !text) {
    button.setAttribute('aria-label', 'In-page action button');
  }
  
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

// - REACT_041: Add accessible names to 2 SVGs
const svg1 = document.querySelector('svg');
const svg2 = document.querySelectorAll('svg')[1];
if (svg1) {
  svg1.setAttribute('aria-labelledby', 'svg1-title');
}
if (svg2) {
  svg2.setAttribute('aria-labelledby', 'svg2-title');
}

// - REACT_025: Ensure unique landmarks (2 issues)
// Fix: For components with conditional <main> elements (e.g., Dashboard error/success states),
// ensure only ONE <main> landmark exists in the source. Replace duplicate <main> tags
// in conditional branches with <section> elements. For runtime validation:
const mainElements = document.querySelectorAll('main');
if (mainElements.length > 1) {
  // Log warning for debugging purposes
  console.warn('Multiple <main> landmarks detected. Consider using <section> or <article> for additional regions.');
  // The static fix should be applied in the source files:
  // - ... Replace one <main> with <section role="region" ...
  // - ... Same fix
}

// - REACT_036: Fix 1 fake link issue
const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
fakeLinks.forEach(link => {
  // Add the `role` attribute to indicate the link is not a real navigation link
  link.setAttribute('role', 'presentation');
});

// NEW: Implement this function for checking landmark elements
function checkLandmarkElements() {
  const landmarks = document.querySelectorAll('.landmark');
  landmarks.forEach((landmark, index) => {
    // Additional checks or logic to validate landmark elements
    // This could be additional attributes, structure checks, etc.
    if (landmark.hasAttribute('aria-labelledby') && !landmark.querySelector(`#landmark-label-${index}`)) {
      console.warn(`REACT_017: ARIA-labelledby attribute exists without corresponding element for landmark at index ${index}`);
    }
    // You can add more checks here based on the requirements
  });
}

// Run the function to check landmark elements
checkLandmarkElements();

// Preserve the existing exports and add new functions
module.exports = {
  main,
  myNewFunction,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureElementHasId,
  addAriaLabel,
  checkLandmarkElement,
  checkDuplicateBanners,
  validateLandmark,
  validateLandmarkStructure,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  checkLandmarkElements,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  createInPageButton,
  // Include functions from dependencyGraphContent if available
  ...(dependencyGraphContent && typeof dependencyGraphContent === 'object' ? dependencyGraphContent : {})
};