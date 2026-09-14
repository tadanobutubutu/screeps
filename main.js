// main.js
// TODO: This is the existing code that needs to be preserved
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

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
  validateLandmarkStructure,
  getSvgAccessibleName,
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
      // Process HTML file here
    });
}

// Function to update th scope attributes (needed by run())
function updateThScopeAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Implementation for updating th scope attributes
}

// Start the game loop
module.onInit = function() {
  setInterval(run, 1000);
};

// Implement the missing function(s) here
const renderIndexView = () => {
  // Updated to use the new functions for rendering graph/index
  const indexData = getIndexData();
  const dependencyGraph = renderDependencyGraph(indexData);
  return renderIndex(dependencyGraph);
};

export const metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps",
};

// REACT_015: Add lang attribute to HTML element
function addLangAttribute() {
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    if (html && !html.hasAttribute('lang')) {
      html.setAttribute('lang', 'en');
    }
  }
}

// REACT_017: Add/fix landmark issues
function addMainLandmark() {
  if (typeof document !== 'undefined') {
    const existingMain = document.querySelector('main, [role="main"]');
    if (!existingMain) {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      main.setAttribute('aria-label', 'Main content');
      
      // Move body content to main if no main exists
      if (document.body && document.body.children.length > 0) {
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach(child => {
          if (!['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(child.tagName)) {
            main.appendChild(child);
          }
        });
        document.body.insertBefore(main, document.body.firstChild);
      }
    }
  }
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return { fixed: [], errors: [] };
  
  const results = { fixed: [], errors: [] };
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  const seenLandmarks = {};
  
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    elements.forEach((element, index) => {
      if (!seenLandmarks[role]) {
        seenLandmarks[role] = 0;
      }
      
      if (seenLandmarks[role] > 0 && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        const uniqueId = `${role}-${seenLandmarks[role]}`;
        element.setAttribute('aria-label', uniqueId);
        results.fixed.push({ role, element, id: uniqueId });
      }
      seenLandmarks[role]++;
    });
  });
  
  return results;
}

// REACT_036: Fix fake link issue
function fixFakeLinkIssue() {
  if (typeof document === 'undefined') return { fixed: [], errors: [] };
  
  const results = { fixed: [], errors: [] };
  const fakeLinks = document.querySelectorAll('a:not([href]), a[href="#"], a[href=""], a[href^="javascript:"]');
  
  fakeLinks.forEach(link => {
    if (!link.hasAttribute('role')) {
      link.setAttribute('role', 'button');
      results.fixed.push(link);
    }
  });
  
  return results;
}

// REACT_027: Fix table structure issues
function fixTableStructureIssues() {
  if (typeof document === 'undefined') return { fixed: [], errors: [] };
  
  const results = { fixed: [], errors: [] };
  const tables = document.querySelectorAll('table');
  
  tables.forEach((table, tableIndex) => {
    // Check for proper table headers (th elements)
    const headers = table.querySelectorAll('th');
    const dataCells = table.querySelectorAll('td');
    
    // Add scope attribute to th elements if missing
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        // Determine if header is for a row or column
        const parent = th.parentElement;
        if (parent) {
          const isFirstCell = parent.firstElementChild === th;
          th.setAttribute('scope', isFirstCell ? 'row' : 'col');
          results.fixed.push({ type: 'th', scope: isFirstCell ? 'row' : 'col', tableIndex });
        }
      }
    });
    
    // Check for caption or summary
    const caption = table.querySelector('caption');
    const summary = table.getAttribute('summary');
    
    if (!caption && !summary) {
      // Add a visually hidden caption
      const hiddenCaption = document.createElement('caption');
      hiddenCaption.className = 'visually-hidden';
      hiddenCaption.textContent = `Table ${tableIndex + 1}`;
      table.insertBefore(hiddenCaption, table.firstChild);
      results.fixed.push({ type: 'caption', tableIndex });
    }
  });
  
  return results;
}

// REACT_041: Add accessible names to SVGs
function renderDependencyGraph() {
  if (typeof document === 'undefined') return null;
  
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby') && !svg.querySelector('title')) {
      // Add a title element for accessibility
      const title = document.createElement('title');
      title.textContent = `Dependency graph ${index + 1}`;
      title.id = `svg-title-${index}`;
      svg.insertBefore(title, svg.firstChild);
      
      // Link the title using aria-labelledby
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
  
  return svgs;
}

