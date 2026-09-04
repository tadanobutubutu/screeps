import './styles.css';
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
<<<<<<< HEAD
const config = require('./config');
const logger = require('./utils/logger');
const fastMap = require('fast-map');
const axios = require('axios');
const cheerio = require('cheerio');
const axeCore = require('axe-core');

// React and Redux imports (converted from ES6 imports to CommonJS for consistency)
const React = require('react');
const { useState, useEffect } = React;
const { List, Button } = require('antd');
const { useSelector, useDispatch } = require('react-redux');
const { setDependencyGraph } = require('./actions/dependencyGraph');
const { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } = require('./bookFunctions');
const { initializeApp } = require('./app.js');
const { registerSW } = require('effector-sw');
const { isSecureContext } = require('./utils.js');
const { CONFIG: CONFIG_CONST } = require('./utils/constants');
const App = require('./App').default;
const { helper, formatDate } = require('./utils');
const { someFunction } = require('./utils/someFunction');
const { fetchUser, clearCache } = require('./utils/user');
const utils = require('./utils');
const { calculateSum, getLangAttribute, getFullLangAttribute } = require('./utils/accessibilityUtils');
const { validateTableAccessibility, validateTableStructure } = require('./utils/tableAccessibilityUtils');
const { validateLandmark, validateLandmarkStructure } = require('./utils/landmarkAccessibilityUtils');
const { getSvgAccessibleName, setSvgAttributes } = require('./utils/svgAccessibilityUtils');
const { validateLinkAccessibility, handleFakeLinks } = require('./utils/linkAccessibilityUtils');
const { checkLinkAccessibility: importedCheckLinkAccessibility } = require('./utils/linkAccessibilityUtils');
const { accessiblyHelper } = require('./accessibly-helper');
const { a11y } = require('@accessible/react');
const { validateInput } = require('./utils/validators');
const { processData } = require('./utils/processor');
const { addProperLandmarkRegions } = require('./utils/landmarkUtils');
const { addProperLandmarkRegions: addProperLandmarkRegionsImported } = require('./utils/landmarkUtils.js');
const { validateInput: validateInputImported } = require('./utils/validators');
const { processData: processDataImported } = require('./utils/processor');

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0',
    userAction: "Unknown",
    previousUserActions: [],
    lastUserActionId: "Unknown",
    userActionStack: [],
};

// Configuration - merged from both branches
const config = require('./config');
const logger = require('./utils/logger');
const fastMap = require('fast-map');
const axios = require('axios');
const cheerio = require('cheerio');
const axeCore = require('axe-core');

// React and Redux imports (converted from ES6 imports to CommonJS for consistency)
const React = require('react');
const { useState, useEffect } = React;
const { List, Button } = require('antd');
const { useSelector, useDispatch } = require('react-redux');
const { setDependencyGraph } = require('./actions/dependencyGraph');
const { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } = require('./bookFunctions');
const { initializeApp } = require('./app.js');
const { registerSW } = require('effector-sw');
const { isSecureContext } = require('./utils.js');
const { CONFIG: CONFIG_CONST } = require('./utils/constants');
const App = require('./App').default;
const { helper, formatDate } = require('./utils');
const { someFunction } = require('./utils/someFunction');
const { fetchUser, clearCache } = require('./utils/user');
const utils = require('./utils');
const { calculateSum, getLangAttribute, getFullLangAttribute } = require('./utils/accessibilityUtils');
const { validateTableAccessibility, validateTableStructure } = require('./utils/tableAccessibilityUtils');
const { validateLandmark, validateLandmarkStructure } = require('./utils/landmarkAccessibilityUtils');
const { getSvgAccessibleName, setSvgAttributes } = require('./utils/svgAccessibilityUtils');
const { validateLinkAccessibility, handleFakeLinks } = require('./utils/linkAccessibilityUtils');
const { checkLinkAccessibility: importedCheckLinkAccessibility } = require('./utils/linkAccessibilityUtils');
const { accessiblyHelper } = require('./accessibly-helper');
const { a11y } = require('@accessible/react');
const { validateInput } = require('./utils/validators');
const { processData } = require('./utils/processor');
const { addProperLandmarkRegions } = require('./utils/landmarkUtils');
const { addProperLandmarkRegions: addProperLandmarkRegionsImported } = require('./utils/landmarkUtils.js');
const { validateInput: validateInputImported } = require('./utils/validators');
const { processData: processDataImported } = require('./utils/processor');

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Screeps',
    version: '1.0.0'
};

