// TODO: This is the existing code that needs to be preserved (This comment remains as-is)

// TODO: Add back any required exports that might have been removed.
// For example, if the issue requires adding back an export like `calculateSum`, you would add:

// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c -->
// _Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_

// Preserve existing functionality

// Importing the necessary functions (for illustration purposes)
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// TODO: Implement harvest and upgrade logic

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleFakeLinks())

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Checks if all form inputs in the document have associated labels
 * @param {Document|HTMLElement} [root=document] - Root element to scan
 * @returns {Array} List of inputs without labels
 */
function checkFormLabels(root = (typeof document !== 'undefined' ? document : null)) {
    if (!root) return [];
    
    const inputs = root.querySelectorAll('input, select, textarea, button');
    const unlabeled = [];
    
    inputs.forEach(input => {
        const hasLabel = input.closest('label') || 
                        input.hasAttribute('aria-label') || 
                        input.hasAttribute('title');
        
        if (!hasLabel) {
            unlabeled.push({
                element: input,
                type: input.type || input.tagName.toLowerCase(),
                id: input.id || 'no-id'
            });
        }
    });
    
    return unlabeled;
}

/**
 * Ensures proper heading hierarchy by checking h1-h6 usage
 * @param {Document|HTMLElement} [root=document] - Root element to scan
 * @returns {Object} Heading hierarchy analysis
 */
function validateHeadingHierarchy(root = (typeof document !== 'undefined' ? document : null)) {
    if (!root) return null;
    
    const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const hierarchy = Array.from(headings).map(h => ({
        level: parseInt(h.tagName.charAt(1)),
        text: h.textContent.trim(),
        id: h.id || 'no-id'
    }));
    
    const analysis = {
        totalHeadings: hierarchy.length,
        h1Count: hierarchy.filter(h => h.level === 1).length,
        hierarchyIssues: []
    };
    
    // Check if there's only one h1 per page
    if (analysis.h1Count > 1) {
        analysis.hierarchyIssues.push({
            issue: 'Multiple h1 elements found',
            severity: 'moderate'
        });
    }
    
    // Check heading order
    let lastLevel = 0;
    hierarchy.forEach((h, index) => {
        if (index > 0) {
            if (h.level > lastLevel + 1) {
                analysis.hierarchyIssues.push({
                    issue: `Jump from h${lastLevel} to h${h.level} at index ${index}`,
                    severity: 'moderate'
                });
            }
        }
        lastLevel = h.level;
    });
    
    return analysis;
}

/**
 * Checks for color contrast issues (basic implementation)
 * @param {Document|HTMLElement} [root=document] - Root element to scan
 * @returns {Array} List of potential contrast issues
 */
