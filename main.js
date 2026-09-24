// TODO: Existing main.js content before the merge conflict...

// Screeps AI - Main Module

// Helper function to get document object safely
function getDocument() {
    if (typeof document !== 'undefined') {
        return document;
    }
    return null;
}

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function createUniqueLandmarkId(baseName) {
    let candidate = baseName;
    let counter = 1;
    while (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add numeric suffix
        const suffix = Math.floor(Math.random() * 900) + 100;
        candidate = `${baseName}-${suffix}`;
        counter++;
        if (counter > 100) {
            candidate = `${baseName}-${Date.now()}`;
            break;
        }
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

// Accessibility helper functions
function getLangAttribute() {
    return 'en';
}

function getFullLangAttribute(lang) {
    const defaultLang = getLangAttribute();
    return lang ? `${defaultLang}-US` : defaultLang;
}

function wrapPrimaryContentInMain() {
    const doc = getDocument();
    if (doc) {
        const primaryContent = doc.querySelector('#primary-content, [role="main"], main, .primary-content');
        if (primaryContent && !primaryContent.closest('main[role="main"]')) {
            const mainElement = doc.createElement('main');
            mainElement.setAttribute('role', 'main');
            mainElement.id = ensureUniqueLandmarkId('main-content');
            primaryContent.parentNode.insertBefore(mainElement, primaryContent);
            mainElement.appendChild(primaryContent);
        }
    }
    return '<main role="main"></main>';
}

function validateTableAccessibility(table) {
    const doc = getDocument();
    const targetTable = table || doc;
    if (!targetTable) return false;
    const tables = targetTable.querySelectorAll ? targetTable.querySelectorAll('table') : [];
    let issues = [];
    tables.forEach(t => {
        if (!t.querySelector('caption')) {
            issues.push('Missing caption');
        }
        const thElements = t.querySelectorAll('th');
        thElements.forEach(th => {
            if (!th.hasAttribute('scope')) {
                issues.push('Missing scope attribute on th');
            }
        });
    });
    return issues.length === 0;
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
 * Adds lang attribute as per the issue requirement
 */
function addLangAttribute(lang) {
    const doc = getDocument();
    lang = lang || 'en';
    if (doc && doc.documentElement) {
        const fullLang = getFullLangAttribute(lang || 'en');
        if (doc.documentElement.lang !== fullLang) {
            doc.documentElement.setAttribute('lang', fullLang);
        }
    }
}

// REACT_027: Fix table structure issues
function validateTableStructure(table) {
    // Validate table structure
    const doc = getDocument();
    const targetTable = table || doc;
    if (!targetTable) return;
    const tables = targetTable.querySelectorAll ? targetTable.querySelectorAll('table') : [];
    tables.forEach(t => {
        // Add scope to th elements if missing
        const thElements = t.querySelectorAll('th');
        thElements.forEach(th => {
            if (!th.getAttribute('scope')) {
                th.setAttribute('scope', 'col');
            }
        });
    });
}

/**
 * Validate landmark
 */
function validateLandmark() {
    // Validate landmark
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    landmarks.forEach(landmark => {
        if (!landmark.hasAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-labelledby', 'landmark-' + Math.random().toString(36).substr(2, 5));
        }
    });
}

/**
 * Validate landmark structure
 */
function validateLandmarkStructure() {
    // Validate landmark structure
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    landmarks.forEach(landmark => {
        const id = landmark.getAttribute('id');
        if (id && !landmark.classList.contains('unique-landmark')) {
            landmark.classList.add('unique-landmark');
        }
    });
}

/**
 * Add and fix landmark issues
 */
function addFixLandmarkIssues() {
    // Add and fix landmark issues
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    landmarks.forEach(landmark => {
        if (!landmark.hasAttribute('aria-hidden') && !landmark.classList.contains('unique-landmark')) {
            landmark.setAttribute('aria-hidden', 'false');
        }
    });
}

function getSvgAccessibleName() {
    // Get SVG accessible name
    return 'Accessible SVG';
}

function setSvgAttributes(svg, accessibleName) {
    // Set SVG attributes for accessibility
    if (!svg) return;
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        svg.setAttribute('aria-label', accessibleName);
    }
}

function addAriaToFormControls() {
    // Add ARIA to form controls
    const formControls = document.querySelectorAll('form input, select, button');
    formControls.forEach(control => {
        control.setAttribute('aria-label', control.type === 'checkbox' ? 'Checkbox' : control.type === 'radio' ? 'Radio' : 'Text Input');
    });
}

/**
 * Ensure unique landmarks
 */
function ensureUniqueLandmarks() {
    // Ensure unique landmarks
    const doc = getDocument();
    if (!doc) return;
    const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
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
}

function handleAccessibilityErrors(element) {
    // Handle accessibility errors
    console.warn('Accessibility error detected:', element);
}

// Make header focusable function
function makeHeaderFocusable() {
    // code to make the header element focusable
    // Example: Adding tabindex to the header
    const doc = getDocument();
    if (!doc) return;
    const header = doc.querySelector('header');
    if (header) {
        header.setAttribute('tabindex', '0');
    }
}

function fixFakeLinkIssues() {
    // Fix fake link issues
    const doc = getDocument();
    if (!doc) return;
    const fakeLinks = doc.querySelectorAll('a[role="button"], a[role="link"]');
    fakeLinks.forEach(link => {
        // Convert to button if appropriate
        if (link.getAttribute('role') === 'button') {
            link.setAttribute('role', 'button');
        }
    });
}

function createAccessibleLink() {
    // Create accessible link
    const doc = getDocument();
    if (!doc) return;
    const links = doc.querySelectorAll('a');
    links.forEach(link => {
        if (!link.getAttribute('aria-label') && !link.textContent) {
            link.setAttribute('aria-label', 'Link');
        }
    });
}

function validateLinkAccessibility() {
    // Existing code...
    const doc = getDocument();
    if (!doc) return true;
    const links = doc.querySelectorAll('a');
    let issues = [];
    links.forEach(link => {
        if (!link.textContent && !link.getAttribute('aria-label')) {
            issues.push('Link missing accessible name');
        }
    });
    return issues.length === 0;
}

function handleFakeLinks() {
    // Existing code...
    const doc = getDocument();
    if (!doc) return;
    const fakeLinks = doc.querySelectorAll('a[role="button"]');
    fakeLinks.forEach(link => {
        // Handle fake links by adding proper role and attributes
        link.setAttribute('role', 'button');
        if (!link.getAttribute('tabindex')) {
            link.setAttribute('tabindex', '0');
        }
    });
}

// New function to check link accessibility
function checkLinkAccessibility() {
    return validateLinkAccessibility();
}

// New function to display module structure
function displayModuleStructure(module) {
    console.log('Displaying module structure for:', module);
}

// Harvest and upgrade logic functions
function harvest(creep, source) {
    if (!source) return;
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }
}

function upgradeController(creep, controller) {
    if (!controller) return;
    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller);
    }
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues(insightReport) {
    // Handle case where insightReport is null, undefined, or not an object
    if (insightReport && typeof insightReport === 'object') {
        const accessibilityIssues = insightReport.accessibility || [];
        if (Array.isArray(accessibilityIssues) && accessibilityIssues.length > 0) {
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
                    // Attempt to address the issue based on type
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
    }

    // Perform actual accessibility fixes
    addLangAttribute();
    createInPageButton();
    const doc = getDocument();
    const table = doc ? doc.getElementById('myTable') : null;
    if (table) {
        validateTableAccessibility(table);
        validateTableStructure(table);
    }

    // Validate landmark structure and uniqueness
    const landmarks = doc ? doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]') : [];
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
}

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();

