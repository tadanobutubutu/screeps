// main.js

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');
const fs = require('fs');
const path = require('path');

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
} = require('./accessibilityHelpers');

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

  init() {
    // Initialize the live region for screen reader announcements
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    document.body.appendChild(this.liveRegion);

    // Setup skip links for keyboard navigation
    this.setupSkipLinks();

    // Add landmark regions for better document structure
    this.addLandmarkRegions();

    // Fix any fake links that don't have proper href attributes
    this.fixFakeLinks(); // Added for REACT_036
    this.countDependencies(); // Merged change from both branches
  },

  setupSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);
  },

  addLandmarkRegions() {
    const container = document.querySelector('.landmark-container');
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
  },

  fixFakeLinks() {
    // REACT_036: Fix fake links that don't have proper href attributes
    const fakeLinks = document.querySelectorAll('a:not([href])');
    fakeLinks.forEach(link => {
      if (link.getAttribute('role') === 'link' || link.classList.contains('fake-link')) {
        // Add role="button" and keyboard support for fake links
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
      }
    });
  },

  // New function to count dependencies
  countDependencies() {
    const importCommentRegExp = /\/\/ import /g;
    const importCount = (document.body.textContent || '').match(importCommentRegExp) || [];
    return importCount.length;
  },
};

// REACT_041: Add accessible names to SVGs
function addAccessibleNamesToSvgs() {
  // Find all SVGs in the document that need accessible names
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach((svg, index) => {
    // Check if SVG already has an accessible name via aria-label or aria-labelledby
    const hasAccessibleName = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby');
    
    if (!hasAccessibleName) {
      // Get the parent element's context or use a default based on index
      const parent = svg.closest('[aria-label]') || svg.parentElement;
      const contextLabel = parent ? parent.getAttribute('aria-label') || parent.textContent : '';
      
      // Generate descriptive accessible name based on context
      let accessibleName = '';
      if (contextLabel) {
        accessibleName = `Icon for ${contextLabel}`;
      } else {
        // Default names for SVGs based on their position or content
        const iconType = svg.classList.contains('icon-building') ? 'Building' :
                         svg.classList.contains('icon-park') ? 'Park' :
                         svg.classList.contains('icon-menu') ? 'Menu' : 'Graphic';
        accessibleName = `${iconType} ${index + 1}`;
      }
      
      // Set the accessible name on the SVG
      svg.setAttribute('aria-label', accessibleName);
    }
  });
  
  return svgs.length;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="region"], [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
  const seenLabels = new Map();
  
  landmarks.forEach(landmark => {
    let label = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby');
    
    if (label) {
      // Check if this label has been seen before
      const count = seenLabels.get(label) || 0;
      if (count > 0) {
        // Make the label unique by appending a number
        landmark.setAttribute('aria-label', `${label} ${count + 1}`);
      }
      seenLabels.set(label, count + 1);
    } else {
      // If no label exists, provide a generic one based on role
      const role = landmark.getAttribute('role') || 'region';
      landmark.setAttribute('aria-label', `${role.charAt(0).toUpperCase() + role.slice(1)} region`);
    }
  });
  
  return landmarks.length;
}

// New function to handle adding landmark regions
function addLandmarkRegions() {
  const container = document.querySelector('.landmark-container');
  if (container) {
    // Ensure unique labels for landmarks (REACT_025)
    const existingLandmarks = container.querySelectorAll('[role="region"]');
    const usedLabels = new Set();
    
    const regions = [
      { label: 'Building', content: 'Main Building' },
      { label: 'Park', content: 'Central Park' }
    ];
    
    const html = regions.map((region, index) => {
      let label = region.label;
      // Make label unique if it already exists
      if (usedLabels.has(label)) {
        label = `${label} ${index + 1}`;
      }
      usedLabels.add(label);
      
      return `
        <div class="landmark-region" role="region" aria-label="${label}">
          ${region.content}
        </div>
      `;
    }).join('');
    
    container.innerHTML = html;
  }
}

// Export the function
// Note: Using module.exports instead of ES6 export for CommonJS compatibility
exports.addLandmarkRegions = addLandmarkRegions;

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.lang) {
  document.documentElement.lang = 'en';
}

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.createElement('main');
mainElement.id = 'main-content';
mainElement.setAttribute('lang', 'en');
// ... rest of the wrapping logic

// Game loop function
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const filePath = path.join(viewsDir, file);
      // ... update logic
    });

  // Additional logic to add landmark regions (if required)
  addLandmarkRegions();
  
  // Apply SVG accessible names (REACT_041)
  addAccessibleNamesToSvgs();
  
  // Ensure landmarks are unique (REACT_025)
  ensureUniqueLandmarks();
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
  getLangAttribute,
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
  addAccessibleNamesToSvgs,
  ensureUniqueLandmarks
};