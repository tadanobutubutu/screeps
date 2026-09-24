// main.js - Accessibility Checker Module
// TODO: Implement the feature

  function trapFocus() {
    focusableElements = element.querySelectorAll('a, button, input, textarea, select');
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (document.activeElement === lastFocusableElement && !document.activeElement.shiftKey) {
      firstFocusableElement.focus();
    } else if (document.activeElement === firstFocusableElement && document.activeElement.shiftKey) {
      lastFocusableElement.focus();
    }
  }

  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      trapFocus();
    }
  });

  // Initialize the focus trap
  trapFocus();
}

// TODO: This is the existing code that needs to be preserved
// ...
/**
 * Checks accessibility of links and buttons within a given container
 * @param {HTMLElement} container - The container element to check for accessibility issues
 * @returns {Array} - Array of accessibility issues found
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Create an accessible in-page button
 * @param {Object} options - Button options
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(options = {}) {
  const button = document.createElement('button');
  button.textContent = options.text || 'Button';
  button.setAttribute('aria-label', options.ariaLabel || options.text || 'In-page button');
  if (options.lang) {
    button.setAttribute('lang', options.lang);
  }
  return button;
}

/**
 * Validate table accessibility
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Validation result
 */
function validateTableAccessibility(table) {
  // ...
}

/**
 * Validate table structure
 * @param {HTMLTableElement} table - The table to validate
 * @returns {Object} Validation result
 */
function validateTableStructure(table) {
  // ...
}

/**
 * Validate landmark accessibility
 * @param {Document} doc - The document to validate
 * @returns {Object} Validation result
 */
function validateLandmark(doc) {
  // ...
}

/**
 * Validates table structure for proper scope attributes on header cells
 * @param {HTMLElement} container - The container element to check for table structure issues
 * @returns {Array} - Array of accessibility issues found
 */
function validateTableStructure(container) {
  const issues = [];
  
  if (!container) {
    container = document;
  }
  
  const tables = container.querySelectorAll('table');
  
  tables.forEach((table, tableIndex) => {
    const rows = table.querySelectorAll('tr');
    
    rows.forEach((row, rowIndex) => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      
      cells.forEach((cell, cellIndex) => {
        // Only check <th> elements
        if (cell.tagName.toLowerCase() !== 'th') return;
        
        const scope = cell.getAttribute('scope');
        
        // Determine expected scope based on cell position
        // First row typically has column headers (scope="col")
        // First column typically has row headers (scope="row")
        const isFirstRow = rowIndex === 0;
        const isFirstColumn = cellIndex === 0;
        
        // If it's a header cell and doesn't have a valid scope attribute
        if (!scope) {
          issues.push({
            type: 'table-structure',
            tableIndex,
            rowIndex,
            cellIndex,
            element: cell,
            message: 'Table header is missing scope attribute. Add scope="col" or scope="row" so cells map to their headers.'
          });
        } else if (scope !== 'col' && scope !== 'row') {
          // Check if scope has valid value
          issues.push({
            type: 'table-structure',
            tableIndex,
            rowIndex,
            cellIndex,
            element: cell,
            message: `Table header has invalid scope value "${scope}". Use scope="col" for column headers or scope="row" for row headers.`
          });
        }
      });
    });
  });
  
  return issues;
}

/**
 * Validates table accessibility including scope attributes
 * @param {HTMLElement} container - The container element to check for table accessibility issues
 * @returns {Array} - Array of accessibility issues found
 */
function validateTableAccessibility(container) {
  const issues = [];
  
  if (!container) {
    container = document;
  }
  
  // Check table structure
  const structureIssues = validateTableStructure(container);
  issues.push(...structureIssues);
  
  return issues;
}

/**
 * Renders a graph visualization for accessibility issues
 * @param {Array} issues - Array of accessibility issues to render
 * @param {HTMLElement} container - The container element to render the graph into
 */
function validateLandmarkStructure(doc) {
  // ...
}

/**
 * Ensure unique landmarks in the document
 * @param {Document} doc - The document to process
 * @returns {Object} Processing result
 */