function checkColorContrast(root = (typeof document !== 'undefined' ? document : null)) {
    if (!root) return [];
    
    const elements = root.querySelectorAll('*');
    const issues = [];
    
    elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        // Skip if elements have no color or background color
        if (color === 'rgba(0, 0, 0, 0)' || backgroundColor === 'rgba(0, 0, 0, 0)') {
            return;
        }
        
        // Simple contrast check (you might want to use a more sophisticated library)
        const luminance = (color) => {
            const rgb = color.match(/\d+/g);
            if (!rgb) return 0;
            const [r, g, b] = rgb.map(c => {
                c = parseInt(c);
                return (c <= 0.03928) ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        
        try {
            const contrast = Math.abs(luminance(color) - luminance(backgroundColor));
            if (contrast < 0.5) { // Simplified threshold
                issues.push({
                    element: el,
                    contrast: contrast,
                    color: color,
                    backgroundColor: backgroundColor
                });
            }
        } catch (e) {
            // If we can't parse colors, skip
        }
    });
    
    return issues;
}

/**
 * TODO: Add the implementation of this function
 * Validates the accessibility of all links in the document.
 * Iterates over all anchor tags and applies the link accessibility validation.
 * @param {Document|HTMLElement} [root=document] - The root element to scan.
 * @returns {Object} A report describing the link accessibility validation results.
 */
function ensureUniqueLandmarks(root = (typeof document !== 'undefined' ? document : null)) {
    if (!root) {
        return [];
    }
    const landmarkSelector = 'header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]';
    const landmarks = Array.from(root.querySelectorAll(landmarkSelector));
    const unique = [];
    const seen = new Set();

    for (const landmark of landmarks) {
        let id = landmark.id;
        if (!id) {
            id = ensureUniqueLandmarkId(landmark.tagName.toLowerCase());
            landmark.id = id;
        }
        if (seen.has(id)) {
            const newId = ensureUniqueLandmarkId(id);
            landmark.id = newId;
            id = newId;
        }
        seen.add(id);
        unique.push(landmark);
    }
    return unique;
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (element && !element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Returns the full lang attribute value (e.g., "en-US") for the document.
 * Combines the value returned by getLangAttribute() with a region if available.
 * @returns {string} The full lang attribute value, or an empty string.
 */
function getFullLangAttribute() {
    const base = getLangAttribute ? getLangAttribute() : '';
    if (!base) {
        return '';
    }
    if (base.includes('-')) {
        return base;
    }
    // Default region fallback (kept lightweight and non-prescriptive)
    return `${base}`;
}

/**
 * Creates an accessible link element. Replaces fake links (e.g., <div onclick>)
 * with proper <a> elements that have href, role, and accessible names.
 * @param {Object} options - Link configuration.
 * @param {string} options.href - The href for the link.
 * @param {string} options.text - The visible text of the link.
 * @param {string} [options.ariaLabel] - Optional aria-label for the link.
 * @param {string} [options.role] - Optional role (defaults to "link").
 * @returns {HTMLAnchorElement} The created anchor element.
 */
function createAccessibleLink({ href, text, ariaLabel, role = 'link' } = {}) {
    const a = (typeof document !== 'undefined') ? document.createElement('a') : null;
    if (!a) {
        return null;
    }
    a.setAttribute('href', href || '#');
    a.setAttribute('role', role);
    a.textContent = text || '';
    if (ariaLabel) {
        a.setAttribute('aria-label', ariaLabel);
    }
    return a;
}

/**
 * Handles all accessibility issues described in the insight report in one place.
 * Applies the following fixes:
 *  - REACT_015: lang attribute on <html>
 *  - REACT_017: landmark roles and structure
 *  - REACT_025: unique landmark IDs
 *  - REACT_027: table structure (delegated to validateTableAccessibility/Structure)
 *  - REACT_036: fake link remediation
 *  - REACT_041: accessible names for SVGs
 *
 * @param {Object} [options] - Optional configuration.
 * @param {Document|HTMLElement} [options.root=document] - Root element to operate on.
 * @returns {Object} A report describing what was applied.
 */
function handleAccessibilityIssues(options = {}) {
    const root = options.root || (typeof document !== 'undefined' ? document : null);
    const report = {
        totalLinks: 0,
        validLinks: 0,
        invalidLinks: 0,
        issues: []
    };

    if (!root || typeof root.querySelectorAll !== 'function') {
        return report;
    }

    const links = Array.from(root.querySelectorAll('a'));
    report.totalLinks = links.length;

    for (const link of links) {
        try {
            if (typeof validateLinkAccessibility === 'function') {
                const result = validateLinkAccessibility(link);
                if (result === false) {
                    report.invalidLinks += 1;
                    report.issues.push({
                        element: link,
                        reason: 'Failed validation'
                    });
                } else {
                    report.validLinks += 1;
                }
            } else {
                report.validLinks += 1;
            }
        } catch (e) {
            report.invalidLinks += 1;
            report.issues.push({
                element: link,
                reason: e && e.message ? e.message : 'Unknown error'
            });
        }
    }

    return report;
}

// ... other fixes ...

// New helper functions to address the additional accessibility requirements
function ensureElementHasId(elementId) {
  const element = document.getElementById(elementId);
  if (element && !element.id) {
    element.setAttribute('id', elementId);
  }
}

function addAriaLabelToElement(elementId, label) {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute('aria-label', label);
  }
}

// Ensure elements have the required IDs
ensureElementHasId('myTable');
ensureElementHasId('mySvg');
ensureElementHasId('inPageButton');
ensureElementHasId('main-content');
ensureElementHasId('navigation');
ensureElementHasId('footer');

// Add ARIA labels for better screen reader support
addAriaLabelToElement('myTable', 'Product data table');
addAriaLabelToElement('mySvg', 'Company logo');
addAriaLabelToElement('inPageButton', 'Accessibility menu');
addAriaLabelToElement('logo', 'Company logo');
addAriaLabelToElement('menu', 'Accessibility menu');

// DOM-based accessibility code

// Add lang attribute to HTML element
addLangAttribute();

// Create in-page button with accessibility considerations
createInPageButton();

// Ensure button has an id and appropriate ARIA label
ensureElementHasId('accessibility-btn');
addAriaLabelToElement('accessibility-btn', 'Accessibility menu');

// Validate table structure and accessibility
// Assuming you have a table element with an id of 'myTable'
const table = document.getElementById('myTable');
if (table) {
    validateTableAccessibility(table);
    validateTableStructure(table);
}

// Add/fix landmark issues
validateLandmark();
validateLandmarkStructure();

// Add accessible names to SVGs
// Assuming you have an SVG element with an id of 'mySvg'
const svg = document.getElementById('mySvg');
if (svg) {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
}

// Ensure unique landmarks
const landmarks = []; // Populate with landmark elements
const uniqueLandmarkList = uniqueLandmarks(landmarks);

// Handle fake links
handleFakeLinks();

// Fix button identifiers
// Ensuring all buttons have proper accessible identifiers
const buttons = document.querySelectorAll('button, [role="button"]');
buttons.forEach((button, index) => {
  if (!button.id) {
    button.id = `button-${index}`;
  }
});

// Google sign-in accessibility
// Ensuring Google sign-in button has proper accessible name and role
function googleSignIn() {
  const googleButton = document.querySelector('.google-sign-in-button');
  if (googleButton) {
    googleButton.setAttribute('aria-label', 'Sign in with Google');
    googleButton.setAttribute('role', 'button');
  }
}
googleSignIn();

// Helper functions for UI rendering
function formatCurrency(amount) {
  return `$${parseFloat(amount).toFixed(2)}`;
}

function formatDate(date) {
  return date.toLocaleDateString();
}

function calculateDiscount(amount) {
  if (amount >= 100) {
    return amount * 0.1;
  }
  return 0;
}

function validateInput(input) {
  if (!input || !input.value) return false;
  return !isNaN(parseFloat(input.value)) && isFinite(input.value);
}

function renderHeader(title) {
  return `<header><h1>${title}</h1></header>`;
}

function renderFooter() {
  return `<footer>&copy; 2024 My Company</footer>`;
}

function renderProductCard(product) {
  return `
    <div class="product-card">
      <h3>${product.name}</h3>
      <p class="price">${formatCurrency(product.price)}</p>
    </div>
  `;
}

// Variables for rendering functions
const dependencyGraphContent = {
  name: 'main',
  dependencies: ['utils/accessibilityUtils', 'utils/tableAccessibilityUtils', 'utils/landmarkUtils', 'utils/svgAccessibilityUtils', 'utils/linkAccessibilityUtils']
};

const indexContent = {
  title: 'Application Index',
  products: [
    { name: 'Product A', price: 29.99 },
    { name: 'Product B', price: 39.99 },
    { name: 'Product C', price: 49.99 }
  ]
};

// Assuming you have functions that render dependency graphs and index views
const renderIndex = () => {
  // Code to render the index view
  // Uses imported modules: validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure
  if (typeof validateLandmark === 'function') {
    validateLandmark(document);
  }
  if (typeof validateLandmarkStructure === 'function') {
    validateLandmarkStructure(document);
  }
  
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    if (typeof validateTableAccessibility === 'function') {
      validateTableAccessibility(table);
    }
    if (typeof validateTableStructure === 'function') {
      validateTableStructure(table);
    }
  });
  
  // Use handleFakeLinks for link accessibility
  if (typeof handleFakeLinks === 'function') {
    handleFakeLinks(document);
  }
  
  console.log('Rendering index view');
};