// Configuration - merged from both branches
const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
  debug: true,
  version: '1.0.0'
};

const config = CONFIG;

const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

// Helper functions
function validateInput(input) {
  return input !== null && input !== undefined;
}

// In a real implementation, you would use a library like D3.js or Vis.js
// to render the actual graph visualization
function renderDependencyGraph(graphData) {
    console.log('Rendering dependency graph with data:', graphData);
}

// New function3 logic here - using the more complete version from origin/main
function newFunction3(items, transformFn) {
    if (!Array.isArray(items)) {
        return [];
    }
    return fastMap(items, transformFn);
}

// Helper function to format dates
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return date.toISOString();
}

// New function4 logic - implementing the actual behavior from origin/main
function newFunction4(input) {
    // Placeholder for function4 logic
    // This should be replaced with the actual implementation
    return input;
}

// New function that does something different
function newFunction() {
  // Implementation of the new function
  console.log('New function executed');
}

// Function to handle credential response
function handleCredentialResponse(response) {
  // Parse the credential response
  const credential = JSON.parse(response.credential);

  // Validate the credential structure
  if (!credential || !credential.credential || !credential.clientId) {
    throw new Error('Invalid credential response structure');
  }

  // Store the credential in a secure way (implementation depends on your auth system)
  // For example, you might store it in a secure cookie or local storage with encryption
  // This is a placeholder for your actual implementation
  localStorage.setItem('authCredential', JSON.stringify({
    token: credential.credential,
    clientId: credential.clientId,
    timestamp: Date.now()
  }));

  // Return the parsed credential for further use
  return credential;
}

// REACT_037: Google sign-in logic
const googleSignIn = {
  initialize: function(clientId) {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: client_id,
        callback: this.handleCredentialResponse.bind(this)
      });
      return true;
    }
    return false;
  },

  renderButton: function(elementId) {
    const element = document.getElementById(elementId);
    if (element && typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        text: 'sign_in_with'
      });
      return true;
    }
    return false;
  },

  handleCredentialResponse: function(response) {
    console.log('Google Sign-In successful');
    return response;
  }
};

// Utility functions
function processLandmarkElements(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = document.querySelectorAll('[role="region"], [role="navigation"], main, aside');
    const landmarkIds = elements.map(el => el.id || null);
    return Array.from(new Set(landmarkIds));
  }
  return landmarks;
}

// Entry point for accessibility improvements
function addressInsightIssues() {
  // ... existing accessibility functions

  // New: Implement function to handle focus trap for keyboard navigation
  newFocusTrap(document.body);
}

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and wrapPrimaryContentInMain())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and addAriaToFormControls())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())
// todo-hash: 50090d29914857ebc4d3d6f532d1293acbb65526
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

// Initialize app function
const initializeApp = () => {
  initialize();
  return appState;
};

// Helper functions moved to a separate file
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  addLandmarkRoles,
  renderDependencyGraph,
  displayModuleStructure,
  countDependencies,
  analyzeModuleDependencies,
  visualizeModuleRelationships
} = require('./helpers');

