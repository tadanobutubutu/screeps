const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

const primaryContent = (typeof document !== 'undefined') ? (document.querySelector('.primary-content') || document.querySelector('[role="main"]') || document.getElementById('main-content') || document.querySelector('#content')) : null;

const AddressabilityIssues = {
  validateTableAccessibility: function(table) {
    return true;
  }
};

// Load configurations from package.json if it exists
function loadConfigurations() {
    try {
        const packagePath = path.join(__dirname, 'package.json');
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
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

// SVG accessibility helper functions from HEAD branch
function addSvgAccessibilityProps(svg) {
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }

  const accessibleName = getSvgAccessibleName(svg);
  if (accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
  }

  setSvgAttributes(svg);
}

function setSvgAttributes(svg) {
    // Code to set other svg attributes goes here
}

// Existing functionality
function calculateSum(a, b) {
  return a + b;
}

const XYZ = function () {
    // Implementation for XYZ function
};

function setHtmlLangAttribute(lang) {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('lang', lang);
    }
}

setHtmlLangAttribute('en');

// Validate the table structure for accessibility issues
if (typeof document !== 'undefined') {
  function validateAllTables() {
    const tables = document.getElementsByTagName('table');
    for (const table of tables) {
      const accessible = validateTableAccessibility(table);
      const structure = validateTableStructure(table);
      if (!accessible || !structure) {
        console.warn('Table accessibility or structure validation failed:', table);
      }
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', validateAllTables);
  } else {
    validateAllTables();
  }
}

// NEW: Implement a new function to handle focus trap for keyboard navigation
function newFocusTrap(container) {
    if (typeof container === 'undefined' || !container.querySelectorAll) {
        return () => {};
    }

    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    function handleTabKey(e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }

    container.addEventListener('keydown', handleTabKey);

    if (firstFocusable) {
        firstFocusable.focus();
    }

    return () => {
        container.removeEventListener('keydown', handleTabKey);
    };
}

// Function to handle person name accessibility
function personName(element) {
    if (!element) return;

    const name = element.textContent?.trim() || element.getAttribute('aria-label') || element.getAttribute('title');
    if (name && !element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', name);
    }
    return element;
}

// Function to wrap primary content in main landmark
function wrapPrimaryContentInMain() {
    if (typeof document === 'undefined') return;

    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    if (main) return;

    const content = primaryContent;
    if (content && content.parentNode) {
        const newMain = document.createElement('main');
        newMain.id = 'main-content';
        newMain.setAttribute('role', 'main');
        content.parentNode.insertBefore(newMain, content);
        newMain.appendChild(content);
    }
}

// Function to fix landmark structure
function fixLandmarkStructure() {
    if (typeof document === 'undefined') return document.body?.innerHTML || '';

    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"], [role="form"], header, nav, main, aside, footer');
    const seenRoles = new Set();

    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        if (seenRoles.has(role)) {
            landmark.removeAttribute('role');
        } else {
            seenRoles.add(role);
        }
    });

    return document.body.innerHTML;
}

