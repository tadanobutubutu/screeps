const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

// Ensure the element has an id, add aria-label, render dependency graphs
const dependencyGraph = document.getElementById('dependencyGraph');

// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const { validateInput, processData, formatResponse } = utils;
const { a11y } = require('@accessible/react');

function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
    return document.documentElement.lang || navigator.language || 'en-US';
}

function validateInput(input) {
    return input !== null && input !== undefined;
}

function processData(data) {
    if (!validateInput(data)) {
        throw new Error('Invalid input data');
    }
    return {
        processed: true,
        data: data,
        timestamp: Date.now()
    };
}

function functionA(data) {
    if (!validateInput(data)) {
        throw new Error('Invalid input to functionA');
    }
    return {
        success: true,
        payload: data
    };
}

function function3() {
  console.log('Function3 is running.');
}

// Helper function to validate landmark structure
function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

function loadLandmarks() {
    try {
        const filePath = path.join(config.dataPath || './data', 'landmarks.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading landmarks:', error.message);
        return [];
    }
}

function processLandmarks(landmarks) {
    if (!landmarks || !Array.isArray(landmarks)) {
        return [];
    }
    return landmarks.filter(landmark => isValidLandmark(landmark));
}

function sortLandmarks(landmarks, ascending = true) {
    return landmarks.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });
}

function createInPageButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('aria-label', text);
    return button;
}

function createAccessibleLink(href, text) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.setAttribute('aria-label', text);
    return link;
}

function getSvgAccessibleName(svgElement) {
    if (!svgElement) return 'Accessible SVG Icon';
    
    const title = svgElement.querySelector('title');
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (title) return title.textContent;
    if (ariaLabel) return ariaLabel;
    return 'Accessible SVG Icon';
}

function setSvgAttributes(svg, accessibleName) {
    if (svg && typeof svg === 'object') {
        svg.setAttribute('role', 'img');
        if (accessibleName) {
            svg.setAttribute('aria-label', accessibleName);
        }
    }
    return svg;
}

function validateLandmark(element) {
    const issues = [];
    const validTags = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
    const validRoles = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary'];

    if (!element.tagName) {
        issues.push('Missing tagName');
    } else {
        const tagName = element.tagName.toLowerCase();
        if (!validTags.includes(tagName)) {
            issues.push(`Invalid landmark tag: ${element.tagName}`);
        }
    }

    const role = element.getAttribute('role');
    if (role && !validRoles.includes(role)) {
        issues.push(`Invalid role: ${role}`);
    }

    return {
        success: issues.length === 0,
        issues
    };
}

function validateTableAccessibility(table) {
    const issues = [];

    if (!table.querySelector || !table.querySelector('caption')) {
        issues.push('Missing caption element');
    }

    if (!table.getAttribute('headers')) {
        issues.push('Missing headers attribute');
    }

    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(cell => {
        if (!cell.hasAttribute('scope')) {
            issues.push('Missing scope attribute on header cell');
        }
    });

    return {
        success: issues.length === 0,
        issues
    };
}

function validateTableStructure(tables) {
    const allIssues = [];
    const tableArray = Array.isArray(tables) ? tables : [tables];

    tableArray.forEach((table, index) => {
        const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
        if (rows.length === 0) {
            allIssues.push({
                tableIndex: index,
                issues: ['Table has no rows']
            });
        }

        const result = validateTableAccessibility(table);
        if (!result.success) {
            allIssues.push({
                tableIndex: index,
                issues: result.issues
            });
        }
    });

    return {
        success: allIssues.length === 0,
        issues: allIssues
    };
}

