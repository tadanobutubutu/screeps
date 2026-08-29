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
} = require('./a11yHelpers');

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

  init() {
    // Initialize the live region for screen reader announcements
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    this.liveRegion.style.position = 'absolute';
    this.liveRegion.style.width = '1px';
    this.liveRegion.style.height = '1px';
    this.liveRegion.style.padding = '0';
    this.liveRegion.style.margin = '-1px';
    this.liveRegion.style.overflow = 'hidden';
    this.liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    this.liveRegion.style.whiteSpace = 'nowrap';
    this.liveRegion.style.border = '0';
    document.body.appendChild(this.liveRegion);

    // Setup skip links for keyboard navigation
    this.setupSkipLinks();
    
    // Fix fake links for better accessibility
    this.fixFakeLinks(); // Added for REACT_036
    this.countDependencies(); // Merged change from both branches
  },

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = '';
      setTimeout(() => {
        this.liveRegion.textContent = message;
      }, 100);
    }
  },

  // Setup skip links for keyboard navigation
  setupSkipLinks() {
    const skipLinkContainer = document.createElement('div');
    skipLinkContainer.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#primary-navigation" class="skip-link">Skip to navigation</a>
    `;
    skipLinkContainer.style.position = 'absolute';
    skipLinkContainer.style.top = '0';
    skipLinkContainer.style.left = '0';
    skipLinkContainer.style.zIndex = '9999';
    document.body.insertBefore(skipLinkContainer, document.body.firstChild);

    // Add styles for skip links
    const style = document.createElement('style');
    style.textContent = `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #000;
        color: #fff;
        padding: 8px 16px;
        z-index: 100;
        transition: top 0.3s;
      }
      .skip-link:focus {
        top: 0;
      }
    `;
    document.head.appendChild(style);
  },

  // Fix fake links that don't have proper href attributes
  fixFakeLinks() {
    document.querySelectorAll('a:not([href])').forEach(link => {
      if (link.getAttribute('href') === null) {
        link.setAttribute('href', '#');
        link.setAttribute('role', 'link');
      }
    });
  },

  // Count dependencies
  countDependencies() {
    const importCommentRegExp = /\/\/\s*import\s+/g;
    const mainJsPath = path.join(__dirname, 'main.js');
    const content = fs.readFileSync(mainJsPath, 'utf8');
    const matches = content.match(importCommentRegExp);
    const importCount = matches ? matches.length : 0;
    return importCount;
  },
};

// New function to handle adding landmark regions
function addLandmarkRegions() {
  const container = document.querySelector('.container');
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

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.lang) {
  document.documentElement.lang = 'en';
}

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.createElement('main');
mainElement.id = 'main-content';
mainElement.lang = 'en';

// Function to manage focus for accessibility
function manageFocus(element) {
  if (element && element.focus) {
    element.setAttribute('tabindex', '-1');
    element.focus();
  }
}

// Function to validate heading structure for accessibility
function validateHeadingStructure() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
  const errors = [];
  
  for (let i = 1; i < headingLevels.length; i++) {
    const current = headingLevels[i];
    const previous = headingLevels[i - 1];
    
    // Heading level should not increase by more than 1
    if (current > previous + 1) {
      errors.push(`Heading level skips from h${previous} to h${current}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Function to check color contrast for accessibility
function checkColorContrast(foregroundColor, backgroundColor) {
  const getLuminance = (color) => {
    const rgb = color.match(/\w\w/g).map(c => parseInt(c, 16) / 255);
    const [r, g, b] = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foregroundColor);
  const l2 = getLuminance(backgroundColor);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const contrastRatio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: contrastRatio,
    meetsAA: contrastRatio >= 4.5,
    meetsAAA: contrastRatio >= 7
  };
}

// Function to ensure alt text is present on all images
function ensureAltText() {
  const images = document.querySelectorAll('img');
  const missingAlt = [];
  
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      missingAlt.push(img);
    }
  });
  
  return {
    total: images.length,
    missingAlt: missingAlt.length,
    elements: missingAlt
  };
}

// Game loop function
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  if (fs.existsSync(viewsDir)) {
    const files = fs.readdirSync(viewsDir)
      .filter(file => file.endsWith('.html'))
      .forEach(file => {
        const filePath = path.join(viewsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        // Perform updates as needed
      });
  }

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
  manageFocus,
  validateHeadingStructure,
  checkColorContrast,
  ensureAltText
};