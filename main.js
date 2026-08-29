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
    // Create ARIA live region for screen reader announcements
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    this.liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
    document.body.appendChild(this.liveRegion);
    
    this.setupSkipLinks();
    this.setupFocusManagement();
    this.fixFakeLinks(); // Added for REACT_036
    this.countDependencies(); // Merged change from both branches
  },

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = '';
      // Force reflow to ensure announcement
      void this.liveRegion.offsetHeight;
      this.liveRegion.textContent = message;
    }
  },

  setupSkipLinks() {
    // Create skip link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = 'position:absolute;top:-40px;left:0;background:#000;color:#fff;padding:8px;z-index:100;transition:top 0.3s;';
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  },

  setupFocusManagement() {
    // Ensure focus is trapped within modal dialogs when opened
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.manageTabNavigation(e);
      }
    });
  },

  manageTabNavigation(event) {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
    
    if (modal) {
      const focusableContent = modal.querySelectorAll(focusableElements);
      const firstFocusable = focusableContent[0];
      const lastFocusable = focusableContent[focusableContent.length - 1];
      
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  },

  // Move focus to a target element
  moveFocusTo(target, announceMessage = null) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    
    if (element) {
      element.setAttribute('tabindex', '-1');
      element.focus();
      
      if (announceMessage) {
        this.announce(announceMessage);
      }
      
      return true;
    }
    return false;
  },

  // New function to count dependencies
  countDependencies() {
    const importCommentRegExp = /\/\/\s*import|require\s*\(/g;
    const importCount = (document.body.textContent || '').match(importCommentRegExp || []).length;
    return importCount;
  },
};

// New function to handle adding landmark regions
function addLandmarkRegions() {
  const container = document.querySelector('[data-landmark-container]') || document.body;
  if (container) {
    container.innerHTML = `
      <div class="landmark-region" role="region" aria-label="Building" tabindex="0">
        Main Building
      </div>
      <div class="landmark-region" role="region" aria-label="Park" tabindex="0">
        Central Park
      </div>
    `;
    
    // Add keyboard support for landmark regions
    const regions = container.querySelectorAll('.landmark-region');
    regions.forEach((region, index) => {
      region.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          region.focus();
          a11yStore.announce(`${region.getAttribute('aria-label')} region focused`);
        }
        
        // Arrow key navigation between regions
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIndex = (index + 1) % regions.length;
          regions[nextIndex].focus();
        }
        
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIndex = (index - 1 + regions.length) % regions.length;
          regions[prevIndex].focus();
        }
      });
      
      // Ensure proper focus styling
      region.addEventListener('focus', () => {
        region.style.outline = '2px solid #0066cc';
        region.style.outlineOffset = '2px';
      });
      
      region.addEventListener('blur', () => {
        region.style.outline = 'none';
      });
    });
  }
}

// Export the function
module.exports.addLandmarkRegions = addLandmarkRegions;

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.lang) {
  document.documentElement.lang = 'en';
}

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.createElement('main');
mainElement.id = 'main-content';
mainElement.setAttribute('lang', 'en');

// Game loop function
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  if (fs.existsSync(viewsDir)) {
    fs.readdirSync(viewsDir)
      .filter(file => file.endsWith('.html'))
      .forEach(file => {
        const filePath = path.join(viewsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        // Process HTML files for accessibility
      });
  }

  // Additional logic to add landmark regions (if required)
  addLandmarkRegions();
}

// Initialize accessibility features
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    a11yStore.init();
  });
}

// Start the game loop
if (typeof Module !== 'undefined') {
  Module.onInit = function() {
    setInterval(run, 1000);
  };
}

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
  addLandmarkRegions
};