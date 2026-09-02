const config = {
  apiUrl: process.env.API_URL || 'https://example.com',
  timeout: 5000,
  debug: false,
  version: '1.0.0',
  dataPath: './data',
  maxResults: 100,
  landmarkRoles: [
    'banner',
    'complementary',
    'contentinfo',
    'form',
    'main',
    'navigation',
    'search'
  ],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

// Configuration - merged
const CONFIG = {
    dataPath: './data',
    maxResults: 100,
    name: 'ScreepsBot',
    version: '1.0.0',
    debug: false,
    apiUrl: process.env.API_URL || 'https://api.example.com',
    timeout: 5000,
    landmarkRoles: config.landmarkRoles,
    maxLandmarks: config.maxLandmarks,
    allowedRoles: config.allowedRoles
};

// Alternative config style for backwards compatibility
const configFromConstants = CONFIG;

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Landmark selectors for DOM queries
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
    'aside:not([role])',
    'section:not([role])'
];

const landmarkRoles = config.allowedRoles;

// Application state
let isInitialized = false;
let dependencyGraph = null;
const appData = {};

const appState = {
    initialized: false,
    data: null,
    cache: new Map(),
    lang: 'en'
};

// Application main entry point
const express = require('express');
const { DOMParser } = require('@xmldom/xmldom');
const fs = require('fs');
const path = require('path');
const { axe } = require('axe-core');

// Import additional modules
const React = require('react');
const { useState, useEffect, useRef } = require('react');
const { render } = require('react-dom');
const { a11y } = require('@accessible/react');
const fastMap = require('fast-map');
const App = require('./App');
const { setDependencyGraph } = require('./actions/dependencyGraph');
const { a11yStore } = require('./store');
const { main } = require('./');

// Utility functions
function getLangAttribute() {
    if (typeof document !== 'undefined' && document.documentElement) {
        return document.documentElement.lang || 'en';
    }
    return 'en';
}

function isValidLandmark(landmark) {
    return landmark && typeof landmark.id !== 'undefined' && landmark.id !== null;
}

function validateTableAccessibility(tableElement) {
    if (!tableElement) return false;
    
    const hasCaption = tableElement.querySelector('caption');
    if (hasCaption) {
        return true;
    }
    
    const headers = tableElement.querySelectorAll('th');
    const cells = tableElement.querySelectorAll('td, th');
    
    for (const cell of cells) {
        if (!cell.id && !cell.getAttribute('scope')) {
            return false;
        }
    }
    
    return headers.length > 0;
}

function validateTableStructure(tableElement) {
    if (!tableElement) return false;
    
    const rows = tableElement.querySelectorAll('tr');
    let hasHeader = false;
    
    for (const row of rows) {
        const cells = row.querySelectorAll('th, td');
        for (const cell of cells) {
            if (cell.tagName.toLowerCase() === 'th') {
                hasHeader = true;
                if (!cell.getAttribute('scope')) {
                    return false;
                }
            }
        }
    }
    
    return hasHeader && rows.length > 0;
}

function validateLandmark(landmark) {
    const errors = [];
    const role = landmark.getAttribute ? landmark.getAttribute('role') : landmark.role;
    const validLandmarks = config.allowedRoles || landmarkRoles;
    
    if (!validLandmarks.includes(role)) {
        errors.push('Invalid landmark role');
    }
    
    return errors;
}

function validateLandmarkStructure() {
    const selectors = landmarkSelectors.length > 0 ? landmarkSelectors : 
        ['[role="banner"]', '[role="navigation"]', '[role="main"]', 
         '[role="complementary"]', '[role="contentinfo"]', '[role="region"]'];
    const landmarks = document ? document.querySelectorAll(selectors.join(', ')) : [];
    
    let hasMain = false;
    let hasNavigation = false;
    
    landmarks.forEach(landmark => {
        const role = landmark.getAttribute ? landmark.getAttribute('role') : landmark.role;
        if (role === 'main') hasMain = true;
        if (role === 'navigation') hasNavigation = true;
    });
    
    return hasMain && hasNavigation;
}

