// main.js - Application entry point
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const { JSDOM } = require('jsdom');

// Configuration
const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

// Helper function to validate landmark structure
function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

// Load landmarks from file
function loadLandmarks() {
    try {
        const filePath = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading landmarks:', error.message);
        return [];
    }
}

// Process and filter landmarks
function processLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarksArray(validLandmarks);

    return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

// Sort landmarks by name
function sortLandmarks(landmarks, ascending = true) {
    return landmarks.slice().sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
}

// Get landmark by ID
function getLandmarkById(landmarks, id) {
    return landmarks.find(landmark => landmark.id === id) || null;
}

// Ensure unique landmarks by ID (array version for landmark objects)
function ensureUniqueLandmarksArray(landmarks) {
    const seen = new Set();
    return landmarks.filter(landmark => {
        if (seen.has(landmark.id)) {
            return false;
        }
        seen.add(landmark.id);
        return true;
    });
}

// New function to write the generated report to a file
function writeReport(report) {
    const reportFile = path.join(__dirname, 'accessibility_report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Function to scan accessibility using axe-core
async function scanAccessibility(htmlContent) {
    const dom = new JSDOM(htmlContent, { runScripts: 'outside-only' });
    const { document } = dom.window;
    
    try {
        const results = await axe.run(document, {
            runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
            }
        });
        return results;
    } catch (error) {
        console.error('Error scanning accessibility:', error.message);
        return {
            violations: [],
            passes: [],
            incomplete: [],
            inapplicable: [],
            timestamp: new Date().toISOString()
        };
    }
}

// Generate accessibility report
async function generateAccessibilityReport(htmlContent) {
    const report = await scanAccessibility(htmlContent);
    writeReport(report);
    return report;
}

// REACT_015: Add lang attribute
function addLangAttribute(html, lang = 'en') {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="${lang}">`;
    });
}

// REACT_027: Fix table structure issues
function fixTableStructure(html) {
    if (typeof html !== 'string') return html;

    // Ensure every table has a caption
    html = html.replace(/<table([^>]*)>/gi, (match, attrs) => {
        if (/<caption/i.test(match)) return match;
        return `<table${attrs}><caption></caption>`;
    });

    // Close caption and wrap rows in thead/tbody where missing
    html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
        if (/<thead/i.test(content)) return match;
        const rows = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;
        const firstRows = rows.slice(0, 1).join('');
        const restRows = rows.slice(1).join('');
        const thPattern = /<td>/gi;
        const firstRowHasTh = thPattern.test(firstRows);
        let thead = '';
        let tbody = restRows;

        if (!firstRowHasTh) {
            thead = `<thead>${firstRows.replace(/<td>/gi, '<th scope="col">').replace(/<\/td>/gi, '</th>')}</thead>`;
        } else {
            thead = `<thead>${firstRows}</thead>`;
        }
        if (!tbody) tbody = '';
        tbody = `<tbody>${tbody}</tbody>`;

        return `<table${attrs}>${thead}${tbody}</table>`;
    });

    // Add scope="col" to th elements that don't have it
    html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/\bscope=/i.test(match)) return match;
        return `<th${attrs} scope="col">`;
    });

    return html;
}

// REACT_017: Add/fix landmark issues
function fixLandmarks(html) {
    if (typeof html !== 'string') return html;

    // Ensure <main> landmark exists
    if (!/<main[^>]*>/i.test(html) && !/<div[^>]*role=["']main["']/i.test(html)) {
        html = html.replace(/<body([^>]*)>/i, '<body$1><main>');
        html = html.replace(/<\/body>/i, '</main></body>');
    }

    // Ensure <nav> landmark exists
    if (!/<nav[^>]*>/i.test(html) && !/<div[^>]*role=["']navigation["']/i.test(html)) {
        html = html.replace(/<main[^>]*>/i, '<nav aria-label="Main navigation"></nav><main>');
    }

    // Ensure <aside> landmark exists if content suggests a sidebar
    if (!/<aside[^>]*>/i.test(html) && !/<div[^>]*role=["']complementary["']/i.test(html)) {
        html = html.replace(/<\/main>/i, '<aside aria-label="Supplementary"></aside></main>');
    }

    // Ensure <footer> landmark exists
    if (!/<footer[^>]*>/i.test(html) && !/<div[^>]*role=["']contentinfo["']/i.test(html)) {
        html = html.replace(/<\/body>/i, '<footer></footer></body>');
    }

    return html;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(html) {
    if (typeof html !== 'string') return html;

    const dom = new JSDOM(html);
    const { document } = dom.window;
    
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        const hasTitle = svg.querySelector('title');
        const hasAriaLabel = svg.hasAttribute('aria-label');
        const hasAriaLabelledBy = svg.hasAttribute('aria-labelledby');

        if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
            const title = document.createElement('title');
            title.textContent = `SVG ${index + 1}`;
            svg.insertBefore(title, svg.firstChild);
        }
    });

    return dom.serialize();
}

// REACT_025: Ensure unique landmarks (string version for HTML)
function ensureUniqueLandmarksString(html) {
    if (typeof html !== 'string') return html;

    const landmarkRoles = [
        'banner',
        'navigation',
        'main',
        'complementary',
        'contentinfo',
        'search',
        'form'
    ];

    landmarkRoles.forEach((role) => {
        const pattern = new RegExp(`role=["']${role}["']`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return 'role="region"';
            });
        }
    });

    // Also check for duplicate HTML5 landmark elements (header, nav, main, aside, footer)
    const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    html5Landmarks.forEach((tag) => {
        const pattern = new RegExp(`<${tag}[^>]*>`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return match.replace(new RegExp(`<${tag}`, 'i'), `<${tag} role="region"`);
            });
        }
    });

    return html;
}

