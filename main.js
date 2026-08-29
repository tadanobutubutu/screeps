import React from 'react';
import ReactDOM from 'react-dom/client';

let funcNames = [];

<<<<<<< HEAD
// Existing utility functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

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
      // ... (existing code)
    });

    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
    dropdownContainers.forEach((container) => {
      container.addEventListener('keydown', (e) => {
        // ... (existing code)
      });
    });
  },

  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      // ... (existing code)
    });
  },

  setupSkipLinks() {
    // ... (existing code)
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
    // ... (existing code)
  },

  addSVGAccessibilityProps() {
    // ... (existing code)
  },

  preserveExistingCode() {
    // ... (existing code)
=======
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainApp />);

export { MainApp, handleSkipLinkClick };
>>>>>>> origin/main

import React from 'react';
import ReactDOM from 'react-dom/client';

let funcNames = [];

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

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
      // ... (existing code)
    });

    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
    dropdownContainers.forEach((container) => {
      container.addEventListener('keydown', (e) => {
        // ... (existing code)
      });
    });
  },

  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      // ... (existing code)
    });
  },

  setupSkipLinks() {
    // ... (existing code)
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
    // ... (existing code)
  },

  addSVGAccessibilityProps() {
    // ... (existing code)
  },

  preserveExistingCode() {
    // ... (existing code)
  },
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainApp />);

export { MainApp, handleSkipLinkClick };
```