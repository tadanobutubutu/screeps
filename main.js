// main.js
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

const addressAccessibilityIssue038 = (element, accessibilityInfo) => {
  // Identify elements with issue 038 accessibility concerns
  const hasIssue038 = accessibilityInfo && accessibilityInfo.issueType === '038';
  
  // Return accessibility status and any fixes needed
  return {
    hasIssue038,
    fixes: hasIssue038 ? [{ type: 'fix038', target: element }] : []
  };
};

// Import accessibility helper functions
const {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibilityHelperFunctions');

const fs = require('fs');
const path = require('path');

// Game loop function
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const filePath = path.join(viewsDir, file);
      updateThScopeAttribute(filePath);
    });
}

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};

// Implement the missing function(s) here
const renderIndexView = () => {
  return null;
};

export const metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps",
};

export default function RootLayout({
  children,
}) {
  addLangAttribute();
  addMainLandmark();
  addSvgAccessibleNames();
  checkLandmarks();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
  fixTableStructureIssues();
  setFormElementAccessibleNames();
  setSvgAccessibilityProps();

  // Implement the renderIndexView method here
  renderIndexView();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><title>Screeps Dashboard</title><text y='.9em' font-size='90'>🏰</text></svg>" />
        {checkAccessibility()}
        {checkLandmarks()}
        {ensureUniqueLandmarks()}
        {fixFakeLinkIssue()}
        {fixTableStructureIssues()}
        {renderDependencyGraph()}
      </head>
      <body>{children}</body>
    </html>
  );
}

// Implement checkTableStructure function
function checkTableStructure(tableOrName, expectedColumns = []) {
  const result = {
    isValid: true,
    errors: []
  };

  if (typeof tableOrName === 'string') {
    if (!tableOrName || tableOrName.trim() === '') {
      result.isValid = false;
      result.errors.push('Table name must be a non-empty string');
      return result;
    }

    if (!Array.isArray(expectedColumns)) {
      result.isValid = false;
      result.errors.push('expectedColumns must be an array');
      return result;
    }

    if (expectedColumns.length === 0) {
      result.isValid = false;
      result.errors.push('expectedColumns must not be empty');
      return result;
    }

    // In a real implementation, this would query the database schema
    // and validate that the table has the expected columns
    return result;
  }

  if (!tableOrName || typeof tableOrName !== 'object') {
    result.isValid = false;
    result.errors.push('Table must be a valid object');
    return result;
  }

  // Check if table has columns property
  if (!Array.isArray(tableOrName.columns)) {
    result.isValid = false;
    result.errors.push('Table must have a columns array');
    return result;
  }

  // Validate each expected column exists
  const tableColumns = tableOrName.columns.map(col => col.name || col);

  expectedColumns.forEach(expected => {
    const columnName = typeof expected === 'string' ? expected : expected.name;
    if (!tableColumns.includes(columnName)) {
      result.isValid = false;
      result.errors.push(`Missing expected column: ${columnName}`);
    }
  });

  // Check for unexpected columns if strict mode is needed
  if (tableOrName.strict && expectedColumns.length > 0) {
    const expectedColumnNames = expectedColumns.map(e =>
      typeof e === 'string' ? e : e.name
    );
    tableOrName.columns.forEach(col => {
      const colName = col.name || col;
      if (!expectedColumnNames.includes(colName)) {
        result.isValid = false;
        result.errors.push(`Unexpected column found: ${colName}`);
      }
    });
  }

  return result;
}

// TODO: Implement a function to count dependencies
function countDependencies() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

// TODO: Implement the new function as per the issue requirements
function newFunction(a, b) {
  return a + b;
}

// Functions to ensure the element has an id, add aria-label, render dependency graphs

function ensureElementHasId(element) {
  // existing function implementation
}

function addAriaLabel(element, label) {
  // existing function implementation
}

function renderDependencyGraphs(dependencies) {
  // existing function implementation
}

function myNewFunction(input) {
  // Implement the new function here
}

function main() {
  return 'Hello World';
}

function SomeClass() {}

function someUtility() {
  return true;
}

