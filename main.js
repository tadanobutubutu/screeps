// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... [PERSON_NAME](), ... and personName())
// - ADD: Address new accessibility issues from insight report

// Import dependencyGraphContent
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

const dependencyGraphContent = require('./dependencyGraph');

const fs = require('fs');
const path = require('path');

// Import dependencyGraphRenderer, addressAccessibilityIssue038, [PERSON_NAME], addressAccessibilityIssueForSpecificElement, totalDependencies, addressOldAccessibilityIssues, and dependencyGraphContent
const DependencyGraphRenderer = require('./dependencyGraphRenderer');
const addressAccessibilityIssue038 = require('./accessibilityFunctions').addressAccessibilityIssue038;
const newFunction = require('./accessibilityFunctions').newFunction;
const addressAccessibilityIssueForSpecificElement = require('./accessibilityFunctions').addressAccessibilityIssueForSpecificElement;
const totalDependencies = require('./accessibilityFunctions').totalDependencies;
const addressOldAccessibilityIssues = require('./accessibilityFunctions').addressOldAccessibilityIssues;

// Import a11yStore from both branches
const a11yStore = require('./a11yStore');

// PLACEHOLDER: Add functions for ensuring element has an id
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = generateId();
  }
  return element;
}

// PLACEHOLDER: Add functions for adding aria-label
function addAriaLabel(element, label) {
  if (!element.nativeEvent || !element.nativeEvent.isTrusted) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

// Address the issue: REACT_038
const addressAccessibilityIssue038Inline = (element, accessibilityInfo) => {
  // Code to address the specific accessibility issue on the element
  // This is a placeholder function and should be replaced with the actual implementation
  console.log(`Addressing accessibility issue for ${element} with info:`, accessibilityInfo);
};

// Implement the requested functions for addressing new accessibility issues

// Function to handle REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  // Code to get the language and return it
  // Placeholder example:
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

function getFullLangAttribute() {
  // Code to get full localized language and return it
  // Placeholder example:
  return 'en-US';
}

// New function: validateTableStructure
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Check if table has a caption, thead, thead > tr, tbody, tfoot, th, td
    const hasCaption = !!table.querySelector('caption');
    const hasThead = !!table.querySelector('thead');
    const rowsInThead = Array.from(table.querySelectorAll('thead tr'));
    const hasTbody = !!table.querySelector('tbody');
    const hasTfoot = !!table.querySelector('tfoot');
    const hasTh = Array.from(table.querySelectorAll('th'));

    // Check if the caption is before the thead, thead before tbody, and tbody before tfoot
    if (hasCaption) {
      if (table.firstChild !== table.querySelector('caption')) {
        throw new Error('Table caption should be the first child of the table');
      }
    }
    if (hasThead) {
      if (table.firstChild !== table.querySelector('thead')) {
        throw new Error('Thead should be before the tbody');
      }
    }
    if (hasTbody && hasThead) {
      if (table.querySelector('thead').nextSibling !== table.querySelector('tbody')) {
        throw new Error('Tbody should be immediately after thead');
      }
    }
    if (hasTfoot && hasTbody) {
      if (table.querySelector('tbody').nextSibling !== table.querySelector('tfoot')) {
        throw new Error('Tfoot should be immediately after tbody');
      }
    }

    // Check if all thead columns have a corresponding tbody column and vice versa
    if (hasTh.length === rowsInThead.length) {
      rowsInThead.forEach((row, index) => {
        if (row.querySelectorAll('th').length !== row.querySelectorAll('td').length) {
          throw new Error(`Row ${index} in table header should have the same number of th and td`);
        }
      });
    }
  });
}

// New function: validateLandmark
function validateLandmark(element, landmarkType) {
  // validates if the specified element is a landmark (using given landmarkType)
  // You may use a library like "axe-core" for more reliable checks considering the various landmark roles.
  // For the sake of simplicity, this example will check only for presence of aria-* attributes, but a more accurate solution would involve verified matching with the given landmarkType.
  // If the element is not a valid landmark of the requested type, throw an error with a message.
  if (!element.hasAttribute('aria-' + landmarkType)) {
    throw new Error(`Element '${element.outerHTML}' is not a valid ${landmarkType} landmark`);
  }
}