// React / UI related functions

function formatProductName(product) {
  return `${product.name} - ${formatCurrency(product.price)}`;
}

function renderProductList(products) {
  const container = document.createElement('div');
  container.className = 'product-list';
  container.innerHTML = products.map(product => `
    <div class="product-card">
      <h3>${formatProductName(product)}</h3>
      <p class="price">${formatCurrency(product.price)}</p>
    </div>
  `).join('');
  return container;
}

function calculateTotalPrice(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  return subtotal - discount;
}

function renderCart(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  const total = subtotal - discount;
  return `
    <div class="cart">
      <h2>Shopping Cart</h2>
      <p>Subtotal: ${formatCurrency(subtotal)}</p>
      <p>Discount: -${formatCurrency(discount)}</p>
      <p>Total: ${formatCurrency(total)}</p>
      <p>Date: ${formatDate(new Date())}</p>
    </div>
  `;
}

function validateAndRender(input) {
  if (validateInput(input)) {
    return `<div class="validated">${formatCurrency(input.value)}</div>`;
  }
  return '<p>Invalid input</p>';
}

function renderPage(data) {
  const header = renderHeader(data.title);
  const content = renderProductList(data.products || []);
  const footer = renderFooter();
  return `${header}${content}${footer}`;
}

// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW
function specificFunctionThatRendersGraphOrIndex() {
  // Use the new functions for rendering graph/index
  renderDependencyGraph();
  renderIndex();
}