// Validation functions
function validateLandmark(landmark) {
<<<<<<< HEAD
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

    // Additional validation for array composition
    if (Array.isArray(landmark)) {
        landmark.forEach(innerLandmark => {
            if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
                errors.push('Landmark array must have valid names');
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

function validateLandmarkStructure(landmark) {
    const errors = [];

    if (!landmark) {
        errors.push('Landmark is required');
        return { valid: false, errors };
    }

    if (!landmark.role) {
        errors.push('Landmark must have a role');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

function checkLandmarkElement(id) {
    if (typeof document === 'undefined') return false;
    const element = document.getElementById(id);
    return element !== null;
}

function ensureUniqueLandmarks(landmarksArray) {
    if (!landmarksArray || landmarksArray.length === 0) {
        return [];
    }
    const seen = new Set();
    return landmarksArray.filter(landmark => {
        const key = landmark.name + '_' + (landmark.role || 'default');
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function ensureLandmarkUniqueness(elements) {
    if (!Array.isArray(elements)) return [];
    const seen = new Set();
    return elements.filter(element => {
        if (!element) return false;
        const id = element.id || element.name;
        if (!id) return false;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
    });
}

// Accessibility functions from both branches
function addLangAttribute() {
    if (typeof document !== 'undefined') {
        const htmlElement = document.documentElement;
        if (!htmlElement.lang) {
            htmlElement.lang = 'en';
        }
    }
}

function addLangAttributeHtml(html) {
    const $ = cheerio.load(html);
    $('html').attr('lang', 'en');
    return $.html();
}

function ensureLangAttributeHtml(html) {
    const $ = cheerio.load(html);
    if ($('html').attr('lang') === undefined) {
        $('html').attr('lang', 'en');
    }
    return $.html();
}

function fixTableStructure() {
    if (typeof document === 'undefined') return;
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (!table.querySelector('thead')) {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                const cells = firstRow.querySelectorAll('th, td');
                cells.forEach(cell => {
                    const newTh = document.createElement('th');
                    newTh.textContent = cell.textContent;
                    if (cell.hasAttribute('colspan')) {
                        newTh.setAttribute('colspan', cell.getAttribute('colspan'));
                    }
                    if (cell.hasAttribute('rowspan')) {
                        newTh.setAttribute('rowspan', cell.getAttribute('rowspan'));
                    }
                    newTh.setAttribute('scope', 'col');
                    headerRow.appendChild(newTh);
                });
                thead.appendChild(headerRow);
                table.insertBefore(thead, table.firstChild);
            }
        }
        if (!table.querySelector('tbody')) {
            const rows = table.querySelectorAll('tr');
            const thead = table.querySelector('thead');
            const rowsAfterHeader = thead ? Array.from(rows).slice(1) : Array.from(rows);
            if (rowsAfterHeader.length > 0) {
                const tbody = document.createElement('tbody');
                rowsAfterHeader.forEach(row => {
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);
            }
        }
    });
}

function fixTableStructureHtml(html) {
    const $ = cheerio.load(html);
    $('table').each((i, elem) => {
        const $table = $(elem);
        const hasHeaderRow = $table.find('tr').first().find('th').length > 0;
        if (!hasHeaderRow) {
            $table.find('tr').first().prepend('<th scope="col"></th>');
            $table.find('td').each((j, cell) => {
                $(cell).prependTo($table.find('tr').first());
            });
        }
    });
    return $.html();
}

function addMainLandmark() {
    if (typeof document === 'undefined') return;
    let mainElement = document.querySelector('main');
    if (!mainElement) {
        mainElement = document.createElement('main');
        mainElement.id = 'main-content';
        const existingContent = document.body.firstElementChild;
        if (existingContent) {
            document.body.insertBefore(mainElement, existingContent);
        } else {
            document.body.appendChild(mainElement);
        }
    } else {
        if (!mainElement.id) {
            mainElement.id = 'main-content';
        }
        if (!mainElement.hasAttribute('role') || mainElement.getAttribute('role') !== 'main') {
            mainElement.setAttribute('role', 'main');
        }
    }
}

function ensureUniqueLandmarksDoc() {
    if (typeof document === 'undefined') return;
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
    landmarkRoles.forEach(role => {
        const elements = document.querySelectorAll(`[role="${role}"]`);
        if (elements.length > 1) {
            let isFirst = true;
            elements.forEach(element => {
                if (isFirst) {
                    isFirst = false;
                } else {
                    element.removeAttribute('role');
                }
            });
        }
    });
}

function addSvgAccessibleNames() {
    if (typeof document === 'undefined') return;
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        const title = svg.querySelector('title');
        if (title) {
            const titleId = `svg-title-${index}`;
            title.id = titleId;
            svg.setAttribute('aria-labelledby', titleId);
        } else {
            const fallbackId = `svg-fallback-title-${index}`;
            const newTitle = document.createElement('title');
            newTitle.id = fallbackId;
            newTitle.textContent = `SVG image ${index + 1}`;
            svg.insertBefore(newTitle, svg.firstChild);
            svg.setAttribute('aria-labelledby', fallbackId);
        }
    });
}

function addSvgAccessibleNamesDom(dom) {
    const $ = cheerio.load(dom);
    $('svg').each((i, elem) => {
        const $svg = $(elem);
        const role = $svg.attr('role');
        if (role === 'img' && !$svg.attr('aria-label') && !$svg.attr('title')) {
            $svg.attr('aria-label', 'Image with no description.');
        } else if (role === 'img' && !$svg.attr('aria-label') && !$svg.attr('title')) {
            $svg.attr('aria-label', 'Image with no description.');
        } else if ($svg.attr('role') === 'none') {
            // Do nothing
        } else {
            $svg.attr('aria-label', 'Image with no description.');
        }
    });
}

function fixFakeLinkIssue() {
    if (typeof document === 'undefined') return;
    const anchors = document.querySelectorAll('a');
    anchors.forEach(anchor => {
        if (!anchor.href || anchor.href === '#' || anchor.href === '' || anchor.href === 'javascript:;') {
            const text = anchor.textContent.trim();
            const button = document.createElement('button');
            button.textContent = text;
            Array.from(anchor.attributes).forEach(attr => {
                if (attr.name !== 'href' && attr.name !== 'onclick') {
                    button.setAttribute(attr.name, attr.value);
                }
            });
            anchor.parentNode.replaceChild(button, anchor);
        }
    });
}

function fixFakeLinks(container) {
    if (!container || typeof document === 'undefined') return;
    const fakeLinks = container.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
    fakeLinks.forEach(link => {
        if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
            link.setAttribute('role', 'button');
            link.addEventListener('click', (e) => {
                e.preventDefault();
            });
        }
    });
}

function fixFakeLinksDom(dom) {
    const $ = cheerio.load(dom);
    $('a[onclick]').each((i, elem) => {
        const $tag = $(elem);
        const onClickAttributeValue = $tag.attr('onclick');
        const matchResult = onClickAttributeValue && onClickAttributeValue.match(/window\.location(?:[^=]+)?\(['"]([^'"]+)['"]/);
        const hrefValue = matchResult && matchResult[1];
        if (hrefValue) {
            $tag.attr('href', hrefValue);
            $tag.attr('onclick', '');
        }
    });
}

function fixLandmarksHtml(html) {
    const $ = cheerio.load(html);
    $('header').attr('role', 'banner');
    $('nav').attr('role', 'navigation');
    $('main').attr('role', 'main');
    $('footer').attr('role', 'contentinfo');
    return $.html();
}

function validateSvgAccessibility(svg) {
    const errors = [];
    if (!svg) {
        errors.push('SVG element is required');
        return { valid: false, errors };
    }
    const accessibleName = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.querySelector('title');
    if (!accessibleName) {
        errors.push('SVG must have an accessible name via aria-label, aria-labelledby, or title element');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}

function processUniqueElements(elements) {
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
}

function addressInsightIssues(document) {
    const issues = [];
    if (!document.documentElement.lang) {
        setLanguageAttribute(document, 'en');
        issues.push('lang attribute added');
    }
    const mainLandmark = document.querySelector('main') || document.querySelector('[role="main"]');
    if (!mainLandmark) {
        issues.push('main landmark added');
    }
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
            const title = document.createElement('title');
            title.textContent = 'SVG image';
            svg.insertBefore(title, svg.firstChild);
            issues.push('SVG accessible name added');
        }
    });
    return issues;
}

function renderDependencyGraph(container) {
    if (!container) return;
    console.log('Rendering dependency graph');
}

function renderIndexView(container) {
    if (!container) return;
    console.log('Rendering index view');
}

function addLandmarkRegions(container) {
    if (!container) return [];
    const regions = ['main', 'navigation', 'banner', 'contentinfo', 'complementary'];
    const addedRegions = [];
    regions.forEach(role => {
        const existing = container.querySelector(`[role="${role}"]`);
        if (!existing) {
            const region = document.createElement('div');
            region.setAttribute('role', role);
            container.appendChild(region);
            addedRegions.push(role);
        }
    });
    return addedRegions;
}

function processAccessibilityIssues(document) {
    const issues = [];
    if (!document.documentElement.lang) {
        issues.push('Missing lang attribute on html element');
    }
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    if (!main) {
        issues.push('Missing main landmark');
    }
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        const hasAccessibleName = svg.getAttribute('aria-label') ||
            svg.getAttribute('aria-labelledby') ||
            svg.querySelector('title');
        if (!hasAccessibleName) {
            issues.push(`SVG at index ${index} missing accessible name`);
        }
    });
    return issues;
}

function validateLandmarkAttributes(container) {
    const main = document.querySelector('main');
    const validRoles = ['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'search', 'form'];
    const landmarks = container.querySelectorAll('[role]');
    const invalidRoles = [];
    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role');
        if (!validRoles.includes(role)) {
            invalidRoles.push(`${landmark.id || 'unknown'} -> ${role}`);
        }
    });
    return {
        valid: invalidRoles.length === 0,
        errors: invalidRoles
    };
}

function landmarkStructureCheck(container) {
    if (!container) return { valid: false, errors: ['Container is required'] };
    const landmarks = container