function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        const elements = document ? Array.from(document.querySelectorAll(landmarkSelectors.join(', '))) : [];
        const landmarkIds = elements.map(el => el.id || el.getAttribute('aria-labelledby'));
        const uniqueIds = new Set(landmarkIds);
        
        elements.forEach((element, index) => {
            if (!element.id) {
                element.id = `landmark-${index}`;
            }
        });
        return elements;
    }
    
    const seen = new Set();
    const uniqueLandmarks = [];
    
    for (const landmark of landmarks) {
        if (!landmark || typeof landmark.id === 'undefined') {
            continue;
        }
        
        const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);
        
        if (!seen.has(landmarkId)) {
            seen.add(landmarkId);
            uniqueLandmarks.push(landmark);
        }
    }
    
    return uniqueLandmarks;
}

function fixFakeLinks() {
    const fakeLinks = document ? document.querySelectorAll('.fake-link') : [];
    fakeLinks.forEach(link => {
        if (link.tagName === 'A' && !link.getAttribute('role')) {
            link.setAttribute('role', 'button');
        }
    });
}

function handleFakeLinks() {
    fixFakeLinks();
}

function addMainLandmark() {
    const main = document ? document.querySelector('main') : null;
    if (!main) {
        const content = document ? document.querySelector('.primary-content') || document.getElementById('main-content') : null;
        if (content) {
            const mainElement = document.createElement('main');
            content.parentNode.insertBefore(mainElement, content);
            mainElement.appendChild(content);
        }
    }
}

function fixTableStructureIssues() {
    const tables = document ? document.querySelectorAll('table') : [];
    tables.forEach(table => {
        if (!table.querySelector('caption')) {
            const caption = document.createElement('caption');
            caption.textContent = 'Table';
            table.insertBefore(caption, table.firstChild);
        }
    });
}

function fixTableHeaderCellScope() {
    const headers = document ? document.querySelectorAll('th') : [];
    headers.forEach(header => {
        if (!header.getAttribute('scope')) {
            header.setAttribute('scope', 'col');
        }
    });
}

function renderDependencyGraph(container) {
    if (!container) return;
    if (!container.hasAttribute('role')) {
        container.setAttribute('role', 'graphics-document');
    }
    if (!container.hasAttribute('aria-label')) {
        container.setAttribute('aria-label', 'Dependency graph');
    }
}

function createInPageButton(buttonText, onClickHandler) {
    const button = document.createElement('button');
    button.textContent = buttonText;
    if (onClickHandler) {
        button.addEventListener('click', onClickHandler);
    }
    return button;
}

class ScreepsBot {
    constructor() {
        this.tasks = [];
        this.initialize();
    }

    initialize() {
        appState.initialized = true;
        isInitialized = true;
    }

    generateTaskId() {
        return Math.random().toString(36).substr(2, 9);
    }

    addTask(taskFn, priority = 'medium') {
        const taskId = this.generateTaskId();
        this.tasks.push({ task: taskFn, priority, id: taskId });
        this.scheduleTasks();
        return taskId;
    }

    scheduleTasks() {
        this.tasks.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    validateTableAccessibility(html) {
        if (typeof html === 'string') {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return validateTableStructure(doc);
        }
        return false;
    }
}

function initialize() {
    if (isInitialized) return;
    
    isInitialized = true;
    appState.initialized = true;
    
    addLangAttribute();
    wrapPrimaryContentInMain();
    fixTableStructureIssues();
    fixTableHeaderCellScope();
    addMainLandmark();
    addSvgAccessibleNames();
    fixFakeLinks();
    ensureUniqueLandmarks();
    
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);
}

function loadLandmarks() {
    try {
        const filePath = path.join(__dirname, config.dataPath, 'landmarks.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading landmarks:', error.message);
        return [];
    }
}

function processLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }
    
    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);
    
    return uniqueLandmarks.slice(0, config.maxResults);
}

function wrapPrimaryContentInMain() {
    const selectors = ['.primary-content', '[role="main"]', '#main-content', '#content'];
    const target = selectors.reduce((acc, selector) => 
        acc || document?.querySelector(selector), null);
    
    if (target && !target.closest('main')) {
        const mainElement = document.createElement('main');
        target.parentNode.insertBefore(mainElement, target);
        mainElement.appendChild(target);
    }
}

