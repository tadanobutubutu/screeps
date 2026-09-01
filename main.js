// main.js
// Import any required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const axe = require('axe-core');

// Configuration - merged
const CONFIG = {
    landmarkRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
    requiredLandmarks: ['banner', 'navigation', 'main'],
    dataPath: './data',
    maxResults: 100,
    apiUrl: process.env.API_URL || 'https://example.com',
    timeout: 5000
};

// Alternative config style for backwards compatibility
const config = CONFIG;

// Landmark configuration
const LANDMARK_CONFIG = {
    landmarkRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
    requiredLandmarks: ['banner', 'navigation', 'main']
};

// Application state
let isInitialized = false;
const appData_originside = {};
const appState = {
    initialized: false,
    data: null,
    cache: new Map(),
    lang: 'en'
};

// Helper function to check if a link is accessible (HTTP version)
function checkLinkAccessibilityHTTP(linkUrl) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    return fetch(linkUrl, { method: 'HEAD', signal: controller.signal })
        .then(response => {
            clearTimeout(timeout);
            return response.ok;
        })
        .catch(() => {
            clearTimeout(timeout);
            return false;
        });
}

// Landmark functions
function isValidLandmark(element) {
    const role = element.getAttribute('role');
    return LANDMARK_CONFIG.landmarkRoles.includes(role);
}

function loadLandmarks() {
    const landmarks = [];
    const elements = document.querySelectorAll('[role]');
    elements.forEach(el => {
        const role = el.getAttribute('role');
        if (LANDMARK_CONFIG.landmarkRoles.includes(role)) {
            landmarks.push(el);
        }
    });
    return landmarks;
}

function processLandmarks(landmarks) {
    return landmarks.map(landmark => ({
        element: landmark,
        role: landmark.getAttribute('role'),
        label: landmark.getAttribute('aria-label') || '',
        id: landmark.id || ''
    }));
}

function sortLandmarks(landmarks) {
    const roleOrder = LANDMARK_CONFIG.landmarkRoles;
    return landmarks.sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));
}

function getLandmarkById(id) {
    const element = document.getElementById(id);
    if (element && isValidLandmark(element)) {
        return element;
    }
    return null;
}

// Helper for input transformation
function helper(input) {
    return input ? input.toUpperCase() : '';
}

// Helper function to format dates
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return date.toISOString().split('T')[0];
}

// Validate input helper
function validateInput(input) {
    return input && typeof input === 'string' && input.trim().length > 0;
}

// Process data helper
function processData(data) {
    if (!data) return null;
    return { ...data, processed: true };
}

// Initialize function
function initialize() {
    appState.initialized = true;
    console.log('App initialized');
}

// Initialize app function
function initializeApp() {
    initialize();
    return appState;
}