function createUniqueLandmarkId(baseName) {
    let candidate = baseName;
    let suffix = 1;
    while (_usedLandmarkIds.has(candidate)) {
        candidate = baseName + '-' + suffix;
        suffix++;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

function handleAccessibilityErrors() {
    // Handle accessibility errors
}

// New function to fix accessibility issues as per the insight report
function addressAccessibilityIssues(insightReport) {
    // Handle case where insightReport is null, undefined, or not an object
    if (!insightReport || typeof insightReport !== 'object') {
        console.warn('Invalid insight report provided to addressAccessibilityIssues');
        return;
    }

    const accessibilityIssues = insightReport.accessibility || [];

    if (!Array.isArray(accessibilityIssues) || accessibilityIssues.length === 0) {
        console.log('No accessibility issues found in the insight report');
        return;
    }

    console.log('Found ' + accessibilityIssues.length + ' accessibility issues:');

    accessibilityIssues.forEach(function(issue, index) {
        if (issue && typeof issue === 'object') {
            var description = issue.description || 'No description available';
            var severity = issue.severity || 'unknown';
            var impact = issue.impact || 'unknown';
            var selector = issue.selector || 'unknown selector';

            console.log('Issue ' + (index + 1) + ':');
            console.log('  Description: ' + description);
            console.log('  Severity: ' + severity);
            console.log('  Impact: ' + impact);
            console.log('  Selector: ' + selector);

            // Attempt to address the issue based on type
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
                        console.log('  Action: Review and address ' + issue.type + ' issue');
                }
            }

            console.log('---');
        }
    });
}

