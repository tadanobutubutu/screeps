module.exports = {
  createInPageButton: function(buttonText, onClickHandler) {
    const button = document.createElement('button');
    const lang = document.documentElement.lang || 'en';

    button.setAttribute('type', 'button');
    button.setAttribute('lang', lang);
    button.setAttribute('aria-label', buttonText || 'In-page action');
    button.textContent = buttonText || 'Action';
    button.addEventListener('click', onClickHandler);
    return button;
  },

  addSvgAccessibleNames: function() {
    const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
    svgs.forEach(svg => {
      const title = svg.querySelector('title');
      if (title && title.textContent.trim()) {
        svg.setAttribute('aria-label', title.textContent.trim());
      }
    });
  },

  ensureUniqueLandmarks: function() {
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"], main, nav, aside, header, footer');
    const seen = new Map();
    landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
      const count = (seen.get(role) || 0) + 1;
      seen.set(role, count);
      if (count > 1 && !landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
        landmark.setAttribute('aria-label', `${role} ${count}`);
      }
    });
  },

  fixFakeLink: function() {
    const fakeLinks = document.querySelectorAll('[role="link"]:not(a), [onclick]:not(a):not(button):not([role])');
    fakeLinks.forEach(el => {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'link');
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
  },

  trapFocus: function(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    element.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => element.removeEventListener('keydown', handleTab);
  },

  announce: function(message, priority = 'polite') {
    const liveRegion = document.getElementById('a11y-live-region') || (() => {
      const div = document.createElement('div');
      div.id = 'a11y-live-region';
      div.setAttribute('aria-live', priority);
      div.setAttribute('aria-atomic', 'true');
      div.style.position = 'absolute';
      div.style.left = '-9999px';
      document.body.appendChild(div);
      return div;
    })();
    liveRegion.textContent = '';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = message;
  },

  handleArrowKeys: function(element, callback) {
    element.addEventListener('keydown', (e) => {
      const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (directions.includes(e.key)) {
        callback(e);
      }
    });
  },

  prefersReducedMotion: function() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  rotateBack: function() {},

  initializeAccessibility: function() {
    this.addSvgAccessibleNames();
    this.ensureUniqueLandmarks();
    this.fixFakeLink();
  },

  initialize: function() {
    this.initializeAccessibility();
  },

  analyzeAccessibility: function(issuesData) {
    return issuesData;
  },

  generateAccessibilityReport: function(issuesData) {
    const analyzedIssues = this.analyzeAccessibility(issuesData);
    const report = {
      introduction: 'Accessibility report for the application',
      data: analyzedIssues,
      conclusions: ''
    };
    return report;
  }
};

function calculateDiscount(price, discount) {
  if (typeof price !== 'number' || price < 0) {
    throw new Error('Price must be a non-negative number');
  }
  if (typeof discount !== 'number' || discount < 0) {
    throw new Error('Discount must be a non-negative number');
  }

  // Calculate discounted price
  const discountedPrice = price * (1 - discount / 100);
  return Math.max(0, discountedPrice);
}

function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

// Export existing functionality and new functions
export {
  initialize,
  getConfig,
  setupSkipLinks,
  setupButtonAccessibility,
  checkLandmarkElement,
  createInPageButton,
  performTask,
  handleEvent,
  greet,
  add,
  calculateDiscount,
  generateAccessibilityReport
};

// Compatibility for CommonJS if needed
module.exports.calculateDiscount = calculateDiscount;
module.exports.greet = greet;
module.exports.add = add;