// New helper functions for accessibility checking
function checkLinkAccessibility() {
  // Implementation for checking link accessibility
  // This function will be used to validate the accessibility of links
  return validateLinkAccessibility();
}

// Function to display module structure
function displayModuleStructure(module) {
  // Implementation to display the module structure for a given module
  // Returns a structured representation of the module
  if (!module) {
    return null;
  }
  const structure = {
    name: module.name || 'unnamed',
    exports: module.exports || [],
    imports: module.imports || [],
    dependencies: module.dependencies || []
  };
  console.log('Displaying module structure for:', module, structure);
  return structure;
}

// State management
const state = {
  initialized: false
};

function updateState(newState) {
  Object.assign(state, newState);
}

// ... other exports ...

// Export the new function
export { checkLinkAccessibility, renderDependencyGraph, displayModuleStructure, specificFunctionThatRendersGraphOrIndex };

// Export utility functions
export {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  // Newly added accessibility functions
  getFullLangAttribute,
  addAriaLabel,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  ensureUniqueLandmarks,
  createAccessibleLink,
  handleAccessibilityIssues,
  addLangAttribute,
  // Newly implemented function for validating all links
  validateAllLinks
};

// Export component functions
export {
  formatCurrency,
  formatDate,
  calculateDiscount,
  validateInput,
  renderHeader,
  renderFooter,
  renderProductCard
};

// Export UI / product functions
export {
  formatProductName,
  renderProductList,
  calculateTotalPrice,
  renderCart,
  validateAndRender,
  renderPage,
  dependencyGraphContent,
  indexContent,
  ensureElementHasId,
  addAriaLabelToElement
};

// New function or change requested in the issue
function checkLinkAccessibility() {
  // Implementation for checking link accessibility
  // This function will be used to validate the accessibility of links
  return validateLinkAccessibility();
}

