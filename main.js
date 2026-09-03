const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

// New function to add aria-label to an element
const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label)
  }
  return element
}

const primaryContent = (typeof document !== 'undefined') ? document.querySelector('main') || document.querySelector('#content') || document.querySelector('.content') || document.querySelector('article') || document.getElementById('primary-content') || document.body : null;

// Load configurations from package.json if it exists
function loadConfigurations() {
    try {
        const packagePath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            config.name = packageJson.name || 'dependency-counter';
            config.version = packageJson.version || '1.0.0';
            config.dependencies = packageJson.dependencies || {};
            config.devDependencies = packageJson.devDependencies || {};
            config.accessibility = packageJson.accessibility || {};
        }
    } catch (error) {
        console.error('Error loading configurations:', error.message);
    }
}

// Implement function to count dependencies
function countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies),
        devDependencies: Object.keys(devDependencies),
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

/**
 * Sanitize a filename by replacing invalid characters
 * @param {string} filename - The filename to sanitize
 * @returns {string} - Sanitized filename
 */
function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Process data items by adding metadata
 * @param {Array} items - Items to process
 * @returns {Array} - Processed items
 */
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

/**
 * Generate a unique session ID
 * @returns {string} - Generated session ID
 */
function generateSessionId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.floor(Math.random() * 1e9).toString(36).substring(0, 9);
    return timestamp + '-' + randomPart;
}

/**
 * Check if the user prefers reduced motion
 * @returns {boolean} True if the user prefers reduced motion
 */
function prefersReducedMotion() {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if the user prefers high contrast
 * @returns {boolean} True if the user prefers high contrast
 */
function prefersHighContrast() {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
    }
    return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Check if an element is a landmark element for accessibility
 * Landmark elements include: main, nav, aside, header, footer, section, article, form, search
 * @param {HTMLElement|string} element - The element or element tag name to check
 * @returns {boolean} True if the element is a landmark element
 */
function isLandmarkElement(element) {
    const landmarkTags = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form', 'search'];

    if (!element) {
        return false;
    }

    if (typeof element === 'string') {
        return landmarkTags.includes(element.toLowerCase());
    }

    if (element.tagName) {
        return landmarkTags.includes(element.tagName.toLowerCase());
    }

    return false;
}

function checkLandmarkAccessibility(container) {
    const landmarkCount = {};

    container.querySelectorAll('[role="main"], main, nav, header, footer, section, article, form, search').forEach(landmark => {
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        landmarkCount[role] = (landmarkCount[role] || 0) + 1;
    });

    return landmarkCount;
}

function validateLandmarkStructure(container) {
    const landmarkCount = {};

    container.querySelectorAll('[role="main"], main, nav, header, footer, section, article, form, search').forEach(landmark => {
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        landmarkCount[role] = (landmarkCount[role] || 0) + 1;
    });

    return missingRoles(['main', 'banner', 'contentinfo'], new Set(Object.keys(landmarkCount)));
}

function configureSvgAccessibility(svg) {
    if (svg && svg.setAttribute) {
        svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
        svg.setAttribute('aria-labelledby', accessibleName);
    }

    setSvgAttributes(svg);
}

function getSvgAccessibleName(svg) {
    if (!svg) return null;

    const title = svg.querySelector('title');
    if (title && title.textContent) {
        return title.textContent.trim();
    }

    const desc = svg.querySelector('desc');
    if (desc && desc.textContent) {
        return desc.textContent.trim();
    }

    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) {
        return ariaLabel.trim();
    }

    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const labeledElement = document.getElementById(ariaLabelledby);
        if (labeledElement && labeledElement.textContent) {
            return labeledElement.textContent.trim();
        }
    }

    return null;
}

function validateAccessibilityReport(report) {
    const errors = [];
    const details = {
        landmarks: { valid: true, errors: [] },
        uniqueLandmarks: { valid: true, errors: [] },
        tables: { valid: true, errors: [] },
        tablesStructure: { valid: true, errors: [] },
        svgs: { valid: true, errors: [] },
        links: { valid: true, errors: [] }
    };

    if (!report || typeof report !== 'object') {
        return {
            valid: false,
            errors: ['Accessibility report is required and must be an object'],
            details: details
        };
    }

    // Validate landmarks
    if (Array.isArray(report.landmarks)) {
        report.landmarks.forEach((landmark, index) => {
            const result = isLandmarkElement(landmark);
            if (!result.valid) {
                result.errors.forEach(err => {
                    errors.push(`Landmark ${index}: ${err}`);
                    details.landmarks.errors.push(`Landmark ${index}: ${err}`);
                });
                details.landmarks.valid = false;
            }
        });
    }

    // Validate unique landmarks
    if (typeof ensureUniqueLandmarks === 'function') {
        const uniqueLandmarksResult = ensureUniqueLandmarks();
        if (!uniqueLandmarksResult.valid) {
            uniqueLandmarksResult.errors.forEach(err => {
                errors.push(`Unique landmarks: ${err}`);
                details.uniqueLandmarks.errors.push(err);
            });
            details.uniqueLandmarks.valid = false;
        }
    }

    // Validate table accessibility
    if (Array.isArray(report.tables)) {
        report.tables.forEach((table) => {
            const accResult = validateTableAccessibility(table);
            if (!accResult.details.success) {
                accResult.details.errors.forEach(err => {
                    errors.push(`Table accessibility: ${err}`);
                    details.tables.errors.push(`Table: ${err}`);
                });
                details.tables.valid = false;
            }

            const structResult = validateTableStructure(table);
            if (!structResult.details.valid) {
                structResult.details.errors.forEach(err => {
                    errors.push(`Table structure: ${err}`);
                    details.tablesStructure.errors.push(`Table: ${err}`);
                });
                details.tablesStructure.valid = false;
            }
        });
    }

    // Validate SVG accessible names
    if (Array.isArray(report.svgs)) {
        report.svgs.forEach((svg, index) => {
            const name = getSvgAccessibleName(svg);
            if (!name || name.trim() === '') {
                const err = `SVG ${index} is missing accessible name`;
                errors.push(err);
                details.svgs.errors.push(err);
                details.svgs.valid = false;
            }
        });
    }

    // Validate link accessibility
    if (Array.isArray(report.links)) {
        report.links.forEach((link, index) => {
            const linkResult = isLinkAccessible(link);
            if (!linkResult.valid) {
                linkResult.errors.forEach(err => {
                    errors.push(`Link ${index}: ${err}`);
                    details.links.errors.push(`Link ${index}: ${err}`);
                });
                details.links.valid = false;
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors: errors,
        details: details
    };
}

module.exports = {
    setHtmlLangAttribute,
    detectAndSetLang,
    getLangAttribute,
    personName,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    validateAccessibilityReport,
    renderDependencyGraph,
    renderIndexView,
    buildDependencyGraph,
    buildBreadcrumbData,
    configureSvgAccessibility,
    getSvgAccessibleName
};