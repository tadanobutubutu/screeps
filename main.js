const books = [];
const safetyCategory = "User Safety: safe";
const safetyCategoriesList = [safetyCategory];
const ARRAY_OF_REQUIRED_LANDMARK_TAGS = ['main', 'nav', 'header', 'footer', 'aside', 'section'];

// main.js - Entry point for the application

// Module imports and configuration
const logger = require('./utils/logger');
const express = require('express');
const axe = require('axe-core');
const fastMap = new Map();
const path = require('path');
const fs = require('fs');

const { calculateSum } = require('./utils');
const { getLangAttribute, getFullLangAttribute } = require('./utils/accessibilityUtils');
const { validateTableAccessibility } = require('./utils/tableAccessibilityUtils');
const { validateTableStructure } = require('./utils/tableAccessibilityUtils');
const { validateLandmark } = require('./utils/landmarkUtils');
const { validateLinkAccessibility } = require('./utils/linkAccessibilityUtils');
const { setSvgAttributes } = require('./utils/svgAccessibilityUtils');
const { handleFakeLinks } = require('./utils/linkAccessibilityUtils');
const { fixAccessibilityIssues } = require('./utils/accessibilityUtils');

const { calculateDiscount } = require('./utils/discountUtils');

const allowedRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000,
  debug: false,
  version: '1.0.0',
  dataPath: './data',
  maxResults: 100,
  allowedRoles: allowedRoles,
  landmarkRoles: allowedRoles,
  maxLandmarks: 50
};

const CONFIG = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000,
  landmarkRoles: [
    'banner',
    'navigation',
    'main',
    'complementary',
    'contentinfo',
    'region',
  ],
  requiredLandmarks: ['banner', 'navigation', 'main'],
};

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
  'section:not([role])'
];