// Fetch user function
async function fetchUser(userId) {
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

// New function to analyze module dependencies and return a report
function analyzeModuleDependencies(modules) {
    const report = {
        totalModules: modules.length,
        dependencyCount: 0,
        moduleNames: modules.map(m => m.name),
        dependencies: {}
    };

    // Calculate dependency count and populate dependencies object
    modules.forEach(module => {
        if (module.dependencies) {
            report.dependencyCount += module.dependencies.length;
            report.dependencies[module.name] = module.dependencies;
        }
    });

    return report;
}

// Function to analyze accessibility issues
function analyzeAccessibility(issuesData) {
    // Implementation to analyze accessibility issues
    return issuesData || [];
}

// Function for generating a report based on accessibility issues
async function generateAccessibilityReport(url) {
    try {
        // Run axe-core scan
        const results = await axe.run(url);

        // Generate report content
        const report = {
            url: url,
            timestamp: new Date().toISOString(),
            violations: results.violations,
            passes: results.passes,
            incomplete: results.incomplete,
            summary: {
                violations: results.violations.length,
                passes: results.passes.length,
                incomplete: results.incomplete.length
            }
        };

        // Write report to file
        const reportName = `accessibility-report-${Date.now()}.json`;
        fs.writeFileSync(reportName, JSON.stringify(report, null, 2));

        return {
            success: true,
            reportFile: reportName,
            reportData: report
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Accessibility function for book form
function makeAddBookFormAccessible() {
    const form = document.querySelector('#addBookForm');
    if (!form) return;

    // Add ARIA attributes to the form
    form.setAttribute('role', 'form');
    form.setAttribute('aria-labelledby', 'addBookFormTitle');

    // Add labels to form fields
    const titleInput = form.querySelector('#bookTitle');
    if (titleInput) {
        titleInput.setAttribute('aria-label', 'Book Title');
        titleInput.setAttribute('required', 'true');
    }

    const authorInput = form.querySelector('#bookAuthor');
    if (authorInput) {
        authorInput.setAttribute('aria-label', 'Book Author');
        authorInput.setAttribute('required', 'true');
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.setAttribute('aria-label', 'Add Book to Collection');
    }

    // Make sure all form fields are focusable
    const inputs = form.querySelectorAll('input, textarea, select, button');
    inputs.forEach(input => {
        if (!input.hasAttribute('tabindex')) {
            input.setAttribute('tabindex', '0');
        }
    });
}

// Link accessibility functions
function validateLinkAccessibility() {
    // Implementation to validate link accessibility
}

function handleFakeLinks() {
    // Implementation to handle fake links
}

// Validate landmark functions
function validateLandmarkStructure() {
    // Implementation to validate landmark structure
}

function validateLandmarkAttributes() {
    // Implementation to validate landmark attributes
}

function addProperLandmarkRegions() {
    // Implementation to add proper landmark regions
}

// Function to scan pages for accessibility issues and generate a report
async function scanAccessibility() {
    const pagesDir = path.join(__dirname, 'pages');
    const filePaths = await fs.promises.readdir(pagesDir);
    const issues = [];

    for (const filePath of filePaths) {
        const fileEmitted = path.join(pagesDir, filePath);
        const { violations } = await axe.analyze(fileEmitted);

        if (violations.length > 0) {
            issues.push({
                file: filePath,
                issues: violations,
            });
        }
    }

    return issues;
}

/**
 * Adds accessibility properties to SVG elements
 * @param {SVGElement} svgElement - The SVG element to enhance
 */
function addSvgAccessibilityProps(svgElement) {
    if (!svgElement.getAttribute('role')) {
        svgElement.setAttribute('role', 'img');
    }
    if (!svgElement.getAttribute('aria-hidden') && !svgElement.getAttribute('aria-label')) {
        svgElement.setAttribute('aria-hidden', 'true');
    }
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

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute(html) {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="en">`;
    });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
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
        html = html.replace(
            /<body([^>]*)>/i,
            '<body$1><main>'
        );
        html = html.replace(/<\/body>/i, '</main></body>');
    }

    // Ensure <nav> landmark exists
    if (!/<nav[^>]*>/i.test(html) && !/<div[^>]*role=["']navigation["']/i.test(html)) {
        html = html.replace(
            /<main[^>]*>/i,
            '<nav aria-label="Main navigation"></nav><main>'
        );
    }

    // Ensure <aside> landmark exists if content suggests a sidebar
    if (!/<aside[^>]*>/i.test(html) && !/<div[^>]*role=["']complementary["']/i.test(html)) {
        html = html.replace(
            /<\/main>/i,
            '<aside aria-label="Supplementary"></aside></main>'
        );
    }

    // Ensure <footer> landmark exists
    if (!/<footer[^>]*>/i.test(html) && !/<div[^>]*role=["']contentinfo["']/i.test(html)) {
        html = html.replace(
            /<\/body>/i,
            '<footer></footer></body>'
        );
    }

    return html;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(html) {
    if (typeof html !== 'string') return html;

    const svgMatches = [...html.matchAll(/<svg([^>]*)>/gi)];
    let offset = 0;

    svgMatches.forEach((match, index) => {
        const fullMatch = match[0];
        const attrs = match[1];
        const svgStart = match.index + offset;
        const svgEnd = html.indexOf('</svg>', svgStart);

        if (svgEnd === -1) return;

        const svgContent = html.substring(svgStart, svgEnd + 6);
        const hasTitle = /<title/i.test(svgContent);
        const hasAriaLabel = /\baria-label=/i.test(attrs);
        const hasAriaLabelledBy = /\baria-labelledby=/i.test(attrs);

        if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
            const newSvg = fullMatch.replace(/>/, `><title>SVG ${index + 1}</title>`);
            const oldSvgLength = svgContent.length;
            html = html.substring(0, svgStart) + newSvg + html.substring(svgStart + oldSvgLength);
            offset += newSvg.length - oldSvgLength;
        }
    });

    return html;
}

// REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks(html) {
    if (typeof html !== 'string') return html;

    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];

    landmarkRoles.forEach(role => {
        const pattern = new RegExp(`role=["']${role}["']`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first occurrence, change subsequent ones
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return `role="region"`;
            });
        }
    });

    // Also check for duplicate HTML5 landmark elements (header, nav, main, aside, footer)
    const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    html5Landmarks.forEach(tag => {
        const pattern = new RegExp(`<${tag}[^>]*>`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first, add role="region" to others
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return match.replace(/^</, '<' + tag).replace(`<${tag}`, `<${tag} role="region"`);
            });
        }
    });

    return html;
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinks(html) {
    if (typeof html !== 'string') return html;

    // Find spans or divs with onclick that act as links and convert to <a>
    html = html.replace(
        /<span([^>]*)onclick=["']([^"']*)["']([^>]*)>/gi,
        (match, before, onclick, after) => {
            const hrefMatch = onclick.match(/window\.location\s*=\s*['"]([^'"]+)['"]/);
            if (hrefMatch) {
                return `<a href="${hrefMatch[1]}"${before}${after}>`;
            }
            return match;
        }
    );

    html = html.replace(/<\/span>/gi, '</a>');

    return html;
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes(html) {
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = addSvgAccessibleNames(result);
    result = ensureUniqueLandmarks(result);
    result = fixFakeLinks(result);
    return result;
}

// Here is the implementation for checking link accessibility
// The existing isLinkAccessible function implementation

function isLinkAccessible(linkElement) {
    if (!linkElement || !(linkElement instanceof HTMLElement)) {
        throw new Error('Invalid link element provided');
    }

    // Check if link has text content
    const hasTextContent = linkElement.textContent.trim().length > 0;

    // Check if link has aria-label or aria-labelledby
    const hasAriaLabel = linkElement.hasAttribute('aria-label') ||
                         linkElement.hasAttribute('aria-labelledby');

    // Check if link has title attribute
    const hasTitle = linkElement.hasAttribute('title');

    // Check if link has href attribute
    const hasHref = linkElement.hasAttribute('href');

    // Check if link is visible
    const isVisible = window.getComputedStyle(linkElement).display !== 'none' &&
                      window.getComputedStyle(linkElement).visibility !== 'hidden';

    // Check if link is focusable
    const isFocusable = linkElement.tabIndex >= 0 ||
                       (linkElement.tagName === 'A' && hasHref) ||
                       linkElement.tagName === 'BUTTON' ||
                       linkElement.tagName === 'INPUT' ||
                       linkElement.tagName === 'SELECT' ||
                       linkElement.tagName === 'TEXTAREA';

    // Check if link has sufficient color contrast
    const hasContrast = checkColorContrast(linkElement);

    return {
        hasTextContent,
        hasAriaLabel,
        hasTitle,
        hasHref,
        isVisible,
        isFocusable,
        hasContrast,
        isAccessible: hasTextContent && (hasAriaLabel || hasTitle) && hasHref && isVisible && isFocusable && hasContrast
    };
}

// Helper function to check color contrast
function checkColorContrast(element) {
    if (!element || !(element instanceof HTMLElement)) return false;

    const style = window.getComputedStyle(element);
    const bgColor = style.backgroundColor;
    const color = style.color;

    // Convert colors to RGB
    const bgRgb = parseColor(bgColor);
    const fgRgb = parseColor(color);

    if (!bgRgb || !fgRgb) return false;

    // Calculate luminance
    const bgLum = calculateLuminance(bgRgb);
    const fgLum = calculateLuminance(fgRgb);

    // Calculate contrast ratio
    const lighter = Math.max(bgLum, fgLum);
    const darker = Math.min(bgLum, fgLum);
    const contrastRatio = (lighter + 0.05) / (darker + 0.05);

    // WCAG AA standard requires at least 4.5:1 contrast for normal text
    return contrastRatio >= 4.5;
}

// Helper function to parse color strings to RGB
function parseColor(colorString) {
    if (!colorString) return null;

    // Handle rgb() format
    const rgbMatch = colorString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10)
        };
    }

    // Handle rgba() format (ignore alpha)
    const rgbaMatch = colorString.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)$/);
    if (rgbaMatch) {
        return {
            r: parseInt(rgbaMatch[1], 10),
            g: parseInt(rgbaMatch[2], 10),
            b: parseInt(rgbaMatch[3], 10)
        };
    }

    // Handle hex format
    const hexMatch = colorString.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
        const hex = hexMatch[1];
        if (hex.length === 3) {
            return {
                r: parseInt(hex[0] + hex[0], 16),
                g: parseInt(hex[1] + hex[1], 16),
                b: parseInt(hex[2] + hex[2], 16)
            };
        } else {
            return {
                r: parseInt(hex.substring(0, 2), 16),
                g: parseInt(hex.substring(2, 4), 16),
                b: parseInt(hex.substring(4, 6), 16)
            };
        }
    }

    // Handle named colors (limited support)
    const namedColors = {
        'black': {r: 0, g: 0, b: 0},
        'white': {r: 255, g: 255, b: 255},
        'red': {r: 255, g: 0, b: 0},
        'green': {r: 0, g: 128, b: 0},
        'blue': {r: 0, g: 0, b: 255}
    };

    return namedColors[colorString.toLowerCase()] || null;
}