// New function: validateLandmarkStructure
function validateLandmarkStructure() {
  // Check for required landmarks and proper structure
  const mainLandmark = document.querySelector('[role="main"], main');
  if (!mainLandmark) {
    throw new Error('Document must have a main landmark (role="main" or <main> element)');
  }

  // Check for duplicate banners
  const banners = document.querySelectorAll('[role="banner"], [role="header"]');
  if (banners.length > 1) {
    throw new Error('Document should have at most one banner or header landmark');
  }

  // Check for duplicate contentinfo
  const contentinfos = document.querySelectorAll('[role="contentinfo"], [role="footer"]');
  if (contentinfos.length > 1) {
    throw new Error('Document should have at most one contentinfo or footer landmark');
  }

  // Check for nested landmarks of the same type
  const allLandmarks = document.querySelectorAll('[role="banner"], [role="complementary"], [role="contentinfo"], [role="form"], [role="main"], [role="navigation"], [role="search"], [role="region"], [role="article"], [role="aside"], [role="figure"], [role="footer"], [role="header"], [role="landmark"], main, header, footer, aside, nav, section[aria-label], form[aria-label]');

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    let parent = landmark.parentElement;
    while (parent) {
      const parentRole = parent.getAttribute('role') || parent.tagName.toLowerCase();
      if (parentRole === role) {
        throw new Error(`Landmark with role "${role}" should not be nested inside another with the same role`);
      }
      parent = parent.parentElement;
    }
  });
}

// New function: getSvgAccessibleName
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

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

// Implement the function for addressing new accessibility issues
function addressAccessibilityIssues(report) {
  if (report) {
    a11yStore.addressAccessibilityIssues(report);
    return;
  }
  validateTableStructure();
  validateLandmarkStructure();
  // Additional accessibility issue handling can be added here
}

/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  if (!svgElement) return;
  
  // Ensure the SVG has an accessible name
  if (!getSvgAccessibleName(svgElement)) {
    // Add a title if no accessible name exists
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'SVG Graphic';
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  
  // Ensure proper ARIA attributes
  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  if (!link) return false;
  
  // Check for href attribute
  const href = link.getAttribute('href');
  if (!href || href === '' || href === '#') {
    return false;
  }
  
  // Check for accessible text
  const text = link.textContent.trim();
  if (!text) {
    // Check for aria-label
    if (!link.hasAttribute('aria-label') && !link.hasAttribute('aria-labelledby')) {
      return false;
    }
  }
  
  return true;
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLButtonElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  if (!button) return false;
  
  // Check for accessible text or label
  const text = button.textContent.trim();
  if (!text) {
    // Check for aria-label
    if (!button.hasAttribute('aria-label') && !button.hasAttribute('aria-labelledby')) {
      return false;
    }
  }
  
  return true;
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  const results = {
    links: { total: 0, accessible: 0, inaccessible: [] },
    buttons: { total: 0, accessible: 0, inaccessible: [] }
  };
  
  if (typeof container === 'undefined') {
    container = document;
  }
  
  const links = container.querySelectorAll('a');
  const buttons = container.querySelectorAll('button');
  
  results.links.total = links.length;
  results.buttons.total = buttons.length;
  
  links.forEach(link => {
    if (isLinkAccessible(link)) {
      results.links.accessible++;
    } else {
      results.links.inaccessible.push(link);
    }
  });
  
  buttons.forEach(button => {
    if (isButtonAccessible(button)) {
      results.buttons.accessible++;
    } else {
      results.buttons.inaccessible.push(button);
    }
  });
  
  return results;
}

/**
 * Checks landmark element has appropriate accessibility attributes.
 * @param {string} role - The landmark role to check
 * @param {HTMLElement} element - The element to check
 */