export default function RootLayout({
  children,
}) {
  addLangAttribute();
  addMainLandmark();

  // Implement the renderIndexView method here
  renderIndexView();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <title>Screeps Dashboard</title>
        <svg viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y='.9em' fontSize="80">S</text></svg>
        {checkAccessibility()}
        {checkLandmarks()}
        {renderDependencyGraph()}
      </head>
      <body>{children}</body>
    </html>
  );
}

// TODO: Add these imported modules to the relevant rendering functions

// Helper function to add lang attribute to HTML element using imported getLangAttribute
function addLangAttribute() {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    const langValue = getLangAttribute();
    if (langValue && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', langValue);
    }
  }
}

// Helper function to add main landmark to the document using validateLandmarkStructure
function addMainLandmark() {
  if (typeof document !== 'undefined') {
    const existingMain = document.querySelector('main, [role="main"]');
    if (!existingMain) {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      const body = document.body;
      if (body && body.firstChild) {
        body.insertBefore(main, body.firstChild);
      } else if (body) {
        body.appendChild(main);
      }
    }
    // Validate the landmark structure using imported function
    validateLandmarkStructure(document);
  }
}

// Function to check accessibility with in-page buttons and accessible links
function checkAccessibility(container = document) {
  const results = {
    links: { accessible: [], inaccessible: [] },
    buttons: { accessible: [], inaccessible: [] }
  };

  if (typeof tableOrName === 'string') {
    if (!tableOrName || tableOrName.trim() === '') {
      result.isValid = false;
      result.errors.push('Table name must be a non-empty string');
      return result;
    }

    if (!Array.isArray(expectedColumns)) {
      result.isValid = false;
      result.errors.push('Expected columns must be an array');
      return result;
    }

    if (expectedColumns.length === 0) {
      result.isValid = false;
      result.errors.push('Expected columns must not be empty');
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
  if (!tableOrName.columns || !Array.isArray(tableOrName.columns)) {
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
  
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    if (isButtonAccessible(button)) {
      results.buttons.accessible.push(button);
    } else {
      results.buttons.inaccessible.push(button);
    }
  });
  
  // Use createInPageButton for creating accessible in-page navigation buttons
  const inPageButtons = container.querySelectorAll('.in-page-button');
  inPageButtons.forEach(btn => {
    const accessibleBtn = createInPageButton(btn.textContent, btn.getAttribute('data-target'));
    if (accessibleBtn) {
      btn.parentNode.replaceChild(accessibleBtn, btn);
    }
  });
  
  return results;
}

  // Check for unexpected columns if strict mode is needed
  if (tableOrName.strict && expectedColumns.length > 0) {
    const expectedColumnNames = expectedColumns.map(e =>
      typeof e === 'string' ? e : e.name
    );
    tableColumns.forEach(colName => {
      if (colName && !expectedColumnNames.includes(colName)) {
        result.isValid = false;
        result.errors.push(`Unexpected column found: ${colName}`);
      }
    });
  });
  
  // Use validateLandmarkStructure to validate and fix landmark structure
  const validationResult = validateLandmarkStructure(container);
  if (validationResult && validationResult.issues) {
    results.issues = results.issues.concat(validationResult.issues);
  }
  
  return results;
}

// Function to fix fake link issues with accessible links
function fixFakeLinkIssue() {
  if (typeof document === 'undefined') return null;
  
  const fakeLinks = document.querySelectorAll('a:not([href]), a[href="#"], a[href=""], a[href="javascript:void(0)"]');
  const results = [];
  
  fakeLinks.forEach(link => {
    const isFakeLink = !link.hasAttribute('href') || 
                       link.getAttribute('href') === '#' || 
                       link.getAttribute('href') === '' ||
                       link.getAttribute('href') === 'javascript:void(0)';
    
    if (isFakeLink && link.hasAttribute('onclick')) {
      // Use createAccessibleLink to create an accessible version
      const accessibleLink = createAccessibleLink(link.textContent, link.getAttribute('onclick'));
      if (accessibleLink) {
        link.parentNode.replaceChild(accessibleLink, link);
        results.push({ success: true, element: accessibleLink });
      }
    }
  });
  
  return results;
}