function ensureUniqueLandmarks(doc) {
  // ...
}

/**
 * Renders an index of accessibility issues
 * @param {Array} issues - Array of accessibility issues to render
 * @param {HTMLElement} container - The container element to render the index into
 */
function renderAccessibilityIndex(issues, container) {
  if (!container || !issues || issues.length === 0) {
    return;
  }

  const indexContainer = document.createElement('div');
  indexContainer.className = 'accessibility-index';
  
  const groupedIssues = {};
  issues.forEach((issue, index) => {
    if (!groupedIssues[issue.type]) {
      groupedIssues[issue.type] = [];
    }
    groupedIssues[issue.type].push({ ...issue, originalIndex: index });
  });

  let indexHTML = '<h3>Accessibility Issues Index</h3><ul class="index-list">';
  
  Object.keys(groupedIssues).forEach(type => {
    indexHTML += `<li class="index-type"><strong>${type}s</strong> (${groupedIssues[type].length})`;
    indexHTML += '<ul class="index-sublist">';
    groupedIssues[type].forEach(item => {
      indexHTML += `<li data-original-index="${item.originalIndex}">${item.message}</li>`;
    });
    indexHTML += '</ul></li>';
  });
  
  indexHTML += '</ul>';
  indexContainer.innerHTML = indexHTML;
  
  container.appendChild(indexContainer);
}

/**
 * Renders both graph and index for accessibility issues
 * @param {HTMLElement} container - The container element to check for accessibility issues
 * @param {HTMLElement} outputContainer - The container element to render results into
 */
function renderAccessibilityResults(container, outputContainer) {
  const issues = checkLinkAndButtonAccessibility(container);
  
  if (outputContainer) {
    renderAccessibilityGraph(issues, outputContainer);
    renderAccessibilityIndex(issues, outputContainer);
  }
  
  return issues;
}

/**
 * Renders the index view of the application
 */
function renderIndexView() {
  // Placeholder for the index view rendering logic
  // This could involve creating elements, setting text content, and appending them to the DOM
  // For the purpose of this example, we'll just log a message
  console.log('Index view rendered');
}

/**
 * Gets recommendation for specific accessibility issue type
 * @param {string} issueType - Type of accessibility issue
 * @returns {string} - Recommendation for fixing the issue
 */
function getRecommendation(issueType) {
  const recommendations = {
    'missing-alt-text': 'Add descriptive alt text to images for screen readers',
    'missing-aria-label': 'Add ARIA labels to interactive elements',
    'low-contrast': 'Increase color contrast ratio to at least 4.5:1',
    'missing-heading': 'Add proper heading hierarchy for screen reader navigation',
    'missing-form-label': 'Add label elements to form inputs',
    'missing-link-text': 'Use descriptive link text instead of "click here"',
    'missing-lang-attribute': 'Add lang attribute to HTML element',
    'missing-title': 'Add a descriptive title element',
    'table-structure': 'Add scope attribute to table headers: use scope="col" for column headers or scope="row" for row headers'
  };
  return recommendations[issueType] || 'Review and fix accessibility issue manually';
}

/**
 * New function to fix the React SVG Accessible Name issue
 * @param {string} svgString - The SVG string to fix
 * @returns {string} - SVG string with accessible name added
 */