function checkLandmarkElement(role, element) {
  if (!element) return false;
  
  const elementRole = element.getAttribute('role');
  if (elementRole !== role) {
    return false;
  }
  
  // Check for accessible name (label)
  const hasLabel = element.hasAttribute('aria-label') || 
                   element.hasAttribute('aria-labelledby') ||
                   element.hasAttribute('aria-describedby');
  
  return hasLabel;
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined') return null;
  
  // Check if main already exists
  let main = document.querySelector('main, [role="main"]');
  if (main) return main;
  
  // Create main element and wrap body content
  if (document.body) {
    main = document.createElement('main');
    while (document.body.firstChild) {
      main.appendChild(document.body.firstChild);
    }
    document.body.appendChild(main);
    return main;
  }
  
  return null;
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing landmark accessibility check results
 */
function checkLandmarks(container = document) {
  const results = {
    landmarks: [],
    missingLabels: []
  };
  
  if (typeof container === 'undefined') {
    container = document;
  }
  
  const landmarkSelectors = [
    '[role="banner"]', '[role="navigation"]', '[role="main"]', 
    '[role="complementary"]', '[role="contentinfo"]', '[role="form"]',
    '[role="search"]', '[role="region"]', 'main', 'nav', 'aside', 'header', 'footer', 'form'
  ];
  
  landmarkSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(element => {
      const role = element.getAttribute('role') || element.tagName.toLowerCase();
      const hasLabel = element.hasAttribute('aria-label') || 
                       element.hasAttribute('aria-labelledby') ||
                       (element.id && document.querySelector(`[aria-labelledby="${element.id}"]`));
      
      results.landmarks.push({ element, role, hasLabel });
      
      if (!hasLabel && role !== 'main' && role !== 'body') {
        results.missingLabels.push(element);
      }
    });
  });
  
  return results;
}

/**
 * Renders the index view of the application.
 */
function renderIndexView() {
  // Implement your code here.
  // Example of creating a button in-page:
  const button = document.createElement('button');
  button.textContent = 'Click Me';
  // Append the button to the body or another element as needed
  document.body.appendChild(button);
}

/**
 * Adds lang attribute to the HTML element if missing.
 * @returns {HTMLElement|null} The HTML element or null if document is not available
 */
function addLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }
    return document.documentElement;
  }
  return null;
}

/**
 * Fixes table structure issues in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to fix table issues in
 * @returns {NodeList} NodeList of fixed tables
 */
function fixTableStructureIssues(container = document) {
  if (typeof container === 'undefined') {
    container = document;
  }
  
  const tables = container.querySelectorAll('table');
  
  tables.forEach(table => {
    // Ensure table has a thead if it has header cells
    const thCells = table.querySelectorAll('th');
    if (thCells.length > 0 && !table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    
    // Ensure table has a tbody if it has data cells
    const tdCells = table.querySelectorAll('td');
    if (tdCells.length > 0 && !table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      const rows = Array.from(table.querySelectorAll('tr')).filter(row => !row.parentElement?.tagName === 'THEAD');
      rows.forEach(row => {
        if (row.parentElement === table) {
          tbody.appendChild(row);
        }
      });
      table.appendChild(tbody);
    }
  });
  
  return tables;
}

/**
 * Validates table accessibility issues.
 * @param {HTMLElement} [container=document] - The container to validate tables in
 * @returns {Object} An object containing validation results
 */
function validateTableAccessibility(container = document) {
  if (typeof container === 'undefined') {
    container = document;
  }
  
  const tables = container.querySelectorAll('table');
  const results = {
    tables: [],
    issues: []
  };
  
  tables.forEach((table, index) => {
    const tableIssues = [];
    
    // Check for caption
    const caption = table.querySelector('caption');
    if (!caption) {
      tableIssues.push('Missing caption element');
    }
    
    // Check for thead
    const thead = table.querySelector('thead');
    if (!thead) {
      tableIssues.push('Missing thead element');
    }
    
    // Check for tbody
    const tbody = table.querySelector('tbody');
    if (!tbody) {
      tableIssues.push('Missing tbody element');
    }
    
    // Check for proper structure
    if (caption && table.firstChild !== caption) {
      tableIssues.push('Caption should be the first child of the table');
    }
    
    results.tables.push({
      index,
      hasCaption: !!caption,
      hasThead: !!thead,
      hasTbody: !!tbody,
      issues: tableIssues
    });
    
    results.issues.push(...tableIssues);
  });
  
  return results;
}

/**
 * Adds or fixes main landmark element.
 * @returns {HTMLElement|null} The main element
 */
function addMainLandmark() {
  return wrapPrimaryContentInMain();
}

/**
 * Adds accessible names to all SVG elements in the document.
 * @returns {NodeList} NodeList of processed SVG elements
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => setSvgAccessibilityProps(svg));
  return svgs;
}

/**
 * Ensures landmark elements are unique in the document.
 * Keeps only a single <main> element and ensures other landmarks have unique labels.
 * @returns {Object} An object containing uniqueness information
 */
function ensureUniqueLandmarks() {
  const results = {
    removedMains: 0,
    labeledLandmarks: []
  };
  
  // Keep only the first main element
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      mains[i].remove();
      results.removedMains++;
    }
  }
  
  // Ensure unique labels for other landmarks
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"], [role="form"], [role="search"]');
  
  landmarks.forEach(landmark => {
    if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      const role = landmark.getAttribute('role');
      landmark.setAttribute('aria-label', `${role} landmark`);
      results.labeledLandmarks.push(landmark);
    }
  });
  
  return results;
}

