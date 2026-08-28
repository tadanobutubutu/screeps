// main.js

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');
// Import accessibility helper functions
const {
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibilityHelperFunctions');
const fs = require('fs');
const path = require('path');

// Store for accessibility-related state (merged from both branches)
const a11yStore = {
  liveRegion: null,
  processedElements: new Set(),
  skipLinkAdded: false,

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addProperLandmarkRegions();
    this.addSVGAccessibilityProps();
    this.fixFakeLinks(); // Added for REACT_036
    this.countDependencies(); // Merged change from both branches
  },

  addProcessedElement(element) {
    if (element && element.id) {
      this.processedElements.add(element.id);
    }
  },

  isProcessed(element) {
    return element && element.id && this.processedElements.has(element.id);
  },

  // New function to count dependencies
  countDependencies() {
    const importCommentRegExp = /^\s*import\s+({|[\w\s,]*)*\s*;?\s*\s*$/gm;
    const importCount = (document.body.textContent || '').match(importCommentRegExp)?.length || 0;
    return importCount;
  },
};

function getSvgAccessibleName(svg) {
  // First, check for aria-labelledby reference
  const labelledBy = svg.getAttribute('aria-labelledby');
  if (labelledBy) {
    const ids = labelledBy.split(/\s+/);
    const names = ids
      .map(id => {
        const el = document.getElementById(id);
        return el ? el.textContent.trim() : '';
      })
      .filter(text => text.length > 0);
    if (names.length > 0) {
      return names.join(' ');
    }
  }

  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim().length > 0) {
    return ariaLabel.trim();
  }

  // Fall back to <title> child element
  const titleElement = svg.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent.trim();
  }

  // Check for title attribute on the SVG itself
  const titleAttr = svg.getAttribute('title');
  if (titleAttr && titleAttr.trim().length > 0) {
    return titleAttr.trim();
  }

  return '';
}

// Existing function to ensure element has an id and add aria-label if missing
function ensureElementIdAndLabel() {
  const elementsToCheck = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  
  elementsToCheck.forEach(tagName => {
    const elements = document.querySelectorAll(tagName);
    elements.forEach((element, index) => {
      // Ensure element has an id
      if (!element.id) {
        element.id = `auto-generated-${tagName}-${Date.now()}-${index}`;
      }
      
      // Add aria-label if missing and element doesn't have other labeling
      const hasLabel = element.getAttribute('aria-label') || 
                       element.getAttribute('aria-labelledby') ||
                       element.querySelector('h1, h2, h3, h4, h5, h6');
      
      if (!hasLabel) {
        const generatedLabel = `${tagName.charAt(0).toUpperCase() + tagName.slice(1)} section ${index + 1}`;
        element.setAttribute('aria-label', generatedLabel);
      }
    });
  });
}

// New function to handle missing lang attribute
function getLangAttribute() {
  if (document.documentElement) {
    document.documentElement.lang = 'en';
  }
}

// New function to ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
  const uniqueLandmarks = new Set();

  landmarkElements.forEach(landmark => {
    const element = document.querySelector(landmark);
    if (element && (!element.id || uniqueLandmarks.has(element.id))) {
      element.id = `auto-generated-${landmark}-${Date.now() * 1000}`;
      uniqueLandmarks.add(element.id);
    }
  });
}