// Function to fix table structure issues with validation
function fixTableStructureIssues() {
  if (typeof document === 'undefined') return null;
  
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach(table => {
    // Use validateTableAccessibility to check accessibility
    const accessibilityResult = validateTableAccessibility(table);
    
    // Use validateTableStructure to check structure
    const structureResult = validateTableStructure(table);
    
    if (!accessibilityResult.isValid || !structureResult.isValid) {
      results.push({
        table,
        accessibilityIssues: accessibilityResult.errors || [],
        structureIssues: structureResult.errors || []
      });
      
      // Apply fixes based on validation results
      if (accessibilityResult.fixes) {
        accessibilityResult.fixes.forEach(fix => {
          if (fix.action === 'addCaption') {
            const caption = document.createElement('caption');
            caption.textContent = fix.text || 'Table';
            table.insertBefore(caption, table.firstChild);
          }
          if (fix.action === 'addSummary') {
            table.setAttribute('summary', fix.text || '');
          }
        });
      }
      
      if (structureResult.fixes) {
        structureResult.fixes.forEach(fix => {
          if (fix.action === 'addScope') {
            const headers = table.querySelectorAll('th');
            headers.forEach(th => {
              if (!th.hasAttribute('scope')) {
                th.setAttribute('scope', 'col');
              }
            });
          }
        });
      }
    }
  });
  
  return results;
}

// Function to render dependency graphs with accessible SVGs
function renderDependencyGraph() {
  if (typeof document === 'undefined') return null;
  
  const svgContainers = document.querySelectorAll('.dependency-graph, .svg-container');
  const results = [];
  
  svgContainers.forEach(container => {
    const svgs = container.querySelectorAll('svg');
    svgs.forEach(svg => {
      // Use getSvgAccessibleName to get or generate accessible name
      const accessibleName = getSvgAccessibleName(svg);
      if (accessibleName) {
        // Check if SVG has a title element
        let title = svg.querySelector('title');
        if (!title) {
          title = document.createElement('title');
          svg.insertBefore(title, svg.firstChild);
        }
        title.textContent = accessibleName;
        
        // Add aria-labelledby reference
        if (!svg.hasAttribute('aria-labelledby')) {
          svg.setAttribute('aria-labelledby', `svg-title-${Math.random().toString(36).substr(2, 9)}`);
          title.id = svg.getAttribute('aria-labelledby');
        }
        
        // Add role="img" if not present
        if (!svg.hasAttribute('role')) {
          svg.setAttribute('role', 'img');
        }
      }
    });
  });
  
  return results;
}

// Function to ensure unique landmarks
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return null;
  
  const roles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  const results = [];
  
  roles.forEach(role => {
    const landmarks = document.querySelectorAll(`[role="${role}"]`);
    if (landmarks.length > 1) {
      // Keep only the first, mark others as redundant
      for (let i = 1; i < landmarks.length; i++) {
        results.push({
          role,
          element: landmarks[i],
          issue: `Duplicate ${role} landmark found`,
          action: 'marked_as_redundant'
        });
        landmarks[i].setAttribute('aria-hidden', 'true');
      }
    }
  });
  
  return results;
}

// Implement checkTableStructure function
function checkTableStructure(tableOrName, expectedColumns = []) {
    const result = {
        isValid: true,
        errors: []
    };

    // Support both call signatures: (tableName, expectedColumns) and (table, expectedColumns)
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

        for (const column of expectedColumns) {
            if (typeof column !== 'string' || column.trim() === '') {
                result.isValid = false;
                result.errors.push('All expected columns must be non-empty strings');
                return result;
            }
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
        const expectedColumnNames = expectedColumns.map(e => typeof e === 'string' ? e : e.name);
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
    const packageJsonPath = path.join(__dirname, 'package.json');
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
  return a * b;
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
  return input * 2;
}

function addMainLandmark() {
  return wrapPrimaryContentInMain();
}

function addSvgAccessibleNames() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
      svg.setAttribute('role', 'img');
    }
  });
}

function ensureUniqueLandmarks() {
  const landmarks = {};
  const roles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  
  roles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        if (index > 0) {
          element.setAttribute('data-landmark-id', `${role}-${index}`);
        }
      });
    }
  });
}

function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]');
  fakeLinks.forEach(link => {
    if (createInPageButton(link)) {
      link.style.display = 'none';
    }
  });
}

