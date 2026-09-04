const books = [];
const safetyCategory = "User Safety: safe";
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

const safetyCategories = ["Unauthorized Advice"];
const utils = require('./utils');

const config = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxResults: 100,
  dataPath: './data',
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

const CONFIG = Object.assign({}, config, { name: 'ScreepsBot' });

const landmarkSelectors = [
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="complementary"]',
  '[role="contentinfo"]',
  '[role="region"]',
  'header:not([role])',
  'nav:not([role])',
  'main:not([role])',
  'footer:not([role])',
  'section:not([role])'
];

let isInitialized = false;
const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function ensureUniqueLandmarks(landmarks, idField = 'id') {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const seen = new Set();
    const uniqueLandmarks = [];

    for (const landmark of landmarks) {
        if (!landmark || typeof landmark[idField] === 'undefined') {
            continue;
        }

        const landmarkId = typeof landmark[idField] === 'string' ? landmark[idField] : String(landmark[idField]);

        if (!seen.has(landmarkId)) {
            seen.add(landmarkId);
            uniqueLandmarks.push(landmark);
        }
    }

    return uniqueLandmarks;
}

function validateLandmark(landmark) {
    const validRoles = ['main', 'navigation', 'banner', 'contentinfo', 'search', 'complementary', 'form', 'region'];
    const role = landmark.getAttribute('role');
    return validRoles.includes(role);
}

function validateLandmarkStructure(landmarks) {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
        if (!document.querySelector(landmark)) {
            missingLandmarks.push(landmark);
        }
    });

    if (missingLandmarks.length > 0) {
        console.warn(`Accessibility warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
        return false;
    }

    return true;
}

function validateLandmarkAttributes(landmark) {
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledBy = landmark.getAttribute('aria-labelledby');
    return !!(ariaLabel || ariaLabelledBy || landmark.textContent.trim());
}

/**
 * Validates landmark structure for accessibility issues
 * @returns {boolean} True if landmark structure is valid
 */
function validateLandmarkStructure() {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
        if (!document.querySelector(landmark)) {
            missingLandmarks.push(landmark);
        }
    });

    if (missingLandmarks.length > 0) {
        console.warn(`Accessibility warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
        return false;
    }

    return true;
}

function getSvgAccessibleName(svg) {
    return svg.getAttribute('aria-label') ||
           svg.getAttribute('title') ||
           svg.querySelector('title')?.textContent ||
           'SVG graphic';
}

function setSvgAttributes(svg, name) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', name);
}

function createInPageButton() {
    const button = document.createElement('button');
    button.textContent = 'Skip to content';
    button.addEventListener('click', function() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.focus();
        }
    });
    return button;
}

/**
 * Validates link accessibility
 * @param {HTMLElement} link - The link element to validate
 * @returns {boolean} True if link is accessible
 */
function validateLinkAccessibility(link) {
    const text = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const ariaLabelledBy = link.getAttribute('aria-labelledby');
    return !!(text || ariaLabel || ariaLabelledBy);
}

/**
 * Handles fake links in the document
 */
function handleFakeLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (!validateLinkAccessibility(link)) {
            link.setAttribute('aria-label', 'Link to ' + (link.href || 'unknown destination'));
        }
    });
}

/**
 * Adds proper landmark regions to the document
 */
function addProperLandmarkRegions() {
    // Ensure document has proper landmark structure
    const header = document.querySelector('header');
    if (header && !header.getAttribute('role')) {
        header.setAttribute('role', 'banner');
    }

    const footer = document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
    }

    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('role')) {
        nav.setAttribute('role', 'navigation');
    }
}

/**
 * Generates a report based on accessibility issues
 * @returns {Object} The accessibility report
 */