function addLangAttribute() {
    if (typeof document !== 'undefined' && document.documentElement) {
        if (!document.documentElement.getAttribute('lang')) {
            document.documentElement.setAttribute('lang', getLangAttribute());
        }
    }
}

function addSvgAccessibleNames() {
    const svgs = document ? document.querySelectorAll('svg') : [];
    svgs.forEach(svg => {
        if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
            const title = svg.querySelector('title');
            if (title) {
                svg.setAttribute('aria-label', title.textContent);
            } else {
                svg.setAttribute('aria-label', 'SVG graphic');
            }
        }
    });
}

function generateAccessibilityReport(options = {}) {
    return new Promise((resolve) => {
        if (typeof document === 'undefined' || !axe.run) {
            resolve({ violations: [], passes: [], incomplete: [] });
            return;
        }
        
        axe.run(document, options, (err, results) => {
            if (err) {
                resolve({ violations: [], passes: [], incomplete: [] });
                return;
            }
            resolve(results);
        });
    });
}

function scanAccessibility(context, options = {}) {
    const violations = [];
    const scanContext = context || (typeof document !== 'undefined' ? document : null);
    
    if (scanContext) {
        // Basic scan simulation
        const landmarks = scanContext.querySelectorAll('[role]');
        if (landmarks.length === 0) {
            violations.push({ id: 'landmarks-missing', description: 'No landmarks found' });
        }
    }
    
    return {
        violations,
        passes: [],
        incomplete: []
    };
}

function writeReport(report) {
    const reportPath = path.join(config.dataPath, 'accessibility-report.json');
    try {
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
        console.log('Report written to', reportPath);
    } catch (error) {
        console.error('Error writing report:', error.message);
    }
}

function filterIssuesByRules(violations, allowedRules) {
    if (!Array.isArray(allowedRules) || allowedRules.length === 0) {
        return violations;
    }
    return violations.filter(violation => allowedRules.includes(violation.id));
}

function generateReportSummary(issues) {
    return {
        total: Array.isArray(issues) ? issues.length : 0
    };
}

// Main function that applies all accessibility fixes and collects data
function applyAccessibilityFixesAndHarvestData(html) {
    let result = html || '';
    
    // Add landmark roles
    const landmarkRoleMap = {
        'header': 'banner',
        'nav': 'navigation',
        'main': 'main',
        'aside': 'complementary',
        'footer': 'contentinfo',
        'section': 'region'
    };
    
    Object.entries(landmarkRoleMap).forEach(([tag, role]) => {
        const regex = new RegExp(`<(${tag})([^>]*)>`, 'gi');
        result = result.replace(regex, (match, element, attrs) => {
            if (!attrs.includes('role=')) {
                return `<${element} role="${role}"${attrs}>`;
            }
            return match;
        });
    });
    
    // Scan for accessibility issues
    const violations = scanAccessibility();
    violations.forEach(violation => {
        console.warn(violation.description);
    });
    
    return result;
}

const axios = require('axios');

