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
}

const removeDependency = (name) => {
    return dependencies.filter(dep => dep.name !== name);
}

const countDependencies = () => dependencies.length;

const appData = {};

const someFunction = () => 'someFunction result';

const { axeInstance } = axe;

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
}

const processData = (data) => {
    // existing processing logic preserved
    return data;
};

const formatResponse = (response) => {
    // existing formatting logic preserved
    return response;
};

// Imported and adapted accessibility utility functions

const getLangAttribute = () => {
    return document.documentElement.lang || 'en';
};

const addLangAttribute = () => {
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.lang) {
        htmlElement.setAttribute('lang', 'en');
    }
    return getLangAttribute();
};

const validateTableAccessibility = (table) => {
    if (!table) return false;
    return table.getAttribute('aria-label') || table.getAttribute('aria-labelledby') || table.getAttribute('aria-describedby');
};

const validateTableStructure = (table) => {
    if (!table) return false;
    const hasHeader = table.querySelector('th') !== null;
    const hasBody = table.querySelector('td') !== null;
    return hasHeader && hasBody;
};

const fixTableStructure = (table) => {
    if (!table) return false;
    if (!validateTableStructure(table)) {
        const thead = table.querySelector('thead');
        if (!thead) {
            const newThead = document.createElement('thead');
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const headerRow = document.createElement('tr');
                const cells = firstRow.querySelectorAll('td');
                cells.forEach(cell => {
                    const th = document.createElement('th');
                    th.textContent = cell.textContent;
                    th.setAttribute('scope', 'col');
                    headerRow.appendChild(th);
                });
                newThead.appendChild(headerRow);
                table.insertBefore(newThead, table.firstChild);
            }
        }
        return true;
    }
    return false;
};

const addMainLandmark = () => {
    const rootContainer = document.getElementById('root');
    if (rootContainer) {
        rootContainer.setAttribute('role', 'main');
        return true;
    }
    return false;
};

const validateLandmark = (landmark) => {
    const validRoles = ['main', 'navigation', 'banner', 'contentinfo', 'search', 'complementary', 'form', 'region'];
    const role = landmark ? landmark.getAttribute('role') : null;
    if (role && validRoles.includes(role)) {
        return true;
    }

    if (landmark && landmark.textContent && landmark.textContent.trim().length > 0) {
        return true;
    }

    return false;
};

const validateLandmarkAttributes = (landmark) => {
    if (!landmark) return false;
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledBy = landmark.getAttribute('aria-labelledby');
    return !!(ariaLabel || ariaLabelledBy || landmark.textContent.trim());
};

const validateLandmarkStructure = (landmark) => {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(required => {
        const element = document.querySelector(required) || document.querySelector(`[role="${required}"]`);
        if (!element) {
            missingLandmarks.push(required);
        }
    });

    if (missingLandmarks.length > 0) {
        console.warn(`Accessibility warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
        return false;
    }

    return true;
};

const addAccessibilityFeatures = () => {
    addLangAttribute();
    addMainLandmark();
};

// TODO: Any additional changes requested in the issue should be added after this function
const additionalAccessibilityCheck = () => {
    const htmlElement = document.documentElement;
    if (htmlElement) {
        const lang = htmlElement.getAttribute('lang');
        if (!lang) {
            htmlElement.setAttribute('lang', 'en');
        }
    }
    
    const mainElement = document.querySelector('main') || document.querySelector('[role="main"]');
    if (mainElement) {
        mainElement.setAttribute('role', 'main');
    }
    
    const landmarks = document.querySelectorAll('header, footer, nav, main, aside, section');
    landmarks.forEach(landmark => {
        if (!landmark.getAttribute('aria-label') && 
            !landmark.getAttribute('aria-labelledby') && 
            !landmark.textContent.trim()) {
            landmark.setAttribute('aria-label', landmark.tagName.toLowerCase());
        }
    });
    
    return true;
};

const initialize = () => {
    // existing initialization logic preserved
    console.log('Application initialized');
};

// Adapted main execution
if (require.main === module) {
    initialize();
}

export {
    greet,
    add,
    getDependencies,
    addDependency,
    removeDependency,
    countDependencies,
    appData,
    someFunction,
    validateInput,
    processData,
    formatResponse,
    validateTableAccessibility,
    validateTableStructure,
    fixTableStructure,
    addMainLandmark,
    validateLandmark,
    validateLandmarkAttributes,
    validateLandmarkStructure,
    initialize
};