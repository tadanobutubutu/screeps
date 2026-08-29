// main.js - Accessibility improvements implementation

// REACT_015: Add lang attribute

import React from 'react';
import ReactDOM from 'react-dom/client';

let funcNames = [];

// Implement function to create in-page buttons
function createInPageButton(buttonId, buttonText) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  
  // Add accessibility attributes
  button.setAttribute('type', 'button');
  button.setAttribute('role', 'button');
  
  // Apply accessible name
  const accessibleName = buttonText || `Button ${buttonId}`;
  button.setAttribute('aria-label', accessibleName);
  
  return button;
}

var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

function reverseString(str) {
  return str.split('').reverse().join('');
}

// New functions added
function isEven(num) {
  return num % 2 === 0;
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

  init() {
    this.setupSkipLinks();
    this.setupFocusManagement();
    this.setupKeyboardNavigation();
    this.checkLandmarkElements();
    this.addSvgAccessibilityProps();
  },

  // Create a live region for screen reader announcements
  createLiveRegion() {
    if (this.liveRegion) return;

    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = 'a11y-live-region';
    document.body.appendChild(region);
    this.liveRegion = region;
  },

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    // Use setTimeout to ensure the change is detected by screen readers
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  // Setup keyboard navigation for interactive elements
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Handle Enter and Space for custom interactive elements
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('[role="button"], .btn, .clickable');
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.is-open, .dropdown.is-open');
        if (openModal) {
          openModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });

    // Fix Safari focus trapping in dropdowns
    const dropdownContainers = document.querySelectorAll('.dropdown, [role="menu"]');
    dropdownContainers.forEach(container => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const currentFocusedElement = document.activeElement;
        let focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest(container))
        ) {
          focusIsInsideContainer = true;
        }

        // Ensure focus trapping only within the dropdown container
        if (focusIsInsideContainer) {
          // Find the first focusable element within the container
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (firstFocusableElement) {
            firstFocusableElement.focus();
          }
        }
      });
    });
  },

  // Manage focus for accessibility
  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('.modal.is-open[role="dialog"]');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  },

  // Setup skip links
  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href')?.replace('#', '');
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      // Focus the skip link when the document is loaded in Safari
      if (navigator.userAgent.indexOf('Safari') !== -1) {
        skipLink.focus();
      }
    }
  },

  // Utility: Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Utility: Check if user prefers high contrast
  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  // New function to check landmark elements
  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach(tag => {
      const landmark = document.querySelector(tag);
      if (landmark && landmark.id === '') {
        landmark.id = `${tag}-${Date.now() * 1000}`;
      }
    });
  },

  // New function to add SVG accessibility props
  addSvgAccessibilityProps() {
    const svgElements = document.querySelectorAll('svg:not([role])');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      const titleId = `svg-title-${Date.now() * 1000}`;
      const titleText = svg.querySelector('title')?.textContent || 'Image description';
      const descriptionId = `svg-desc-${Date.now() * 1000}`;
      svg.setAttribute('aria-labelledby', titleId);

      const descriptionElement = document.createElement('desc');
      descriptionElement.id = descriptionId;
      descriptionElement.textContent = titleText;
      descriptionElement.className = 'sr-only';
      svg.appendChild(descriptionElement);
    });
  },

  // New function to preserve existing code
  preserveExistingCode() {
    // TODO: This is the existing code that needs to be preserved
    // (This comment remains as-is)
    // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
    // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
    // _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
    // <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
    // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
    // <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
  }
};

// Address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach(issue => {
    // Handle each issue type
    switch (issue.type) {
      case 'missing-lang':
        if (!document.documentElement.lang) {
          document.documentElement.lang = 'en';
        }
        break;
      case 'missing-skip-link':
        if (!document.querySelector('.skip-link')) {
          const skipLink = document.createElement('a');
          skipLink.className = 'skip-link';
          skipLink.href = '#main-content';
          skipLink.textContent = 'Skip to main content';
          skipLink.style.position = 'absolute';
          skipLink.style.left = '-9999px';
          skipLink.style.top = '0';
          document.body.insertBefore(skipLink, document.body.firstChild);
        }
        break;
      case 'missing-alt':
        document.querySelectorAll('img:not([alt])').forEach(img => {
          if (!img.getAttribute('alt')) {
            img.setAttribute('alt', 'Image description');
          }
        });
        break;
      case 'missing-label':
        document.querySelectorAll('input:not([aria-label]), select:not([aria-label]), textarea:not([aria-label])').forEach(el => {
          if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
            el.setAttribute('aria-label', 'Form field');
          }
        });
        break;
      case 'missing-role':
        if (issue.element && !issue.element.getAttribute('role')) {
          issue.element.setAttribute('role', issue.role || 'presentation');
        }
        break;
      case 'missing-aria-hidden':
        if (issue.element && issue.element.tagName === 'svg') {
          const title = issue.element.querySelector('title');
          if (!title) {
            const newTitle = document.createElement('title');
            newTitle.textContent = issue.description || 'Decorative image';
            issue.element.insertBefore(newTitle, issue.element.firstChild);
          }
        }
        break;
      // Add more cases as needed
    }
  });
}