function makeHeaderFocusable() {
    // code to make the header element focusable
    // Example: Adding tabindex to the header
    var doc = getDocument();
    var header = doc.querySelector('header');
    if (header) {
        header.setAttribute('tabindex', '0');
    }
}

function fixFakeLinkIssues() {
    // Fix fake link issues
}

function createAccessibleLink() {
    // Create accessible link
}

function validateLinkAccessibility() {
    // Existing code...
}

function handleFakeLinks() {
    // Existing code...
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues() {
    addLangAttribute(getLangAttribute());
    createInPageButton();
    var doc = getDocument();
    var table = doc.querySelector('table');
    if (table) {
        validateTableAccessibility(doc);
        validateTableStructure();
    }

    // Validate landmark structure and uniqueness
    var landmarks = doc.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"]');
    var landmarkIds = new Set();
    landmarks.forEach(function(landmark) {
        if (landmark.id) {
            if (landmarkIds.has(landmark.id)) {
                // Duplicate ID found, need to fix
            } else {
                landmarkIds.add(landmark.id);
            }
        }
    });

    // Add accessible names to all SVG elements
    const svgs = doc ? doc.querySelectorAll('svg') : [];
    svgs.forEach(svg => {
        const accessibleName = getSvgAccessibleName(svg);
        setSvgAttributes(svg, accessibleName);
    });

    validateLinkAccessibility();
    handleFakeLinks();

    // Fix button identifiers
    const buttons = doc ? doc.querySelectorAll('button, [role="button"]') : [];
    buttons.forEach((button, index) => {
        if (!button.id) {
            button.id = 'button-' + index;
        }
    });

    fixFakeLinkIssues();
    // Note: addressAccessibilityIssues requires an insightReport parameter, so it's called separately when needed
}

// Add new function to address the accessibility issue REACT_043: Make header focusable
function makeHeaderFocusable() {
    // code to make the header element focusable
    // Example: Adding tabindex to the header
    const doc = getDocument();
    const header = doc ? doc.querySelector('header') : null;
    if (header) {
        header.setAttribute('tabindex', '0');
    }
}

function fixFakeLinkIssues() {
    // Fix fake link issues
    const doc = getDocument();
    if (!doc) return;
    const fakeLinks = doc.querySelectorAll('a[role="button"], a[role="link"]');
    fakeLinks.forEach(link => {
        // Convert to button if appropriate
        if (link.getAttribute('role') === 'button') {
            link.setAttribute('role', 'button');
        }
    });
}

function createAccessibleLink() {
    // Create accessible link
    const doc = getDocument();
    if (!doc) return;
    const links = doc.querySelectorAll('a');
    links.forEach(link => {
        if (!link.getAttribute('aria-label') && !link.textContent) {
            link.setAttribute('aria-label', 'Link');
        }
    });
}

function validateLinkAccessibility() {
    // Existing code...
    const doc = getDocument();
    if (!doc) return true;
    const links = doc.querySelectorAll('a');
    let issues = [];
    links.forEach(link => {
        if (!link.textContent && !link.getAttribute('aria-label')) {
            issues.push('Link missing accessible name');
        }
    });
    return issues.length === 0;
}

function handleFakeLinks() {
    // Existing code...
    const doc = getDocument();
    if (!doc) return;
    const fakeLinks = doc.querySelectorAll('a[role="button"]');
    fakeLinks.forEach(link => {
        // Handle fake links by adding proper role and attributes
        link.setAttribute('role', 'button');
        if (!link.getAttribute('tabindex')) {
            link.setAttribute('tabindex', '0');
        }
    });
}

// New function to display module structure
function displayModuleStructure(module) {
    console.log('Displaying module structure for:', module);
}

// DOM-based accessibility code

// Helper function to get document object safely
function getDocument() {
    if (typeof document !== 'undefined') {
        return document;
    }
    return null;
}

// Initialize DOM-based accessibility when document is available
if (typeof document !== 'undefined') {
    // Validate table structure and accessibility
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        validateTableAccessibility(table);
        validateTableStructure(table);
    });

    // Add/fix landmark issues
    validateLandmark();
    validateLandmarkStructure();
    ensureUniqueLandmarks();

    // Add accessible names to SVGs
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        const accessibleName = getSvgAccessibleName(svg);
        setSvgAttributes(svg, accessibleName);
    });

    // Ensure unique landmarks
    const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"], [role="banner"], [role="complementary"], [role="search"]');
    const landmarkIds = new Set();
    landmarks.forEach(landmark => {
        if (landmark.id) {
            if (landmarkIds.has(landmark.id)) {
                const newId = createUniqueLandmarkId(landmark.getAttribute('role') || 'landmark');
                landmark.id = newId;
            } else {
                landmarkIds.add(landmark.id);
            }
        } else {
            landmark.id = createUniqueLandmarkId(landmark.getAttribute('role') || 'landmark');
        }
    });

    // Validate link accessibility
    validateLinkAccessibility();

    // Fix fake link issues
    handleFakeLinks();

    // Fix button identifiers
    const buttons = document.querySelectorAll('button, [role="button"]');
    buttons.forEach((button, index) => {
        if (!button.id) {
            button.id = `accessible-button-${index}`;
        }
    });

    // Google sign-in accessibility
    const googleButton = document.querySelector('[data-google-signin]');
    if (googleButton) {
        googleButton.setAttribute('aria-label', 'Sign in with Google');
        googleButton.setAttribute('role', 'button');
    }

    // Validate table structure and accessibility
    const table = document.getElementById('myTable');
    if (table) {
        validateTableAccessibility(table);
        validateTableStructure(table);
    }

    // Add/fix landmark issues
    validateLandmark();
    validateLandmarkStructure();
    ensureUniqueLandmarks();

    // Add accessible names to SVGs
    const svg = document.getElementById('mySvg');
    if (svg) {
        const accessibleName = getSvgAccessibleName(svg);
        setSvgAttributes(svg, accessibleName);
    }

    // Ensure unique landmarks
    createUniqueLandmarkId('main-content');

    // Validate link accessibility (New Function)
    checkLinkAccessibility();

    // Handle fake links
    handleFakeLinks();

    // Handle fake link issues
    handleAccessibilityErrors();
}