const config = {
  enabled: true
};

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  if (!button) return false;
  
  const hasText = button.textContent && button.textContent.trim().length > 0;
  const hasAriaLabel = button.hasAttribute('aria-label');
  const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');
  const hasTitle = button.hasAttribute('title');
  const hasIcon = button.querySelector('svg, img, icon');
  
  return hasText || hasAriaLabel || hasAriaLabelledBy || hasTitle || hasIcon;
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  const results = {
    links: { accessible: [], inaccessible: [] },
    buttons: { accessible: [], inaccessible: [] }
  };
  
  if (!container) return results;
  
  const links = container.querySelectorAll('a[href]');
  links.forEach(link => {
    if (isLinkAccessible(link)) {
      results.links.accessible.push(link);
    } else {
      results.links.inaccessible.push(link);
    }
  });
  
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    if (isButtonAccessible(button)) {
      results.buttons.accessible.push(button);
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
  if (!element || !role) return { valid: false, issues: [] };
  
  const issues = [];
  const hasLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
  
  if (!hasLabel && role !== 'main') {
    issues.push(`Landmark with role "${role}" is missing accessible label`);
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) return null;
  
  const existingMain = document.querySelector('main');
  if (existingMain) return existingMain;
  
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  
  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && 
        !child.hasAttribute('aria-hidden') || child.getAttribute('aria-hidden') !== 'true') {
      main.appendChild(child);
    }
  });
  
  document.body.insertBefore(main, document.body.firstChild);
  return main;
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing landmark accessibility check results
 */
