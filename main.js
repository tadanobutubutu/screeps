// main.js - Main application entry point
// TODO: Implement validateLandmark functionality

(function() {
  'use strict';

  // Existing application state
  const appState = {
    initialized: false,
    currentView: 'home',
    user: null,
    settings: {
      theme: 'light',
      language: 'en'
    }
  };

  // DOM Ready handler
  function onDOMReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  // Initialize the application
  function initApp() {
    if (appState.initialized) {
      console.warn('App already initialized');
      return;
    }

    // Add lang attribute to html element for accessibility (REACT_015)
    const htmlElement = document.documentElement;
    if (!htmlElement.hasAttribute('lang')) {
      const lang = document.documentElement.lang || appState.settings.language || 'en';
      htmlElement.setAttribute('lang', lang);
    }

    // Initialize components
    initNavigation();
    initAccessibility();
    // New function implementation
    addressAccessibilityIssues();

    appState.initialized = true;
    console.log('Application initialized successfully');
  }

  // Navigation initialization
  function initNavigation() {
    const nav = document.querySelector('nav');
    if (nav) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
    }
  }

  // Accessibility improvements
  function initAccessibility() {
    // Ensure proper ARIA attributes
    const mainContent = document.querySelector('main') || document.body;
    if (mainContent && !mainContent.hasAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }

    // Skip to content link support
    const skipLink = document.querySelector('.skip-link, [href="#main"]');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector('main, [role="main"]');
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  }

  // Valid landmark roles
  const VALID_LANDMARKS = [
    'banner',
    'navigation',
    'main',
    'complementary',
    'contentinfo',
    'search',
    'form'
  ];

  // Validate landmark functionality
  function validateLandmark(element) {
    if (!element || !(element instanceof HTMLElement)) {
      return { valid: false, error: 'Invalid element provided' };
    }

    const role = element.getAttribute('role');
    const tagName = element.tagName.toLowerCase();

    // Check for explicit role attribute
    if (role) {
      if (VALID_LANDMARKS.includes(role)) {
        return { valid: true, role: role, type: 'explicit' };
      } else {
        return { valid: false, error: `Invalid landmark role: ${role}` };
      }
    }

    // Check for semantic HTML5 landmark elements
    const semanticLandmarks = {
      'main': 'main',
      'nav': 'navigation',
      'header': 'banner',
      'footer': 'contentinfo',
      'aside': 'complementary',
      'form': 'form',
      'section': 'region',
      'search': 'search'
    };

    if (semanticLandmarks[tagName]) {
      // Verify with ARIA in HTML that these require role for landmark status
      const landmarkTagNames = ['main', 'nav', 'header', 'footer', 'aside', 'search'];
      if (landmarkTagNames.includes(tagName)) {
        return { valid: true, role: semanticLandmarks[tagName], type: 'semantic' };
      }
      // Section and other elements need explicit role for landmark
      return { valid: true, role: semanticLandmarks[tagName], type: 'semantic', requiresRole: true };
    }

    return { valid: false, error: 'No valid landmark role or semantic element' };
  }

  // Validate all landmarks on the page
  function validateAllLandmarks() {
    const results = {
      valid: [],
      invalid: [],
      warnings: []
    };

    // Check elements with explicit role attributes
    const elementsWithRole = document.querySelectorAll('[role]');
    elementsWithRole.forEach(function(element) {
      const validation = validateLandmark(element);
      const landmarkInfo = {
        element: element,
        selector: getSelector(element),
        validation: validation
      };

      if (validation.valid) {
        results.valid.push(landmarkInfo);
      } else {
        results.invalid.push(landmarkInfo);
      }
    });

    // Check semantic landmark elements
    const semanticSelectors = ['main', 'nav', 'header', 'footer', 'aside', 'form', 'section', 'search'];
    semanticSelectors.forEach(function(selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(function(element) {
        // Skip if already checked via role attribute
        if (!element.hasAttribute('role')) {
          const validation = validateLandmark(element);
          const landmarkInfo = {
            element: element,
            selector: getSelector(element),
            validation: validation
          };

          if (validation.valid) {
            results.valid.push(landmarkInfo);
          } else {
            results.invalid.push(landmarkInfo);
          }
        }
      });
    });

    // Check for multiple main landmarks (warning)
    const mainLandmarks = results.valid.filter(function(item) {
      return item.validation.role === 'main';
    });
    if (mainLandmarks.length > 1) {
      results.warnings.push('Multiple main landmarks found. Consider using only one main landmark per page.');
    }

    return results;
  }

  // Helper function to get a CSS selector for an element
  function getSelector(element) {
    if (element.id) {
      return '#' + element.id;
    }
    if (element.className && typeof element.className === 'string') {
      var classes = element.className.trim().split(/\s+/);
      if (classes.length > 0) {
        return element.tagName.toLowerCase() + '.' + classes[0];
      }
    }
    return element.tagName.toLowerCase();
  }

  // Function to address new accessibility issues from the insight report
  function addressAccessibilityIssues() {
    // Validate all landmarks on the page
    const landmarkResults = validateAllLandmarks();

    // Ensure at least one main landmark exists
    const hasMainLandmark = landmarkResults.valid.some(function(item) {
      return item.validation.role === 'main';
    });

    if (!hasMainLandmark) {
      var mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.setAttribute('role', 'main');
      } else {
        var body = document.body;
        body.setAttribute('role', 'main');
      }
    }

    // Ensure navigation has proper landmark
    var navElement = document.querySelector('nav');
    if (navElement && !navElement.hasAttribute('role')) {
      navElement.setAttribute('role', 'navigation');
    }

    // Return validation summary for debugging/testing
    return {
      landmarks: landmarkResults,
      warnings: landmarkResults.warnings,
      mainLandmarkPresent: hasMainLandmark
    };
  }

  // Get application state
  function getState() {
    return { ...appState };
  }

  // Update application state
  function updateState(updates) {
    Object.assign(appState, updates);
    return appState;
  }

  // Export public API
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      initApp,
      getState,
      updateState,
      onDOMReady,
      validateLandmark,
      validateAllLandmarks,
      addressAccessibilityIssues
    };
  } else {
    window.App = {
      initApp,
      getState,
      updateState,
      onDOMReady,
      validateLandmark,
      validateAllLandmarks,
      addressAccessibilityIssues
    };
  }

  // Auto-initialize when DOM is ready
  onDOMReady(function() {
    initApp();
  });
})();