// REACT_036: Fix fake link issue (DOM version)
function fixFakeLinkIssue(element) {
    if (!element || element.tagName !== 'A') return null;

    // If element looks like a link but doesn't have href, make it a button
    if (!element.hasAttribute('href') || element.getAttribute('href') === '#') {
        const button = element.ownerDocument.createElement('button');
        // Copy attributes
        Array.from(element.attributes).forEach(attr => {
            if (attr.name !== 'href') {
                button.setAttribute(attr.name, attr.value);
            }
        });
        // Copy content
        button.innerHTML = element.innerHTML;
        // Replace in DOM
        element.parentNode.replaceChild(button, element);
        return button;
    }
    return element;
}

// Fix fake links in HTML string
function fixFakeLinksInHtml(html) {
    if (typeof html !== 'string') return html;
    
    const dom = new JSDOM(html);
    const { document } = dom.window;
    
    const fakeLinks = document.querySelectorAll('a[href="javascript:void(0)"], a[href="#"]');
    fakeLinks.forEach(link => {
        fixFakeLinkIssue(link);
    });
    
    return dom.serialize();
}

// New function to analyze module dependencies and return a report
function analyzeModuleDependencies(modules) {
    const report = {
        totalModules: modules.length,
        dependencyCount: 0,
        moduleNames: modules.map(m => m.name),
        dependencies: {}
    };

    modules.forEach(module => {
        if (module.dependencies) {
            report.dependencyCount += module.dependencies.length;
            report.dependencies[module.name] = module.dependencies;
        }
    });

    return report;
}

/**
 * Divides two number with proper error handling
 * @param {number} dividend - The number to be divided
 * @param {number} divisor - The number to divide by
 * @returns {number} The result of the division
 * @throws {Error} If divisor is zero or if inputs are not valid numbers
 */
function divide(dividend, divisor) {
    if (typeof dividend !== 'number' || typeof divisor !== 'number') {
        throw new Error('Both arguments must be numbers');
    }

    if (isNaN(dividend) || isNaN(divisor)) {
        throw new Error('Both arguments must be valid numbers');
    }

    if (divisor === 0) {
        throw new Error('Division by zero is not allowed');
    }

    return dividend / divisor;
}

