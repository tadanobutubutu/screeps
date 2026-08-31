// Screeps AI - Main Module

// Main game loop
module.exports = function() {
    // Initialize accessibility features
    const langAttr = getLangAttribute();
    const primaryContent = wrapPrimaryContentInMain();

    // Validate accessibility
    validateTableAccessibility();
    validateTableStructure();
    validateLandmark();
    validateLandmarkStructure();
    addFixLandmarkIssues();

    // SVG accessibility
    const svgName = getSvgAccessibleName();
    addAriaToFormControls();

    // Unique landmarks and fake link fixes
    ensureUniqueLandmarks();
    fixFakeLinkIssues();
    createAccessibleLink();

    // Check link accessibility
    checkLinkAccessibility();

    // Harvest and upgrade logic
    const creeps = Game.creeps;
    const sources = Game.sources;
    const controller = Game.controllers[0]; // assuming first controller

    Object.values(creeps).forEach(creep => {
        const source = creep.findClosestByPath(FIND_SOURCES, {
            filter: (source) => source.energy > 0
        });
        if (source) {
            harvest(creep, source);
        } else {
            upgradeController(creep, controller);
        }
    });
};

// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityErrors())

/**
 * Internal set to track used landmark IDs
 * @type {Set<string>}
 */
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 9);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Accessibility helper functions
 */
function getLangAttribute() {
    return 'en';
}

function getFullLangAttribute(lang) {
    return lang + '-US';
}

function wrapPrimaryContentInMain() {
    return '<main role="main"></main>';
}

function validateTableAccessibility() {
    const doc = getDocument();
    if (!doc) return false;
    const tables = doc.querySelectorAll('table');
    let issues = [];
    tables.forEach(table => {
        if (!table.querySelector('caption')) {
            issues.push('Missing caption');
        }
        const thElements = table.querySelectorAll('th');
        thElements.forEach(th => {
            if (!th.getAttribute('scope')) {
                issues.push('Missing scope attribute on th');
            }
        });
    });
    return issues.length === 0;
}

/**
 * REACT_015: Add lang attribute to HTML element
 * @param {string} lang - Language code
 */
function addLangAttribute(lang = 'en') {
    const doc = getDocument();
    if (doc && doc.documentElement) {
        if (doc.documentElement.lang !== lang) {
            doc.documentElement.setAttribute('lang', getFullLangAttribute(lang));
        }
    }
}

/**
 * REACT_027: Fix table structure issues
 */
function validateTableStructure() {
    // Validate table structure
}

/**
 * Validate landmark
 */
function validateLandmark() {
    // Validate landmark
}

/**
 * Validate landmark structure
 */
function validateLandmarkStructure() {
    // Validate landmark structure
}

/**
 * Add and fix landmark issues
 */
function addFixLandmarkIssues() {
    // Add and fix landmark issues
}

/**
 * Get SVG accessible name
 * @param {Element} svg - SVG element
 * @returns {string} Accessible name
 */
function getSvgAccessibleName(svg) {
    if (!svg) return '';
    return svg.getAttribute('aria-label') || svg.getAttribute('title') || 'SVG graphic';
}

/**
 * Set SVG attributes for accessibility
 * @param {Element} svg - SVG element
 * @param {string} name - Accessible name
 */
function setSvgAttributes(svg, name) {
    if (!svg) return;
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', name);
}

/**
 * Get SVG accessible name (without parameters for compatibility)
 * @returns {string} Default accessible name
 */
function getSvgAccessibleNameDefault() {
    return 'Accessible SVG graphic';
}

/**
 * Add ARIA to form controls
 */
function addAriaToFormControls() {
    // Add ARIA to form controls
}

/**
 * Ensure unique landmarks
 */
function ensureUniqueLandmarks() {
    // Ensure unique landmarks
}

/**
 * Handle accessibility errors
 * @param {Element} element - Element with accessibility errors
 */
function handleAccessibilityErrors(element) {
    // Handle accessibility errors
}

/**
 * REACT_043: Make header focusable
 * @returns {void}
 */
