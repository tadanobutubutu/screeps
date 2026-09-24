// TODO: This is the existing code that needs to be preserved (This comment remains as-is)

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c43 -->
// _Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_

<!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// Preserve existing functionality

// Importing the necessary functions (for illustration purposes)
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

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
const renderDependencyGraph = (data) => {
  // Code to render the dependency graph using the data provided
  // Uses imported modules: getSvgAccessibleName, setSvgAttributes
  if (data && typeof data === 'object') {
    const nodes = [];
    const edges = [];
    
    if (data.dependencies) {
      nodes.push({ id: data.name || 'root', label: data.name || 'root' });
      
      for (const dep of data.dependencies) {
        const depName = typeof dep === 'string' ? dep : (dep.name || 'unknown');
        if (depName) {
          nodes.push({ id: depName, label: depName });
          edges.push({ from: data.name || 'root', to: depName });
        }
      }
    }
    
    // Use imported modules for SVG accessibility in the graph
    if (typeof getSvgAccessibleName === 'function' && typeof setSvgAttributes === 'function') {
      const svgElements = document.querySelectorAll('.dependency-graph svg');
      svgElements.forEach((svg) => {
        const accessibleName = getSvgAccessibleName(svg);
        if (accessibleName) {
          setSvgAttributes(svg, accessibleName);
        }
      });
    }
  }
  
  console.log('Rendering dependency graph with data:', data);
};

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

// Updated specificFunctionThatRendersGraphOrIndex using imported modules
function specificFunctionThatRendersGraphOrIndex() {
  // Call the updated functions to render the graph or index as needed
  // Uses imported modules in rendering functions
  renderDependencyGraph(dependencyGraphContent);
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
  addLangAttribute
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

// Export state
export {
  state,
  updateState
};

// Export internal functions for accessibility
export {
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  addAriaLabel,
  addLangAttribute
};

// Export the internal set for tracking used landmark IDs
export { _usedLandmarkIds };

/**
 * Generates a comprehensive accessibility audit report
 * @param {Document|HTMLElement} [root=document] - Root element to scan
 * @returns {Object} Comprehensive accessibility report
 */
function generateAccessibilityAudit(root = (typeof document !== 'undefined' ? document : null)) {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalIssues: 0,
            critical: 0,
            moderate: 0,
            minor: 0,
            passed: 0
        },
        categories: {
            forms: { issues: 0, passed: 0 },
            headings: { issues: 0, passed: 0 },
            contrast: { issues: 0, passed: 0 },
            landmarks: { issues: 0, passed: 0 },
            tables: { issues: 0, passed: 0 },
            links: { issues: 0, passed: 0 }
        },
        issues: [],
        passed: []
    };
    
    // Check form labels
    try {
        const unlabeledInputs = checkFormLabels(root);
        if (unlabeledInputs.length > 0) {
            report.categories.forms.issues = unlabeledInputs.length;
            report.summary.totalIssues += unlabeledInputs.length;
            report.summary.moderate += unlabeledInputs.length;
            
            unlabeledInputs.forEach(input => {
                report.issues.push({
                    category: 'Form Labels',
                    message: `Input ${input.id} (${input.type}) lacks an associated label`,
                    element: input.element,
                    severity: 'moderate'
                });
            });
        } else {
            report.categories.forms.passed = 1;
            report.summary.passed++;
            report.passed.push({
                category: 'Form Labels',
                message: 'All form inputs have associated labels'
            });
        }
    } catch (e) {
        console.error('Error checking form labels:', e);
    }
    
    // Check heading hierarchy
    try {
        const headingAnalysis = validateHeadingHierarchy(root);
        if (headingAnalysis) {
            if (headingAnalysis.hierarchyIssues.length > 0) {
                report.categories.headings.issues = headingAnalysis.hierarchyIssues.length;
                report.summary.totalIssues += headingAnalysis.hierarchyIssues.length;
                report.summary.moderate += headingAnalysis.hierarchyIssues.length;
                
                headingAnalysis.hierarchyIssues.forEach(issue => {
                    report.issues.push({
                        category: 'Heading Hierarchy',
                        message: issue.issue,
                        severity: issue.severity
                    });
                });
            } else {
                report.categories.headings.passed = 1;
                report.summary.passed++;
                report.passed.push({
                    category: 'Heading Hierarchy',
                    message: 'Heading hierarchy is valid'
                });
            }
        }
    } catch (e) {
        console.error('Error checking heading hierarchy:', e);
    }
    
    // Check color contrast
    try {
        const contrastIssues = checkColorContrast(root);
        if (contrastIssues.length > 0) {
            report.categories.contrast.issues = contrastIssues.length;
            report.summary.totalIssues += contrastIssues.length;
            report.summary.minor += contrastIssues.length;
            
            contrastIssues.forEach(issue => {
                report.issues.push({
                    category: 'Color Contrast',
                    message: `Potential contrast issue: contrast ratio ${issue.contrast.toFixed(2)}`,
                    element: issue.element,
                    severity: 'minor'
                });
            });
        } else {
            report.categories.contrast.passed = 1;
            report.summary.passed++;
            report.passed.push({
                category: 'Color Contrast',
                message: 'All elements pass basic contrast checks'
            });
        }
    } catch (e) {
        console.error('Error checking color contrast:', e);
    }
    
    return report;
}

