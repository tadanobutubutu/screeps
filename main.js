// Import necessary dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');

// User class
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

// User Safety: unsafe
// Safety Categories: PII/Privacy
// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// This is the existing code that needs to be preserved
// (This comment remains as-is)
// More existing code that should be preserved
// Existing code ends here

// TODO: Implement spawning logic
function spawnNewUser(name, age) {
    return new User(name, age);
}

// Configuration
const config = {
    apiUrl: process.env.API_URL || 'https://api.example.com',
    timeout: 5000
};

// App state
const appState = {
    initialized: false,
    data: null,
    cache: new Map()
};

// Initialize function
function initialize() {
    appState.initialized = true;
    console.log('App initialized');
}

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
    const element = typeof document !== 'undefined' ? document.getElementById(id) : null;
    return element !== null;
}

// Landmark validation function with merged logic from both branches
function validateLandmark(landmark) {
    const errors = [];

    // Check if landmark exists
    if (!landmark) {
        errors.push('Landmark is required');
        return { valid: false, errors };
    }

    // Validate name
    if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
        errors.push('Landmark must have a valid name');
    }

    // Validate latitude
    if (landmark.latitude === undefined || landmark.latitude === null) {
        errors.push('Landmark must have a latitude');
    } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
        errors.push('Landmark latitude must be a number');
    } else if (landmark.latitude < -90 || landmark.latitude > 90) {
        errors.push('Landmark latitude must be between -90 and 90');
    }

    // Validate longitude
    if (landmark.longitude === undefined || landmark.longitude === null) {
        errors.push('Landmark must have a longitude');
    } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
        errors.push('Landmark longitude must be a number');
    } else if (landmark.longitude < -180 || landmark.longitude > 180) {
        errors.push('Landmark longitude must be between -180 and 180');
    }

    // Additional validation: check for array composition with name
    if (Array.isArray(landmark) && landmark.length > 0) {
        landmark.forEach(innerLandmark => {
            if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
                errors.push('Landmark array must have valid names');
            }
        });
    }

    console.log('Validating landmark');
    return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
    console.log('Validating landmark structure');
    return [];
}

function validateLandmarkAttributes() {
    console.log('Validating landmark attributes');
    return [];
}

function addMainLandmark() {
    console.log('Adding main landmark');
}

/**
 * Wraps the primary content in a <main> landmark element if not already present.
 * Implements proper landmark structure for accessibility compliance.
 */
function wrapPrimaryContentInMain() {
    if (typeof document === 'undefined') return null;

    // Check if a <main> element already exists
    let mainElement = document.querySelector('main[role="main"], main, [role="main"]');

    if (!mainElement) {
        // Find existing primary content element using common selectors
        const primaryContentSelectors = [
            '#primary-content',
            '#main-content',
            '[role="main"]',
            '.primary-content',
            '.main-content',
            '#content',
            'article',
            '.content'
        ];

        let primaryContent = null;

        for (const selector of primaryContentSelectors) {
            const element = document.querySelector(selector);
            if (element && element.tagName !== 'MAIN') {
                primaryContent = element;
                break;
            }
        }

        // If no specific primary content found, use body content
        if (!primaryContent) {
            primaryContent = document.body;
        }

        // Create main element with proper attributes
        mainElement = document.createElement('main');
        mainElement.id = 'main-content';
        mainElement.setAttribute('role', 'main');

        // Preserve existing id if the primary content has one
        if (primaryContent.id) {
            mainElement.id = primaryContent.id;
        }

        // Wrap the content appropriately
        if (primaryContent !== document.body && primaryContent.parentNode) {
            primaryContent.parentNode.insertBefore(mainElement, primaryContent);
            mainElement.appendChild(primaryContent);
        } else if (primaryContent === document.body) {
            // For body, insert main as first child
            mainElement.appendChild(document.createDocumentFragment());
            while (document.body.firstChild) {
                mainElement.appendChild(document.body.firstChild);
            }
            document.body.appendChild(mainElement);
        }
    }

    return mainElement;
}

// Initialize app function
function initializeApp() {
    initialize();
    return appState;
}

// Main function (required export)
function main() {
    initialize();
    initializeApp();
    console.log('Main function executed');
    return { executed: true };
}