// Helper function to calculate relative luminance
function calculateLuminance(rgb) {
    const sRGB = [rgb.r, rgb.g, rgb.b].map(c => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

// Ensure the dependencyGraph container has a proper ARIA role
function ensureDependencyGraphRole(container) {
    if (!container) return;
    if (!container.hasAttribute('role')) {
        container.setAttribute('role', 'graphics-document');
    }
    if (!container.hasAttribute('aria-label')) {
        container.setAttribute('aria-label', 'Dependency graph');
    }
}

function addressAccessibilityIssues(insightReport) {
    // Apply accessibility fixes to HTML content based on insight report
    if (insightReport && insightReport.html) {
        insightReport.html = applyAccessibilityFixes(insightReport.html);
    }
    console.log('Addressing accessibility issues from insight report:', insightReport);
}

function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    document.body.appendChild(button);
}

// Placeholder functions for functionA and functionB
function functionA() {
    // Implementation to be added
}

function functionB() {
    // Implementation to be added
}

// New function3 logic
function function3() {
    console.log('Function3 is running.');
}

// TODO: add the new functions or changes requested in the issue
// Implementation of the new requested function
function newRequestedFunction() {
    // Implementation of the new function
    // This is a placeholder - replace with actual implementation
    console.log('New function added as requested');
}

// Main application entry point
const app = express();

function main() {
    console.log('Main function executed');
    initializeApp();
}

// Re-add the required exports
module.exports = {
    addLangAttribute,
    fixTableStructure,
    fixLandmarks,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinks,
    applyAccessibilityFixes,
    addressAccessibilityIssues,
    createInPageButton,
    divide,
    functionA,
    functionB,
    function3,
    isLinkAccessible,
    checkColorContrast,
    parseColor,
    calculateLuminance,
    newRequestedFunction,
    analyzeAccessibility,
    generateAccessibilityReport,
    analyzeModuleDependencies,
    makeAddBookFormAccessible,
    validateLandmarkStructure,
    validateLandmarkAttributes,
    addProperLandmarkRegions,
    validateLinkAccessibility,
    handleFakeLinks,
    checkLinkAccessibilityHTTP,
    addSvgAccessibilityProps,
    scanAccessibility,
    ensureDependencyGraphRole,
    // Landmark functions
    isValidLandmark,
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    // Configuration and state
    CONFIG,
    config,
    app,
    appState,
    // Helper functions
    helper,
    formatDate,
    validateInput,
    processData,
    initialize,
    initializeApp,
    fetchUser,
    clearCache,
    someFunction
};

// Run if executed directly
if (require.main === module) {
    main();
}