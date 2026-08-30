import { getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure, addScopeToTableHeaderCells } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure, ensureUniqueLandmarks as ensureLandmarkUniqueness } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks, createAccessibleLink } from './utils/linkAccessibilityUtils';
import { formatProductName, renderProductList, calculateTotalPrice, renderCart, validateAndRender, renderPage } from './utils/productUtils';
import { spawn } from './utils/spawnUtils';
import { checkLinkAccessibility } from './utils/linkAccessibilityUtils';

import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils';
import { renderHeader, renderFooter, renderProductCard } from './components';
import { state, updateState } from './state';

import { createInPageButton } from './utils/accessibilityUtils';

// Helper functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) cloned[key] = deepClone(obj[key]);
    }
    return cloned;
  }
  return obj;
}

function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function safeJsonParse(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultValue;
  }
}

// Accessibility helper functions
function handleKeyboardNavigation(options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  return (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  };
}

const handleKeyboard = handleKeyboardNavigation;

function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTab = (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  container.addEventListener('keydown', handleTab);
  
  return () => {
    container.removeEventListener('keydown', handleTab);
  };
}

function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
  document.body.appendChild(announcer);

  return {
    announce: (message) => {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  };
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();

function createLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        const suffix = Math.random().toString(36).substring(2, 9);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

function ensureUniqueLandmarkId(baseName) {
    return createLandmarkId(baseName);
}

function addAriaLabel(element, label) {
    if (element && !element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

function addLangAttribute() {
  const elementToModify = typeof document !== 'undefined' ? document.documentElement : null;
  const langValue = getFullLangAttribute() || 'en';
  if (elementToModify) {
    elementToModify.setAttribute('lang', langValue);
  }
}

function handleReact015() {
  const htmlElement = document.documentElement;
  const langAttr = getFullLangAttribute() || 'en';
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', langAttr);
  }
}

function handleReact017AndReact025() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  
  landmarks.forEach(landmark => {
    validateLandmark(landmark);
    validateLandmarkStructure(landmark);
    
    if (landmark.id) {
      const existingIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
      if (existingIds.filter(id => id === landmark.id).length > 1) {
        landmark.id = createLandmarkId(landmark.tagName.toLowerCase());
      }
    } else {
      landmark.id = createLandmarkId(landmark.tagName.toLowerCase());
    }
  });
  
  ensureLandmarkUniqueness();
}

function handleReact041() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
    
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby') && !svg.getAttribute('title')) {
      svg.setAttribute('aria-label', `SVG icon ${index + 1}`);
    }
  });
}

function handleReact036() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.hasAttribute('onclick') || link.classList.contains('button') || link.getAttribute('role') === 'button') {
      createAccessibleLink(link);
    }
  });
  
  handleFakeLinks();
  
  const suspiciousLinks = document.querySelectorAll('span[onclick], div[onclick], button');
  suspiciousLinks.forEach(element => {
    const onclickAttr = element.getAttribute('onclick');
    if (onclickAttr && (onclickAttr.includes('window.location') || onclickAttr.includes('document.location'))) {
      const newLink = document.createElement('a');
      newLink.href = element.getAttribute('onclick').match(/['"]([^'"]+)['"]/)?.[1] || '#';
      newLink.textContent = element.textContent;
      newLink.setAttribute('role', 'button');
      element.parentNode.replaceChild(newLink, element);
    }
  });
}

function ensureElementHasId(elementId) {
  const element = typeof document !== 'undefined' ? document.getElementById(elementId) : null;
  if (element && !element.hasAttribute('id')) {
    element.setAttribute('id', elementId);
  }
}

function addAriaLabelById(elementId, label) {
  const element = typeof document !== 'undefined' ? document.getElementById(elementId) : null;
  if (element) {
    element.setAttribute('aria-label', label);
  }
}

function renderDependencyGraph(module) {
  console.log('Rendering dependency graph for:', module);
  return {
    module: module,
    dependencies: [],
    rendered: true
  };
}

function displayModuleStructure(module) {
  console.log('Displaying module structure for:', module);
  return {
    module: module,
    structure: {},
    displayed: true
  };
}

