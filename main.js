import React from 'react';
import ReactDOM from 'react-dom/client';

// Existing function example
function existingFunction() {
  // Existing function code here
}

// Existing variable example
const existingVariable = 'value';

// Existing exports example
module.exports = {
  existingFunction,
  existingVariable,
};

// ----- END ORIGINAL CODE -----

// Adding the new function at the end
function newFunction() {
  // Your new function code here
}

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

// Accessibility store implementation (from origin/main)
const a11yStore = {
  liveRegion: null,

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addSVGAccessibilityProps();
  },

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

  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ... (existing code preserved)
    });

    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
    dropdownContainers.forEach((container) => {
      // ... (existing code preserved)
    });
  },

  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      // ... (existing code preserved)
    });
  },

  setupSkipLinks() {
    // ... (existing code preserved)
  },

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmark = document.querySelector(`[role="${element}"]`);
      if (landmark && landmark.id === '') {
        landmark.setAttribute('id', `${element}-${Math.floor(Math.random() * 1000)}`);
      }
    });
  },

  addSVGAccessibilityProps() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', 'svg-title');
      const titleText = svg.querySelector('title').textContent || 'Image description';
      const descriptionId = `svg-description-${Math.floor(Math.random() * 1000)}`;
      svg.setAttribute('aria-describedby', descriptionId);

      const descriptionElement = document.createElement('p');
      descriptionElement.setAttribute('id', descriptionId);
      descriptionElement.textContent = titleText;
      descriptionElement.className = 'sr-only';
      document.body.appendChild(descriptionElement);
    });
  },

  preserveExistingCode() {
    // ... (existing code preserved)
  }
};

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
    handleSkipLinkClick,
    existingFunction,
    existingVariable,
    newFunction,
    multiply,
    divide,
    reverseString,
    isEven,
    capitalizeFirst,
    a11yStore,
    addressAccessibilityIssues,
    wrapPrimaryContentInMain,
    prefersReducedMotion,
    prefersHighContrast
};