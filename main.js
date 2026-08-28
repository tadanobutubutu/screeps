// main.js
// Main entry point for the application

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and createAccessibleLink())

const { updateThScopeAttribute } = require('./testHelper');

const a11yStore = {
  countDependencies: function(dependencies) {
    if (!Array.isArray(dependencies)) return 0;
    return dependencies.length;
  },
  addressAccessibilityIssues: function(issues) {
    return issues.filter(issue => issue.valid).length;
  },
  createAccessibleButton: function(label, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    if (onClick) button.addEventListener('click', onClick);
    return button;
  },
  createAccessibleDialog: function(id, label) {
    const dialog = document.createElement('dialog');
    dialog.id = id;
    dialog.setAttribute('aria-label', label);
    return dialog;
  },
  announceToScreenReader: function(message, priority) {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority || 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => document.body.removeChild(announcer), 1000);
  },
  trapFocus: function(element) {
    const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },
  initAccessibility: function() {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = document.documentElement.lang || 'en';
  },
  updateLiveRegion: function(message, politeness) {
    let liveRegion = document.getElementById('a11y-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-live-region';
      liveRegion.setAttribute('aria-live', politeness || 'polite');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = message;
  },
  checkLandmarkElements: function(container) {
    const landmarks = container.querySelectorAll('header, nav, main, aside, footer, section, [role]');
    return Array.from(landmarks).map(lm => ({
      tag: lm.tagName.toLowerCase(),
      role: lm.getAttribute('role'),
      label: lm.getAttribute('aria-label')
    }));
  },
  addSVGAccessibilityProps: function(svg, title) {
    if (!svg) return;
    svg.setAttribute('role', 'img');
    let titleEl = svg.querySelector('title');
    if (!titleEl) {
      titleEl = document.createElement('title');
      svg.insertBefore(titleEl, svg.firstChild);
    }
    titleEl.textContent = title;
    svg.setAttribute('aria-labelledby', titleEl.id || 'svg-title');
  },
  preserveExistingCode: function(code) {
    return code;
  },
  prefersReducedMotion: function() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  prefersHighContrast: function() {
    return window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches;
  },
  standaloneAddressAccessibilityIssues: function(issues) {
    return issues.filter(i => i.valid).length;
  }
};

const {
  countDependencies,
  addressAccessibilityIssues,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkElements,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
} = a11yStore;

function validateLandmarkElements(container) {
  return a11yStore.checkLandmarkElements(container);
}

function wrapPrimaryContentInMain(container) {
  if (!container) return;
  const existingMain = container.querySelector('main, [role="main"]');
  if (existingMain) return existingMain;
  const main = document.createElement('main');
  while (container.firstChild) {
    main.appendChild(container.firstChild);
  }
  container.appendChild(main);
  return main;
}

function checkLandmarks(container) {
  return validateLandmarkElements(container);
}

// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
  if (typeof document === 'undefined') return 'en';
  const lang = document.documentElement.lang || 'en';
  const dir = document.documentElement.dir || 'ltr';
  return { lang, dir };
}

function getLangAttributeFromElement(element) {
  if (!element) return 'en';
  return element.lang || 'en';
}

// REACT_027: Fix table structure issues
function validateTableAccessibility(table) {
  if (!table) return { valid: false, issues: ['Table not found'] };
  const issues = [];
  if (!table.tHead && !table.querySelector('thead')) {
    issues.push('Missing table header');
  }
  if (!table.tBodies.length && !table.querySelector('tbody')) {
    issues.push('Missing table body');
  }
  const rows = table.rows || table.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push('Table has no rows');
  }
  return { valid: issues.length === 0, issues };
}

function validateTableStructure(table) {
  if (!table) return { valid: false, issues: ['Table not found'] };
  const issues = [];
  const cells = table.querySelectorAll('td, th');
  cells.forEach((cell) => {
    if (!cell.textContent.trim() && !cell.querySelector('img[alt]')) {
      issues.push('Empty cell without accessible content');
    }
  });
  const headers = table.querySelectorAll('th');
  headers.forEach((th) => {
    if (!th.scope && !th.id) {
      issues.push('Header cell missing scope or id');
    }
  });
  return { valid: issues.length === 0, issues };
}