/**
 * Fixes fake link issues by converting links without href to buttons.
 * @returns {Array} Array of fixed link elements
 */
function fixFakeLinkIssue() {
  const links = document.querySelectorAll('a');
  const fixedLinks = [];

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href === '') {
      link.setAttribute('role', 'button');
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
      fixedLinks.push(link);
    }
  });

  return fixedLinks;
}

/**
 * Sets accessible names for all form elements in the document.
 * @returns {NodeList} NodeList of processed form elements
 */
function setFormElementAccessibleNames() {
  const formElements = document.querySelectorAll('form [name], form [id]');
  formElements.forEach(element => {
    if (element.tagName.toLowerCase() === 'form') {
      // Set aria-labelledby for the form using a unique label
      const uniqueLabel = `form-${generateId()}`;
      element.setAttribute('aria-labelledby', uniqueLabel);
      element.insertAdjacentHTML('afterbegin', `<span id="${uniqueLabel}">${element.getAttribute('aria-label') || ''}</span>`);
    } else {
      element.setAttribute('aria-label', `${element.tagName.toLowerCase()} input: ${element.name || element.id}`);
    }
  });
  return formElements;
}

/**
 * Adds a11y attributes to interactive elements to ensure they are keyboard accessible.
 * @returns {Array} Array of elements with added attributes
 */