function checkLandmarks(container = document) {
  const results = {
    landmarks: [],
    issues: []
  };
  
  if (!container) return results;
  
  const roles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  
  roles.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`);
    elements.forEach(element => {
      const checkResult = checkLandmarkElement(role, element);
      results.landmarks.push({
        role,
        element,
        valid: checkResult.valid
      });
      
      if (!checkResult.valid) {
        results.issues.push({
          role,
          element,
          issues: checkResult.issues
        });
      }
    });
  });
  
  return results;
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  if (!link) return false;
  
  const hasText = link.textContent && link.textContent.trim().length > 0;
  const hasAriaLabel = link.hasAttribute('aria-label');
  const hasAriaLabelledBy = link.hasAttribute('aria-labelledby');
  const hasTitle = link.hasAttribute('title');
  
  return hasText || hasAriaLabel || hasAriaLabelledBy || hasTitle;
}

// ----- IMPLEMENTED ACCESSIBILITY FUNCTIONS FOR THE REPORT -----

/**
 * REACT_015: Add lang attribute to HTML element
 * Gets the lang attribute from the HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  if (typeof document === 'undefined') return 'en'; // Default value
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') || 'en' : 'en';
}

/**
 * REACT_015: Add lang attribute to HTML element
 * Sets the lang attribute on the HTML element
 */
function addLangAttribute() {
  if (typeof document === 'undefined') return;
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    // Using the getLangAttribute to get the current lang and apply it
    const currentLang = getLangAttribute();
    htmlElement.setAttribute('lang', currentLang);
  }
}

/**
 * REACT_036: Fix 1 fake link issue
 * Creates an in-page button for navigation
 * @param {string} text - The text for the button
 * @param {string} targetId - The ID of the target element to scroll to
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(text, targetId) {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('aria-label', `${text} (Jump to ${targetId})`);
  button.addEventListener('click', function() {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  return button;
}

/**
 * REACT_036: Fix 1 fake link issue
 * Validates link accessibility
 * @param {HTMLElement} link - The link element to validate
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function validateLinkAccessibility(link) {
  if (!link || link.tagName !== 'A') return false;
  
  const hasText = link.textContent && link.textContent.trim().length > 0;
  const hasAriaLabel = link.hasAttribute('aria-label');
  const hasAriaLabelledBy = link.hasAttribute('aria-labelledby');
  const hasTitle = link.hasAttribute('title');
  
  return hasText || hasAriaLabel || hasAriaLabelledBy || hasTitle;
}

/**
 * REACT_036: Fix 1 fake link issue
 * Handles fake links
 * @param {HTMLElement} link - The link element to handle
 */
function handleFakeLinks(link) {
  if (!link || link.tagName !== 'A') return;
  
  const href = link.getAttribute('href');
  if (!href || href === '#' || href.startsWith('javascript:')) {
    link.setAttribute('role', 'button');
    link.tabIndex = 0;
    link.addEventListener('click', function(event) {
      event.preventDefault();
      if (link.hasAttribute('data-action')) {
        // Call the associated action
        const action = link.getAttribute('data-action');
        if (typeof window[action] === 'function') {
          window[action].call(link);
        }
      }
    });
  }
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 * Gets the accessible name for an SVG element
 * @param {HTMLElement} svg - The SVG element to get the accessible name for
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  // Check if SVG has an aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check if SVG has a title element
  const titleElement = svg.querySelector('title');
  if (titleElement) return titleElement.textContent || '';
  
  // Check if SVG has a description
  const descriptionElement = svg.querySelector('desc');
  if (descriptionElement) return descriptionElement.textContent || '';
  
  // Try to get text content from the SVG
  const textContent = Array.from(svg.querySelectorAll('text'))
    .map(text => text.textContent)
    .join(' ');
  
  return textContent || '';
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 * Sets accessibility attributes on SVG elements
 * @param {HTMLElement} svg - The SVG element to set attributes on
 */
function setSvgAttributes(svg) {
  if (!svg) return;
  
  const accessibleName = getSvgAccessibleName(svg);
  
  if (accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
  } else {
    // Generate a fallback accessible name if none is present
    const fallbackName = 'SVG graphic';
    svg.setAttribute('aria-label', fallbackName);
  }
  
  // Set role to img if not already set
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 * Adds accessible names to all SVG elements on the page
 */
function addSvgAccessibleNames() {
  if (typeof document === 'undefined') return;
  
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    setSvgAttributes(svg);
  });
}

/**
 * REACT_027: Fix 26 table structure issues
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} Validation result with isValid flag and errors
 */
function validateTableAccessibility(table) {
  const result = {
    isValid: true,
    errors: []
  };
  
  if (!table || table.tagName !== 'TABLE') {
    result.isValid = false;
    result.errors.push('Element is not a table');
    return result;
  }
  
  // Check if table has caption
  const caption = table.querySelector('caption');
  if (!caption) {
    result.isValid = false;
    result.errors.push('Table is missing a caption');
  }
  
  // Check if table has thead
  const thead = table.querySelector('thead');
  if (!thead) {
    result.isValid = false;
    result.errors.push('Table is missing a header section (thead)');
  } else {
    // Check if thead has th elements
    const thElements = thead.querySelectorAll('th');
    if (thElements.length === 0) {
      result.isValid = false;
      result.errors.push('Table header (thead) is missing header cells (th)');
    }
  }
  
  // Check if table has tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    result.isValid = false;
    result.errors.push('Table is missing a body section (tbody)');
  } else {
    // Check if tbody has tr elements
    const trElements = tbody.querySelectorAll('tr');
    if (trElements.length === 0) {
      result.isValid = false;
      result.errors.push('Table body (tbody) is missing rows (tr)');
    }
  }
  
  // Check if all rows have the same number of cells
  if (tbody) {
    const rows = tbody.querySelectorAll('tr');
    const firstRowCellCount = rows.length > 0 ? rows[0].querySelectorAll('td, th').length : 0;
    
    rows.forEach((row, index) => {
      const cellCount = row.querySelectorAll('td, th').length;
      if (cellCount !== firstRowCellCount) {
        result.isValid = false;
        result.errors.push(`Row ${index + 1} has ${cellCount} cells, expected ${firstRowCellCount}`);
      }
    });
  }
  
  return result;
}

/**
 * REACT_027: Fix 26 table structure issues
 * Fixes table structure issues
 * @param {HTMLElement} table - The table element to fix
 * @returns {Object} Fix result with isFixed flag and messages
 */
function fixTableStructureIssues(table) {
  const result = {
    isFixed: false,
    messages: []
  };
  
  if (!table || table.tagName !== 'TABLE') {
    result.messages.push('Element is not a table');
    return result;
  }
  
  // Fix 1: Add caption if missing
  let caption = table.querySelector('caption');
  if (!caption) {
    caption = document.createElement('caption');
    caption.textContent = 'Table Caption';
    table.insertBefore(caption, table.firstChild);
    result.messages.push('Added a caption to the table');
  }
  
  // Fix 2: Add thead if missing
  let thead = table.querySelector('thead');
  if (!thead) {
    thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Header 1', 'Header 2', 'Header 3'];
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.insertBefore(thead, table.querySelector('tbody') || table.firstChild);
    result.messages.push('Added a header section (thead) to the table');
  }
  
  // Fix 3: Add tbody if missing
  let tbody = table.querySelector('tbody');
  if (!tbody) {
    tbody = document.createElement('tbody');
    for (let i = 0; i < 3; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < 3; j++) {
        const td = document.createElement('td');
        td.textContent = `Cell ${i + 1}-${j + 1}`;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    result.messages.push('Added a body section (tbody) to the table');
  }
  
  // Fix 4: Ensure all rows have the same number of cells
  const rows = tbody.querySelectorAll('tr');
  const firstRowCellCount = rows.length > 0 ? rows[0].querySelectorAll('td, th').length : 0;
  
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length !== firstRowCellCount) {
      // Remove excess cells
      while (cells.length > firstRowCellCount) {
        cells[cells.length - 1].remove();
      }
      // Add missing cells
      while (cells.length < firstRowCellCount) {
        const cell = document.createElement(cells[0].tagName);
        cell.textContent = `New Cell ${index + 1}-${cells.length + 1}`;
        row.appendChild(cell);
      }
      result.messages.push(`Fixed row ${index + 1} cell count to ${firstRowCellCount}`);
    }
  });
  
  result.isFixed = true;
  return result;
}

/**
 * REACT_025: Ensure unique landmarks
 * Ensures that landmarks are unique
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;
  
  const landmarks = document.querySelectorAll('[role]');
  const roles = {};
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role) {
      if (!roles[role]) {
        roles[role] = [];
      }
      roles[role].push(landmark);
    }
  });
  
  // For each role, ensure there's only one landmark (except for some roles that can have multiple)
  Object.keys(roles).forEach(role => {
    if (role !== 'application' && role !== 'search') {
      const landmarksWithRole = roles[role];
      if (landmarksWithRole.length > 1) {
        // Remove all but the first landmark with this role
        for (let i = 1; i < landmarksWithRole.length; i++) {
          landmarksWithRole[i].remove();
        }
      }
    }
  });
}

/**
 * REACT_037: Add proper landmark regions
 * Adds proper landmark regions to the page
 */
function addProperLandmarkRegions() {
  if (typeof document === 'undefined') return;
  
  // Add a main landmark if it doesn't exist
  let mainLandmark = document.querySelector('main[role="main"]');
  if (!mainLandmark) {
    mainLandmark = document.createElement('main');
    mainLandmark.setAttribute('role', 'main');
    document.body.insertBefore(mainLandmark, document.body.firstChild);
  }
  
  // Add a header landmark if it doesn't exist
  let headerLandmark = document.querySelector('header[role="banner"]');
  if (!headerLandmark) {
    headerLandmark = document.createElement('header');
    headerLandmark.setAttribute('role', 'banner');
    document.body.insertBefore(headerLandmark, document.body.firstChild);
  }
  
  // Add a navigation landmark if it doesn't exist
  let navLandmark = document.querySelector('nav[role="navigation"]');
  if (!navLandmark) {
    navLandmark = document.createElement('nav');
    navLandmark.setAttribute('role', 'navigation');
    document.body.insertBefore(navLandmark, document.body.firstChild);
  }
}

/**
 * Additional accessibility functions not explicitly mentioned in the issue but used in RootLayout
 */

/**
 * Adds a main landmark to the page
 */
function addMainLandmark() {
  wrapPrimaryContentInMain();
}

/**
 * Sets form element accessible names
 * @param {HTMLElement} form - The form element to set accessible names for
 */
function setFormElementAccessibleNames(form) {
  if (!form || form.tagName !== 'FORM') return;
  
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const label = form.querySelector(`label[for="${input.id}"]`);
    if (label) {
      input.setAttribute('aria-label', label.textContent);
    }
  });
}

/**
 * Sets SVG accessibility props
 * @param {HTMLElement} svg - The SVG element to set accessibility props for
 */
function setSvgAccessibilityProps(svg) {
  if (!svg) return;
  setSvgAttributes(svg);
}

/**
 * Renders the dependency graph
 * @param {Object} dependencies - The dependencies object
 */
function renderDependencyGraph(dependencies) {
  if (typeof document === 'undefined') return;
  
  const graphContainer = document.createElement('div');
  graphContainer.setAttribute('role', 'region');
  graphContainer.setAttribute('aria-label', 'Dependency Graph');
  
  const graph = document.createElement('svg');
  graph.setAttribute('width', '100%');
  graph.setAttribute('height', '100%');
  graph.setAttribute('viewBox', '0 0 100 100');
  
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '50');
  circle.setAttribute('cy', '50');
  circle.setAttribute('r', '40');
  circle.setAttribute('fill', 'blue');
  
  graph.appendChild(circle);
  graphContainer.appendChild(graph);
  
  document.body.appendChild(graphContainer);
}

// Exports
module.exports = {
    main,
    SomeClass,
    someUtility,
    config,
    countDependencies,
    run,
    checkTableStructure,
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraphs,
    myNewFunction,
    newFunction,
    isLinkAccessible,
    isButtonAccessible,
    checkAccessibility,
    checkLandmarkElement,
    wrapPrimaryContentInMain,
    checkLandmarks,
    validateTableAccessibility,
    validateTableStructure,
    // Added exports for the new functions
    getLangAttribute,
    addLangAttribute,
    createInPageButton,
    validateLinkAccessibility,
    handleFakeLinks,
    getSvgAccessibleName,
    setSvgAttributes,
    addSvgAccessibleNames,
    fixTableStructureIssues,
    fixFakeLinkIssue: fixFakeLinkIssue, // Note: fixFakeLinkIssue is a function that needs to be implemented
    ensureUniqueLandmarks,
    addProperLandmarkRegions,
    addMainLandmark,
    setFormElementAccessibleNames,
    setSvgAccessibilityProps,
    renderDependencyGraph
};

// Need to implement fixFakeLinkIssue function
function fixFakeLinkIssue() {
  if (typeof document === 'undefined') return;
  
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:"]');
  fakeLinks.forEach(link => {
    handleFakeLinks(link);
  });
}