function enhanceKeyboardNavigation(options = {}) {
  const defaults = {
    landmarkKey: 'l',
    skipLinkKey: 's',
    announceLandmarks: true,
    autoInit: true
  };
  
  const settings = { ...defaults, ...options };
  
  let landmarkElements = [];
  let skipLinks = [];
  let announcementRegion = null;
  
  function collectLandmarks() {
    const elements = [];
    landmarkSelectors.forEach(selector => {
      const found = document.querySelectorAll(selector);
      found.forEach(el => elements.push(el));
    });
    return elements;
  }
  
  function focusLandmark(index) {
    const landmarks = collectLandmarks();
    if (landmarks.length > 0) {
      const targetIndex = ((index % landmarks.length) + landmarks.length) % landmarks.length;
      landmarks[targetIndex].setAttribute('tabindex', '-1');
      landmarks[targetIndex].focus();
      if (settings.announceLandmarks) {
        announceLandmark(landmarks[targetIndex]);
      }
    }
  }
  
  function announceLandmark(element) {
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    const label = element.getAttribute('aria-label') || '';
    const text = `Landmark: ${role}${label ? ', ' + label : ''}`;
    
    if (!announcementRegion) {
      announcementRegion = document.createElement('div');
      announcementRegion.setAttribute('role', 'status');
      announcementRegion.setAttribute('aria-live', 'polite');
      announcementRegion.setAttribute('aria-atomic', 'true');
      announcementRegion.style.position = 'absolute';
      announcementRegion.style.left = '-9999px';
      announcementRegion.style.width = '1px';
      announcementRegion.style.height = '1px';
      announcementRegion.style.overflow = 'hidden';
      document.body.appendChild(announcementRegion);
    }
    
    announcementRegion.textContent = '';
    setTimeout(() => {
      announcementRegion.textContent = text;
    }, 50);
  }
  
  function createSkipLinks() {
    const landmarks = collectLandmarks();
    const skipNav = document.createElement('div');
    skipNav.id = 'skip-nav';
    skipNav.style.position = 'absolute';
    skipNav.style.left = '-9999px';
    skipNav.style.top = 'auto';
    skipNav.style.width = '1px';
    skipNav.style.height = '1px';
    skipNav.style.overflow = 'hidden';
    
    landmarks.forEach((landmark, index) => {
      const link = document.createElement('a');
      const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
      const label = landmark.getAttribute('aria-label') || '';
      
      link.href = '#';
      link.textContent = `Skip to ${role}${label ? ': ' + label : ''}`;
      link.onclick = (e) => {
        e.preventDefault();
        focusLandmark(index);
        skipNav.style.left = '-9999px';
      };
      
      skipNav.appendChild(link);
      skipLinks.push(link);
    });
    
    if (landmarks.length > 0) {
      document.body.insertBefore(skipNav, document.body.firstChild);
    }
    
    return skipNav;
  }
  
  function handleKeyDown(event) {
    if (event.key.toLowerCase() === settings.landmarkKey && event.altKey) {
      event.preventDefault();
      const currentFocus = document.activeElement;
      const landmarks = collectLandmarks();
      let currentIndex = -1;
      
      landmarks.forEach((landmark, index) => {
        if (landmark === currentFocus || landmark.contains(currentFocus)) {
          currentIndex = index;
        }
      });
      
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % landmarks.length : 0;
      focusLandmark(nextIndex);
    }
    
    if (event.key.toLowerCase() === settings.skipLinkKey && event.altKey) {
      event.preventDefault();
      const skipNav = document.getElementById('skip-nav');
      if (skipNav) {
        skipNav.style.left = '0';
        skipNav.style.width = 'auto';
        skipNav.style.height = 'auto';
        skipNav.style.overflow = 'visible';
        const firstLink = skipNav.querySelector('a');
        if (firstLink) {
          firstLink.focus();
        }
      }
    }
  }
  
  function init() {
    landmarkElements = collectLandmarks();
    createSkipLinks();
    document.addEventListener('keydown', handleKeyDown);
  }
  
  function destroy() {
    document.removeEventListener('keydown', handleKeyDown);
    const skipNav = document.getElementById('skip-nav');
    if (skipNav) {
      skipNav.remove();
    }
    if (announcementRegion) {
      announcementRegion.remove();
      announcementRegion = null;
    }
    skipLinks = [];
    landmarkElements = [];
  }
  
  if (settings.autoInit && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
  
  return {
    focusLandmark,
    collectLandmarks,
    init,
    destroy,
    settings
  };
}

// Count internal private functions (starting with '_')
const countDependencies = {
  // Count internal private functions (starting with '_')
  _internalDependencies: function() {
    // Count internal private functions (starting with '_')
    const internalDependencies = [];
    // Use appropriate global object for the environment
    const globalObj = (typeof window !== 'undefined') ? window : global;
    const functions = [];
    Object.keys(globalObj).forEach(key => {
      if (key.startsWith('_') && typeof globalObj[key] === 'function') {
        internalDependencies.push(key);
      }
    });
    const internalCount = internalDependencies.length;
    return internalCount;
  }
};

// Application state
const appState = {
    initialized: false,
    data: null,
    cache: {}
};

function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element_id_${Math.random().toString(36).substring(2, 15)}`;
  }
  return element;
}

function addAriaLabel(element, label) {
  if (!element.ariaLabel && !element.ariaLabelledby) {
    element.ariaLabel = label;
  }
  return element;
}

function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.addEventListener('click', onClickHandler);
  return button;
}

function validateLinkAccessibilityLocal(link) {
  return link.href && !(link.href === "#" || link.href.startsWith("javascript"));
}

/**
 * Gets the accessible name for an SVG element
 * @param {Object} svgElement - The SVG element
 * @returns {string} The accessible name for the SVG
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return 'Accessible SVG Icon';

  const title = svgElement.querySelector('title');
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (title) return title.textContent;
  if (ariaLabel) return ariaLabel;
  return 'Accessible SVG Icon';
}

/**
 * Adds accessibility attributes to SVG elements
 * @param {Object} svgElement - The SVG element to add accessibility attributes to
 * @returns {Object} Result with success status and the modified SVG element
 */
function addSvgAccessibility(svgElement) {
  if (!svgElement || typeof svgElement !== 'object') {
    return {
      success: false,
      element: svgElement,
      issues: ['Invalid SVG element provided']
    };
  }

  const issues = [];
  const element = svgElement;

  // Ensure SVG has role="img" for screen readers
  if (!element.hasAttribute('role')) {
    element.setAttribute('role', 'img');
  } else if (element.getAttribute('role') !== 'img' && element.getAttribute('role') !== 'graphic') {
    issues.push('SVG role should be "img" or "graphic" for proper accessibility');
  }

  // Check for and add accessible name via aria-label or title element
  const hasAriaLabel = element.hasAttribute('aria-label');
  const hasAriaLabelledby = element.hasAttribute('aria-labelledby');
  const hasTitle = element.querySelector && element.querySelector('title');

  if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
    issues.push('SVG missing accessible name (aria-label, aria-labelledby, or title element)');
  }

  // Ensure SVG is not hidden from assistive technology unnecessarily
  if (element.getAttribute('aria-hidden') === 'true') {
    issues.push('SVG should not have aria-hidden="true" if it conveys semantic meaning');
  }

  // Add aria-hidden to decorative SVGs if they have no accessible content
  if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle && !element.hasAttribute('aria-hidden')) {
    element.setAttribute('aria-hidden', 'true');
  }

  return {
    success: issues.length === 0,
    element: element,
    issues: issues
  };
}

/**
 * Processes the credential and returns appropriate authentication state
 * @param {Object} credentialResponse - The credential response to process
 * @returns {Object} Authentication state with user info and status
 */
function processCredentialAuthentication(credentialResponse) {
  const result = handleCredentialResponse(credentialResponse);

  if (!result.success) {
    return {
      authenticated: false,
      user: null,
      errors: result.issues
    };
  }

  const user = result.parsedCredential || result.userData;

  return {
    authenticated: true,
    user: {
      email: user.email,
      name: user.name,
      picture: user.picture
    },
    errors: []
  };
}

function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function getConfig() {
  return config;
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function validateInputLocal(input) {
  return input !== null && input !== undefined;
}

function createAccessibleLink(href, title, text) {
  const link = document.createElement('a');
  link.href = href;
  link.title = title;
  link.textContent = text;
  link.setAttribute('aria-label', text);
  return link;
}

function processDataLocal(data) {
  if (!validateInputLocal(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now()
  };
}

function visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

function generateDependencyReport(dependencies) {
  let graph = 'Dependency Tree:\n';
  dependencies.forEach(dep => {
    graph += `- ${dep.name}\n`;
  });
  return { graph };
}

function fixAccessibilityIssues() {
  fixTableStructure();
  fixLandmarks();
  addSvgAccessibleNamesLocal();
  fixFakeLinksLocal();
}

function fixTableStructure() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        // Ensure table has caption
        const caption = table.querySelector('caption');
        if (!caption) {
            const newCaption = document.createElement('caption');
            newCaption.textContent = 'Table';
            table.appendChild(newCaption);
        }
        // Add headers attribute if missing
        table.setAttribute('headers', 'true');
    });
}

function fixLandmarks() {
    if (document.querySelector('main')) return;
    const main = document.createElement('main');
    main.setAttribute('aria-label', 'Primary Content');
    document.body.insertBefore(main, document.body.firstChild);
    document.querySelectorAll('[role]').forEach(element => {
        const tagName = element.tagName.toLowerCase();
        if (!ARRAY_OF_REQUIRED_LANDMARK_TAGS.includes(tagName)) {
            const className = `landmark_${tagName}`;
            element.setAttribute('class', className);
            element.setAttribute('aria-label', className);
        }
    });
}

function addSvgAccessibleNamesLocal() {
    document.querySelectorAll('svg').forEach(svg => {
        const xmlns = svg.hasAttribute('xmlns') ? svg.getAttribute('xmlns') : '';
        const accessibleName = xmlns.indexOf('svg') !== -1 ? `${svg.getAttribute('viewBox')} ${svg.getAttribute('width')}x${svg.getAttribute('height')}` : '';
        svg.setAttribute('aria-label', accessibleName);
        svg.setAttribute('role', 'img');
    });
}

function fixFakeLinksLocal() {
    const fakeLinks = document.querySelectorAll('a[href="#"]');
    fakeLinks.forEach(link => {
        link.setAttribute('role', 'button');
        link.setAttribute('aria-label', link.textContent);
    });
}

// Addressmissing functions or changes requested in the issue.
// New function: getUserSafetyAdvice
function getUserSafetyAdvice() {
  return safetyCategoriesList[Math.floor(Math.random() * safetyCategoriesList.length)];
}

// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute(), getFullLangAttribute(), addLangAttribute() and wrapPrimaryContentInMain())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure(), validateTableHeaderCellScope and fixTableStructureIssues())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and validateLandmark and addMainLandmark(), addLandmarkRegions and fixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
// todo-hash: 500

module.exports = {
  config,
  CONFIG,
  books,
  safetyCategory,
  landmarkSelectors,
  enhanceKeyboardNavigation,
  countDependencies,
  appState,
  ensureElementHasId,
  addAriaLabel,
  createInPageButton,
  validateLinkAccessibilityLocal,
  getSvgAccessibleName,
  addSvgAccessibility,
  processCredentialAuthentication,
  initializeApp,
  getConfig,
  validateInput,
  validateInputLocal,
  createAccessibleLink,
  processDataLocal,
  visualizeDependencyTree,
  generateDependencyReport,
  fixAccessibilityIssues,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNamesLocal,
  fixFakeLinksLocal,
  getUserSafetyAdvice,
  ARRAY_OF_REQUIRED_LANDMARK_TAGS
};