function createInPageButton() {
    // Create an accessible in-page button for navigation
    const doc = getDocument();
    if (!doc) return null;
    const button = doc.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', 'Navigate to section');
    return button;
}

function setSvgAttributes(svg, accessibleName) {
    if (!svg) return;
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        svg.setAttribute('aria-label', accessibleName);
    }
}

// Render functions
function renderPage(data) {
    // Code to render the page
}

function renderAccessibilityPage() {
    fixAccessibilityIssues();
    renderDependencyGraph(dependencyGraphContent);
    renderIndex();
}

function renderDependencyGraph(data) {
    // Code to render the dependency graph
    console.log('Rendering dependency graph for:', data);
}

function renderIndex() {
    // Code to render the index view
}

// Product functions
function formatProductName(product) {
    return `${product.name} - ${product.category}`;
}

function renderProductCard(product) {
    return `<div class="product-card">${formatProductName(product)}</div>`;
}

function renderProductList(products) {
    const doc = getDocument();
    const container = doc ? doc.getElementById('product-list') : null;
    if (container) {
        container.innerHTML = products.map(renderProductCard).join('');
    }
    return container;
}

// Cart functions
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

function formatDate(date) {
    return date.toLocaleDateString();
}

function calculateDiscount(subtotal) {
    return 0;
}