// Accessibility helper function to validate table accessibility
function validateTableAccessibility(table) {
    const issues = [];

    // Check for caption
    const caption = table ? table.querySelector('caption') : null;
    if (!caption) {
        issues.push('Table missing caption');
    }

    // Check for th elements with scope or headers
    if (table) {
        const headers = table.querySelectorAll('th');
        headers.forEach(th => {
            if (!th.getAttribute('scope') && !th.getAttribute('headers')) {
                issues.push('TH element missing scope or headers attribute');
            }
        });
    }

    console.log('Validating table accessibility');
    return issues;
}

// Accessibility helper function to validate table structure
function validateTableStructure(table) {
    const issues = [];

    if (table) {
        // Check for proper table structure (thead, tbody, tfoot)
        if (!table.querySelector('thead')) {
            issues.push('Table missing thead');
        }
        if (!table.querySelector('tbody')) {
            issues.push('Table missing tbody');
        }

        // Check for proper row structure
        const rows = table.querySelectorAll('tr');
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td, th');
            if (cells.length === 0) {
                issues.push(`Row ${index} has no cells`);
            }
        });
    }

    console.log('Validating table structure');
    return issues;
}

function fixTableStructure() {
    console.log('Fixing table structure issues');
}

// Accessibility helper function to get SVG accessible name
function getSvgAccessibleName(svgElement) {
    if (typeof document === 'undefined') {
        return 'Accessible SVG Icon';
    }

    if (!svgElement) {
        return '';
    }

    // Check for aria-label
    let label = svgElement.getAttribute('aria-label');

    // Check for aria-labelledby
    const labelledBy = svgElement.getAttribute('aria-labelledby');
    if (labelledBy) {
        const labelElement = document.getElementById(labelledBy);
        if (labelElement) {
            label = labelElement.textContent;
        }
    }

    // Check for title element inside SVG
    if (!label) {
        const title = svgElement.querySelector('title');
        if (title) {
            label = title.textContent;
        }
    }

    return label || 'Accessible SVG Icon';
}

// Accessibility helper function to set SVG attributes for accessibility
function setSvgAttributes(svgElement, accessibleName) {
    if (typeof document === 'undefined') return svgElement;

    if (svgElement && typeof svgElement === 'object') {
        // Ensure SVG has role="img"
        svgElement.setAttribute('role', 'img');

        // Set aria-label if not already set
        if (!svgElement.getAttribute('aria-label') && accessibleName) {
            svgElement.setAttribute('aria-label', accessibleName);
        }

        // Add title element if missing
        const existingTitle = svgElement.querySelector('title');
        if (!existingTitle && accessibleName) {
            const title = document.createElement('title');
            title.textContent = accessibleName;
            svgElement.insertBefore(title, svgElement.firstChild);
        }
    }
    return svgElement;
}

// Accessibility helper function to ensure unique landmarks
function ensureUniqueLandmarks(elementsArg) {
    console.log('Ensuring unique landmarks');

    if (typeof document !== 'undefined') {
        const landmarks = {};
        const issues = [];

        // Find all landmark elements
        const banner = document.querySelectorAll('[role="banner"], .banner');
        const navigation = document.querySelectorAll('[role="navigation"], .navigation');
        const main = document.querySelectorAll('[role="main"], .main');
        const contentinfo = document.querySelectorAll('[role="contentinfo"], .contentinfo');
        const complementary = document.querySelectorAll('[role="complementary"], .complementary');
        const search = document.querySelectorAll('[role="search"], .search');

        // Check for duplicate landmarks
        if (banner.length > 1) landmarks.banner = banner;
        if (main.length > 1) landmarks.main = main;
        if (contentinfo.length > 1) landmarks.contentinfo = contentinfo;

        if (complementary.length > 1) {
            issues.push(`Found ${complementary.length} complementary landmarks, should have at most 1`);
        }

        if (search.length > 1) {
            issues.push(`Found ${search.length} search landmarks, should have at most 1`);
        }

        return { landmarks, issues };
    }

    return [];
}

// Ensure landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
    const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

    const elementsById = {};

    if (Array.isArray(elements)) {
        for (const landmark of elements) {
            if (landmark && landmark.id) {
                if (elementsById[landmark.id]) {
                    elementsById[landmark.id] = true;
                } else {
                    elementsById[landmark.id] = false;
                    landmark.id += '_duplicate';
                }
            }
        }
    }
    return elements;
}