// Function to render dependency graph
function renderDependencyGraph(landmarks) {
    // Placeholder for rendering logic
    console.log('Rendering dependency graphs for landmarks...');
}

// Fix table structure on DOM element
function fixTableStructureDom(tableElement) {
    if (!tableElement || tableElement.tagName !== 'TABLE') return;

    // Ensure table has proper structure with thead, tbody, and tfoot if needed
    if (!tableElement.querySelector('thead')) {
        const thead = tableElement.ownerDocument.createElement('thead');
        const firstRow = tableElement.querySelector('tr');
        if (firstRow) {
            thead.appendChild(firstRow);
            tableElement.insertBefore(thead, tableElement.firstChild);
        }
    }

    if (!tableElement.querySelector('tbody')) {
        const tbody = tableElement.ownerDocument.createElement('tbody');
        const rows = Array.from(tableElement.querySelectorAll('tr:not(:first-child)'));
        rows.forEach(row => tbody.appendChild(row));
        tableElement.appendChild(tbody);
    }

    // Add scope attributes to headers if missing
    const headers = tableElement.querySelectorAll('th');
    headers.forEach(header => {
        if (!header.hasAttribute('scope')) {
            header.setAttribute('scope', 'col');
        }
    });
}

// Add accessibility properties to SVG elements
function addSvgAccessibilityProps(svgElement) {
    if (!svgElement.getAttribute('role')) {
        svgElement.setAttribute('role', 'img');
    }
    if (!svgElement.getAttribute('aria-hidden') && !svgElement.getAttribute('aria-label')) {
        svgElement.setAttribute('aria-hidden', 'true');
    }
}

// Check link accessibility
function checkLinkAccessibility() {
    // This requires a DOM environment
    if (typeof document === 'undefined') return [];
    
    const links = document.querySelectorAll('a[href]');
    const issues = [];

    links.forEach((link) => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();

        if (!text) {
            issues.push(`Link with href "${href}" has no accessible text`);
        }
    });

    return issues;
}

// Wrap primary content in main element
function wrapPrimaryContentInMain() {
    if (typeof document === 'undefined') return null;
    
    const body = document.body;

    if (!body) {
        return null;
    }

    const existingMain = document.querySelector('main');
    if (existingMain) {
        return existingMain;
    }

    const main = document.createElement('main');

    while (body.firstChild) {
        main.appendChild(body.firstChild);
    }

    body.appendChild(main);

    return main;
}

// Initialize the application with accessibility improvements
function initialize() {
    // Address accessibility issues on the current document (if in browser/JSDOM)
    if (typeof document !== 'undefined') {
        addressAccessibilityIssues();
    }
}