function generateAccessibilityReport() {
  const report = {
    timestamp: new Date().toISOString(),
    issues: []
  };
  return report;
}

function checkLinkAccessibilityLocal() {
  const links = document.querySelectorAll('a');
  const results = [];

  links.forEach((link, index) => {
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label');
    const hasTitle = link.hasAttribute('title');

    results.push({
      index: index,
      href: link.href,
      accessible: hasText || hasAriaLabel || hasTitle
    });
  });

  return results;
}

function getDocument() {
    if (typeof document !== 'undefined') {
        return document;
    }
    return null;
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll([
    'header[role="banner"]',
    'nav[role="navigation"]',
    'main[role="main"]',
    'aside[role="complementary"]',
    'footer[role="contentinfo"]'
  ].join(', '));

  const landmarkIds = new Set();
  landmarks.forEach(landmark => {
    if (landmark.id) {
      if (landmarkIds.has(landmark.id)) {
        landmark.removeAttribute('id');
      } else {
        landmarkIds.add(landmark.id);
      }
    }
  });
}

function validateLinkAccessibilityLocal() {
  return [];
}

function myNewFunction(arg1, arg2) {
  return arg1 * arg2;
}

function multiply(arg1, arg2) {
  return myNewFunction(arg1, arg2);
}

function ensureDependencyGraphARIA() {
  const doc = getDocument();
  let htmlElement = doc ? doc.querySelector('html') : null;
  
  if (!htmlElement) {
    return { lang: null, dir: null };
  }
  
  if (!htmlElement.hasAttribute('lang') || !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
  
  if (!htmlElement.hasAttribute('dir')) {
    htmlElement.setAttribute('dir', 'ltr');
  }
  
  return {
    lang: htmlElement.getAttribute('lang'),
    dir: htmlElement.getAttribute('dir')
  };
}

function isInViewport(element) {
  if (typeof document === 'undefined') return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Screeps game loop helper functions
function harvest(creep, source) {
    if (creep.store.getFreeCapacity() > 0) {
        if (creep.pos.isNearTo(source)) {
            creep.harvest(source);
        } else {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    } else {
        const targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType === STRUCTURE_EXTENSION ||
                    structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_STORAGE ||
                    structure.structureType === STRUCTURE_CONTAINER ||
                    (structure.structureType === STRUCTURE_ROAD && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                );
            }
        });
        if (targets.length > 0) {
            creep.transfer(targets[0], RESOURCE_ENERGY);
        }
    }
}