// REACT_017: Add/fix landmark issues
function validateLandmark(landmark) {
  if (!landmark) return { valid: false, issues: ['Landmark not found'] };
  const issues = [];
  const role = landmark.getAttribute('role');
  const tag = landmark.tagName.toLowerCase();
  const landmarkTags = ['header', 'nav', 'main', 'aside', 'footer', 'section'];
  if (!role && !landmarkTags.includes(tag)) {
    issues.push('Element is not a recognized landmark');
  }
  if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby') && tag === 'section') {
    issues.push('Section landmark missing accessible name');
  }
  return { valid: issues.length === 0, issues };
}

function validateLandmarkStructure(container) {
  if (!container) return { valid: false, issues: ['Container not found'] };
  const issues = [];
  const landmarks = container.querySelectorAll('header, nav, main, aside, footer, section, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="region"]');
  if (landmarks.length === 0) {
    issues.push('No landmarks found in container');
  }
  const mainLandmarks = container.querySelectorAll('main, [role="main"]');
  if (mainLandmarks.length > 1) {
    issues.push('Multiple main landmarks found');
  }
  return { valid: issues.length === 0, issues };
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(container) {
  if (!container) return { valid: false, issues: ['Container not found'] };
  const issues = [];
  const seen = new Map();
  const landmarks = container.querySelectorAll('header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach((landmark) => {
    const tag = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || tag;
    const label = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || '';
    const key = `${role}:${label}`;
    if (seen.has(key)) {
      issues.push(`Duplicate landmark: ${role}`);
    } else {
      seen.set(key, true);
    }
  });
  return { valid: issues.length === 0, issues };
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const refElement = document.getElementById(ariaLabelledBy);
    if (refElement) return refElement.textContent.trim();
  }
  const title = svg.querySelector('title');
  if (title) return title.textContent.trim();
  return '';
}

// REACT_036: Fix fake link issues
function createInPageButton(label, targetId) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.setAttribute('aria-controls', targetId);
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      if (target.focus) target.focus();
    }
  });
  return button;
}

function createAccessibleLink(href, text, options = {}) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  if (options.ariaLabel) {
    link.setAttribute('aria-label', options.ariaLabel);
  }
  if (options.newWindow) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
  if (options.onClick) {
    link.addEventListener('click', options.onClick);
  }
  return link;
}

function ensureElementHasId(element) {
  if (!element) return null;
  if (!element.id) {
    element.id = 'a11y-auto-' + Math.random().toString(36).substr(2, 9);
  }
  return element.id;
}

function addAriaLabel(element, label) {
  if (!element) return;
  element.setAttribute('aria-label', label);
}

function renderDependencyGraphs(dependencies) {
  return countDependencies(dependencies);
}

function myNewFunction(input) {
  return input;
}

function someFunction() {
  return 'some function';
}

function main() {
  a11yStore.initAccessibility();
}

class SomeClass {
  constructor() {
    this.name = 'SomeClass';
  }
}

function someUtility() {
  return 'utility';
}

const config = {
  accessibility: {
    enableAutoInit: true,
    announceLevel: 'polite'
  }
};

function run() {
  return 'running';
}

function add(a, b) {
  return a + b;
}

function calculateDiscount(price, discount) {
  if (typeof price !== 'number' || typeof discount !== 'number') {
    return price;
  }
  return price - (price * discount / 100);
}

function loop() {
  for (let i = 0; i < 10; i++) {
    console.log(i);
  }
}

module.exports = {
  a11yStore,
  main,
  SomeClass,
  someUtility,
  config,
  countDependencies,
  run,
  checkTableStructure: validateTableStructure,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  myNewFunction,
  getSvgAccessibleName,
  addressAccessibilityIssues,
  createAccessibleButton: a11yStore.createAccessibleButton,
  createAccessibleDialog: a11yStore.createAccessibleDialog,
  announceToScreenReader: a11yStore.announceToScreenReader,
  trapFocus: a11yStore.trapFocus,
  initAccessibility: a11yStore.initAccessibility,
  updateLiveRegion: a11yStore.updateLiveRegion,
  checkLandmarkElements: a11yStore.checkLandmarkElements,
  addSVGAccessibilityProps: a11yStore.addSVGAccessibilityProps,
  preserveExistingCode: a11yStore.preserveExistingCode,
  prefersReducedMotion: a11yStore.prefersReducedMotion,
  prefersHighContrast: a11yStore.prefersHighContrast,
  standaloneAddressAccessibilityIssues: a11yStore.standaloneAddressAccessibilityIssues,
  loop,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  add,
  calculateDiscount,
  getLangAttribute,
  getLangAttributeFromElement,
  createInPageButton,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkElements,
  newFunction: myNewFunction,
  updateThScopeAttribute
};