function validateLandmarkStructure(landmarks) {
    const issues = [];

    if (Array.isArray(landmarks)) {
        landmarks.forEach((landmark, index) => {
            const result = validateLandmark(landmark);
            if (!result.success) {
                issues.push({
                    landmarkIndex: index,
                    issues: result.issues
                });
            }
        });
    } else {
        const allLandmarks = document.querySelectorAll('[role], header, nav, main, aside, footer, section, article');
        let hasMain = false;
        let hasNavigation = false;

        allLandmarks.forEach(landmark => {
            const tagName = landmark.tagName.toLowerCase();
            const role = landmark.getAttribute('role');
            if (tagName === 'main' || role === 'main') hasMain = true;
            if (tagName === 'nav' || role === 'navigation') hasNavigation = true;
        });

        if (!hasMain) {
            issues.push('Missing main landmark');
        }
        if (!hasNavigation) {
            issues.push('Missing navigation landmark');
        }
    }

    return {
        success: issues.length === 0,
        issues
    };
}

function ensureUniqueLandmarks(landmarks) {
    const names = [];
    const duplicates = [];
    let elementsToCheck = landmarks;

    if (!Array.isArray(landmarks)) {
        elementsToCheck = document.querySelectorAll('[role], header, nav, main, aside, footer, section, article');
    }

    elementsToCheck.forEach(landmark => {
        const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
        if (names.includes(name)) {
            duplicates.push(name);
        } else {
            names.push(name);
        }
    });

    const elementsById = {};
    elementsToCheck.forEach(landmark => {
        if (landmark.id) {
            if (elementsById[landmark.id]) {
                duplicates.push(`Duplicate ID: ${landmark.id}`);
                landmark.id += '_duplicate';
            } else {
                elementsById[landmark.id] = true;
            }
        }
    });

    const landmarksByRole = {};
    elementsToCheck.forEach(landmark => {
        const role = landmark.getAttribute('role');
        if (role) {
            if (landmarksByRole[role]) {
                duplicates.push(`Duplicate landmark role: ${role}`);
            } else {
                landmarksByRole[role] = true;
            }
        }
    });

    return {
        success: duplicates.length === 0,
        duplicates
    };
}

function handleAccessibilityIssues(issues = []) {
    const handled = [];
    const unhandled = [];

    issues.forEach(issue => {
        if (issue.fixable) {
            handled.push(issue);
        } else {
            unhandled.push(issue);
        }
    });

    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        validateTableAccessibility(table);
        validateTableStructure(table);
    });

    const landmarks = document.querySelectorAll('[role], header, nav, main, aside, footer, section, article');
    landmarks.forEach(landmark => {
        validateLandmark(landmark);
    });

    validateLandmarkStructure();
    ensureUniqueLandmarks();

    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        getSvgAccessibleName(svg);
    });

    return {
        total: issues.length,
        handled: handled.length,
        unhandled: unhandled.length,
        unhandledIssues: unhandled
    };
}

function validateFormInputs(formElement) {
    const inputs = formElement.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
        const isRequired = input.hasAttribute('required');
        const value = input.value.trim();
        
        if (isRequired && !value) {
            console.warn(`Required input is empty: ${input.name || input.id}`);
            isValid = false;
        }
        
        if (input.type === 'email' && value && !isValidEmail(value)) {
            console.warn(`Invalid email format: ${value}`);
            isValid = false;
        }
        
        if (input.type === 'url' && value && !isValidUrl(value)) {
            console.warn(`Invalid URL format: ${value}`);
            isValid = false;
        }
    });

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

function addLandmarkRegions() {
    console.log('Adding landmark regions');
}

function initializeApp() {
    appState.initialized = true;
    console.log('Initializing application...');
    return true;
}

function getConfig() {
    return config;
}

// TODO: Implement actual logic for functionA
function functionA(data) {
    if (!validateInput(data)) {
        throw new Error('Invalid input to functionA');
    }
    return {
        success: true,
        payload: data
    };
}

// Export all existing and new functions
module.exports = {
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    setSvgAttributes,
    createInPageButton,
    createAccessibleLink,
    handleAccessibilityIssues,
    validateFormInputs,
    isValidEmail,
    isValidUrl,
    isValidLandmark,
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    functionA,
    function3,
    addLandmarkRegions,
    initializeApp,
    getConfig,
    process, processData, validateInput, formatResponse,
    config,
    appState,
    appData
};