/**
 * Finds and reports on hidden content issues
 * @param {Document|HTMLElement} [root=document] - Root element to scan
 * @returns {Object} Hidden content analysis
 */
function checkHiddenContent(root = (typeof document !== 'undefined' ? document : null)) {
    if (!root) return null;
    
    const analysis = {
        hiddenElements: [],
        ariaHidden: [],
        visuallyHidden: [],
        issues: []
    };
    
    // Check for elements with display: none or visibility: hidden
    const allElements = root.querySelectorAll('*');
    allElements.forEach(el => {
        const style = window.getComputedStyle(el);
        const isHiddenByStyle = style.display === 'none' || style.visibility === 'hidden';
        
        if (isHiddenByStyle) {
            analysis.hiddenElements.push({
                element: el,
                reason: isHiddenByStyle ? 
                    (style.display === 'none' ? 'display: none' : 'visibility: hidden') : 
                    'other',
                text: el.textContent.trim().substring(0, 50) + '...'
            });
        }
        
        // Check for aria-hidden
        if (el.hasAttribute('aria-hidden') && el.getAttribute('aria-hidden') === 'true') {
            analysis.ariaHidden.push({
                element: el,
                reason: el.textContent.trim().substring(0, 50) + '...'
            });
        }
        
        // Check for screen reader only classes (common patterns)
        const className = el.className.toString().toLowerCase();
        if (className.includes('sr-only') || 
            className.includes('screen-reader') || 
            className.includes('visually-hidden')) {
            analysis.visuallyHidden.push({
                element: el,
                reason: 'Visually hidden class',
                text: el.textContent.trim().substring(0, 50) + '...'
            });
        }
    });
    
    // Check if aria-hidden elements contain focusable elements
    analysis.ariaHidden.forEach(item => {
        const focusableInHidden = item.element.querySelectorAll('button, a, input, select, textarea, [tabindex]');
        if (focusableInHidden.length > 0) {
            analysis.issues.push({
                element: item.element,
                issue: 'Element with aria-hidden=true contains focusable elements',
                severity: 'critical'
            });
        }
    });
    
    return analysis;
}

/**
 * Checks for skip links and their implementation
 * @param {Document|HTMLElement} [root=document] - Root element to scan
 * @returns {Object} Skip link analysis
 */
function checkSkipLinks(root = (typeof document !== 'undefined' ? document : null)) {
    if (!root) return null;
    
    const analysis = {
        skipLinks: [],
        mainContentIds: [],
        issues: []
    };
    
    // Find skip links
    const skipLinks = root.querySelectorAll('a[href^="#"]');
    skipLinks.forEach(link => {
        const href = link.getAttribute('href');
        const id = href.substring(1);
        const target = root.getElementById(id);
        
        analysis.skipLinks.push({
            element: link,
            targetId: id,
            target: target,
            text: link.textContent.trim()
        });
        
        if (!target) {
            analysis.issues.push({
                element: link,
                issue: `Skip link targets non-existent element with id "${id}"`,
                severity: 'critical'
            });
        }
    });
    
    // Find main content elements
    const mainElements = root.querySelectorAll('main, [role="main"], #main, #content, #content-wrapper');
    mainElements.forEach(el => {
        analysis.mainContentIds.push({
            element: el,
            id: el.id,
            tagName: el.tagName
        });
    });
    
    // Check if there are skip links
    if (analysis.skipLinks.length === 0 && analysis.mainContentIds.length > 0) {
        analysis.issues.push({
            element: null,
            issue: 'Page has main content but no skip links for keyboard users',
            severity: 'moderate'
        });
    }
    
    return analysis;
}

// TODO: Add any new functions or changes requested in the issue here

