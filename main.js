import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';

const landmarks = [];

const functionA = {
  X: 'valueX',
  Y: 'valueY',
  Z: 'valueZ'
};

const functionB = {
  X: 'valueX',
  Y: 'valueY',
  Z: 'valueZ'
};

const icons = {
  icon: '<svg viewBox="0 0 100 100" aria-label="Dashboard"><title>Dashboard</title></svg>'
};

function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

function ensureUniqueLandmarks(landmarks) {
  const seen = new Set();
  return landmarks.filter(landmark => {
    const key = landmark.name;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

const landmarkStructureCheck = (landmark) => {
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
};

const isSecureContext = () => {
  return window.isSecureContext;
};

const setLanguageAttribute = (lang = 'en') => {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
};

const addLandmarkRoles = () => {
  const navElement = document.querySelector('nav');
  if (navElement && !navElement.hasAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }

  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.hasAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }

  const headerElement = document.querySelector('header');
  if (headerElement && !headerElement.hasAttribute('role')) {
    headerElement.setAttribute('role', 'banner');
  }
};

const ensureUniqueLandmarkElements = () => {
  const navElements = document.querySelectorAll('nav');
  if (navElements.length > 1) {
    navElements.forEach((nav, index) => {
      if (index > 0) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });
  }

  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    mainElements.forEach((main, index) => {
      if (index > 0) {
        main.setAttribute('aria-label', `Main content ${index + 1}`);
      }
    });
  }
};

const addSVGAccessibleName = (svgSelector, accessibleName) => {
  const svgs = document.querySelectorAll(svgSelector);
  svgs.forEach((svg) => {
    let titleElement = svg.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      svg.insertBefore(titleElement, svg.firstChild);
    }
    titleElement.textContent = accessibleName;
  });
};

const fixFakeLinks = () => {
  const fakeLinks = document.querySelectorAll('[href]:not(a)');
  fakeLinks.forEach(element => {
    if (element.tagName.toLowerCase() !== 'a') {
      element.setAttribute('role', 'button');
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', element.textContent.trim() || 'Link');
      }
    }
  });
};

function helloWorld() {
  return 'Hello, World!';
}

function processLandmarks(landmarks) {
  const validLandmarks = landmarks.filter(landmarkStructureCheck);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);
  return uniqueLandmarks;
}

// Function to implement accessibility fixes from insight report
// This addresses the TODO comment on line 5
const applyAccessibilityFixes = () => {
  // Apply all accessibility fixes from the insight report
  setLanguageAttribute(); // REACT_015: Add lang attribute to HTML element
  addLandmarkRoles(); // REACT_017: Add landmark roles and fix landmark issues
  ensureUniqueLandmarkElements(); // REACT_025: Ensure unique landmarks
  
  // Add accessible names to SVGs (REACT_041)
  addSVGAccessibleName('svg.home-icon', 'Home icon');
  addSVGAccessibleName('svg.settings-icon', 'Settings icon');
  
  // Fix fake links (REACT_036)
  fixFakeLinks();
};

// Function to set language attribute on HTML element
function setLanguageAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

// Function to initialize the dependency graph with accessibility support
function initDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', 'Dependency graph visualization');
  }
  return container;
}

// Function to render the dependency graph
function renderDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    // Add the logic to render the dependency graph inside the container
    // This is a placeholder for the actual rendering logic
    container.innerHTML = 'Dependency Graph Data';
  }
}

// Helper function to get element by ID
function getElementById(id) {
    return document.getElementById(id);
}

// Helper function to query elements
function queryElements(selector) {
    return document.querySelectorAll(selector);
}

// Function to check landmark elements in the DOM
function checkLandmarkElements() {
    const landmarkSelectors = ['header', 'nav', 'main', 'aside', 'footer', 'article', 'section'];
    const results = {};

    landmarkSelectors.forEach(landmark => {
        const elements = document.querySelectorAll(landmark);
        results[landmark] = {
            count: elements.length,
            exists: elements.length > 0
        };
    });

    return results;
}

// Function to validate landmark structure
function validateLandmarkStructure() {
    const results = checkLandmarkElements();
    const validation = {
        isValid: true,
        errors: [],
        warnings: []
    };

    if (!results.main.exists) {
        validation.isValid = false;
        validation.errors.push('Required <main> landmark element is missing');
    }

    return validation;
}

/**
 * Initializes the application and applies accessibility fixes.
 */
const initApp = () => {
  // Initialize the main application
  initializeApp();

  // Apply accessibility fixes
  applyAccessibilityFixes(); // Apply all accessibility fixes from insight report

  // Initialize the application data
  console.log('Initializing ' + appData.title + ' v' + appData.version);
  
  // Additional initialization logic can go here

  // Signal that the app has started
  appStarted();
};

// Check if the environment is secure before initializing
if (isSecureContext()) {
  initApp();
} else {
  console.warn('Application is not running in a secure context. Some features may not be available.');
}

// Register the service worker
registerSW();

// Export functions for testing
export {
    ensureUniqueLandmarks,
    landmarkStructureCheck,
    helloWorld,
    initDependencyGraph,
    renderDependencyGraph,
    getElementById,
    queryElements,
    checkLandmarkElement,
    checkLandmarkElements,
    validateLandmarkStructure,
    initApp,
    icons,
    isSecureContext,
    setLanguageAttribute,
    addLandmarkRoles,
    ensureUniqueLandmarkElements,
    addSVGAccessibleName,
    fixFakeLinks,
    landmarks,
    functionA,
    functionB,
    processLandmarks,
    applyAccessibilityFixes,
    getLangAttribute,
    createInPageButton
};