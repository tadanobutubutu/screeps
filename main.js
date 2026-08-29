// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8c93f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a97c2237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f8e635b07b09b809ac49f5e1c81cf4f389f9c1 -->
// GitHub Issue Fix - Commit: 6009dec851a51383e88dc071ee4edb6953001d55
import React from 'react';
import ReactDOM from 'react-dom/client';

let funcNames = [];

// TODO: Add back any required exports that might have been removed.
// For example, if the issue requires adding back an export like `calculateSum`, you would add:
// export function calculateSum(a, b) { return a + b; }

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
    this.setupKeyboardHandlers();
    this.setupFocusManagement();
    this.setupSkipLinks();
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

  setupKeyboardHandlers() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.open');
        if (openModal) {
          openModal.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    });

    const dropdownContainers = document.querySelectorAll('.dropdown');
    dropdownContainers.forEach((container) => {
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

        if (!focusIsInsideContainer) {
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

  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('.modal.open');
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

  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href');
    const target = targetId ? document.querySelector(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        skipLink.textContent = 'Skip to main content';
      });

      if (target.getAttribute('tabindex')) {
        skipLink.focus();
      }
    }
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
    landmarkElements.forEach((tag) => {
      const landmark = document.querySelector(tag);
      if (landmark && landmark.id === '') {
        landmark.setAttribute('aria-label', 'Untitled ' + tag + ' ' + Math.round(Math.random() * 1.000));
      }
    });
  },

  ensureSvgAccessibility() {
    const svgElements = document.querySelectorAll('svg:not([role])');
    svgElements.forEach((svg) => {
      svg.setAttribute('role', 'img');
      let titleElement = svg.querySelector('title');
      const titleId = 'svg-title-' + Math.round(Math.random() * 1.000);
      const titleText = titleElement ? titleElement.textContent : 'Image description';
      const descriptionId = 'svg-desc-' + Math.round(Math.random() * 1.000);
      titleElement = titleElement || svg.insertBefore(document.createElement('title'), svg.firstChild);
      titleElement.id = descriptionId;

      const descriptionElement = document.createElement('desc');
      descriptionElement.id = descriptionId;
      descriptionElement.textContent = titleText;
      descriptionElement.className = 'sr-only';
      svg.insertBefore(descriptionElement, svg.firstChild);
    });
  },

  preserveExistingCode() {
    // TODO: This is the existing code that needs to be preserved
    // (This comment remains as-is)
    // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
    // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
    // _Commit: f8051b788bad4952d8c93f08d3c7d22a06ff80d3_
    // <!-- todo-hash: b498b47abee4b3f29c69a97c2237d968a50cc419 -->
    // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
    // <!-- todo-hash: 1f8e635b07b09b809ac49f5e1c81cf4f389f9c1 -->
  }
};

// Function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach((issue) => {
    switch (issue.type) {
      case 'missing-lang':
        if (document.documentElement) {
          document.documentElement.setAttribute('lang', 'en');
        }
        break;
      case 'missing-skip-link':
        if (document.body) {
          const skipLink = document.createElement('a');
          skipLink.className = 'skip-link';
          skipLink.href = '#main-content';
          skipLink.textContent = 'Skip to main content';
          document.body.insertBefore(skipLink, document.body.firstChild);
        }
        break;
      case 'missing-alt':
        document.querySelectorAll('img').forEach((img) => {
          if (!img.getAttribute('alt')) {
            img.setAttribute('alt', 'Image description');
          }
        });
        break;
      case 'missing-label':
        document.querySelectorAll('input, select, textarea').forEach((el) => {
          if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
            el.setAttribute('aria-label', 'Form field');
          }
        });
        break;
    }
  });
}

// REACT_015: Add lang attribute
if (document.documentElement && !document.documentElement.getAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

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

// CommonJS exports (preserved from HEAD)
module.exports = {
  add,
  subtract,
  multiply,
  divide,
  reverseString,
  isEven,
  capitalizeFirst,
  a11yStore,
  addressAccessibilityIssues,
  updateLiveRegion: a11yStore.updateLiveRegion,
  checkLandmarkElements: a11yStore.checkLandmarkElements,
  ensureSvgAccessibility: a11yStore.ensureSvgAccessibility,
  preserveExistingCode: a11yStore.preserveExistingCode,
  prefersReducedMotion: a11yStore.prefersReducedMotion,
  prefersHighContrast: a11yStore.prefersHighContrast,
};

// ES6 module exports (preserved from origin/main)
export { a11yStore };
export { addressAccessibilityIssues };
export { updateLiveRegion };
export { checkLandmarkElements };
export { ensureSvgAccessibility };
export { preserveExistingCode };
export { prefersReducedMotion };
export { prefersHighContrast };
export { MainApp, handleSkipLinkClick };
export default a11yStore;