function generateAccessibilityReport() {
    const issues = [];

    // Check for images without alt attributes
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
        if (!img.hasAttribute('alt')) {
            issues.push({
                type: 'missing-alt',
                element: 'img',
                index: index,
                message: `Image at index ${index} is missing an alt attribute`
            });
        }
    });

    // Check for buttons without accessible names
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn, index) => {
        const accessibleName = btn.textContent.trim() || btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby');
        if (!accessibleName) {
            issues.push({
                type: 'missing-name',
                element: 'button',
                index: index,
                message: `Button at index ${index} is missing an accessible name`
            });
        }
    });

    // Check for links without accessible names
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
        const accessibleName = link.textContent.trim() || link.getAttribute('aria-label') || link.getAttribute('aria-labelledby');
        if (!accessibleName) {
            issues.push({
                type: 'missing-name',
                element: 'a',
                index: index,
                message: `Link at index ${index} is missing an accessible name`
            });
        }
    });

    // Check for form inputs without labels
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
        const inputType = input.getAttribute('type');
        if (inputType && inputType !== 'hidden' && inputType !== 'submit' && inputType !== 'button' && inputType !== 'reset') {
            const labelId = input.getAttribute('aria-labelledby');
            const labelText = input.getAttribute('aria-label');
            const hasLabel = document.querySelector(`label[for="${input.id}"]`) || labelId || labelText;
            if (!hasLabel) {
                issues.push({
                    type: 'missing-label',
                    element: 'input',
                    index: index,
                    message: `Input at index ${index} is missing an associated label`
                });
            }
        }
    });

    if (!document.querySelector('header')) {
        issues.push({
            type: 'missing-header',
            element: 'header',
            message: 'Missing header element'
        });
    }

    if (!document.querySelector('nav')) {
        issues.push({
            type: 'missing-nav',
            element: 'nav',
            message: 'Missing navigation element'
        });
    }

    if (!document.querySelector('footer')) {
        issues.push({
            type: 'missing-footer',
            element: 'footer',
            message: 'Missing footer element'
        });
    }

    if (!document.querySelector('main')) {
        issues.push({
            type: 'missing-main',
            element: 'main',
            message: 'Missing main element'
        });
    }

    return {
        success: issues.length === 0,
        issues
    };
}

function validateLandmarkSingle(element) {
    const issues = [];
    const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

    if (!element.tagName) {
        issues.push('Missing tagName');
    } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
        issues.push('Invalid landmark: ' + element.tagName);
    }

    return {
        success: issues.length === 0,
        issues
    };
}

const validLandmarks = ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'];

// Re-implement functions and use cases as needed
const fixTableAccessibility = function (table) {
    // ... (implementation from origin/main)
};

const getSvgAccessibleName = function (svgElement) {
    // ... (implementation from origin/main)
};

const setSvgAttributes = function (svg, accessibleName) {
    // ... (implementation from origin/main)
};

const ensureUniqueLandmarks = function (landmarksArg) {
    // ... (implementation from origin/main)
};

const addLandmarkRoles = function () {
    // ... (implementation from origin/main)
};

const validateLinkAccessibility = function (link) {
    // ... (implementation from origin/main)
};

const handleFakeLinks = function () {
    // ... (implementation from origin/main)
};

const fixLinkAccessibility = function (links) {
    // ... (implementation from origin/main)
};

const createAccessibleLinks = function (links, ancestors) {
    // ... (implementation from origin/main)
};

const addKeyboardNavigation = function () {
    // ... (implementation from origin/main)
};

const addAriaLabels = function () {
    // ... (implementation from origin/main)
};

const addScreenReaderAnnouncements = function () {
    // ... (implementation from origin/main)
};

const addFocusTrap = function () {
    // ... (implementation from origin/main)
};

const fixTableStructureIssues = function (table) {
    // ... (implementation from origin/main)
};

const fixTableHeaderCellScope = function (table) {
    // ... (implementation from origin/main)
};

const addMainLandmark = function () {
    // ... (implementation from origin/main)
};

const ensureUniqueLandmarksCombined = function (landmarks) {
    // ... (implementation from origin/main)
};

const sortLandmarks = function (landmarks, ascending = true) {
    // ... (implementation from origin/main)
};

const getLandmarkById = function (landmarks, id) {
    // ... (implementation from origin/main)
};

const isValidLandmark = function (landmark) {
    // ... (implementation from origin/main)
};

const analyzeContentSafety = function () {
    // ... (implementation from origin/main)
};

const addressAccessibilityIssues = function () {
    // ... (implementation from origin/main)
};

const getUserSafety = function () {
    // ... (implementation from origin/main)
};

const getSafetyCategories = function () {
    // ... (implementation from origin/main)
};