function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableStructure(table);
    validateTableAccessibility(table);
  });
}

function setFormElementAccessibleNames() {
  const formElements = document.querySelectorAll('input, select, textarea, button');
  formElements.forEach(element => {
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      const label = element.getAttribute('placeholder') || element.getAttribute('title') || element.getAttribute('id');
      if (label) {
        element.setAttribute('aria-label', label);
      }
    }
  });
}

function setSvgAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', accessibleName);
    }
  });
}

function renderDependencyGraph() {
  const dependencies = countDependencies();
  return renderDependencyGraphs(dependencies);
}

function myNewFunction(input) {
  // Implement the new function here
  return input;
}

// Functions defined in the file
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

// Functions from the HEAD section that are relevant to Screeps bot

/**
 * Validates landmark structure for accessibility.
 * @param {HTMLElement} element - The landmark element to validate
 * @param {string} role - The ARIA role of the landmark
 * @returns {Object} Validation result with isValid flag and issues array
 */
function validateLandmarkElement(role, element) {
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
 * Validates landmark structure elements.
 * @param {Array} elements - Array of landmark elements to validate
 * @returns {Object} Validation results
 */
function validateLandmarkStructure(elements) {
  const results = {
    valid: true,
    landmarks: []
  };
  
  if (!Array.isArray(elements)) {
    return results;
  }
  
  elements.forEach(element => {
    const role = element.getAttribute('role');
    if (role) {
      const checkResult = validateLandmarkElement(role, element);
      results.landmarks.push({
        element,
        role,
        valid: checkResult.valid
      });
      
      if (!checkResult.valid) {
        results.valid = false;
      }
    }
  });
  
  return results;
}

/**
 * Validates landmark accessibility for unique landmark issues.
 * @param {HTMLElement} [container=document] - The container to check
 * @returns {Object} Validation results
 */
function validateLandmarkAccessibility(container = document) {
  const results = {
    valid: true,
    issues: []
  };
  
  if (!container) return results;
  
  const roles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  
  roles.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`);
    
    if (elements.length > 1 && role !== 'main') {
      results.valid = false;
      results.issues.push({
        type: 'non_unique_landmark',
        role: role,
        count: elements.length
      });
    }
    
    elements.forEach(element => {
      const hasLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
      if (!hasLabel && role !== 'main') {
        results.valid = false;
        results.issues.push({
          type: 'missing_label',
          role: role,
          element: element
        });
      }
    });
  });
  
  return results;
}

/**
 * Validates and fixes table accessibility issues.
 * @param {HTMLElement} container - The container to check for tables
 * @returns {Object} Validation results
 */
function validateTableAccessibility(container = document) {
  const results = {
    valid: true,
    tables: []
  };
  
  if (!container) return results;
  
  const tables = container.querySelectorAll('table');
  
  tables.forEach(table => {
    const tableResult = {
      element: table,
      hasCaption: !!table.querySelector('caption'),
      hasHeader: !!table.querySelector('thead'),
      hasScope: !!table.querySelector('[scope="col"], [scope="row"]'),
      valid: true
    };
    
    if (!tableResult.hasCaption) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('aria-label') || 'Table';
      table.insertBefore(caption, table.firstChild);
    }
    
    if (!tableResult.hasHeader) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    
    if (!tableResult.hasScope) {
      const headerCells = table.querySelectorAll('th');
      headerCells.forEach((cell, index) => {
        if (!cell.hasAttribute('scope')) {
          const row = cell.closest('tr');
          if (row) {
            const rowIndex = Array.from(row parentNode.children).indexOf(row);
            if (rowIndex === 0) {
              cell.setAttribute('scope', 'col');
            } else {
              cell.setAttribute('scope', 'row');
            }
          }
        }
      });
    }
    
    tableResult.valid = tableResult.hasCaption && tableResult.hasHeader && tableResult.hasScope;
    if (!tableResult.valid) results.valid = false;
    
    results.tables.push(tableResult);
  });
  
  return results;
}

/**
 * Validates and fixes table structure issues.
 * @param {HTMLElement} container - The container to check for tables
 * @returns {Object} Validation results
 */
function validateTableStructure(container = document) {
  const results = {
    valid: true,
    tables: []
  };
  
  if (!container) return results;
  
  const tables = container.querySelectorAll('table');
  
  tables.forEach(table => {
    const tableResult = {
      element: table,
      hasTbody: !!table.querySelector('tbody'),
      valid: true
    };
    
    if (!tableResult.hasTbody) {
      const tbody = document.createElement('tbody');
      const rows = Array.from(table.querySelectorAll('tr'));
      rows.forEach(row => {
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      tableResult.valid = false;
      results.valid = false;
    }
    
    results.tables.push(tableResult);
  });
  
  return results;
}

/**
 * Gets the full language attribute for the HTML element.
 * @returns {string} The language attribute value
 */
function getFullLangAttribute() {
  return getLangAttribute();
}

/**
 * Sets SVG accessibility attributes.
 * @param {SVGElement} svg - The SVG element to update
 * @param {string} accessibleName - The accessible name for the SVG
 */
function setSvgAttributes(svg, accessibleName) {
  if (!svg || !accessibleName) return;
  
  if (!svg.hasAttribute('aria-label')) {
    svg.setAttribute('aria-label', accessibleName);
  }
  
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  
  const title = svg.querySelector('title');
  if (!title) {
    const newTitle = document.createElement('title');
    newTitle.textContent = accessibleName;
    svg.insertBefore(newTitle, svg.firstChild);
  }
}

/**
 * Adds the lang attribute to the HTML document element.
 */
function addLangAttribute() {
  if (typeof document === 'undefined') return;
  
  const lang = getLangAttribute();
  if (document.documentElement) {
    document.documentElement.setAttribute('lang', lang || 'en');
  }
}

/**
 * Adds a main landmark element for accessibility.
 * @returns {HTMLElement|null} The main element or null if not available
 */
function addMainLandmark() {
  if (typeof document === 'undefined' || !document.body) return null;
  
  let main = document.querySelector('main');
  if (!main) {
    main = document.createElement('main');
    main.setAttribute('role', 'main');
    document.body.insertBefore(main, document.body.firstChild);
  }
  
  return main;
}

/**
 * Ensures unique landmarks by adding aria-label to duplicate landmarks.
 * @param {HTMLElement} [container=document] - The container to check
 * @returns {Object} Results with landmarks fixed
 */
function ensureUniqueLandmarks(container = document) {
  const results = {
    landmarks: [],
    allFixed: true
  };
  
  if (!container) return results;
  
  const roles = ['banner', 'navigation', 'complementary', 'search', 'form', 'application'];
  
  roles.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`);
    
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        if (index > 0) {
          const existingLabel = element.getAttribute('aria-label');
          if (!existingLabel) {
            const computedStyle = window.getComputedStyle(element);
            const position = index + 1;
            let label = `${role.charAt(0).toUpperCase() + role.slice(1)} ${position}`;
            
            if (element.id) {
              label = `${role.charAt(0).toUpperCase() + role.slice(1)} ${element.id}`;
            } else if (element.className) {
              label = `${role.charAt(0).toUpperCase() + role.slice(1)} ${element.className}`;
            }
            
            element.setAttribute('aria-label', label);
          }
        }
        
        results.landmarks.push({
          role,
          element,
          wasDuplicate: index > 0
        });
      });
    }
  });
  
  return results;
}