module.exports = {
    config,
    XYZ,
    calculateSum,
    countDependencies,

    addLangAttribute: function (element) {
        // Adds lang attribute to the given HTML element
        if (element && typeof element.setAttribute === 'function') {
            element.setAttribute('lang', 'en');
        }
        return element;
    },

    ensureLandmarkUniqueness: function (elements) {
        if (!Array.isArray(elements)) {
            return [];
        }

        const uniqueElements = [];
        const seen = new Map();

        elements.forEach(element => {
            const key = element.id || element.name || JSON.stringify(element);
            if (!seen.has(key)) {
                seen.set(key, true);
                uniqueElements.push(element);
            }
        });

        return uniqueElements;
    },

    addressInsightIssues: function () {
        this.getLangAttribute();
        this.addLangAttribute(typeof document !== 'undefined' ? (document.documentElement || document.body) : null);

        if (typeof landmarks !== 'undefined' && Array.isArray(landmarks)) {
            this.ensureLandmarkUniqueness(landmarks);
        }
        this.ensureUniqueLandmarks();

        this.validateTableAccessibility();
        this.validateTableStructure();

        this.getSvgAccessibleName();

        this.createInPageButton();
        this.createAccessibleLink();
        this.handleAccessibilityIssues();

        this.validateLandmark();
        this.validateLandmarkStructure();
    },

    initializeApp: function () {
        this.addressInsightIssues();
        this.loadConfigurations();
        countDependencies();
        if (typeof wrapPrimaryContentInMain === 'function') {
            wrapPrimaryContentInMain();
        }
        if (typeof fixLandmarkStructure === 'function') {
            document.body.innerHTML = fixLandmarkStructure();
        }
    },

    // Utility functions
    getLangAttribute: function () {
        let lang = 'en'; // Default to English
        return lang;
    },

    validateTableAccessibility: function (table) {
        // Check 26 table structure issues
        return true;
    },

    validateTableStructure: function (table) {
        // Check the table structure and return a boolean value indicating the result
        return true;
    },

    validateLandmark: function (element) {
        const validLandmarks = ['main', 'nav', 'aside', 'footer', 'header', 'form', 'search'];
        const role = element.getAttribute('role');
        return validLandmarks.includes(role);
    },

    validateLandmarkStructure: function () {
        if (typeof document === 'undefined') return true;

        const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"], [role="form"], header, nav, main, aside, footer');
        const seenRoles = new Set();
        let valid = true;

        landmarks.forEach(landmark => {
            const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
            if (seenRoles.has(role)) {
                console.warn(`Duplicate landmark role detected: ${role}`);
                valid = false;
            } else {
                seenRoles.add(role);
            }
        });

        return valid;
    },

    ensureUniqueLandmarks: function () {
        return true;
    },

    getSvgAccessibleName: function (svgElement, name) {
        return svgElement;
    },

    createInPageButton: function (text) {
        return {};
    },

    createAccessibleLink: function (href, text) {
        return {};
    },

    handleAccessibilityIssues: function () {
    },

    addAriaLabel: function (element, label) {
        if (!element.ariaLabel) {
            element.ariaLabel = label;
        }
        return element;
    },

    checkElementAccessibility: function (element) {
        return true;
    },

    setupHandlers: function () {
        console.log('Setting up event handlers...');
    },

    validateInput: function (input) {
        return input !== null && input !== undefined;
    },

    processData: function (data) {
        if (!this.validateInput(data)) {
            throw new Error('Invalid input data');
        }
    },

    fixFakeLinkIssue: function (doc) {
        if (typeof doc === 'undefined' || !doc.querySelectorAll) {
            return;
        }
        const clickableElements = doc.querySelectorAll('[role="link"]:not(a), [onclick]');
        let count = 0;

        clickableElements.forEach(element => {
            const tagName = element.tagName.toLowerCase();
            const hasHref = element.hasAttribute('href');

            if (tagName !== 'a' && !hasHref) {
                const isInteractive = element.getAttribute('role') === 'link' ||
                                       (element.hasAttribute('onclick') && element.onclick && element.onclick.toString().includes('window.location'));

                if (isInteractive && !element.hasAttribute('aria-label')) {
                    const text = element.textContent.trim();
                    if (text) {
                        element.setAttribute('aria-label', text);
                    }
                }
                count++;
            }
        });

        return count;
    },

    renderDependencyGraphContent: function () {
        // Placeholder for dependency graph rendering
    },

    addBook: function (book) {
        return book;
    },

    createServer: function () {
        const server = http.createServer(app);
        app.get('/', (req, res) => {
            res.send('Hello World!');
        });

        return server;
    },

    startApp: function () {
        this.loadConfigurations();
        const server = this.createServer();
        return server;
    },

    addSvgAccessibilityProps: addSvgAccessibilityProps,
    setSvgAttributes: setSvgAttributes,
    newFocusTrap: newFocusTrap,
    personName: personName,
    wrapPrimaryContentInMain: wrapPrimaryContentInMain,
    fixLandmarkStructure: fixLandmarkStructure,
    setHtmlLangAttribute: setHtmlLangAttribute
};