// Utility function to initialize all accessibility features
function initA11y() {
  // Ensure lang attribute is set
  if (!document.documentElement.lang) {
    document.documentElement.lang = 'en';
  }

  // Wrap the entire document content inside a <main> element and set its lang attribute
  const mainElement = document.createElement('main');
  mainElement.id = 'main-content';
  while (document.body.firstChild) {
    mainElement.appendChild(document.body.firstChild);
  }
  document.body.appendChild(mainElement);

  // Initialize accessibility store
  a11yStore.init();
}

// Export for module usage
export { a11yStore };
export { mainElement };
export { addressAccessibilityIssues };
export { updateLiveRegion };
export { initA11y };
export default a11yStore;

// Import and export additional functions if needed (placeholder for actual modules)
// Assuming 'utils' modules are required (example follows)
// import { utilityFunction } from './utils.js';
// export { utilityFunction };

// Additional required exports
export const updateLiveRegion = (message, priority) => a11yStore.updateLiveRegion(message, priority);
export const checkLandmarkElements = () => a11yStore.checkLandmarkElements();
export const addSvgAccessibilityProps = () => a11yStore.addSvgAccessibilityProps();
export const preserveExistingCode = () => a11yStore.preserveExistingCode();
export const prefersReducedMotion = () => a11yStore.prefersReducedMotion();
export const prefersHighContrast = () => a11yStore.prefersHighContrast();

// Adding the function to count dependencies
function countDependencies(obj) {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count += countDependencies(obj[key]);
    } else if (typeof obj[key] === 'function') {
      let funcName = obj[key].name || '<anonymous>';
      if (!funcNames.includes(funcName)) {
        funcNames.push(funcName);
        count++;
      }
    }
  }
  return count;
}

for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == 'harvester') {
        roleHarvester.run(creep);
    }
    if (creep.memory.role == 'upgrader') {
        roleUpgrader.run(creep);
    }
}

function validateLandmark(landmark) {
    if (!landmark) {
        return false;
    }
    return landmark && !landmark.spawning;
}

function validateLandmarkStructure(landmark) {
    if (!landmark) {
        return false;
    }
    if (landmark.structureType) {
        return true;
    }
    return false;
}

function MainApp() {
  return (
    <div lang="en">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><button type="button" onClick={() => {}} aria-label="Contact">Contact</button></li>
          </ul>
        </nav>
      </header>
      
      <main id="main-content" role="main" tabIndex={-1}>
        <h1>Welcome</h1>
        <p>This is the main content area.</p>
      </main>
      
      <footer role="contentinfo">
        <p>&copy; 2024 Company Name</p>
      </footer>
    </div>
  );
}

function handleSkipLinkClick() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.focus();
  }
}

function renderDependencyGraphs(dependencies) {
  // existing function implementation
}

function myNewFunction(input) {
  // Implement the new function here
}

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainApp />);

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.getAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

mainElement.appendChild(document.body.cloneNode(true));
document.body.parentNode.insertBefore(mainElement, document.body);

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

// Preserve existing code
a11yStore.preserveExistingCode();

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

// Standalone utility function to check if user prefers reduced motion
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Standalone utility function to check if user prefers high contrast
export function prefersHighContrast() {
  return window.matchMedia('(prefers-contrast: more)').matches;
}

// Restored function to wrap primary content in a <main> element (required export)
function wrapPrimaryContentInMain() {
  const mainElement = document.createElement('main');
  mainElement.setAttribute('lang', document.documentElement.lang);

  // Ensure html lang attribute
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }

  mainElement.appendChild(document.body.cloneNode(true));
  document.body.parentNode.insertBefore(mainElement, document.body);
}

// Export for module usage
export { a11yStore };
export { addressAccessibilityIssues };
export default a11yStore;
export { wrapPrimaryContentInMain };

module.exports = {
    main,
    SomeClass,
    someUtility,
    config,
    countDependencies,
    validateLandmark,
    validateLandmarkStructure,
    renderDependencyGraphs,
    myNewFunction,
    MainApp,
    handleSkipLinkClick
};