async function fetchUser(userId) {
    if (!userId) {
        return null;
    }
    
    try {
        const response = await axios.get(`${config.apiUrl}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error.message);
        return { id: userId, name: 'Unknown User' };
    }
}

function clearCache() {
    appState.cache.clear();
}

function someFunction() {
    return 'some value';
}

function helper(input) {
    return input ? String(input).toUpperCase() : '';
}

function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return date.toISOString().split('T')[0];
}

function validateInput(input) {
    return input && typeof input === 'string' && input.trim().length > 0;
}

function processData(data) {
    if (!data) return null;
    return { ...data, processed: true };
}

function countDependencies(dependencies) {
    return dependencies ? dependencies.length : 0;
}

function analyzeModuleDependencies(modulePath) {
    if (!modulePath) return {};
    try {
        const content = fs.readFileSync(modulePath, 'utf8');
        const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
        const matches = [...content.matchAll(requireRegex)];
        return {
            module: modulePath,
            dependencies: matches.map(m => m[1]),
            count: matches.length
        };
    } catch (error) {
        return { error: error.message };
    }
}

function visualizeModuleRelationships(dependencies) {
    return dependencies.map(dep => ({
        id: dep,
        type: 'dependency'
    }));
}

function displayModuleStructure(modulePath, level = 0) {
    if (!modulePath) return;
    console.log(`${'  '.repeat(level)}${modulePath}`);
}

const newFunctions = {
    renderDependencyGraphFromImprovements: function(container) {
        renderDependencyGraph(container);
    },
    createInPageButtons: function(buttonElements, containerSelector) {
        if (typeof buttonElements !== 'function') return;
        
        buttonElements().forEach(btn => {
            const button = createInPageButton(btn.text, btn.onClick);
            const container = containerSelector 
                ? document.querySelector(containerSelector) 
                : document.body;
            if (container) {
                container.appendChild(button);
            }
        });
    },
    addLandmarkRolesFromImprovements: function(insightReport) {
        if (!insightReport) return;
        
        const issues = insightReport.issues || [];
        issues.forEach(issue => {
            if (issue.code === 'landmark-role-missing') {
                const element = document.querySelector(issue.selector);
                if (element) {
                    element.setAttribute('role', issue.suggestedRole);
                }
            }
        });
    }
};

// Initialize app function
function initializeApp() {
    initialize();
    return appState;
}

// Helper to check if element has valid id
function checkLandmarkElement(id) {
    const element = document ? document.getElementById(id) : null;
    return element !== null;
}

// Validate landmark object for Screeps game entities
function validateLandmarkObject(landmark) {
    const errors = [];
    
    if (!landmark) {
        errors.push('Landmark is required');
        return { valid: false, errors };
    }
    
    if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
        errors.push('Landmark must have a valid name');
    }
    
    if (landmark.latitude === undefined || landmark.latitude === null) {
        errors.push('Landmark must have a latitude');
    } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
        errors.push('Landmark latitude must be a number');
    } else if (landmark.latitude < -90 || landmark.latitude > 90) {
        errors.push('Landmark latitude must be between -90 and 90');
    }
    
    if (landmark.longitude === undefined || landmark.longitude === null) {
        errors.push('Landmark must have a longitude');
    } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
        errors.push('Landmark longitude must be a number');
    } else if (landmark.longitude < -180 || landmark.longitude > 180) {
        errors.push('Landmark longitude must be between -180 and 180');
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

// ScreepsBot class for game operations
class ScreepsBot {
    constructor() {
        this.tasks = [];
        this.reset();
    }
    
    reset() {
        isInitialized = false;
        appState.initialized = false;
        appState.data = null;
        appState.cache = new Map();
    }
    
    initialize() {
        if (isInitialized) return;
        
        isInitialized = true;
        appState.initialized = true;
        appState.data = { initializedAt: new Date().toISOString() };
        
        // Run initial accessibility checks
        this.performAccessibilityScan();
    }
    
    performAccessibilityScan() {
        const violations = scanAccessibility();
        if (violations.violations.length > 0) {
            console.warn('Accessibility issues found:', violations.violations);
        }
    }
}

// Helper utilities
function enforceLeafRuntime(name) {
    return String(name || '').replace(/\s+/g, '-');
}

function ensureElementHasId(element, id) {
    if (!element) return element;
    if (!element.id) {
        element.id = id || `element-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element;
}

function ensureLandmarkLabel(landmark) {
    return landmark.name || landmark.role || 'Landmark';
}

// Enhanced landmark processing
function ensureUniqueLandmarksEnhanced(landmarksArray) {
    if (!landmarksArray || landmarksArray.length === 0) {
        return [];
    }
    
    const seen = new Set();
    return landmarksArray.map((landmark) => {
        const key = enforceLeafRuntime(landmark.name) + '_' + (landmark.role || 'default');
        if (!seen.has(key)) {
            seen.add(key);
            const element = landmark;
            
            if (typeof element === 'object' && element.setAttribute) {
                element = ensureElementHasId(element, landmark.id || key);
                if (!element.hasAttribute('aria-label')) {
                    element.setAttribute('aria-label', ensureLandmarkLabel(landmark));
                }
            }
            
            return element;
        }
        return null;
    }).filter(Boolean);
}

function getSvgAccessibleName(svgElement) {
    if (!svgElement) return '';
    
    const title = svgElement.querySelector('title');
    if (title) {
        return title.textContent;
    }
    
    const desc = svgElement.querySelector('desc');
    if (desc) {
        return desc.textContent;
    }
    
    return svgElement.getAttribute('aria-label') || '';
}

function addSvgAccessibilityProps(svgElement, label, labelledById) {
    if (!svgElement) return;
    
    if (label) {
        svgElement.setAttribute('aria-label', label);
    }
    if (labelledById) {
        svgElement.setAttribute('aria-labelledby', labelledById);
    }
}

function getSvgAccessibilityProps(label, labelledById) {
    const props = {};
    if (label) {
        props['aria-label'] = label;
    }
    if (labelledById) {
        props['aria-labelledby'] = labelledById;
    }
    return props;
}

function getAccessibleLinkProps(href, label) {
    return {
        href,
        'aria-label': label,
        role: 'link'
    };
}

function navigateWithArrow(key, activeElement) {
    if (!activeElement) return;
    
    switch (key) {
        case 'ArrowUp':
            activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            break;
        case 'ArrowDown':
            activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            break;
    }
}

function handleTabNavigation(event, activeElement) {
    if (!activeElement) return;
    
    const focusableElements = activeElement.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
}

function setFocus(elementId) {
    const element = document ? document.getElementById(elementId) : null;
    if (element) {
        element.focus();
        element.setAttribute('tabindex', '0');
    }
}

function validatePersonName(person) {
    return person && person.name ? person.name : 'Unknown';
}

// Initialize accessibility features
const bot = new ScreepsBot();
bot.initialize();

module.exports = {
    config,
    CONFIG,
    PORT,
    HOST,
    landmarkSelectors,
    landmarkRoles,
    appState,
    appData,
    isInitialized,
    dependencyGraph,
    axios,
    bot,
    isValidLandmark,
    getSvgAccessibleName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    ensureUniqueLandmarksEnhanced,
    addSvgAccessibilityProps,
    getSvgAccessibilityProps,
    getAccessibleLinkProps,
    getLangAttribute,
    createInPageButton,
    primaryContent: document?.querySelector('.primary-content') || document?.querySelector('[role="main"]'),
    wrapPrimaryContentInMain,
    ensureDependencyGraphAriaRole: (container) => {
        if (!container) return;
        if (!container.hasAttribute('role')) {
            container.setAttribute('role', 'region');
        }
    },
    writeReport,
    scanAccessibility,
    generateAccessibilityReport,
    filterIssuesByRules,
    generateReportSummary,
    ScreepsBot,
    initialize,
    initializeApp,
    getUniqueLandmarks: ensureUniqueLandmarks,
    validateLinkAccessibility,
    handleFakeLinks,
    fixFakeLinkIssues,
    ensureAccessibilityAttributesForAddBook: () => {},
    addLandmarkRoles: () => {},
    createInPageButtons: () => {},
    fixUniqueLandmarks: ensureUniqueLandmarks,
    navigateWithArrow,
    handleTabNavigation,
    setFocus,
    renderFunction1: async () => {},
    renderFunction2: () => {},
    addressAccessibilityIssuesEnhanced: () => {},
    loadLandmarks,
    processLandmarks,
    sortLandmarks: (landmarks, ascending = true) => {
        return landmarks.slice().sort((a, b) => {
            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
    },
    getLandmarkById: (landmarks, id) => {
        return landmarks.find(landmark => landmark.id === id) || null;
    },
    improveAccessibility: () => {},
    checkLandmarkElement,
    validateLandmarkObject,
    implementAccessibilityFixesFromReport: () => {},
    helper,
    formatDate,
    validateInput,
    processData,
    fetchUser,
    clearCache,
    someFunction,
    countDependencies,
    analyzeModuleDependencies,
    visualizeModuleRelationships,
    displayModuleStructure,
    newFunctions
};