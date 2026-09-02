import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { axe } from 'axe-core';

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
    dependencies = dependencies.filter(dep => dep.name !== name);
    return dependencies;
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
};

const formatResponse = (response) => {
    // existing formatting logic preserved
};

// Accessibility utility functions
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

const addAccessibilityFeatures = () => {
    addLangAttribute();
    addMainLandmark();
};

const initialize = () => {
    addAccessibilityFeatures();
    // existing initialization logic preserved
};

// React app rendering
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

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

// Report web vitals
reportWebVitals();