// New function to add SVG accessibility props
function addSVGAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    // Existing code for determining the accessible name of the SVG element
    const titleElement = svg.querySelector('title');
    const titleText = titleElement ? (titleElement.textContent || 'Image description') : 'Image description';

    svg.setAttribute('role', 'img');

    // Ensure the SVG has a <title> child for proper accessibility
    if (!titleElement) {
      const newTitle = document.createElement('title');
      newTitle.textContent = titleText;
      svg.insertBefore(newTitle, svg.firstChild);
    }

    // Use getSvgAccessibleName to determine the appropriate aria-labelledby value
    const existingTitle = svg.querySelector('title');
    if (existingTitle && !existingTitle.id) {
      existingTitle.id = 'svg-title';
    }
    svg.setAttribute('aria-labelledby', existingTitle ? existingTitle.id : 'svg-title');

    const descriptionId = `svg-desc-${Date.now() * 1000}`;
    svg.setAttribute('aria-describedby', descriptionId);

    const descriptionElement = document.createElement('desc');
    descriptionElement.id = descriptionId;
    descriptionElement.textContent = titleText;
    descriptionElement.className = 'sr-only';
    svg.appendChild(descriptionElement);
  });
}

// New function to add proper landmark regions to the document
function addLandmarkRegions() {
  const container = document.getElementById('landmark-regions-container');
  if (container) {
    container.innerHTML = `
      <div class="landmark-region" role="region" aria-label="Building">
        Main Building
      </div>
      <div class="landmark-region" role="region" aria-label="Park">
        Central Park
      </div>
    `;
  }
}

// New function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach(issue => {
    // Handle each issue type
    switch (issue.type) {
      case 'missing-lang':
        getLangAttribute();
        break;
      case 'missing-skip-link':
        if (!document.querySelector('.skip-link')) {
          const skipLink = document.createElement('a');
          skipLink.className = 'skip-link';
          skipLink.href = '#main-content';
          skipLink.textContent = 'Skip to main content';
          skipLink.style.position = 'absolute';
          skipLink.style.top = '-40px';
          document.body.insertBefore(skipLink, document.body.firstChild);
        }
        break;
      case 'missing-alt':
        document.querySelectorAll('img').forEach(img => {
          if (!img.getAttribute('alt')) {
            const imgId = `img-desc-${Date.now() * 1000}`;
            const descriptionId = `img-desc-text-${Date.now() * 1000}`;

            img.setAttribute('alt', 'Image description');
            img.setAttribute('aria-describedby', descriptionId);

            const descriptionElement = document.createElement('span');
            descriptionElement.id = descriptionId;
            descriptionElement.className = 'sr-only';
            descriptionElement.textContent = 'Image description';
            img.parentNode.insertBefore(descriptionElement, img.nextSibling);
          }
        });
        break;
      case 'missing-aria-label':
        // Existing function to handle missing aria-labels
        ensureElementIdAndLabel();
        break;
      case 'missing-role':
        // Existing function to handle missing roles
        // ...
        break;
      case 'missing-landmark-regions':
        // Add proper landmark regions to the document
        addLandmarkRegions();
        break;
      default:
        // Unknown issue type, log for debugging
        console.warn('Unknown accessibility issue type:', issue.type);
        break;
    }
  });
}

// Updated function to check and address landmark elements and add SVG accessibility props
function checkLandmarkElementsAndAddSVGAccessibility() {
  ensureUniqueLandmarks();
  addSVGAccessibilityProps();
}

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.lang) {
  document.documentElement.setAttribute('lang', 'en');
}

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.createElement('main');
document.documentElement.setAttribute('lang', 'en');
document.body.appendChild(mainElement);

// Game loop function
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const filePath = path.join(viewsDir, file);
      updateThScopeAttribute(filePath);
    });

  // Additional logic to add landmark regions (if required)
  addLandmarkRegions();
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};

// Game-related functions and exports

function main() {
  return 'Hello World';
}

function SomeClass() {}

function someUtility() {
  return true;
}

const config = {
  enabled: true
};

module.exports = {
  run,
  main,
  SomeClass,
  someUtility,
  config,
  countDependencies,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  a11yStore,
  mainElement,
  addLandmarkRegions,
  ensureElementIdAndLabel,
  ensureUniqueLandmarks,
  addSVGAccessibilityProps,
  getLangAttribute,
  addressAccessibilityIssues,
  checkLandmarkElementsAndAddSVGAccessibility
};