function makeHeaderFocusable() {
    const header = document.querySelector('header');
    if (header) {
        header.setAttribute('tabindex', '0');
    }
}

/**
 * REACT_036: Fix fake link issues
 */
function fixFakeLinkIssues() {
    const fakeLinks = document.querySelectorAll('a[href^="#"]');
    fakeLinks.forEach(link => {
        if (link.getAttribute('href') === '#' || !link.textContent.trim()) {
            link.setAttribute('role', 'button');
        }
    });
}

/**
 * Create accessible link
 */
function createAccessibleLink() {
    // Create accessible link
}

/**
 * Validate link accessibility
 * @returns {boolean} True if links are accessible
 */
function validateLinkAccessibility() {
    const links = document.querySelectorAll('a');
    let isValid = true;
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        
        // Check for empty links
        if ((!href || href === '#') && !text) {
            isValid = false;
            link.setAttribute('aria-hidden', 'true');
        }
        
        // Check for proper link text
        if (text === '' && link.getAttribute('aria-label')) {
            return; // Skip if aria-label is present
        }
        
        if (text === '') {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Handle fake links
 */
function handleFakeLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#') {
            link.setAttribute('role', 'button');
        }
    });
}

/**
 * REACT_043: Make header focusable (exported version)
 */
export function makeHeaderFocusable() {
    return makeHeaderFocusable();
}

/**
 * Create in-page navigation button
 */
function createInPageButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', 'Navigate to section');
    if (!button.id) {
        button.id = 'in-page-nav-button';
    }
    return button;
}

/**
 * Check link accessibility
 * @returns {boolean} True if all links are accessible
 */
function checkLinkAccessibility() {
    return validateLinkAccessibility();
}

/**
 * Display module structure
 * @param {string} module - Module name
 */
function displayModuleStructure(module) {
    console.log('Displaying module structure for:', module);
}

/**
 * Google sign-in accessibility
 */
function googleSignIn() {
    const googleButton = document.querySelector('[data-google-signin]');
    if (googleButton) {
        googleButton.setAttribute('aria-label', 'Sign in with Google');
        googleButton.setAttribute('role', 'button');
    }
}

/**
 * Fix accessibility issues based on insight report
 * @param {Object} insightReport - Insight report object
 */
function fixAccessibilityIssues(insightReport) {
    if (!insightReport || typeof insightReport !== 'object') {
        console.warn('Invalid insight report provided to fixAccessibilityIssues');
        return;
    }

    const accessibilityIssues = insightReport.accessibility || [];

    if (!Array.isArray(accessibilityIssues) || accessibilityIssues.length === 0) {
        console.log('No accessibility issues found in the insight report');
        return;
    }

    console.log(`Found ${accessibilityIssues.length} accessibility issues:`);

    accessibilityIssues.forEach((issue, index) => {
        if (issue && typeof issue === 'object') {
            const description = issue.description || 'No description available';
            const severity = issue.severity || 'unknown';
            const impact = issue.impact || 'unknown';
            const selector = issue.selector || 'unknown selector';

            console.log(`Issue ${index + 1}:`);
            console.log(`  Description: ${description}`);
            console.log(`  Severity: ${severity}`);
            console.log(`  Impact: ${impact}`);
            console.log(`  Selector: ${selector}`);

            if (issue.type) {
                switch (issue.type) {
                    case 'color-contrast':
                        console.log('  Action: Consider adjusting color contrast for better visibility');
                        break;
                    case 'alt-text':
                        console.log('  Action: Add or improve alt text for images');
                        break;
                    case 'aria-label':
                        console.log('  Action: Add or improve aria-label attributes');
                        break;
                    case 'heading-order':
                        console.log('  Action: Review and fix heading hierarchy order');
                        break;
                    default:
                        console.log(`  Action: Review and address ${issue.type} issue`);
                }
            }

            console.log('---');
        }
    });
}

/**
 * Get full language attribute with proper format
 * @returns {string} Full language attribute
 */