/**
 * Validates link accessibility.
 * @param {HTMLAnchorElement} link - The link to validate
 * @returns {boolean} True if accessible, false otherwise
 */
function validateLinkAccessibility(link) {
  if (!link) return false;
  
  const hasText = link.textContent && link.textContent.trim().length > 0;
  return hasText || link.hasAttribute('aria-label') || link.hasAttribute('aria-labelledby');
}

/**
 * Handles fake link issues by adding appropriate attributes.
 * @param {HTMLElement} [container=document] - The container to check
 * @returns {Object} Results with fixes applied
 */
function handleFakeLinks(container = document) {
  const results = {
    fixes: 0
  };
  
  if (!container) return results;
  
  const links = container.querySelectorAll('a');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    
    if (href === '#' || href === '' || !href) {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
      link.setAttribute('aria-label', 'Interactive element');
      results.fixes++;
    }
    
    if (!link.hasAttribute('aria-label') && !link.hasAttribute('aria-labelledby')) {
      const text = link.textContent.trim() || link.getAttribute('title') || 'Link';
      link.setAttribute('aria-label', text + ' link');
    }
  });
  
  return results;
}

/**
 * Fixes fake link issues in the document.
 * @returns {Object} Results with fixes applied
 */
function fixFakeLinkIssue() {
  if (typeof document === 'undefined') return { fixed: false };
  
  return handleFakeLinks(document);
}