function calculateTotalPrice(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = calculateDiscount(subtotal);
    return subtotal - discount;
}

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

function validateInput(input) {
    return input && input.products && Array.isArray(input.products);
}

function validateAndRender(input) {
    if (validateInput(input)) {
        return renderProductList(input.products);
    }
}

// Main game loop
function mainLoop() {
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
}

// Utility functions (placeholder implementations)
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

function formatDate(date) {
    return date.toLocaleDateString();
}

function calculateDiscount(amount) {
    return 0; // Placeholder
}

function validateInput(input) {
    return !!input;
}

function renderProductCard(product) {
    return `<div class="product-card">${product.name}</div>`;
}

// Export accessibility utility functions
module.exports.makeHeaderFocusable = makeHeaderFocusable;

// Export UI / product functions
module.exports.checkLinkAccessibility = checkLinkAccessibility;
module.exports.displayModuleStructure = displayModuleStructure;
module.exports.formatProductName = formatProductName;
module.exports.renderProductList = renderProductList;
module.exports.calculateTotalPrice = calculateTotalPrice;
module.exports.renderCart = renderCart;
module.exports.validateAndRender = validateAndRender;
module.exports.renderPage = renderPage;
module.exports.renderAccessibilityPage = renderAccessibilityPage;

// Export accessibility functions
module.exports.getLangAttribute = getLangAttribute;
module.exports.createInPageButton = createInPageButton;
module.exports.validateTableAccessibility = validateTableAccessibility;
module.exports.validateTableStructure = validateTableStructure;
module.exports.validateLandmark = validateLandmark;
module.exports.validateLandmarkStructure = validateLandmarkStructure;
module.exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
module.exports.getSvgAccessibleName = getSvgAccessibleName;
module.exports.setSvgAttributes = setSvgAttributes;
module.exports.validateLinkAccessibility = validateLinkAccessibility;
module.exports.handleFakeLinks = handleFakeLinks;
module.exports.fixFakeLinkIssues = fixFakeLinkIssues;
module.exports.createAccessibleLink = createAccessibleLink;
module.exports.fixAccessibilityIssues = fixAccessibilityIssues;
module.exports.addLangAttribute = addLangAttribute;
module.exports.addAriaLabel = addAriaLabel;
module.exports.handleAccessibilityErrors = handleAccessibilityErrors;
module.exports.createUniqueLandmarkId = createUniqueLandmarkId;
module.exports.handleAccessibilityIssues = handleAccessibilityIssues;

// Export utility functions
module.exports.formatCurrency = formatCurrency;
module.exports.formatDate = formatDate;
module.exports.calculateDiscount = calculateDiscount;
module.exports.validateInput = validateInput;
module.exports.renderProductCard = renderProductCard;

// Export helper functions
module.exports.getDocument = getDocument;
module.exports.getFullLangAttribute = getFullLangAttribute;
module.exports.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
module.exports.addAriaToFormControls = addAriaToFormControls;
module.exports.addFixLandmarkIssues = addFixLandmarkIssues;

// Export game logic functions
module.exports.harvest = harvest;
module.exports.upgradeController = upgradeController;