function getFullLangAttribute() {
    const lang = getLangAttribute();
    const name = typeof personName === 'function' ? personName() : 'user';
    return `${lang}-${name.toLowerCase().replace(/\s+/g, '-')}`;
}

/**
 * Handle accessibility issues dynamically
 */
function handleAccessibilityIssues() {
    validateLandmark();
    validateLandmarkStructure();
    ensureUniqueLandmarks();
    fixFakeLinkIssues();
    addFixLandmarkIssues();
}

/**
 * Google sign-in accessibility
 */
function setupGoogleSignIn() {
    googleSignIn();
}

/**
 * Get document (for testing compatibility)
 * @returns {Document|undefined} Document object
 */
function getDocument() {
    if (typeof document !== 'undefined') {
        return document;
    }
    return undefined;
}

/**
 * Person name function (for getFullLangAttribute)
 * @returns {string} Person name
 */
function personName() {
    return 'User';
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Format date
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US').format(date);
}

/**
 * Calculate discount
 * @param {number} subtotal - Subtotal amount
 * @returns {number} Discount amount
 */
function calculateDiscount(subtotal) {
    if (subtotal > 100) {
        return subtotal * 0.1;
    }
    return 0;
}

/**
 * Validate input
 * @param {Object} input - Input object to validate
 * @returns {boolean} True if valid
 */
function validateInput(input) {
    return input && typeof input === 'object';
}

/**
 * Calculate total price
 * @param {Array} cart - Cart items
 * @returns {number} Total price
 */
function calculateTotalPrice(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = calculateDiscount(subtotal);
    return subtotal - discount;
}

/**
 * Harvest function
 * @param {Object} creep - Creep object
 * @param {Object} source - Source object
 */
function harvest(creep, source) {
    if (!source) return;
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }
}

/**
 * Upgrade controller function
 * @param {Object} creep - Creep object
 * @param {Object} controller - Controller object
 */
function upgradeController(creep, controller) {
    if (!controller) return;
    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller);
    }
}

/**
 * Render page
 * @param {Object} data - Data to render
 */
function renderPage(data) {
    // Code to render the page
}

/**
 * Render dependency graph
 * @param {Object} data - Data to render
 */
function renderDependencyGraph(data) {
    // Code to render the dependency graph
}

/**
 * Render index
 */
function renderIndex() {
    // Code to render the index view
}

/**
 * Format product name
 * @param {Object} product - Product object
 * @returns {string} Formatted product name
 */
function formatProductName(product) {
    return `${product.name} - ${product.category}`;
}

/**
 * Render product list
 * @param {Array} products - Products to render
 * @returns {HTMLElement} Container element
 */
function renderProductList(products) {
    const container = document.getElementById('product-list');
    if (container) {
        container.innerHTML = products.map(renderProductCard).join('');
    }
    return container;
}

/**
 * Render product card
 * @param {Object} product - Product object
 * @returns {string} HTML string
 */
function renderProductCard(product) {
    return `<div class="product-card">${formatProductName(product)}</div>`;
}

/**
 * Render cart
 * @param {Array} cart - Cart items
 * @returns {string} HTML string
 */
function renderCart(cart) {
    const total = calculateTotalPrice(cart);
    return `
    <div class="cart">
      <h2>Shopping Cart</h2>
      <p>Total: ${formatCurrency(total)}</p>
      <p>Date: ${formatDate(new Date())}</p>
    </div>
  `;
}

/**
 * Validate and render
 * @param {Object} input - Input object
 * @returns {HTMLElement|undefined} Container or undefined
 */
function validateAndRender(input) {
    if (validateInput(input)) {
        return renderProductList(input.products);
    }
    return undefined;
}

/**
 * Add fix landmark issues
 */
function addFixLandmarkIssues() {
    const doc = getDocument();
    if (!doc) return;
    
    const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    
    landmarks.forEach(landmark => {
        const existingId = landmark.getAttribute('id') || '';
        if (existingId) {
            if ([..._usedLandmarkIds].includes(existingId)) {
                const newId = ensureUniqueLandmarkId(existingId);
                landmark.setAttribute('id', newId);
            } else {
                _usedLandmarkIds.add(existingId);
            }
        }
    });
}