function upgradeController(creep, controller) {
    if (creep.store[RESOURCE_ENERGY] > 0) {
        if (creep.pos.isNearTo(controller)) {
            creep.upgradeController(controller);
        } else {
            creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
}

function spawn(config) {
    if (!config || typeof config !== 'object') {
        console.error('Invalid spawn configuration');
        return null;
    }

    const { type, options = {} } = config;

    if (!type) {
        console.error('Spawn configuration must include a type');
        return null;
    }

    const spawnOptions = {
        detached: false,
        stdio: 'inherit',
        ...options
    };
}

// State management
const state = {
  currentModule: null,
  dependencyGraph: null,
  moduleStructure: null
};

// Placeholder for dependency graph content
const dependencyGraphContent = {};

// Placeholder for index content
const indexContent = {};

// DOM-based accessibility code
// Add lang attribute to HTML element
document.documentElement.setAttribute('lang', getFullLangAttribute());

// Create in-page button with accessibility considerations
createInPageButton();

// Validate table structure and accessibility
const tables = document.querySelectorAll('table');
tables.forEach(table => {
  validateTableAccessibility(table);
  validateTableStructure(table);
});

// Add/fix landmark issues
validateLandmark();
validateLandmarkStructure();
ensureUniqueLandmarks(document.querySelector('main') || document.querySelector('[role="main"]') || document.body);

// Add accessible names to SVGs
const svg = document.getElementById('mySvg');
const accessibleName = getSvgAccessibleName(svg);
setSvgAttributes(svg, accessibleName);

// Ensure unique landmarks
const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
const landmarkIds = new Set();
landmarks.forEach(landmark => {
  if (landmark.id) {
    if (landmarkIds.has(landmark.id)) {
      landmark.removeAttribute('id');
    } else {
      landmarkIds.add(landmark.id);
    }
  }
});

// DOM content loaded handler
document.addEventListener('DOMContentLoaded', () => {
  handleReact015();
  handleReact017AndReact025();
  handleReact041();
  handleReact036();

  addLangAttribute();
  createInPageButton();

  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  addScopeToTableHeaderCells();
  
  validateLinkAccessibility();
  handleFakeLinks();
  ensureUniqueLandmarks();

  // Fix button identifiers
  const buttons = document.querySelectorAll('[role="button"]');
  buttons.forEach((button, index) => {
    if (!button.id) {
      button.id = `button-${index}`;
    }
  });

  // Ensure elements have IDs and aria-labels
  ensureElementHasId('myTable');
  ensureElementHasId('mySvg');
  ensureElementHasId('inPageButton');
  addAriaLabelById('myTable', 'Product data table');
  addAriaLabelById('mySvg', 'Company logo');
  addAriaLabelById('inPageButton', 'Skip to main content');

  // Use the new function to add aria-labels to the appropriate elements
  const myButton = document.querySelector('.my-button');
  const myIcon = document.querySelector('.my-icon');

  if (myButton) {
    addAriaLabel(myButton, 'My Button');
  }

  if (myIcon) {
    addAriaLabel(myIcon, 'My Icon');
  }

  // Google sign-in accessibility
  const googleButton = document.querySelector('.google-sign-in, [data-provider="google"]');
  if (googleButton) {
    addAriaLabel(googleButton, 'Sign in with Google');
    googleButton.setAttribute('role', 'button');
  }

  const googleSignInButton = document.querySelector('[data-google-signin]');
  if (googleSignInButton) {
    addAriaLabel(googleSignInButton, 'Sign in with Google');
    googleSignInButton.setAttribute('role', 'button');
  }
});

function googleSignIn() {
  const googleButton = document.querySelector('[data-google-signin]');
  if (googleButton) {
    addAriaLabel(googleButton, 'Sign in with Google');
    googleButton.setAttribute('role', 'button');
  }
}

function initializeAccessibility() {
  const announcer = createAnnouncer();

  return {
    announce: announcer.announce,
    handleKeyboardNavigation,
    handleKeyboard,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    ensureDependencyGraphARIA: () => ensureDependencyGraphARIA(),
    getLangAttribute,
    getFullLangAttribute
  };
}

// Implement updateView using render dependency graph and display module structure functions
const updateView = (viewType) => {
  if (viewType === 'graph') {
    const dependencyGraphData = renderDependencyGraph(state.currentModule);
    // ... (assuming you have a renderer for dependency graphs)
  } else if (viewType === 'index') {
    const moduleStructureData = displayModuleStructure(state.currentModule);
    // ... (assuming you have a renderer for module structures)
  }
};

// TODO: add the new functions or changes requested in the issue
// Here's a sample implementation for a new function named 'myNewFunction'
const myNewFunctionWrapper = () => {
  console.log('Executing custom function for rendering graph/index');
};

// Export necessary functions and components
export {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  addScopeToTableHeaderCells,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  createAccessibleLink,
  myNewFunction,
  multiply,
  checkLinkAccessibility,
  renderDependencyGraph,
  displayModuleStructure,
  spawn,
  formatCurrency,
  formatDate,
  calculateDiscount,
  validateInput,
  renderHeader,
  renderFooter,
  renderProductCard,
  state,
  updateState
};

// Export utility functions
export {
  getFullLangAttribute,
  renderDependencyGraph,
  displayModuleStructure,
  formatProductName,
  createAnnouncer,
  trapFocus,
  prefersReducedMotion,
  handleKeyboard,
  addAriaLabel,
  ensureElementHasId,
  addAriaLabelById,
  handleReact015,
  handleReact017AndReact025,
  handleReact041,
  handleReact036,
  ensureUniqueLandmarkId,
  initializeAccessibility,
  updateView,
  googleSignIn
};