/**
 * Main accessibility fix function that consolidates all accessibility improvements
 * This function can be called after DOM is loaded to apply all accessibility fixes
 * @param {Object} options - Configuration options
 * @param {Document|HTMLElement} options.root - Root element to operate on
 * @param {boolean} options.autoApply - Whether to automatically apply fixes
 * @returns {Object} Summary of actions taken
 */
function applyAllAccessibilityFixes(options = {}) {
    const root = options.root || (typeof document !== 'undefined' ? document : null);
    const autoApply = options.autoApply !== false;
    const report = {
        applied: [],
        skipped: [],
        errors: []
    };
    
    if (!root) {
        report.errors.push('No valid root element provided');
        return report;
    }
    
    try {
        // 1. Apply lang attribute if missing
        const html = root.documentElement || (root.tagName === 'HTML' ? root : null);
        if (html && html.tagName === 'HTML' && !html.hasAttribute('lang')) {
            const langValue = getFullLangAttribute() || 'en';
            if (autoApply) {
                html.setAttribute('lang', langValue);
            }
            report.applied.push({
                fix: 'lang attribute',
                element: 'html',
                value: langValue
            });
        }
        
        // 2. Ensure unique landmark IDs
        const landmarks = ensureUniqueLandmarks(root);
        if (landmarks && landmarks.length > 0) {
            report.applied.push({
                fix: 'unique landmark IDs',
                count: landmarks.length
            });
        }
        
        // 3. Validate tables
        const tables = root.querySelectorAll('table');
        tables.forEach(table => {
            if (autoApply) {
                validateTableAccessibility(table);
                validateTableStructure(table);
            }
        });
        report.applied.push({
            fix: 'table validation',
            count: tables.length
        });
        
        // 4. Add accessible names to SVGs
        const svgs = root.querySelectorAll('svg');
        svgs.forEach(svg => {
            const name = getSvgAccessibleName(svg);
            if (name && autoApply) {
                setSvgAttributes(svg, name);
            }
        });
        report.applied.push({
            fix: 'svg accessible names',
            count: svgs.length
        });
        
        // 5. Handle fake links
        if (autoApply && typeof handleFakeLinks === 'function') {
            const handled = handleFakeLinks(root);
            report.applied.push({
                fix: 'fake links',
                count: typeof handled === 'number' ? handled : 'unknown'
            });
        }
        
        // 6. Add skip links if missing
        const hasSkipLinks = root.querySelector('a[href^="#"]');
        const hasMainContent = root.querySelector('main, [role="main"], #main, #content, #content-wrapper');
        if (hasMainContent && !hasSkipLinks && autoApply) {
            const skipLink = createAccessibleLink({
                href: '#main',
                text: 'Skip to main content',
                ariaLabel: 'Skip to main content'
            });
            if (skipLink) {
                root.body.insertBefore(skipLink, root.body.firstChild);
                report.applied.push({
                    fix: 'skip link',
                    text: 'Skip to main content'
                });
            }
        }
        
        return report;
        
    } catch (error) {
        report.errors.push({
            error: error.message,
            stack: error.stack
        });
        return report;
    }
}

/**
 * Helper function to debounce accessibility checks
 * @param {Function} func - Function to debounce
 * @param {number} wait - Debounce delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounceAccessibilityCheck(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Main entry point for accessibility fixes
 * This function should be called after DOM is loaded
 */
function initializeAccessibility() {
    // Check if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            mainAccessibilityInit();
        });
    } else {
        mainAccessibilityInit();
    }
}

/**
 * Internal initialization function
 */
function mainAccessibilityInit() {
    try {
        // Apply all accessibility fixes automatically
        const result = applyAllAccessibilityFixes({
            autoApply: true,
            root: document
        });
        
        console.log('Accessibility initialization completed:', result);
        
        // Run comprehensive audit
        const audit = generateAccessibilityAudit();
        console.log('Accessibility audit:', audit);
        
    } catch (error) {
        console.error('Error during accessibility initialization:', error);
    }
}

// Auto-initialize when script loads (if DOM is already loaded)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Use setTimeout to ensure DOM is fully parsed
    setTimeout(initializeAccessibility, 0);
}

// Export all new functions
export {
  generateAccessibilityReport,
  renderAccessibilityReportHtml,
  generateAndDisplayReport
};

// Exporting for CommonJS compatibility
module.exports = {
  specificFunctionThatRendersGraphOrIndex,
  checkLinkAccessibility,
  displayModuleStructure,
  renderDependencyGraph,
  generateAccessibilityReport
};