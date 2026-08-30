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

function initDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', 'Dependency graph visualization');
  }
  return container;
}

function renderDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = 'Dependency Graph Data';
  }
}

function getElementById(id) {
  return document.getElementById(id);
}

function queryElements(selector) {
  return document.querySelectorAll(selector);
}

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

const appData = {
  title: 'My Application',
  version: '1.0.0'
};

const initApp = () => {
  initializeApp();

  setLanguageAttribute();
  addLandmarkRoles();
  ensureUniqueLandmarkElements();

  addSVGAccessibleName('#home-icon', 'Home icon');
  addSVGAccessibleName('#settings-icon', 'Settings icon');

  fixFakeLinks();

  console.log('Initializing ' + appData.title + ' v' + appData.version);

  appStarted();
};

if (isSecureContext()) {
  initApp();
} else {
  console.warn('Application is not running in a secure context. Some features may not be available.');
}

registerSW();

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
  processLandmarks
};