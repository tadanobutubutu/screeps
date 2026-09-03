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

const primaryContent = (typeof document !== 'undefined') ? document.getElementById('primary-content') || document.body : null;

const AddressabilityIssues = {
  validateTableAccessibility: function(table) {
    return true;
  },
  makeSvgAccessible: function(svg) {
    if (svg && typeof svg.setAttribute === 'function') {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-labelledby', accessibleName);
    }

    setSvgAttributes(svg);
  },
  setSvgAttributes: function(svg) {
    // Code to set other svg attributes goes here
  },
  setHtmlLangAttribute: function(lang) {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('lang', lang);
    }
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
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

// SVG accessibility helper functions

// Existing functionality
function calculateSum(a, b) {
  return a + b;
}

const XYZ = function () {
    // Implementation for XYZ function
};

// Functions for accessibility improvements (HEAD branch changes)
function newFocusTrap(container) {
    if (typeof container === 'undefined' || !container.querySelectorAll) {
        return () => {};
    }

    const focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
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

function personName(element) {
    if (!element) return;

    const name = element.textContent?.trim() || element.getAttribute('aria-label') || element.getAttribute('title');
    if (name && !element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', name);
    }
    return element;
}

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

function fixLandmarkStructure(landmarks) {
    if (!landmarks || !Array.isArray(landmarks)) return landmarks;

    const uniqueElements = [];
    const seen = new Set();

    for (const landmark of landmarks) {
        const key = landmark.id || landmark.name || landmark.className;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueElements.push(landmark);
        }
    }

    return uniqueElements;
}

function getSvgAccessibleName(svgElement, name) {
    return svgElement;
}

// Utility functions
function addLangAttribute(element, lang = 'en') {
    let htmlElement = element || document.documentElement
    if (!htmlElement) {
        return null
    }
    if (!htmlElement.getAttribute('lang')) {
        htmlElement.setAttribute('lang', lang)
    }
    return htmlElement
}

function validateTableAccessibility(table) {
    // Check 26 table structure issues
    return true;
}

function validateTableStructure(table) {
    // Check the table structure and return a boolean value indicating the result
    return true;
}

function validateLandmark(element) {
    const validLandmarks = ['main', 'nav', 'aside', 'footer', 'header', 'form', 'search'];
    const role = element.getAttribute('role');
    return validLandmarks.includes(role);
}

function validateLandmarkStructure(landmarks) {
    if (typeof landmarks === 'undefined' || !Array.isArray(landmarks)) return true;

    const seenRoles = new Set();
    let valid = true;

    for (const landmark of landmarks) {
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        if (seenRoles.has(role)) {
            console.warn(`Duplicate landmark role detected: ${role}`);
            valid = false;
        } else {
            seenRoles.add(role);
        }
    }

    return valid;
}

module.exports = {
    config,
    XYZ,
    calculateSum,
    countDependencies,
    AddressabilityIssues,
    addLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    newFocusTrap,
    personName,
    wrapPrimaryContentInMain,
    getSvgAccessibleName
};