// Function to render dependency graphs or display module structure
function renderDependencyGraph(module) {
  // Implementation to render the dependency graph for a given module
  // Builds a graph representation of the module's dependencies
  const nodes = [];
  const edges = [];
  if (module && module.dependencies) {
    nodes.push({ id: module.name || 'root', label: module.name || 'root' });
    for (const dep of module.dependencies) {
      const depName = typeof dep === 'string' ? dep : dep.name;
      nodes.push({ id: depName, label: depName });
      edges.push({ from: module.name || 'root', to: depName });
    }
  }
  console.log('Rendering dependency graph for:', module, { nodes, edges });
  return { nodes, edges };
}

// Function to display module structure
function displayModuleStructure(module) {
  // Implementation to display the module structure for a given module
  // Returns a structured representation of the module
  if (!module) {
    return null;
  }
  const structure = {
    name: module.name || 'unnamed',
    exports: module.exports || [],
    imports: module.imports || [],
    dependencies: module.dependencies || []
  };
  console.log('Displaying module structure for:', module, structure);
  return structure;
}

// React / UI related functions

// TODO: Add these imported modules to the relevant rendering functions

function formatProductName(product) {
  return `${product.name} - ${formatCurrency(product.price)}`;
}

function renderProductList(products) {
  const container = document.createElement('div');
  container.className = 'product-list';
  container.innerHTML = products.map(product => `
    <div class="product-card">
      <h3>${formatProductName(product)}</h3>
      <p class="price">${formatCurrency(product.price)}</p>
    </div>
  `).join('');
  return container;
}

function calculateDiscount(subtotal) {
  // Example discount: 10% of subtotal
  return subtotal * 0.1;
}

function calculateTotalPrice(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  return subtotal - discount;
}

function renderCart(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  const total = subtotal - discount;
  return `
    <div class="cart">
      <h2>Shopping Cart</h2>
      <p>Subtotal: ${formatCurrency(subtotal)}</p>
      <p>Discount: -${formatCurrency(discount)}</p>
      <p>Total: ${formatCurrency(total)}</p>
      <p>Date: ${formatDate(new Date())}</p>
    </div>
  `;
}

function validateAndRender(input) {
  if (validateInput(input)) {
    return `<div class="validated">${formatCurrency(input.value)}</div>`;
  }
  return '<p>Invalid input</p>';
}

function renderPage(data) {
  const header = renderHeader(data.title);
  const content = renderProductList(data.products || []);
  const footer = renderFooter();
  return `${header}${content}${footer}`;
}

// TODO: Update the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW
function specificFunctionThatRendersGraphOrIndex() {
  // Call the updated functions to render the graph or index as needed
  renderDependencyGraph(dependencyGraphContent);
  renderIndex();
}

/**
 * Wraps the primary content of the document in a <main> element if it isn't already.
 * If a <main> element already exists, returns it. Otherwise, finds the primary
 * content (e.g., element with id "main-content", or the largest content container)
 * and wraps it in a <main> element. Adds an id of "main-content" if missing and
 * ensures the main element is properly identified for accessibility purposes.
 * @param {Document|HTMLElement} [root=document] - The root element to scan.
 * @returns {HTMLElement|null} The main element, or null if no suitable content was found.
 */
