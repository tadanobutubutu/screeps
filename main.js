// GitHub Issue Fix - Commit: 6009dec851a51383188dc071ee4edb6953001d55

// TODO: Add exports for new functions if needed - UPDATED: Added exports below

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

  init: function() {
    this.createLiveRegion();
    this.setupKeyboardHandlers();
    this.setupFocusManagement();
    this.setupSkipLinks();
  },

  createLiveRegion: function() {
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

  announce: function(message, priority) {
    priority = priority || 'polite';
    if (!this.liveRegion) return;
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    setTimeout(function() {
      this.liveRegion.textContent = message;
    }.bind(this), 100);
  },

  setupKeyboardHandlers: function() {
    var self = this;
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        var target = e.target;
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      if (e.key === 'Escape') {
        var openModal = document.querySelector('.modal.open');
        if (openModal) {
          openModal.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    });

    var dropdownContainers = document.querySelectorAll('.dropdown');
    dropdownContainers.forEach(function(container) {
      container.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;

        var currentFocusedElement = document.activeElement;
        var focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest(container))
        ) {
          focusIsInsideContainer = true;
        }

        if (!focusIsInsideContainer) {
          var firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (firstFocusableElement) {
            firstFocusableElement.focus();
          }
        }
      });
    });
  },

  setupFocusManagement: function() {
    var self = this;
    document.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;

      var modal = document.querySelector('.modal.open');
      if (!modal) return;

      var focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      var firstElement = focusableElements[0];
      var lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  },

  setupSkipLinks: function() {
    var skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    var targetId = skipLink.getAttribute('href');
    var target = targetId ? document.querySelector(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        skipLink.textContent = 'Skip to main content';
      });

      if (document.body.classList.indexOf('no-skip-link') !== -1) {
        skipLink.focus();
      }
    }
  },

  prefersReducedMotion: function() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast: function() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion: function(message, priority) {
    priority = priority || 'polite';
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  checkLandmarkElements: function() {
    var landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach(function(tag) {
      var landmark = document.querySelector(tag);
      if (landmark && landmark.id === '') {
        landmark.id = 'landmark-' + tag + '-' + Math.floor(Math.random() * 1000);
      }
    });
  },

  enhanceSVGElements: function() {
    var svgElements = document.querySelectorAll('svg');
    svgElements.forEach(function(svg) {
      svg.setAttribute('role', 'img');
      var titleId = 'svg-title-' + Math.floor(Math.random() * 1000);
      var titleText = svg.querySelector('title') || 'Image description';
      var descriptionId = 'svg-desc-' + Math.floor(Math.random() * 1000);
      svg.setAttribute('aria-labelledby', titleId);

      var descriptionElement = document.createElement('desc');
      descriptionElement.id = descriptionId;
      descriptionElement.textContent = titleText;
      descriptionElement.className = 'sr-only';
      svg.insertBefore(descriptionElement, svg.firstChild);
    });
  },

  preserveExistingCode: function() {
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

// Function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach(function(issue) {
    switch (issue.type) {
      case 'missing-lang':
        if (document.documentElement) {
          document.documentElement.setAttribute('lang', 'en');
        }
        break;
      case 'missing-skip-link':
        if (document.body) {
          var skipLink = document.createElement('a');
          skipLink.className = 'skip-link';
          skipLink.href = '#main-content';
          skipLink.textContent = 'Skip to main content';
          document.body.insertBefore(skipLink, document.body.firstChild);
        }
        break;
      case 'missing-alt':
        var images = document.querySelectorAll('img');
        images.forEach(function(img) {
          if (!img.getAttribute('alt')) {
            img.setAttribute('alt', 'Image description');
          }
        });
        break;
      case 'missing-label':
        var inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(function(el) {
          if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
            el.setAttribute('aria-label', 'Form field');
          }
        });
        break;
    }
  });
}

// REACT_015: Add lang attribute
if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.setAttribute('lang', 'en');
}

// Initialize accessibility features
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    a11yStore.init();
  });
}

// CommonJS exports (preserved from HEAD)
module.exports = {
  add: add,
  subtract: subtract,
  multiply: multiply,
  divide: divide,
  reverseString: reverseString,
  isEven: isEven,
  capitalizeFirst: capitalizeFirst,
  a11yStore: a11yStore,
  addressAccessibilityIssues: addressAccessibilityIssues,
  updateLiveRegion: a11yStore.updateLiveRegion,
  checkLandmarkElements: a11yStore.checkLandmarkElements,
  enhanceSVGElements: a11yStore.enhanceSVGElements,
  preserveExistingCode: a11yStore.preserveExistingCode,
  prefersReducedMotion: a11yStore.prefersReducedMotion,
  prefersHighContrast: a11yStore.prefersHighContrast
};

// ES6 module exports (preserved from origin/main)
export { a11yStore };
export { addressAccessibilityIssues };
export { a11yStore.updateLiveRegion as updateLiveRegion };
export { a11yStore.checkLandmarkElements as checkLandmarkElements };
export { a11yStore.enhanceSVGElements as enhanceSVGElements };
export { a11yStore.preserveExistingCode as preserveExistingCode };
export { a11yStore.prefersReducedMotion as prefersReducedMotion };
export { a11yStore.prefersHighContrast as prefersHighContrast };
export default a11yStore;