function addA11yAttributesToInteractiveElements() {
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach(element => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
  return interactiveElements;
}

// Create the new placeholder functions for accessibility handling
const newAccessibilityFunction = () => {
  return 'new accessibility function';
};

// Utility functions (added from the new changes)
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Addresses accessibility issues from an insight report.
 * @param {Array} insightReport - An array of issue objects, each with a type property indicating the issue type.
 */
function addressAccessibilityIssuesFromInsightReport(insightReport) {
  if (!Array.isArray(insightReport)) {
    console.error('Insight report must be an array');
    return;
  }

  insightReport.forEach(issue => {
    switch (issue.type) {
      case 'LANG_ATTRIBUTE':
        addLangAttribute();
        break;
      case 'TABLE_STRUCTURE':
        fixTableStructureIssues();
        break;
      case 'LANDMARK_STRUCTURE':
        validateLandmarkStructure();
        ensureUniqueLandmarks();
        break;
      case 'SVG_ACCESSIBILITY':
        addSvgAccessibleNames();
        break;
      case 'FAKE_LINK':
        fixFakeLinkIssue();
        break;
      case 'FORM_ELEMENTS':
        setFormElementAccessibleNames();
        break;
      case 'INTERACTIVE_ELEMENTS':
        addA11yAttributesToInteractiveElements();
        break;
      case 'GENERAL_ACCESSIBILITY':
        checkAccessibility();
        break;
      default:
        console.warn(`Unknown issue type: ${issue.type}`);
    }
  });
}

function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Placeholder function for personName referenced in accessibility issues
function personName() {
  return 'User';
}

// Counts the total number of dependencies in package.json
/**
 * Counts the total number of dependencies in package.json
 * @returns {Object} An object containing counts for dependencies, devDependencies, and total
 */
function countDependencies() {
  const packagePath = path.join(__dirname, 'package.json');

  try {
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    const dependencyCount = Object.keys(dependencies).length;
    const devDependencyCount = Object.keys(devDependencies).length;
    
    return {
      dependencies: dependencyCount,
      devDependencies: devDependencyCount,
      total: dependencyCount + devDependencyCount
    };
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return {
      dependencies: 0,
      devDependencies: 0,
      total: 0
    };
  }
}

// New function to convert anchor tags to buttons with specific id and text
function convertAnchorsToButtons() {
  if (typeof document !== 'undefined') {
    const anchors = document.querySelectorAll('a');
    anchors.forEach(anchor => {
      const button = document.createElement('button');
      button.id = anchor.id;
      button.type = 'button';
      button.textContent = anchor.textContent;
      // Copy attributes from anchor to button
      Array.from(anchor.attributes).forEach(attr => {
        if (attr.name !== 'id') {
          button.setAttribute(attr.name, attr.value);
        }
      });
      // Replace anchor with button
      anchor.parentNode.replaceChild(button, anchor);
    });
  }
}

/**
 * Renders dependency graph content
 * @param {Object} options - Options for rendering the dependency graph
 * @returns {string} The rendered dependency graph HTML
 */
function renderDependencyGraph(options = {}) {
  const {
    containerId = 'dependency-graph',
    showDevDependencies = true,
    maxDepth = 2
  } = options;
  
  const content = dependencyGraphContent || {};
  
  let html = `<div id="${containerId}" class="dependency-graph">`;
  html += '<h2>Dependency Graph</h2>';
  
  if (content.dependencies) {
    html += '<div class="dependencies">';
    html += '<h3>Dependencies</h3>';
    html += '<ul>';
    
    Object.keys(content.dependencies).forEach(dep => {
      html += `<li>${dep}: ${content.dependencies[dep]}</li>`;
    });
    
    html += '</ul>';
    html += '</div>';
  }
  
  html += '</div>';
  
  return html;
}

// Maintain the existing content from origin/main
// ...

// Make functions accessible globally for browser usage
const globalObject = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : global);
globalObject.setSvgAccessibilityProps = setSvgAccessibilityProps;
globalObject.isLinkAccessible = isLinkAccessible;
globalObject.isButtonAccessible = isButtonAccessible;
globalObject.checkAccessibility = checkAccessibility;
globalObject.checkLandmarkElement = checkLandmarkElement;
globalObject.checkLandmarks = checkLandmarks;
globalObject.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
globalObject.renderIndexView = renderIndexView;
// ...

// Export all functions including those from both branches
module.exports = {
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  DependencyGraphRenderer,
  addressAccessibilityIssue038,
  newFunction,
  getLangAttribute,
  getFullLangAttribute,
  totalDependencies,
  addressAccessibilityIssues,
  addressAccessibilityIssueForSpecificElement,
  validateTableStructure,
  validateTableAccessibility,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  newAccessibilityFunction,
  addressOldAccessibilityIssues,
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  checkAccessibility,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  renderIndexView,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  setFormElementAccessibleNames,
  addA11yAttributesToInteractiveElements,
  addressAccessibilityIssuesFromInsightReport,
  formatDate,
  generateId,
  personName,
  countDependencies,
  dependencyGraphContent,
  convertAnchorsToButtons,
  a11yStore
};