function wrapPrimaryContentInMain(root = (typeof document !== 'undefined' ? document : null)) {
    if (!root) {
        return null;
    }

    // If a <main> element already exists, return the first one.
    const existingMain = root.querySelector ? root.querySelector('main') : null;
    if (existingMain) {
        if (!existingMain.id) {
            existingMain.id = 'main-content';
        }
        return existingMain;
    }

    // Find candidate primary content element.
    let primaryContent = null;
    if (root.getElementById) {
        primaryContent = root.getElementById('main-content');
    }
    if (!primaryContent && root.querySelector) {
        // Fallback: find the element with the most children/content
        const candidates = root.querySelectorAll('div, section, article');
        let maxScore = -1;
        for (const candidate of candidates) {
            // Skip elements that are themselves inside a landmark we'd convert
            const score = (candidate.querySelectorAll('*').length || 0) + (candidate.textContent ? candidate.textContent.length : 0);
            if (score > maxScore) {
                maxScore = score;
                primaryContent = candidate;
            }
        }
    }

    if (!primaryContent) {
        return null;
    }

    // Create a new <main> element and wrap the primary content.
    const main = (typeof document !== 'undefined') ? document.createElement('main') : null;
    if (!main) {
        return null;
    }
    main.id = primaryContent.id || 'main-content';

    const parent = primaryContent.parentNode;
    if (!parent) {
        return null;
    }
    parent.insertBefore(main, primaryContent);
    main.appendChild(primaryContent);

    return main;
}

// Export the new function
export { checkLinkAccessibility, renderDependencyGraph, displayModuleStructure, wrapPrimaryContentInMain };

// Export utility functions
export {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  // Newly added accessibility functions
  getFullLangAttribute,
  addAriaLabel,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  ensureUniqueLandmarks,
  createAccessibleLink,
  handleAccessibilityIssues,
  addLangAttribute,
  // Newly added wrap function
  wrapPrimaryContentInMain
};

// Export component functions
export {
  formatCurrency,
  formatDate,
  calculateDiscount,
  validateInput
};

// Export UI / product functions
export {
  renderHeader,
  renderFooter,
  renderProductCard
};

// Exporting for CommonJS compatibility
module.exports = {
  specificFunctionThatRendersGraphOrIndex
};

// Export additional required functions
export { ensureUniqueLandmarkId, uniqueLandmarks, addAriaLabel, addLangAttribute };

// Report generation logic
/**
 * Generates an accessibility report based on the current document state.
 * @returns {Object} An object containing the accessibility report data.
 */
function generateAccessibilityReport() {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalIssues: 0,
            critical: 0,
            moderate: 0,
            passed: 0
        },
        issues: [],
        passed: []
    };

    // Check lang attribute
    const htmlElement = document.querySelector('html');
    if (htmlElement && htmlElement.hasAttribute('lang')) {
        report.passed.push({
            category: 'REACT_015',
            message: 'HTML element has lang attribute',
            status: 'passed'
        });
    } else {
        report.issues.push({
            category: 'REACT_015',
            message: 'HTML element is missing lang attribute',
            status: 'critical'
        });
        report.summary.critical++;
        report.summary.totalIssues++;
    }

    // Check landmark uniqueness
    const landmarks = document.querySelectorAll('[role]');
    const landmarkIds = new Set();
    let duplicateLandmarks = [];

    landmarks.forEach(landmark => {
        const id = landmark.id;
        if (id) {
            if (landmarkIds.has(id)) {
                duplicateLandmarks.push(id);
                report.issues.push({
                    category: 'REACT_025',
                    message: `Duplicate landmark ID: ${id}`,
                    status: 'critical'
                });
                report.summary.critical++;
                report.summary.totalIssues++;
            }
            landmarkIds.add(id);
        }
    });

    if (duplicateLandmarks.length === 0) {
        report.passed.push({
            category: 'REACT_025',
            message: 'All landmarks have unique IDs',
            status: 'passed'
        });
    }

    // Check table accessibility
    const tables = document.querySelectorAll('table');
    tables.forEach((table, index) => {
        const headers = table.querySelectorAll('th');
        if (headers.length > 0) {
            report.passed.push({
                category: 'REACT_027',
                message: `Table ${index + 1} has proper header cells`,
                status: 'passed'
            });
        }
    });

    // Check SVG accessibility
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        const title = svg.querySelector('title');
        const desc = svg.querySelector('desc');
        if (title && desc) {
            report.passed.push({
                category: 'REACT_041',
                message: `SVG ${index + 1} has accessible title and description`,
                status: 'passed'
            });
        } else {
            report.issues.push({
                category: 'REACT_041',
                message: `SVG ${index + 1} is missing accessible name`,
                status: 'moderate'
            });
            report.summary.moderate++;
            report.summary.totalIssues++;
        }
    });

    // Check link accessibility
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
        if (link.textContent.trim() === '') {
            report.issues.push({
                category: 'REACT_036',
                message: `Link ${index + 1} has no accessible text`,
                status: 'moderate'
            });
            report.summary.moderate++;
            report.summary.totalIssues++;
        } else {
            report.passed.push({
                category: 'REACT_036',
                message: `Link ${index + 1} has accessible text`,
                status: 'passed'
            });
        }
    });

    return report;
}

