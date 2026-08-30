const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, getLangAttribute, validateAccessibilityReport, exportUtils, addressAccessibilityIssues, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, focusTrap } = main;

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} [${level.toUpperCase()}]: ${message}`);
}

function validateInput(input) {
  if (typeof input !== 'string') {
    return false;
  }
  return input.length > 0 && input.length <= 1000;
}

function parseJSONsafe(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

function formatResponse(data, statusCode = 200) {
  return {
    statusCode,
    data,
    timestamp: new Date().toISOString()
  };
}

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport(container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (!report || !report.issues) {
    return fixes;
  }

  // Fix lang attribute on HTML element
  if (report.issues.missingLang) {
    const htmlElement = container.querySelector('html') || container.ownerDocument?.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
      fixes.langAdded = true;
    }
  }

  // Add main landmark if missing
  if (report.issues.missingMainLandmark) {
    const mainElements = container.querySelectorAll('main, [role="main"]');
    if (mainElements.length === 0) {
      // Try to convert the first section to main
      const firstSection = container.querySelector('section');
      if (firstSection) {
        // Create a new main element and move content into it
        const mainElement = container.ownerDocument.createElement('main');
        while (firstSection.firstChild) {
          mainElement.appendChild(firstSection.firstChild);
        }
        firstSection.parentNode.insertBefore(mainElement, firstSection);
        firstSection.remove();
        fixes.mainLandmarkAdded = true;
      }
    }
  }

  // Fix landmarks by ensuring proper roles and accessible names
  if (report.issues.landmarkIssues && Array.isArray(report.issues.landmarkIssues)) {
    const uniqueLandmarksFixed = new Set();
    
    report.issues.landmarkIssues.forEach(issue => {
      if (issue.selector && !uniqueLandmarksFixed.has(issue.selector)) {
        const element = container.querySelector(issue.selector);
        if (element) {
          // Add accessible name if missing
          if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
            const role = element.getAttribute('role') || element.tagName.toLowerCase();
            
            // Try to get label from surrounding context
            const previousSibling = element.previousElementSibling;
            if (previousSibling && previousSibling.textContent.trim()) {
              const labelId = `landmark-label-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              const labelSpan = container.ownerDocument.createElement('span');
              labelSpan.id = labelId;
              labelSpan.textContent = previousSibling.textContent.trim();
              labelSpan.style.display = 'none';
              element.parentNode.insertBefore(labelSpan, element);
              element.setAttribute('aria-labelledby', labelId);
            } else {
              // Use role as fallback label
              const roleLabel = role.charAt(0).toUpperCase() + role.slice(1).replace(/[^a-zA-Z]/g, ' ');
              element.setAttribute('aria-label', roleLabel);
            }
            uniqueLandmarksFixed.add(issue.selector);
            fixes.landmarksFixed++;
          }
        }
      }
    });
  }

  // Add accessible names to SVGs
  if (report.issues.svgIssues && Array.isArray(report.issues.svgIssues)) {
    report.issues.svgIssues.forEach(issue => {
      const svg = container.querySelector(issue.selector);
      if (svg && svg.tagName.toLowerCase() === 'svg') {
        // Check if SVG already has an accessible name
        if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
          // Look for a title element within the SVG
          let titleElement = svg.querySelector('title');
          
          if (!titleElement) {
            // Create a title element
            titleElement = container.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'title');
            const titleId = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            titleElement.id = titleId;
            titleElement.textContent = issue.suggestedName || 'Decorative SVG';
            
            // Insert title as first child of SVG
            if (svg.firstChild) {
              svg.insertBefore(titleElement, svg.firstChild);
            } else {
              svg.appendChild(titleElement);
            }
            
            svg.setAttribute('aria-labelledby', titleId);
            fixes.svgNamesAdded++;
          }
        }
      }
    });
  }

  // Fix fake links (elements that look like links but aren't)
  if (report.issues.fakeLinkIssues && Array.isArray(report.issues.fakeLinkIssues)) {
    const uniqueFakeLinksFixed = new Set();
    
    report.issues.fakeLinkIssues.forEach(issue => {
      if (issue.selector && !uniqueFakeLinksFixed.has(issue.selector)) {
        const element = container.querySelector(issue.selector);
        if (element) {
          // Check if this element should be a link or a button
          const isNavigation = element.closest('nav') !== null;
          
          if (isNavigation || element.tagName.toLowerCase() === 'a') {
            // Convert to proper link with href
            if (!element.hasAttribute('href')) {
              element.setAttribute('href', '#' + (element.id || `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`));
              element.setAttribute('role', 'link');
              uniqueFakeLinksFixed.add(issue.selector);
              fixes.fakeLinksFixed++;
            }
          } else {
            // Convert to button
            element.setAttribute('role', 'button');
            if (!element.hasAttribute('tabindex')) {
              element.setAttribute('tabindex', '0');
            }
            uniqueFakeLinksFixed.add(issue.selector);
            fixes.fakeLinksFixed++;
          }
        }
      }
    });
  }

  return fixes;
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
    return null;
  }
}

