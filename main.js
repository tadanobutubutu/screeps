const React = require('react');
const express = require('express');
const { useState, useEffect } = require('react');
const antd = require('antd');
const { List, Button } = antd || {};
const { useSelector, useDispatch } = require('react-redux');
const path = require('path');
const fs = require('fs');
require('./styles.css');
const { registerSW } = require('effector-sw');
const { isSecureContext } = require('./utils.js');
const { calculateSum } = require('./utils');
const { getLangAttribute, getFullLangAttribute } = require('./utils/accessibilityUtils');
const { validateTableAccessibility, validateTableStructure } = require('./utils/tableAccessibilityUtils');
const { validateLandmark, validateLandmarkStructure } = require('./utils/landmarkUtils');
const { getSvgAccessibleName, setSvgAttributes } = require('./utils/svgAccessibilityUtils');
const { validateLinkAccessibility, handleFakeLinks } = require('./utils/linkAccessibilityUtils');
const { checkLinkAccessibility } = require('./utils/linkAccessibilityUtils');
const { CONFIG } = require('./utils/constants');
const { validateInput } = require('./utils/validators');
const { processData } = require('./utils/processor');
const { initializeApp: initAppFromModule } = require('./app.js');
const { setDependencyGraph } = require('./actions/dependencyGraph');
const { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } = require('./bookFunctions');
const { getRootHtmlAccessibilityProps, getLandmarkProps, getSvgAccessibilityProps, getAccessibleLinkProps } = require('./accessibility');

// Configuration - merged from both branches
const APP_CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

// Web server dependencies
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const config = {
    apiUrl: process.env.API_URL || 'https://api.example.com',
    timeout: 5000
};

const appState = {
    initialized: false,
    data: null,
    cache: new Map()
};

function initialize() {
    appState.initialized = true;
    console.log('App initialized');
}

function initializeApp() {
    initialize();
    return appState;
}

function visualizeDependencyTree(dependencies) {
    console.log('Dependency Tree:');
    return dependencies;
}

function spawnNewUser(name, age) {
    return new User(name, age);
}

function processData(data) {
  if (!data) {
    return null;
  }
  appState.data = data;
  return data;
}

function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: 'User ' + userId };
}

function clearCache() {
  appState.cache.clear();
}

function someFunction() {
  return 'some value';
}

function helper(input) {
  return input ? input.toUpperCase() : '';
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString();
}

function validateInput(input) {
  if (!input) {
    return false;
  }
  return true;
}

let icons = {};

const landmarks = [];

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

function getLangAttribute() {
  return 'en';
}

function addLangAttribute(element) {
  if (element && typeof element === 'object') {
    element.lang = getLangAttribute();
  }
  return element;
}

function ensureLangAttribute() {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = getLangAttribute();
  }
}

function setLanguageAttribute() {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = 'en';
  }
}

function validateTableAccessibility() {
  console.log('Validating table accessibility');
  return [];
}

function validateTableStructure() {
  console.log('Validating table structure');
  return [];
}

function fixTableStructure() {
  console.log('Fixing table structure issues');
}

function fixLandmarks() {
  console.log('Fixing landmarks');
}

function addSvgAccessibleNames() {
  console.log('Adding SVG accessible names');
}

function replaceButtonIds() {
  console.log('Replacing button IDs');
}

function ensureDependencyGraphAriaRole() {
  console.log('Ensuring dependency graph ARIA role');
}

function fixFakeLinkIssue() {
  console.log('Fixing fake link issue');
}

function addMainLandmark() {
  console.log('Adding main landmark');
}

function validateLandmark() {
  console.log('Validating landmark');
  return [];
}

function validateLandmarkStructure() {
  console.log('Validating landmark structure');
  return [];
}