/**
 * Fixes table structure issues.
 * @returns {Object} Results with fixes applied
 */
function fixTableStructureIssues() {
  if (typeof document === 'undefined') return { fixed: false };
  
  const validation = validateTableStructure(document);
  return { fixed: validation.valid, validation: validation };
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  if (!button) return false;
  
  const hasText = button.textContent && button.textContent.trim().length > 0;
  const hasAriaLabel = button.getAttribute('aria-label');
  const hasAriaLabelledBy = button.getAttribute('aria-labelledby');
  const hasTitle = button.hasAttribute('title');
  const hasIcon = button.querySelector && button.querySelector('img, icon');
  
  return hasText || hasAriaLabel || hasAriaLabelledBy || hasTitle || hasIcon;
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
  
  const links = container.querySelectorAll ? container.querySelectorAll('a') : [];
  links.forEach(link => {
    if (isLinkAccessible(link)) {
      results.links.accessible.push(link);
    } else {
      results.links.inaccessible.push(link);
    }
  });
  
  const buttons = container.querySelectorAll ? container.querySelectorAll('button') : [];
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
 * @returns {Object} Validation result with valid flag and issues array
 */
function checkLandmarkElement(role, element) {
  if (!element || !role) return { valid: false, issues: [] };
  
  const issues = [];
  const hasLabel = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby');
  
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
 * @returns {HTMLElement|null} The main element created or existing
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
        child.getAttribute('data-keep-outside-main') !== 'true') {
      main.appendChild(child);
    }
  });
  
  document.body.appendChild(main);
  return main;
}

/**
 * Checks landmark elements and sets appropriate aria-labels.
 * @param {HTMLElement} [container=document] - The container to check
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
    const elements = container.querySelectorAll ? container.querySelectorAll(`[role="${role}"]`) : [];
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
  const hasAriaLabel = link.getAttribute('aria-label');
  const hasAriaLabelledBy = link.getAttribute('aria-labelledby');
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
 * Creates an accessible in-page button element.
 * This function addresses REACT_015 (lang attribute) and REACT_036 (fake link issues).
 * @param {Object} options - Button configuration options
 * @param {string} options.text - Button text content
 * @param {string} [options.ariaLabel] - Accessible label for screen readers
 * @param {string} [options.type='button'] - Button type (button, submit, reset)
 * @param {Function} [options.onClick] - Click event handler
 * @param {string} [options.id] - Unique identifier for the button
 * @param {string} [options.className] - CSS class name(s)
 * @param {boolean} [options.disabled=false] - Whether the button is disabled
 * @param {Object} [options.attributes] - Additional HTML attributes
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(options = {}) {
  const {
    text = '',
    ariaLabel,
    type = 'button',
    onClick,
    id,
    className,
    disabled = false,
    attributes = {}
  } = options;

  // Create the button element
  const button = document.createElement('button');
  
  // Set button type
  button.setAttribute('type', type);
  
  // Set text content
  if (text) {
    button.textContent = text;
  }
  
  // Set aria-label if provided (for accessibility when no visible text)
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  
  // Set id if provided
  if (id) {
    button.setAttribute('id', id);
  }
  
  // Set class name if provided
  if (className) {
    button.className = className;
  }
  
  // Set disabled state
  if (disabled) {
    button.setAttribute('disabled', 'true');
    button.disabled = true;
  }
  
  // Add additional attributes
  Object.entries(attributes).forEach(([key, value]) => {
    button.setAttribute(key, value);
  });
  
  // Attach click handler if provided
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  // Ensure button has accessible name (text content or aria-label)
  if (!text && !ariaLabel) {
    console.warn('createInPageButton: Button created without accessible name. Provide text or ariaLabel for accessibility.');
  }
  
  return button;
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
    getLangAttribute,
    getFullLangAttribute,
    validateLandmarkStructure,
    createInPageButton,
    createAccessibleLink
};

export { addressAccessibilityIssue038, getSvgAccessibleName, utilityFunction };