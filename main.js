// main.js - Main application entry point
// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute

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
    if (!mainContent.hasAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }

    // Skip to content link support
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
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
      onDOMReady
    };
  } else {
    window.App = {
      initApp,
      getState,
      updateState,
      onDOMReady
    };
  }

  // Auto-initialize when DOM is ready
  onDOMReady(() => {
    initApp();
  });
})();