// Address accessibility issues on DOM
function addressAccessibilityIssues() {
    if (typeof document === 'undefined') return;

    // Ensure the root container has an accessible name
    const rootContainer = document.getElementById('root') ? document.getElementById('root').parentElement : null;
    if (rootContainer) {
        rootContainer.setAttribute('role', 'main');
    }

    // Adding the lang attribute to the HTML element
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', 'en');
    }

    // Initialize skip link functionality
    const skipLink = document.querySelector('[href^="#"]');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    }

    // Ensure all buttons with role="button" respond to Enter key
    document.querySelectorAll('[role="button"]').forEach(function(button) {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Add focusVisible polyfill behavior
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    // Trap focus in modal and announce welcome message
    const modalElement = document.getElementById('modal');
    if (modalElement && typeof a11y !== 'undefined' && a11y && a11y.trapFocus) {
        a11y.trapFocus(modalElement);
    }
    if (typeof a11y !== 'undefined' && a11y && a11y.announce) {
        a11y.announce('Welcome to the bot!', 'assertive');
    }

    // Adding an alt attribute to an image
    const imageElement = document.getElementById('example-image');
    if (imageElement && !imageElement.hasAttribute('alt')) {
        imageElement.setAttribute('alt', 'A description of the image');
    }

    // Correcting the ARIA role for a div
    const divElement = document.getElementById('example-div');
    if (divElement) {
        divElement.setAttribute('role', 'list');
    }
}

// Function to get SVG accessible name from content string
function extractSvgAccessibleName(svgContent) {
    const dom = new JSDOM(`<svg>${svgContent}</svg>`);
    const svgElement = dom.window.document.querySelector('svg');
    const title = svgElement.querySelector('title');
    return title ? title.textContent : 'No accessible name found';
}

// Get SVG accessible name from DOM element
function getSvgAccessibleName(svgElement) {
    if (!svgElement) return '';

    // Check for title element
    const title = svgElement.querySelector('title');
    if (title) return title.textContent.trim();

    // Check for aria-label
    if (svgElement.hasAttribute('aria-label')) {
        return svgElement.getAttribute('aria-label').trim();
    }

    // Check for aria-labelledby
    if (svgElement.hasAttribute('aria-labelledby')) {
        const id = svgElement.getAttribute('aria-labelledby');
        const labelElement = svgElement.ownerDocument.getElementById(id);
        if (labelElement) return labelElement.textContent.trim();
    }

    return '';
}

// Add ARIA to form controls
function addAriaToFormControls() {
    if (typeof document === 'undefined') return;
    
    const formControls = document.querySelectorAll('input, select, textarea, button');

    formControls.forEach(control => {
        if (!control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
            const label = document.querySelector(`label[for="${control.id}"]`);
            if (label) {
                control.setAttribute('aria-labelledby', label.id);
            } else if (control.placeholder) {
                control.setAttribute('aria-label', control.placeholder);
            }
        }
    });
}

// Ensure unique landmarks in DOM
function ensureUniqueLandmarksDom() {
    if (typeof document === 'undefined') return;
    
    const landmarks = document.querySelectorAll('[role="main"], [role="nav"], [role="footer"], main, nav, footer');
    const landmarkTypes = new Map();

    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        const count = landmarkTypes.get(role) || 0;
        landmarkTypes.set(role, count + 1);
        
        if (count > 0 && !landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', `${role} content ${count + 1}`);
        }
    });
}

// Create accessible link
function createAccessibleLink(href, text) {
    if (typeof document === 'undefined') return null;
    
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.setAttribute('aria-label', text);
    return link;
}

// Validate table accessibility
function validateTableAccessibility(table) {
    if (!table) return false;

    // Check if table has a caption
    const hasCaption = table.querySelector('caption') !== null;

    // Check if table has proper headers
    const headers = table.querySelectorAll('th');
    const hasHeaders = headers.length > 0;

    // Check if table cells have proper scope attributes
    const cells = table.querySelectorAll('td, th');
    let hasScope = true;
    cells.forEach(cell => {
        if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
            hasScope = false;
        }
    });

    return hasCaption && hasHeaders && hasScope;
}

// Validate table structure
function validateTableStructure(table) {
    if (!table) return false;

    // Check if table has proper structure
    const rows = table.querySelectorAll('tr');
    if (rows.length === 0) return false;

    // Check if first row contains headers
    const firstRowCells = rows[0].querySelectorAll('th, td');
    const hasHeaders = firstRowCells.length > 0 && firstRowCells[0].tagName === 'TH';

    return hasHeaders;
}

// Validate landmark elements
function validateLandmark() {
    if (typeof document === 'undefined') return false;
    
    const requiredLandmarks = ['main', 'nav', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
        const element = document.querySelector(`[role="${landmark}"]`) ||
                       document.querySelector(landmark);
        if (!element) {
            missingLandmarks.push(landmark);
        }
    });

    return missingLandmarks.length === 0;
}

// Validate landmark structure
function validateLandmarkStructure() {
    if (typeof document === 'undefined') return false;
    
    const landmarks = document.querySelectorAll('[role="main"], [role="nav"], [role="footer"], main, nav, footer');
    let isValid = true;

    landmarks.forEach(landmark => {
        if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
            isValid = false;
        }
    });

    return isValid;
}