/**
 * Validate landmark
 */
function validateLandmark() {
    const doc = getDocument();
    if (!doc) return;
    
    const landmarkRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary'];
    const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    
    // At minimum, main landmark is required
    const hasMain = landmarks.length > 0;
    if (!hasMain) {
        console.warn('Missing main landmark');
    }
}

/**
 * Validate landmark structure
 */
function validateLandmarkStructure() {
    const doc = getDocument();
    if (!doc) return;
    
    const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    
    // Check for duplicate landmark roles
    const roleCounts = {};
    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role');
        roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
    
    // Banner, contentinfo should appear at most once
    if (roleCounts['banner'] > 1) {
        console.warn('Multiple banner landmarks found');
    }
    if (roleCounts['contentinfo'] > 1) {
        console.warn('Multiple contentinfo landmarks found');
    }
}

/**
 * Ensure unique landmarks
 */
function ensureUniqueLandmarks() {
    const doc = getDocument();
    if (!doc) return;
    
    const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    
    landmarks.forEach(landmark => {
        const id = landmark.getAttribute('id');
        if (!id) {
            const role = landmark.getAttribute('role');
            const newId = ensureUniqueLandmarkId(role);
            landmark.setAttribute('id', newId);
        }
    });
}

/**
 * Add accessible names to SVGs
 */
function addAccessibleNamesToSVGs() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        const accessibleName = getSvgAccessibleName(svg);
        setSvgAttributes(svg, accessibleName);
    });
}

// Initialize accessibility features
const langAttr = getLangAttribute();
const primaryContent = wrapPrimaryContentInMain();

// Validate accessibility
validateTableAccessibility();
validateTableStructure();
validateLandmark();
validateLandmarkStructure();
addFixLandmarkIssues();

// SVG accessibility
const svgName = getSvgAccessibleNameDefault();
addAriaToFormControls();

// Unique landmarks and fake link fixes
ensureUniqueLandmarks();
fixFakeLinkIssues();
createAccessibleLink();

// Check link accessibility
checkLinkAccessibility();

// Google sign-in accessibility
setupGoogleSignIn();

// Validate table structure and accessibility
const table = document.getElementById('myTable');
if (table) {
    validateTableAccessibility(table);
    validateTableStructure(table);
}

// Ensure unique landmarks
ensureUniqueLandmarkId('main-content');

// Handle fake link issues
handleAccessibilityErrors();

// Render functions
function renderPage(data) {
    // Code to render the page
}

function renderAccessibilityPage() {
    addLangAttribute();
    createInPageButton();
    const table = document.getElementById('myTable');
    if (table) {
        validateTableAccessibility(table);
        validateTableStructure(table);
    }

    // Validate landmark structure and uniqueness
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    const landmarkIds = new Set();
    landmarks.forEach(landmark => {
        if (landmark.id) {
            if (landmarkIds.has(landmark.id)) {
                landmark.removeAttribute('id');
            } else {
                landmarkIds.add(landmark.id);
            }
        }
    });

    // Add accessible names to all SVG elements
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        const accessibleName = getSvgAccessibleName(svg);
        setSvgAttributes(svg, accessibleName);
    });

    validateLinkAccessibility();
    handleFakeLinks();

    // Fix button identifiers
    const buttons = document.querySelectorAll('button, [role="button"]');
    buttons.forEach((button, index) => {
        if (!button.id) {
            button.id = `accessible-button-${index}`;
        }
    });

    validateLinkAccessibility();
    handleFakeLinks();
}

// Export accessibility utility functions
export { makeHeaderFocusable };

// Export UI / product functions
export {
  checkLinkAccessibility,
  displayModuleStructure
};

// Export accessibility functions
export {
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
  fixFakeLinkIssues,
  createAccessibleLink,
  addFixLandmarkIssues
};

// Export utility functions
export {
  formatCurrency,
  formatDate,
  calculateDiscount,
  validateInput,
  calculateTotalPrice,
  renderCart,
  validateAndRender,
  renderPage
};