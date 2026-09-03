import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';

import { axe } from 'axe-core';
import fastMap from 'fast-map';
import path from 'path';

import { greet, add, getDependencies, addDependency, removeDependency, countDependencies, appData, someFunction, validateInput, processData, formatResponse } from './mainAdapted';
import { validateTableAccessibility, validateTableStructure, fixTableStructure, addMainLandmark, validateLandmark, validateLandmarkAttributes, validateLandmarkStructure } from './mainAccessibility';

const fs = require('fs');

const config = {};

const initialize = () => {
    // Add the existing accessibility initialisation logic here if needed
    addMainLandmark();

    // Ensure the dependencyGraph container has a proper ARIA role
    const dependencyGraph = document.getElementById('dependencyGraph');
    if (dependencyGraph) {
        dependencyGraph.setAttribute('role', 'region');
        dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
    }

    // Address accessibility issues from insight report:
    addressAccessibilityIssues();

    // Create the in-page button
    createInPageButton();

    // Initialize accessibility features from a11y utilities
    if (a11y && a11y.init) {
        a11y.init();
    }

    // Render index view
    renderIndexView();
};

// Adapted main execution
if (require.main === module) {
    initialize();
}

// Function to scan for accessibility issues using axe-core
function scanAccessibility() {
    const issues = [];
    
    if (typeof document !== 'undefined') {
        const results = axe.run(document);
        if (results && results.violations) {
            results.violations.forEach(violation => {
                issues.push({
                    id: violation.id,
                    impact: violation.impact,
                    description: violation.description,
                    help: violation.helpUrl,
                    nodes: violation.nodes.map(node => ({
                        html: node.html,
                        target: node.target
                    }))
                });
            });
        }
    }
    
    return issues;
}

// Function to write the generated report to a file
function writeReport(report) {
    const reportFile = path.join(process.cwd(), 'accessibility-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Function to get the language attribute value
function getLangAttribute() {
    if (typeof document !== 'undefined') {
        return document.documentElement.lang || 'en';
    }
    return 'en';
}

// Function to create an in-page button
function createInPageButton() {
    if (typeof document === 'undefined') return null;
    
    const button = document.createElement('button');
    button.textContent = 'Accessibility Info';
    button.setAttribute('aria-label', 'Show accessibility information');
    button.id = 'a11y-info-button';
    
    button.addEventListener('click', () => {
        const report = scanAccessibility();
        if (typeof window !== 'undefined') {
            alert(`Found ${report.length} accessibility issues`);
        }
    });
    
    document.body.appendChild(button);
    return button;
}

// Function to address accessibility issues
function addressAccessibilityIssues() {
    if (typeof document === 'undefined') return;
    
    // Ensure the root container has an accessible name
    const rootContainer = document.getElementById('root');
    if (rootContainer) {
        rootContainer.setAttribute('role', 'main');
    }

    // Initialize skip link functionality
    const skipLink = document.getElementById('skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            const targetId = skipLink.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    }

    // Ensure all buttons with role="button" respond to Enter key
    const buttonRoles = document.querySelectorAll('[role="button"]');
    buttonRoles.forEach(button => {
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
    const modalElement = document.querySelector('[role="dialog"]');
    if (modalElement && a11y && a11y.trapFocus) {
        a11y.trapFocus(modalElement);
    }
    if (a11y && a11y.announce) {
        a11y.announce('Welcome to the bot!', 'assertive');
    }

    // Adding an alt attribute to an image
    const imageElement = document.querySelector('img:not([alt])');
    if (imageElement) {
        imageElement.setAttribute('alt', 'A description of the image');
    }

    // Correcting the ARIA role for a div
    const divElement = document.querySelector('[data-role="list"]');
    if (divElement) {
        divElement.setAttribute('role', 'list');
    }

    // Adding the lang attribute to the HTML element
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.lang) {
        htmlElement.setAttribute('lang', getLangAttribute());
    }
}

// New function to import a module and execute a function
function importAndExecute(modulePath, functionName, callback) {
    try {
        const module = require(modulePath);
        if (module[functionName]) {
            const result = module[functionName]();
            if (callback) {
                callback(null, result);
            }
            return result;
        } else {
            if (callback) {
                callback(new Error(`Function ${functionName} not found in module`), null);
            }
        }
    } catch (error) {
        if (callback) {
            callback(error, null);
        }
    }
    return null;
}

// New function to validate table accessibility
function validateTableAccessibility(tableElement) {
    if (!tableElement) return false;

    // Check if table has a caption
    const hasCaption = tableElement.querySelector('caption') !== null;

    // Check if table has proper headers
    const hasHeaders = tableElement.querySelector('th[headers]') !== null ||
                        tableElement.querySelector('th') !== null;

    // Check if table has proper scope attributes for headers
    const headers = tableElement.querySelectorAll('th');
    let hasScope = true;
    headers.forEach(header => {
        if (!header.hasAttribute('scope')) {
            hasScope = false;
        }
    });

    return hasCaption && hasHeaders && hasScope;
}

// New function to validate table structure
function validateTableStructure(tableElement) {
    if (!tableElement) return false;

    // Check if table has proper row and cell structure
    const rows = tableElement.querySelectorAll('tr');
    let validStructure = true;

    rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length === 0) {
            validStructure = false;
        }
    });

    return validStructure;
}

// New function to validate landmark
function validateLandmark(landmarkElement) {
    if (!landmarkElement) return false;

    // Check if landmark has proper role
    const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
    const role = landmarkElement.getAttribute('role');

    return validRoles.includes(role);
}

// New function to validate landmark structure
function validateLandmarkStructure(landmarkElement) {
    if (!landmarkElement) return false;

    // Check if landmark has proper heading
    const heading = landmarkElement.querySelector('h1, h2, h3, h4, h5, h6');
    return heading !== null;
}

// New function to get SVG accessible name
function getSvgAccessibleName(svgElement) {
    if (!svgElement) return '';

    // Check for title and desc elements
    const title = svgElement.querySelector('title');
    const desc = svgElement.querySelector('desc');

    if (title) return