const calculateDiscount = function (price, percentage) {
    // ... (implementation from origin/main)
};

module.exports = {
    fixTableAccessibility,
    getSvgAccessibleName,
    setSvgAttributes,
    ensureUniqueLandmarks,
    addLandmarkRoles,
    validateLinkAccessibility,
    handleFakeLinks,
    fixLinkAccessibility,
    createAccessibleLinks,
    addKeyboardNavigation,
    addAriaLabels,
    addScreenReaderAnnouncements,
    addFocusTrap,
    fixTableStructureIssues,
    fixTableHeaderCellScope,
    addMainLandmark,
    ensureUniqueLandmarksCombined,
    sortLandmarks,
    getLandmarkById,
    isValidLandmark,
    analyzeContentSafety,
    addressAccessibilityIssues,
    getUserSafety,
    getSafetyCategories,
    calculateDiscount
};

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
    }
}

async function scanAccessibility() {
    // Run axe-core scanning
    const axeResult = await axe.run({
        url: 'https://example.com', // Placeholder URL
        // other options...
    });

    const report = generateAccessibilityReport(axeResult);
    writeReport(report);
    return report;
}

// Helper functions for axe integration

async function handleCredentialResponse(response) {
    try {
        const parsed = JSON.parse(response);

        const credentials = parsed.credentials || {};

        if (Object.keys(credentials).length === 0) {
            console.warn('No credentials found in response');
            return {};
        }

        const validated = validateCredentials(credentials);

        if (validated) {
            console.log('Credentials successfully handled:', validated);
            return validated;
        } else {
            console.warn('Invalid credentials received');
            return {};
        }
    } catch (error) {
        console.error('Error processing credential response:', error.message);
        throw error;
    }
}

function addressAccessibilityIssues() {
    const rootContainer = document.getElementById('root');
    if (rootContainer) {
        rootContainer.setAttribute('role', 'main');
    }

    const skipLink = document.getElementById('skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            const targetId = skipLink.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    }

    document.querySelectorAll('[role="button"]').forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    a11y.announce('Welcome to the bot!', 'assertive');

    const imageElement = document.querySelector('.image-placeholder');
    if (imageElement) {
        imageElement.setAttribute('alt', 'A description of the image');
    }

    const divElement = document.querySelector('.list-container');
    if (divElement) {
        divElement.setAttribute('role', 'list');
    }

    const htmlElement = document.documentElement;
    if (htmlElement) {
        htmlElement.setAttribute('lang', getLangAttribute());
    }
}

const accessibilityUtils = {
    addressNewAccessibilityIssues: function(issues) {
        if (!issues || !Array.isArray(issues)) {
            return [];
        }
        return issues;
    }
};

function addLangAttribute(html) {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="en">`;
    });
}

function fixTableStructure(html) {
    if (typeof html !== 'string') return html;

    html = html.replace(/<table([^>]*)>/gi, (match, attrs) => {
        if (/<caption/i.test(match)) return match;
        return `<table${attrs}><caption></caption>`;
    });

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

    html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/\bscope=/i.test(match)) return match;
        return `<th${attrs} scope="col">`;
    });

    return html;
}

function fixLandmarks(html) {
    if (typeof html !== 'string') return html;

    if (!/<main[^>]*>/i.test(html) && !/<div[^>]*role=["']main["']/i.test(html)) {
        html = html.replace(
            /<body([^>]*)>/i,
            '<body$1><main>'
        );
        html = html.replace(/<\/body>/i, '</main></body>');
    }

    if (!/<nav[^>]*>/i.test(html) && !/<div[^>]*role=["']navigation["']/i.test(html)) {
        html = html.replace(
            /<main[^>]*>/i,
            '<nav aria-label="Main navigation"></nav><main>'
        );
    }

    if (!/<aside[^>]*>/i.test(html) && !/<div[^>]*role=["']complementary["']/i.test(html)) {
        html = html.replace(
            /<\/main>/i,
            '<aside aria-label="Supplementary"></aside></main>'
        );
    }

    if (!/<footer[^>]*>/i.test(html) && !/<div[^>]*role=["']contentinfo["']/i.test(html)) {
        html = html.replace(
            /<\/body>/i,
            '<footer></footer></body>'
        );
    }

    return html;
}

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
            html