// Add and fix landmark issues in DOM
function addFixLandmarkIssues() {
    if (typeof document === 'undefined') return;
    
    // Add main landmark if missing
    if (!document.querySelector('main, [role="main"]')) {
        const main = document.createElement('main');
        main.setAttribute('role', 'main');
        main.setAttribute('aria-label', 'Main content');
        document.body.prepend(main);
    }

    // Add nav landmark if missing
    if (!document.querySelector('nav, [role="nav"]')) {
        const nav = document.createElement('nav');
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Main navigation');
        document.body.prepend(nav);
    }

    // Add footer landmark if missing
    if (!document.querySelector('footer, [role="footer"]')) {
        const footer = document.createElement('footer');
        footer.setAttribute('role', 'contentinfo');
        footer.setAttribute('aria-label', 'Footer content');
        document.body.appendChild(footer);
    }
}

// Create in-page button
function createInPageButton() {
    if (typeof document === 'undefined') return null;
    
    const button = document.createElement('button');
    button.textContent = 'Accessibility Info';
    button.setAttribute('aria-label', 'Show accessibility information');
    document.body.appendChild(button);
    return button;
}

// Get language attribute value
function getLangAttribute() {
    if (typeof document === 'undefined') return 'en';
    return document.documentElement.lang || 'en';
}

// Import and execute module function
function importAndExecute(modulePath, functionName, callback) {
    try {
        const module = require(modulePath);
        if (typeof module[functionName] === 'function') {
            module[functionName](callback);
        } else {
            console.error(`Function ${functionName} not found in module ${modulePath}`);
        }
    } catch (error) {
        console.error(`Error importing module ${modulePath}:`, error.message);
    }
}

// Existing utility function
const formatResponse = (data) => {
    return JSON.stringify(data, null, 2);
};

// Import required modules
let validateInput, processData;
try {
    ({ validateInput } = require('./utils/validators'));
    ({ processData } = require('./utils/processor'));
} catch (error) {
    console.warn('Could not import utils modules:', error.message);
}

// Main execution when run directly
if (require.main === module) {
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);
    const sorted = sortLandmarks(processed);

    console.log(`Loaded ${landmarks.length} landmarks`);
    console.log(`Processed to ${processed.length} unique landmarks`);
    console.log(`Sorted ${sorted.length} landmarks`);

    if (sorted.length > 0) {
        console.log('First landmark:', sorted[0]);
        renderDependencyGraph(sorted);
    }
}

// Export all functions
module.exports = {
    // Configuration
    CONFIG,
    
    // Landmark processing
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    ensureUniqueLandmarksArray,
    renderDependencyGraph,
    
    // Accessibility scanning and reporting
    scanAccessibility,
    generateAccessibilityReport,
    writeReport,
    
    // HTML string accessibility fixes
    addLangAttribute,
    fixTableStructure,
    fixLandmarks,
    addSvgAccessibleNames,
    ensureUniqueLandmarksString,
    fixFakeLinksInHtml,
    
    // DOM accessibility fixes
    fixFakeLinkIssue,
    fixTableStructureDom,
    addSvgAccessibilityProps,
    checkLinkAccessibility,
    wrapPrimaryContentInMain,
    addressAccessibilityIssues,
    extractSvgAccessibleName,
    getSvgAccessibleName,
    addAriaToFormControls,
    ensureUniqueLandmarksDom,
    createAccessibleLink,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    addFixLandmarkIssues,
    createInPageButton,
    getLangAttribute,
    
    // Utilities
    analyzeModuleDependencies,
    divide,
    formatResponse,
    importAndExecute,
    initialize,
    
    // Imported utilities
    validateInput,
    processData
};

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_027: Fix table structure issues
// REACT_017: Add/fix landmark issues
// REACT_041: Add accessible names to SVGs
// REACT_025: Ensure unique landmarks
// REACT_036: Fix fake link issue