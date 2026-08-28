const fs = require('fs');
const path = require('path');

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addProperLandmarkRegions();
    this.addSVGAccessibilityProps();
    this.fixFakeLinks();
    this.countDependencies();
  },

  countDependencies() {
    const importCommentRegExp = /^\s*import\s+({|[\w\s,]*)*\s*;?\s*\s*$/gm;
    const importCount = (document.body.textContent || '').match(importCommentRegExp)?.length || 0;
    return importCount;
  },
};

// Main game loop for Screeps
function run() {
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      updateThScopeAttribute(path.join(viewsDir, file));
    });
}

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.lang) {
  document.documentElement.setAttribute('lang', 'en');
}

// Import accessibility helper functions
const {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibilityHelperFunctions');

// Wrap the entire document content inside a <main> element and set its lang attribute
let mainElement;
if (!document.documentElement.lang) {
  document.documentElement.setAttribute('lang', 'en');
  mainElement = document.createElement('main');
  document.body.appendChild(mainElement);
}

// Main game loop for Screeps
module.exports = {
  loop: function() {
    // Clean up memory of dead creeps
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }

    // Your game logic here
  },

  run,
  countDependencies: function() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length,
    };
  },

  main() {
    return 'Hello World';
  },

  SomeClass,
  someUtility() {
    return true;
  },

  config: {
    enabled: true,
  },

  a11yStore,
  mainElement,
  prefersReducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  prefersHighContrast: () => window.matchMedia('(prefers-contrast: high)').matches,
  wrapPrimaryContentInMain: () => {
    if (mainElement && !mainElement.contains(document.querySelector('main'))) {
      document.body.prepend(mainElement);
    }
  },
  addressAccessibilityIssues: () => {
    a11yStore.init();
  },
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
};

function SomeClass() {}

function main() {
  return 'Hello World';
}

function someUtility() {
  return true;
}