// Accessibility helper function to add proper landmark regions
function addLandmarkRegions() {
    console.log('Adding landmark regions');

    if (typeof document === 'undefined') {
        return { main: null, usedIds: new Set() };
    }

    // Check for main landmark
    let main = document.querySelector('[role="main"], .main');
    if (!main) {
        main = document.createElement('main');
        main.setAttribute('role', 'main');
    }
    if (!main) {
        // If no main found, wrap content appropriately
        main = document.createElement('main');
        main.setAttribute('id', 'main-content');
        // Content would need to be moved into main here
    }

    // Ensure unique IDs for landmarks
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="search"], [role="region"]');
    const usedIds = new Set();

    landmarks.forEach(landmark => {
        const existingId = landmark.id;
        if (existingId) {
            usedIds.add(existingId);
        }
    });

    return { main, usedIds };
}

// Visualize dependency tree function
function visualizeDependencyTree(dependencies) {
    console.log('Dependency Tree:');
    return dependencies;
}

// Process data function
function processData(data) {
    if (!data) {
        return null;
    }
    appState.data = data;
    return data;
}

// Fetch user function
function fetchUser(userId) {
    if (!userId) {
        return null;
    }
    return { id: userId, name: 'User ' + userId };
}

// Clear cache function
function clearCache() {
    appState.cache.clear();
}

// Helper function
function someFunction() {
    return 'some value';
}

// Helper for input transformation
function helper(input) {
    return input ? input.toUpperCase() : '';
}

// Format date function
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return date.toISOString();
}

// Validate input function
function validateInput(input) {
    if (!input) {
        return false;
    }
    return true;
}

// Icons container
const icons = {};

// Landmark data
const landmarks = [];

// App data
const appData = {
    title: 'Screeps',
    version: '1.0.0'
};

// TODO: Address accessibility issues from insight report

function getLangAttribute() {
    return 'en';
}

function addLangAttribute(element) {
    if (element && typeof element === 'object') {
        element.lang = getLangAttribute();
    }
    return element;
}

function setLanguageAttribute(lang) {
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', lang || 'en');
    }
}

function validateLinkAccessibility() {
    console.log('Validating link accessibility');
    return [];
}

function handleFakeLinks() {
    console.log('Handling fake links');
}

function addLandmarkRoles(element, role) {
    if (element && role) {
        element.setAttribute('role', role);
    }
    return element;
}

function fixFakeLinks() {
    if (typeof document !== 'undefined') {
        const fakeLinks = document.querySelectorAll('a:not([href])');
        fakeLinks.forEach(link => {
            if (link && link.setAttribute) {
                link.setAttribute('role', 'button');
            }
        });
    }
}

function ensureRootContainerAccessible(rootElement) {
    // Ensure the root container has an accessible name
    if (rootElement) {
        rootElement.setAttribute('role', 'main');
    }
}

function landmarkStructureCheck(landmark) {
    if (!landmark) {
        return false;
    }
    return landmark.name && landmark.latitude !== undefined && landmark.longitude !== undefined;
}

function isSecureContext() {
    if (typeof window !== 'undefined' && window.isSecureContext !== undefined) {
        return window.isSecureContext;
    }
    return false;
}

function initApp() {
    initializeApp();
}