function validateLandmarkAttributes() {
  console.log('Validating landmark attributes');
  return [];
}

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function getSvgAccessibleName() {
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

function ensureUniqueLandmarks(landmarksArg) {
  console.log('Ensuring unique landmarks');
  return [];
}

function createInPageButton() {
  console.log('Creating in-page button');
}

function validateLinkAccessibility() {
  console.log('Validating link accessibility');
  return [];
}

function handleFakeLinks() {
  console.log('Handling fake links');
}

function wrapPrimaryContentInMain(parent) {
  if (!parent || typeof parent.nodeType !== 'number') {
    throw new Error('Invalid parent element');
  }

  if (parent.tagName && parent.tagName.toLowerCase() === 'main') {
    return parent;
  }

  const mainElement = document.createElement('main');
  mainElement.appendChild(parent);

  return mainElement;
}

function addLandmarkRoles() {
  if (typeof document !== 'undefined') {
    const mainElement = document.querySelector('main');
    if (mainElement && mainElement.setAttribute) {
      mainElement.setAttribute('role', 'main');
    }
    
    const navElement = document.querySelector('nav');
    if (navElement && navElement.setAttribute) {
      navElement.setAttribute('role', 'navigation');
    }
  }
}

function fixFakeLinks() {
  if (typeof document !== 'undefined') {
    const fakeLinks = document.querySelectorAll('a:not([href])');
    fakeLinks.forEach(link => {
      if (link && link.setAttribute) {
        link.setAttribute('role', 'button');
      }
    });
  }
}

function ensureRootContainerAccessible(rootElement) {
  if (rootElement) {
    rootElement.setAttribute('role', 'main');
  }
}

function getSvgAccessibilityProps(label, labelledById) {
  const props = {
    role: 'img',
    focusable: 'false',
  };
  if (label) {
    props['aria-label'] = label;
  } else if (labelledById) {
    props['aria-labelledby'] = labelledById;
  } else {
    props['aria-hidden'] = 'true';
  }
  return props;
}

function getAccessibleLinkProps(href, label) {
  return {
    href,
    role: 'link',
    'aria-label': label,
  };
};

function getLandmarkProps(landmark, label) {
  return {
    role: landmark,
    'aria-label': label
  };
}

function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
};

function generateKeyUtil(book) {
  if (book.id) {
    return book.id;
  }
  return `${book.title}-${book.author}-${Math.random().toString(36).substr(2, 9)}`;
};

async function fetchBookDependencies(bookId) {
  try {
    const response = await fetch(`https://api.example.com/books/${bookId}/dependencies`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const dependencies = await response.json();
    dispatch(setDependencyGraph({ bookId, dependencies }));
  } catch (error) {
    console.error('Error fetching book dependencies:', error);
  }
}

function updateBookDependencies(bookId, newDependencies) {
  dispatch(setDependencyGraph({ bookId, dependencies: newDependencies }));
};

function addressAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.issues) {
    return;
  }

  insightReport.issues.forEach((issue) => {
    switch (issue.type) {
      case 'REACT_015':
        if (issue.element) {
          addLangAttribute(issue.element);
        }
        break;
      case 'REACT_027':
        if (issue.type === 'structure') {
          validateTableStructure();
          fixTableStructure();
        } else {
          validateTableAccessibility();
        }
        break;
      case 'REACT_017':
        addMainLandmark();
        validateLandmark();
        validateLandmarkStructure();
        validateLandmarkAttributes();
        addLandmarkRegions();
        break;
      case 'REACT_041':
        if (issue.element) {
          setSvgAttributes(issue.element, issue.accessibleName || getSvgAccessibleName());
        }
        break;
      case 'REACT_025':
        ensureUniqueLandmarks();
        break;
      case 'REACT_036':
        handleFakeLinks();
        fixFakeLinks();
        break;
      default:
        console.log('Unknown issue type:', issue.type);
    }
  });
}

