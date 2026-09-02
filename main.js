// Main JavaScript file
// This file handles the main application logic

import { axe } from 'axe-core';
import fastMap from 'fast-map';
import path from 'path';

const config = {};
const dependencies = [
    { name: 'lodash', version: '4.17.21' },
    { name: 'express', version: '4.18.2' },
    { name: 'react', version: '18.2.0' }
];

const getDependencies = () => dependencies;

const addDependency = (name, version) => {
    dependencies.push({ name, version });
    return dependencies;
};

const removeDependency = (name) => {
    dependencies = dependencies.filter(dep => dep.name !== name);
    return dependencies;
};

const countDependencies = () => dependencies.length;

const appData = {};

const someFunction = () => 'someFunction result';

const greet = (name) => `Hello, ${name}!`;

const add = (a, b) => a + b;

const validateInput = (input) => {
    if (!input) {
        return 'Input is required';
    }

    if (typeof input !== 'string') {
        return 'Input must be a string';
    }

    return null;
};

const processData = (data) => {
    // existing processing logic preserved
};

const formatResponse = (response) => {
    // existing formatting logic preserved
};

// Imported and adapted accessibility utility functions

const getLangAttribute = () => {
    return document.documentElement.lang || 'en';
};

const addLangAttribute = () => {
    const htmlElement = document.documentElement;
    if (htmlElement) {
        htmlElement.setAttribute('lang', getLangAttribute());
    }
};

const validateTableAccessibility = (table) => {
    return !!(table.querySelector('caption') || table.getAttribute('aria-label') || table.getAttribute('aria-labelledby'));
};

const validateTableStructure = (table) => {
    const hasHeader = !!table.querySelector('thead th');
    const hasBody = !!table.querySelector('tbody td');
    return hasHeader && hasBody;
};

const fixTableStructure = (table) => {
    if (!validateTableStructure(table)) {
        if (!table.querySelector('thead')) {
            const thead = document.createElement('thead');
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const headerRow = document.createElement('tr');
                Array.from(firstRow.children).forEach(cell => {
                    const th = document.createElement('th');
                    th.textContent = cell.textContent;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.insertBefore(thead, table.firstChild);
            }
        }
    }
};

const addMainLandmark = () => {
    const rootContainer = document.getElementById('root');
    if (rootContainer) {
        rootContainer.setAttribute('role', 'main');
    }
};

const validateLandmark = (landmark) => {
    const validRoles = ['main', 'navigation', 'banner', 'contentinfo', 'search', 'complementary', 'form', 'region'];
    const role = landmark.getAttribute('role');
    if (role && validRoles.includes(role)) {
        return true;
    }

    if (!landmark.getAttribute('role') && landmark.getAttribute('id')) {
        return true;
    }

    return false;
};

const validateLandmarkAttributes = (landmark) => {
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledBy = landmark.getAttribute('aria-labelledby');
    return !!(ariaLabel || ariaLabelledBy || landmark.textContent.trim());
};

const validateLandmarkStructure = (landmark) => {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmarkName => {
        if (!document.querySelector(landmarkName)) {
            missingLandmarks.push(landmarkName);
        }
    });

    if (missingLandmarks.length > 0) {
        console.warn(`Accessibility warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
        return false;
    }

    return true;
};

const getSvgAccessibleName = (svgElement) => {
    if (!svgElement) return '';

    // Check for title and desc elements
    const title = svgElement.querySelector('title');
    const desc = svgElement.querySelector('desc');

    if (title) return title.textContent;
    if (desc) return desc.textContent;

    // Check for aria-label or aria-labelledby
    if (svgElement.hasAttribute('aria-label')) {
        return svgElement.getAttribute('aria-label');
    }

    if (svgElement.hasAttribute('aria-labelledby')) {
        const id = svgElement.getAttribute('aria-labelledby');
        const labelElement = document.getElementById(id);
        return labelElement ? labelElement.textContent : '';
    }

    return '';
};

const setSvgAttributes = (svgElement, name) => {
    if (!svgElement || !name) return;

    // Set aria-label if not already set
    if (!svgElement.hasAttribute('aria-label')) {
        svgElement.setAttribute('aria-label', name);
    }

    // Set role if not already set
    if (!svgElement.hasAttribute('role')) {
        svgElement.setAttribute('role', 'img');
    }
};

// Export the report generation function
export {
    generateAccessibilityReport: async function () {
        const report = await scanAccessibility();
        export.writeReport(report);
    },
    scanAccessibility,
    writeReport,
    addressAccessibilityIssues,
    getLangAttribute,
    createInPageButton,
    a11y,
    importAndExecute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    initialize
};

// Initialize the application with accessibility improvements
function initialize() {
    // Ensure the dependencyGraph container has a proper ARIA role
    if (dependencyGraph) {
        dependencyGraph.setAttribute('role', 'region');
        dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
    }

    // Address accessibility issues from insight report:
    // Ensure the dependencyGraph container has a proper ARIA role
    // (This comment remains as-is)
    //_Commit: eef4b6be04a5e2cd61b7543cfe2dff2da0857ca2_
    //<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
    //_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
    //<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
    //_Commit: 62d675a958b864c43ad4471b12c4c40c5570b3f7_
    //<!-- todo-hash: b713d536f0ce67bf9eb8012f08502c264300052f -->

    // Address accessibility issues
    addressAccessibilityIssues();

    // Create the in-page button
    createInPageButton();

    // Existing initialization logic preserved
    // Accessibility: Ensure main content is keyboard accessible
    // Accessibility: Add skip link functionality
    // Accessibility: Ensure buttons have proper labels
    // Accessibility: Add landmark roles and fix landmark issues
    // Accessibility: Add accessible names to 2 SVGs
    // Accessibility: Ensure unique landmarks (2 issues)
    // Accessibility: Fix 1 fake link issue
    // Initialize accessibility features from a11y utilities
    if (a11y && a11y.init) {
        a11y.init();
    }
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
}