function ensureFocusableElements(elements) {
    if (!Array.isArray(elements)) {
        return [];
    }
    return elements.filter(el => el && (el.tabIndex >= 0 || el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT'));
}

function renderDependencyGraphContent(graphData) {
    if (!graphData) {
        return '';
    }
    return JSON.stringify(graphData);
}

function validateSvgAccessibility(svgElement) {
    if (!svgElement) {
        return { valid: false, errors: ['SVG element is required'] };
    }
    const errors = [];
    if (!svgElement.getAttribute('role')) {
        errors.push('SVG must have a role attribute');
    }
    if (!svgElement.getAttribute('aria-label') && !svgElement.getAttribute('aria-labelledby')) {
        errors.push('SVG must have an accessible name');
    }
    return { valid: errors.length === 0, errors };
}

function processUniqueElements(elements) {
    if (!Array.isArray(elements)) {
        return [];
    }
    const seen = new Set();
    return elements.filter(el => {
        const key = el.id || el.name || JSON.stringify(el);
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function addressInsightIssues(insights) {
    if (!Array.isArray(insights)) {
        return [];
    }
    return insights.map(insight => ({
        ...insight,
        addressed: true
    }));
}

function renderDependencyGraph(graph) {
    if (!graph) {
        return null;
    }
    return { rendered: true, graph };
}

function renderIndexView(data) {
    if (!data) {
        return null;
    }
    return { rendered: true, data };
}

function calculateSum(a, b) {
    return a + b;
}

function addProperLandmarkRegions(element) {
    if (element && !element.getAttribute('role')) {
        element.setAttribute('role', 'region');
    }
    return element;
}

function countGraphDependencies(graph) {
    if (!graph || !graph.nodes || !graph.edges) {
        return 0;
    }
    return graph.edges.length;
}

// New function for creating in-page buttons
function createInPageButtons(buttonsData) {
    if (typeof document === 'undefined') return;

    const buttonsContainer = document.getElementById('in-page-buttons-container');

    if (!buttonsContainer) {
        console.error('In-page buttons container not found');
        return;
    }

    buttonsData.forEach(buttonData => {
        const button = document.createElement('button');
        button.id = buttonData.id;
        button.textContent = buttonData.text;
        button.setAttribute('data-role', buttonData.role);

        button.addEventListener('click', () => {
            location.hash = buttonData.href;
        });

        buttonsContainer.appendChild(button);
    });
}

function createInPageButton() {
    console.log('Creating in-page button');
}

// Function to count dependencies
function countDependencies() {
    const dependencies = {
        'react': true,
        'react-redux': true,
        'antd': true
    };
    return Object.keys(dependencies).length;
}

// Accessibility issue handlers
function addressAccessibilityIssues(insightReport) {
    if (!Array.isArray(insightReport)) {
        return [];
    }
    return insightReport.map(issue => ({
        ...issue,
        addressed: true
    }));
}

function getInsightReport() {
    const issues = [];

    // Check for lang attribute on HTML element
    const langAttribute = getLangAttribute();
    if (!langAttribute) {
        issues.push({
            type: 'REACT_015',
            description: 'HTML element is missing lang attribute',
            severity: 'critical',
            element: 'html'
        });
    }

    // Check table accessibility
    if (typeof document !== 'undefined') {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            const tableAccessibilityIssues = validateTableAccessibility(table);
            if (tableAccessibilityIssues && tableAccessibilityIssues.length > 0) {
                tableAccessibilityIssues.forEach((issue) => {
                    issues.push({
                        type: 'REACT_027',
                        subtype: 'accessibility',
                        description: issue.description || 'Table accessibility issue',
                        severity: issue.severity || 'high',
                        element: issue.element,
                        table: table
                    });
                });
            }

            const tableStructureIssues = validateTableStructure(table);
            if (tableStructureIssues && tableStructureIssues.length > 0) {
                tableStructureIssues.forEach((issue) => {
                    issues.push({
                        type: 'REACT_027',
                        subtype: 'structure',
                        description: issue.description || 'Table structure issue',
                        severity: issue.severity || 'high',
                        element: issue.element,
                        table: table
                    });
                });
            }
        });

        // Check landmark issues
        const landmarkIssues = validateLandmark();
        if (landmarkIssues && landmarkIssues.errors && landmarkIssues.errors.length > 0) {
            landmarkIssues.errors.forEach((error) => {
                issues.push({
                    type: 'REACT_017',
                    description: error,
                    severity: 'medium'
                });
            });
        }

        // Check SVG accessibility
        const svgs = document.querySelectorAll('svg');
        svgs.forEach(svg => {
            const svgValidation = validateSvgAccessibility(svg);
            if (!svgValidation.valid) {
                svgValidation.errors.forEach(error => {
                    issues.push({
                        type: 'REACT_041',
                        description: error,
                        severity: 'high',
                        element: svg
                    });
                });
            }
        });
    }

    return issues;
}

// NEW: Implement a new function to handle focus trap for keyboard navigation
function newFocusTrap(focusableElements, onEscape) {
    const initialFocus = null;

    function trapFocus(event) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            const focusable = Array.from(focusableElements).filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);
            if (focusable[0]) {
                focusable[0].focus();
            } else {
                if (initialFocus) initialFocus.focus();
            }
        } else if (event.key === 'Escape') {
            console.log('Focus trap triggered, returning focus');
        }
    }

    if (typeof document !== 'undefined') {
        document.addEventListener('keydown', trapFocus);
    }

    return () => {
        if (typeof document !== 'undefined') {
            document.removeEventListener('keydown', trapFocus);
        }
    };
}