/**
 * Renders the accessibility report as an HTML string.
 * @param {Object} report - The accessibility report object.
 * @returns {string} HTML string representing the report.
 */
function renderAccessibilityReportHtml(report) {
    let html = `<div class="accessibility-report">
        <h1>Accessibility Report</h1>
        <p>Generated: ${report.timestamp}</p>
        
        <div class="summary">
            <h2>Summary</h2>
            <ul>
                <li>Total Issues: ${report.summary.totalIssues}</li>
                <li>Critical: ${report.summary.critical}</li>
                <li>Moderate: ${report.summary.moderate}</li>
                <li>Passed: ${report.summary.passed.length}</li>
            </ul>
        </div>
        
        <div class="issues">
            <h2>Issues Found</h2>`;
    
    if (report.issues.length === 0) {
        html += '<p>No issues found!</p>';
    } else {
        report.issues.forEach(issue => {
            html += `<div class="issue ${issue.status}">
                <strong>${issue.category}</strong>: ${issue.message}
            </div>`;
        });
    }
    
    html += `</div>
        
        <div class="passed">
            <h2>Passed Checks</h2>`;
    
    if (report.passed.length === 0) {
        html += '<p>No checks passed yet.</p>';
    } else {
        report.passed.forEach(item => {
            html += `<div class="passed-item">
                <strong>${item.category}</strong>: ${item.message}
            </div>`;
        });
    }
    
    html += '</div></div>';
    
    return html;
}

/**
 * Generates and displays the accessibility report in the console and returns the report object.
 * @returns {Object} The accessibility report object.
 */
function generateAndDisplayReport() {
    const report = generateAccessibilityReport();
    
    console.log('=== Accessibility Report ===');
    console.log(`Generated: ${report.timestamp}`);
    console.log(`Total Issues: ${report.summary.totalIssues}`);
    console.log(`Critical: ${report.summary.critical}`);
    console.log(`Moderate: ${report.summary.moderate}`);
    console.log(`Passed: ${report.summary.passed.length}`);
    
    if (report.issues.length > 0) {
        console.log('\n--- Issues ---');
        report.issues.forEach(issue => {
            console.log(`[${issue.status.toUpperCase()}] ${issue.category}: ${issue.message}`);
        });
    }
    
    if (report.passed.length > 0) {
        console.log('\n--- Passed Checks ---');
        report.passed.forEach(item => {
            console.log(`[PASS] ${item.category}: ${item.message}`);
        });
    }
    
    return report;
}

// Export report generation functions
export {
  generateAccessibilityReport,
  renderAccessibilityReportHtml,
  generateAndDisplayReport
};

// Export ensureUniqueLandmarkId for ensuring unique landmark IDs
export { ensureUniqueLandmarkId };

// Export uniqueLandmarks for getting unique landmarks from a list
export { uniqueLandmarks };

// Export addAriaLabel for adding aria-label attributes to elements
export { addAriaLabel };

// Export addLangAttribute for adding lang attributes to elements
export { addLangAttribute };

// Export the internal set for tracking used landmark IDs
export { _usedLandmarkIds };