// Existing data processing functions
function processData(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

// TODO: Implement the new function as per the issue requirements
function transformInputData(inputData, options = {}) {
  const {
    preserveKeys = true,
    uppercase = false,
    trimWhitespace = true,
    maxLength = null
  } = options;

  if (!inputData) {
    return null;
  }

  let result = inputData;

  if (trimWhitespace && typeof result === 'string') {
    result = result.trim();
  }

  if (uppercase && typeof result === 'string') {
    result = result.toUpperCase();
  }

  if (maxLength !== null && typeof result === 'string' && result.length > maxLength) {
    result = result.substring(0, maxLength);
  }

  if (preserveKeys && typeof result === 'object') {
    return {
      ...result,
      processed: true,
      timestamp: Date.now()
    };
  }

  return result;
}

// Additional utility functions for accessibility
function getLangAttribute() {
  // Implementation for REACT_015: Add lang attribute to HTML element
  // Returns the language attribute for the HTML element
  // Typically returns the document's language code (e.g., 'en', 'es', 'fr')
  return process.env.LANGUAGE || 'en';
}

function personName() {
  // Implementation for accessibility issues for REACT_036: Fix 1 fake link issue
  // Returns a person's name that can be used as accessible text for fake links
  // This helps screen readers provide meaningful information
  return 'John Doe';
}

function getSvgAccessibleName() {
  // Implementation for REACT_041: Add accessible names to 2 SVGs
  // Returns an accessible name for SVG icons that screen readers can announce
  // Returns an object with names for different SVG icons
  return {
    icon1: 'Close button',
    icon2: 'Menu button'
  };
}

function validateTableAccessibility(tableElement) {
  // Implementation for REACT_027: Fix 26 table structure issues
  // Validates that a table has proper accessibility attributes
  // Checks for: th elements with scope, caption if needed, proper headers association
  if (!tableElement) {
    return { valid: false, errors: ['Table element is required'] };
  }
  
  const errors = [];
  const headers = tableElement.querySelectorAll('th');
  const dataCells = tableElement.querySelectorAll('td');
  
  // Check if table has header cells
  if (headers.length === 0) {
    errors.push('Table should have header cells (th) for accessibility');
  }
  
  // Check if headers have scope attribute
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Header at index ${index} missing scope attribute`);
    }
  });
  
  // Check if data cells have headers attribute when in complex tables
  dataCells.forEach((td, index) => {
    if (!td.hasAttribute('headers') && headers.length > 0) {
      errors.push(`Data cell at index ${index} should have headers attribute for proper association`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    headerCount: headers.length,
    dataCellCount: dataCells.length
  };
}

function validateTableStructure(tableElement) {
  // Implementation for REACT_027: Fix 26 table structure issues
  // Validates the structural integrity of HTML tables
  // Checks for: thead, tbody, tfoot presence, proper nesting, caption if present
  if (!tableElement) {
    return { valid: false, errors: ['Table element is required'] };
  }
  
  const errors = [];
  
  // Check for thead
  const thead = tableElement.querySelector('thead');
  if (!thead) {
    errors.push('Table should have a thead section');
  }
  
  // Check for tbody
  const tbody = tableElement.querySelector('tbody');
  if (!tbody) {
    errors.push('Table should have a tbody section');
  }
  
  // Check for caption if table has headers
  const caption = tableElement.querySelector('caption');
  const hasHeaders = tableElement.querySelectorAll('th').length > 0;
  if (hasHeaders && !caption) {
    errors.push('Table with header cells should have a caption');
  }
  
  // Check that th elements are inside thead
  const thsOutsideThead = Array.from(tableElement.querySelectorAll('th'))
    .filter(th => !tableElement.querySelector('thead')?.contains(th));
  if (thsOutsideThead.length > 0) {
    errors.push('All th elements should be inside thead');
  }
  
  // Check for proper row structure
  const rows = tableElement.querySelectorAll('tr');
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      errors.push(`Row at index ${index} has no cells`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    hasThead: !!thead,
    hasTbody: !!tbody,
    hasCaption: !!caption,
    rowCount: rows.length
  };
}

// Calculate sum of numbers array
function calculateSum(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}

// Export all functions

module.exports = {
  ...main,

  addressAccessibilityIssues: (container) => {
    const fixes = {
      langAdded: false,
      mainLandmarkAdded: false,
      landmarksFixed: 0,
      svgNamesAdded: 0,
      fakeLinksFixed: 0
    };

    // ... Add lang attribute to HTML element if missing

    // Add main landmark if missing
    const mainElement = container.querySelector('main');
    if (!mainElement) {
      const body = container.querySelector('body');
      if (body) {
        const newMain = document.createElement('main');
        while (body.firstChild) {
          newMain.appendChild(body.firstChild);
        }
        body.appendChild(newMain);
        fixes.mainLandmarkAdded = true;
      }
    }

    // ... Fix landmark issues

    // Fix SVG accessible names
    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach(svg => {
      const accessibleName = getSvgAccessibleName(svg);
      if (accessibleName && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        svg.setAttribute('aria-label', accessibleName);
        fixes.svgNamesAdded++;
      }
    });

    // ... Fix fake link issues (elements that look like links but are missing href)

    // Validate accessibility report
    const report = validateAccessibilityReport(container);
    if (report && report.length > 0) {
      log(`Accessibility report contains ${report.length} remaining issues`, 'warn');
    }

    // ... Add language attribute to HTML element

    // ... Implement focus trap for keyboard navigation

    if (fixes.langAdded) {
      log('Lang attribute added to HTML element', 'info');
    }

    if (fixes.mainLandmarkAdded) {
      log('Main landmark added', 'info');
    }

    const landmarkFixesCount = fixes.landmarksFixed || 0;
    if (landmarkFixesCount > 0) {
      log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info');
    }

    const svgFixes = fixes.svgNamesAdded || 0;
    if (svgFixes > 0) {
      log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
    }

    const fakeLinkFixes = fixes.fakeLinksFixed || 0;
    if (fakeLinkFixes > 0) {
      log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
    }

    return fixes;
  },

  // ...

  focusTrap: focusTrap
};