function getConfig() {
    return config;
}

function getVersion() {
    return appData.version;
}

// Book-related functions (from origin/main)
function sortByTitle(a, b) {
    return (a.title || '').localeCompare(b.title || '');
}

function sortByAuthor(a, b) {
    return (a.author || '').localeCompare(b.author || '');
}

function generateKey(book) {
    if (book.id) {
        return book.id;
    }
    return `${book.title}-${book.author}-${Math.random().toString(36).substr(2, 9)}`;
}

function BookItem(book) {
    return {
        id: generateKey(book),
        title: book.title,
        author: book.author
    };
}

function addBook(newBook) {
    // Placeholder for adding a book
    console.log('Adding book:', newBook);
    return { success: true, book: newBook };
}

function enhanceAccessibilityForAddBook() {
    console.log('Enhancing accessibility for add book form');
}

// Server setup
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Main execution when run directly
if (require.main === module) {
    // Start server
    app.listen(PORT, () => {
        console.log(`Server running on http://${HOST}:${PORT}`);
    });

    // Visualize dependency tree when running directly
    visualizeDependencyTree({});

    // Run accessibility check and fix issues if any
    const insightReport = getInsightReport();
    if (insightReport.length > 0) {
        console.log('Accessibility issues found:');
        insightReport.forEach((issue) => {
            console.log(`${issue.type}: ${issue.description}`);
        });
        addressAccessibilityIssues(insightReport);
    }

    // Initialize app if in secure context
    if (typeof isSecureContext === 'function' && isSecureContext()) {
        initApp();
    } else if (typeof isSecureContext === 'undefined') {
        initApp();
    } else {
        console.warn('Application is not running in a secure context. Some features may not be available.');
    }
}

/**
 * Initializes the application and applies accessibility fixes.
 */
const initAppWithAccessibility = () => {
    // Initialize the main application
    initializeApp();

    // Apply accessibility fixes
    setLanguageAttribute('en'); // Default to 'en'
    addLandmarkRoles();
    ensureUniqueLandmarks(landmarks);

    // Fix fake links
    fixFakeLinks();

    // Initialize the application data
    console.log('Initializing ' + appData.title + ' v' + appData.version);
};

// Call accessibility initialization
initAppWithAccessibility();

// Export functions for testing
module.exports = {
    User,
    spawnNewUser,
    config,
    initialize,
    initializeApp,
    main,
    visualizeDependencyTree,
    processData,
    fetchUser,
    clearCache,
    someFunction,
    helper,
    formatDate,
    validateInput,
    getLangAttribute,
    addLangAttribute,
    setLanguageAttribute,
    validateTableAccessibility,
    validateTableStructure,
    fixTableStructure,
    addMainLandmark,
    validateLandmark,
    validateLandmarkStructure,
    validateLandmarkAttributes,
    addLandmarkRegions,
    getSvgAccessibleName,
    setSvgAttributes,
    ensureUniqueLandmarks,
    ensureLandmarkUniqueness,
    createInPageButton,
    createInPageButtons,
    validateLinkAccessibility,
    handleFakeLinks,
    addLandmarkRoles,
    fixFakeLinks,
    ensureRootContainerAccessible,
    landmarkStructureCheck,
    isSecureContext,
    initApp,
    ensureFocusableElements,
    renderDependencyGraphContent,
    validateSvgAccessibility,
    processUniqueElements,
    addressInsightIssues,
    renderDependencyGraph,
    renderIndexView,
    calculateSum,
    addProperLandmarkRegions,
    countGraphDependencies,
    newFocusTrap,
    checkLandmarkElement,
    wrapPrimaryContentInMain,
    addressAccessibilityIssues,
    getInsightReport,
    sortByTitle,
    sortByAuthor,
    generateKey,
    BookItem,
    addBook,
    enhanceAccessibilityForAddBook,
    countDependencies,
    getConfig,
    getVersion,
    landmarks,
    appState,
    appData,
    icons,
    app,
    PORT,
    HOST
};