function getInsightReport() {
  const issues = [];
  
  const langAttribute = getLangAttribute();
  if (!langAttribute) {
    issues.push({
      type: 'REACT_015',
      description: 'HTML element is missing lang attribute',
      severity: 'critical',
      element: 'html'
    });
  }
  
  const tableAccessibilityIssues = validateTableAccessibility();
  if (tableAccessibilityIssues && tableAccessibilityIssues.length > 0) {
    tableAccessibilityIssues.forEach((issue) => {
      issues.push({
        type: 'REACT_027',
        subtype: 'accessibility',
        description: issue.description || 'Table accessibility issue',
        severity: issue.severity || 'high',
        element: issue.element,
        table: issue.table
      });
    });
  }
  
  const tableStructureIssues = validateTableStructure();
  if (tableStructureIssues && tableStructureIssues.length > 0) {
    tableStructureIssues.forEach((issue) => {
      issues.push({
        type: 'REACT_027',
        subtype: 'structure',
        description: issue.description || 'Table structure issue',
        severity: issue.severity || 'high',
        element: issue.element,
        table: issue.table
      });
    });
  }
  
  const landmarkIssues = validateLandmark();
  if (landmarkIssues && landmarkIssues.length > 0) {
    landmarkIssues.forEach((issue) => {
      issues.push({
        type: 'REACT_017',
        description: issue.description || 'Landmark issue',
        severity: issue.severity || 'medium',
        element: issue.element,
        landmark: issue.landmark
      });
    });
  }
  
  const landmarkStructureIssues = validateLandmarkStructure();
  if (landmarkStructureIssues && landmarkStructureIssues.length > 0) {
    landmarkStructureIssues.forEach((issue) => {
      issues.push({
        type: 'REACT_017',
        structure: true,
        description: issue.description || 'Landmark structure issue',
        severity: issue.severity || 'medium',
        element: issue.element,
        landmark: issue.landmark
      });
    });
  }
  
  const landmarkAttributeIssues = validateLandmarkAttributes();
  if (landmarkAttributeIssues && landmarkAttributeIssues.length > 0) {
    landmarkAttributeIssues.forEach((issue) => {
      issues.push({
        type: 'REACT_017',
        description: issue.description || 'Landmark attribute issue',
        severity: issue.severity || 'low',
        element: issue.element,
        landmark: issue.landmark
      });
    });
  }
  
  getSvgAccessibleName();

  return issues;
}

const initApp = () => {
  initializeApp();
  setLanguageAttribute();
  addLandmarkRoles();
  if (landmarks && landmarks.length > 0) {
    ensureUniqueLandmarks(landmarks);
  } else {
    ensureUniqueLandmarks();
  }

  icons = {
    icon: '<svg viewBox="0 0 100 100" aria-label="Screeps icon"></svg>'
  };

  fixFakeLinks();

  console.log('Initializing ' + appData.title + ' v' + appData.version);
};

if (typeof isSecureContext === 'function' && isSecureContext()) {
  initApp();
} else if (typeof isSecureContext === 'undefined') {
  initApp();
} else {
  console.warn('Application is not running in a secure context. Some features may not be available.');
}

function getConfig() {
  return config;
}

function getVersion() {
  return appData.version;
}

function main() {
    initialize();
    initializeApp();
    console.log('Main function executed');
    return { executed: true };
}

// Server-side code
if (typeof window === 'undefined' && typeof process !== 'undefined' && process.versions && process.versions.node) {
  app.get('/accessibility-report', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/landmarks', (req, res) => {
    res.json({ landmarks: landmarks });
  });

  app.use((req, res, next) => {
    if (!req.originalUrl.startsWith('/api')) {
      try {
        const root = document.createElement('html');
        root.appendChild(wrapPrimaryContentInMain(req.originalUrl));

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(root.outerHTML);
        return;
      } catch (e) {
      }
    }
    next();
  });

  if (typeof initAppFromModule === 'function') {
    initAppFromModule(app, PORT, registerSW);
  }
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('Server running on http://' + HOST + ':' + PORT);
  });

  visualizeDependencyTree(require.dependencies);
}

module.exports = {
    User,
    spawnNewUser,
    config,
    initialize,
    initializeApp,
    main,
    visualizeDependencyTree,
    APP_CONFIG,
    appState,
    fetchUser,
    clearCache,
    someFunction,
    helper,
    formatDate,
    validateInput,
    getLangAttribute,
    addLangAttribute,
    ensureLangAttribute,
    setLanguageAttribute,
    validateTableAccessibility,
    validateTableStructure,
    fixTableStructure,
    fixLandmarks,
    addMainLandmark,
    validateLandmark,
    validateLandmarkStructure,
    validateLandmarkAttributes,
    addLandmarkRegions,
    getSvgAccessibleName,
    setSvgAttributes,
    ensureUniqueLandmarks,
    createInPageButton,
    validateLinkAccessibility,
    handleFakeLinks,
    addLandmarkRoles,
    fixFakeLinks,
    fixFakeLinkIssue,
    replaceButtonIds,
    ensureDependencyGraphAriaRole,
    addSvgAccessibleNames,
    ensureRootContainerAccessible,
    getSvgAccessibilityProps,
    getAccessibleLinkProps,
    getLandmarkProps,
    addressAccessibilityIssues,
    getInsightReport,
    getConfig,
    getVersion,
    processData,
    countDependencies,
    generateKey: generateKeyUtil,
    fetchBookDependencies,
    updateBookDependencies,
    appData,
    landmarks,
    icons
};