function fixSVGAccessibleName(svgString) {
  // Check if the SVG string already contains an accessible name
  if (svgString.includes('aria-label') || svgString.includes('aria-labelledby') || svgString.includes('title')) {
    return svgString;
  }

  // Create a temporary SVG element to parse the SVG string
  const tempSVG = document.implementation.createHTMLDocument();
  tempSVG.body.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${svgString}</svg>`;
  const svgRoot = tempSVG.querySelector('svg');

  // Check if the SVG is decorative and does not need an accessible name
  const parentElement = svgRoot.parentElement;
  const isDecorative = parentElement && (
    parentElement.tagName === 'button' || 
    parentElement.tagName === 'input' || 
    parentElement.tagName === 'textarea' || 
    parentElement.tagName === 'select' ||
    (parentElement.tagName === 'audio' && parentElement.hasAttribute('controls')) ||
    (parentElement.tagName === 'video' && parentElement.hasAttribute('controls'))
  );
  
  if (isDecorative) {
    return svgString.replace('<svg', '<svg aria-hidden="true"');
  }

  // Add an aria-label to the SVG if it's not decorative
  const svgWithAriaLabel = svgString.replace('<svg', '<svg aria-label="SVG description"');
  return svgWithAriaLabel;
}

/**
 * Generates a summary of addressed accessibility issues
 * @param {Array} addressedIssues - Array of addressed issues
 * @returns {string} - Summary text
 */
function generateSummary(addressedIssues) {
  const total = addressedIssues.length;
  const critical = addressedIssues.filter(i => i.severity === 'critical').length;
  const moderate = addressedIssues.filter(i => i.severity === 'moderate').length;
  const low = addressedIssues.filter(i => i.severity === 'low').length;

  return `Addressed ${total} accessibility issues: ${critical} critical, ${moderate} moderate, ${low} low priority.`;
}

const {
  getLangAttribute,
  getFullLangAttribute,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibility-helpers');

const { class1, function1, Object1 } = require('./components');

const version = "1.0.0";

const a11yStore = {
  init() {
    this.initLangAttribute();
    this.setupSkipLinks();
    this.ensureUniqueLandmarks();
    this.fixFakeLinks();
    this.initAccessibility();
  },

  createAccessibleButton(id, label, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.setAttribute('aria-label', label);
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  },

  createAccessibleDialog(id, title, content, closeLabel = 'Close') {
    const dialog = document.createElement('div');
    dialog.id = id;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', `${id}-title`);
    dialog.setAttribute('aria-modal', 'true');
    
    const titleEl = document.createElement('h2');
    titleEl.id = `${id}-title`;
    titleEl.textContent = title;
    
    const closeButton = this.createAccessibleButton(`${id}-close`, closeLabel, () => {
      dialog.hidden = true;
      dialog.setAttribute('aria-hidden', 'true');
    });
    
    dialog.appendChild(titleEl);
    dialog.appendChild(closeButton);
    dialog.appendChild(content);
    
    return dialog;
  },

  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },
};

function getSVGAccessibleName(svgElement) {
  const title = svgElement.querySelector('title');
  const desc = svgElement.querySelector('desc');
  
  if (title && title.textContent) {
    return title.textContent.trim();
  }
  
  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }
  
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }
  
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labeledElement = document.getElementById(ariaLabelledby);
    if (labeledElement && labeledElement.textContent) {
      return labeledElement.textContent.trim();
    }
  }
  
  return 'SVG graphic';
}

function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach(issue => {
    switch (issue.type) {
      case 'missing-lang':
        if (issue.element) {
          issue.element.setAttribute('lang', 'en');
        }
        break;
      case 'missing-skip-link':
        if (issue.element) {
          const skipLink = document.createElement('a');
          skipLink.className = 'skip-link';
          skipLink.href = '#main-content';
          skipLink.textContent = 'Skip to main content';
          skipLink.setAttribute('aria-label', 'Skip to main content');
          document.body.insertBefore(skipLink, document.body.firstChild);
        }
        break;
      case 'missing-alt':
        document.querySelectorAll('img').forEach(img => {
          if (!img.getAttribute('alt')) {
            img.setAttribute('alt', 'Image description');
          }
        });
        break;
      case 'missing-label':
        document.querySelectorAll('input, select, textarea').forEach(el => {
          if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
            el.setAttribute('aria-label', 'Form field');
          }
        });
        break;
      case 'table-structure':
        if (issue.element) {
          // Fix table headers by adding appropriate scope attribute
          const scope = issue.element.getAttribute('scope');
          if (!scope) {
            // Try to determine if it's a row or column header
            const row = issue.element.closest('tr');
            const cellIndex = Array.from(row.children).indexOf(issue.element);
            if (cellIndex === 0) {
              issue.element.setAttribute('scope', 'row');
            } else {
              issue.element.setAttribute('scope', 'col');
            }
          }
        }
        break;
    }
  });
}

const mainElement = document.querySelector('main') || wrapPrimaryContentInMain();
console.log('Main element lang:', document.documentElement.lang);

if (!document.documentElement.lang) {
  document.documentElement.lang = 'en';
}

/**
 * Ensures all landmarks have unique IDs to meet accessibility requirements
 * @returns {Set<string>} - Set of IDs found in landmark elements
 */
function setSvgAttributes(svg, accessibleName) {
  // ...
}

/**
 * Validate link accessibility
 * @param {HTMLAnchorElement} link - The link to validate
 * @returns {Object} Validation result
 */
function validateLinkAccessibility(link) {
  // ...
}

/**
 * Handle fake links (elements with click handlers but no href)
 * @param {Document} doc - The document to process
 * @returns {Object} Processing result
 */
function handleFakeLinks(doc) {
  // ...
}

/**
 * Create an accessible link element
 * @param {Object} options - Link options
 * @returns {HTMLAnchorElement} The created accessible link element
 */
function createAccessibleLink(options = {}) {
  const link = document.createElement('a');
  link.href = options.href || '#';
  link.textContent = options.text || 'Link';
  
  // Add accessibility attributes
  if (options.ariaLabel) {
    link.setAttribute('aria-label', options.ariaLabel);
  } else if (options.text) {
    link.setAttribute('aria-label', options.text);
  }
  
  // Make it focusable if not already
  if (!link.hasAttribute('tabindex') && !link.hasAttribute('role')) {
    link.setAttribute('tabindex', '0');
  }
  
  return link;
}

/**
 * Handle accessibility issues in the document
 * @param {Document} doc - The document to process
 * @returns {Object} Processing result
 */
function handleAccessibilityIssues(doc) {
  const issues = [];
  
  // Check for fake links (links without href)
  const fakeLinks = doc.querySelectorAll('[onclick], [role="button"]');
  fakeLinks.forEach(element => {
    if (element.tagName !== 'A' && element.tagName !== 'BUTTON') {
      issues.push(`${element.id || element.name}: Fake link (no href)`);
    }
  });
  
  // Apply fixes for fake links
  fakeLinks.forEach(element => {
    if (element.tagName !== 'A' && element.tagName !== 'BUTTON') {
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
    }
  });
  
  return { issues };
}

// Example usage and export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    checkLinkAndButtonAccessibility,
    checkLangAttribute,
    checkImageAltAccessibility,
    checkFormLabelAccessibility,
    checkAccessibility,
    validateTableStructure,
    validateTableAccessibility,
    renderAccessibilityGraph,
    renderAccessibilityIndex,
    renderAccessibilityResults,
    renderIndexView,
    getRecommendation,
    fixSVGAccessibleName,
    generateSummary,
    getSVGAccessibleName,
    addressAccessibilityIssues,
    ensureUniqueLandmarks,
    wrapPrimaryContentInMain,
    a11yStore,
    DEFAULT_CONFIG,
    version
  };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.checkLinkAndButtonAccessibility = checkLinkAndButtonAccessibility;
  window.checkLangAttribute = checkLangAttribute;
  window.checkImageAltAccessibility = checkImageAltAccessibility;
  window.checkFormLabelAccessibility = checkFormLabelAccessibility;
  window.checkAccessibility = checkAccessibility;
  window.validateTableStructure = validateTableStructure;
  window.validateTableAccessibility = validateTableAccessibility;
  window.renderAccessibilityGraph = renderAccessibilityGraph;
  window.renderAccessibilityIndex = renderAccessibilityIndex;
  window.renderAccessibilityResults = renderAccessibilityResults;
  window.renderIndexView = renderIndexView;
  window.getRecommendation = getRecommendation;
  window.fixSVGAccessibleName = fixSVGAccessibleName;
  window.generateSummary = generateSummary;
  window.getSVGAccessibleName = getSVGAccessibleName;
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.ensureUniqueLandmarks = ensureUniqueLandmarks;
  window.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
  window.a11yStore = a11yStore;
  window.DEFAULT_CONFIG = DEFAULT_CONFIG;
  window.version = version;
}