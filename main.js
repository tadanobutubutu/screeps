// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// Commit: a3c5cf541ab167e23402b298c1007dab267aff41

import React from 'react';

const {
  getLangAttribute,
  getFullLangAttribute,
  createInPageButton,
  createAccessibleLink,
} = require('./utils/accessibility');

const affectedFunctions = {
  getLangAttribute,
  getFullLangAttribute,
  createInPageButton,
  createAccessibleLink,
};

// Export affected functions and Main component to make them accessible
module.exports = {
  ...affectedFunctions,
  Main: Main,
};

const a11yStore = {
  init() {
    // REACT_015: Add lang attribute to HTML element
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }

    this.setupSkipLinks();
    this.setupFocusManagement();
    this.fixFakeLinks();
    this.initAccessibility();
  },

  createAccessibleButton(id, label, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.setAttribute('aria-label', label);
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  },

  createAccessibleDialog(id, title, content, closeLabel = 'Close') {
    const dialog = document.createElement('div');
    dialog.id = id;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', `${id}-title`);
    dialog.setAttribute('aria-modal', 'true');

    const titleEl = document.createElement('h2');
    titleEl.id = `${id}-title`;
    titleEl.textContent = title;

    const closeButton = this.createAccessibleButton(`${id}-close`, closeLabel, () => {
      dialog.hidden = true;
      dialog.setAttribute('aria-hidden', 'true');
    });

    dialog.appendChild(titleEl);
    dialog.appendChild(content);
    dialog.appendChild(closeButton);

    return dialog;
  },

  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },

  initAccessibility() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.tabIndex = -1;
          target.focus();
          this.announceToScreenReader('Navigated to main content');
        }
      });
    }

    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.alt) {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }
    });

    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      if (!input.id && input.name) {
        input.id = input.name;
      }
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label && input.type !== 'hidden') {
        input.setAttribute('aria-label', input.name || 'Form input');
      }
    });

    this.checkLandmarkElements();
    this.addAccessibilityPropertiesToSvgElements();
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

  makeAccessible(element) {
    if (!element) return;
    
    // Add basic accessibility attributes if missing
    if (element.tagName === 'BUTTON' && !element.hasAttribute('aria-label')) {
      const text = element.textContent.trim();
      if (text) {
        element.setAttribute('aria-label', text);
      }
    }
    
    if (element.tagName === 'A' && !element.hasAttribute('aria-label') && !element.textContent.trim()) {
      element.setAttribute('aria-label', 'Link');
    }
    
    // Ensure all interactive elements are keyboard accessible
    const tabIndex = element.getAttribute('tabindex');
    if (tabIndex === null && ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
      element.setAttribute('tabindex', '0');
    }
  },

  newNecessaryFunction() {
    // Implement the new function logic here
    this.createLiveRegion();
  },

  handleAccessibilityIssues() {
    // Implement the function logic to handle accessibility issues
    this.initAccessibility();
    this.setupFocusManagement();
    this.checkLandmarkElements();
    this.addAccessibilityPropertiesToSvgElements();
    this.fixFakeLinks();
  },

  addressAccessibilityIssue038() {
    // Existing code for addressing accessibility issue 038
    const elements = document.querySelectorAll('[role="button"]');
    elements.forEach((el) => {
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
      }
      if (!el.hasAttribute('aria-label') && !el.textContent.trim()) {
        el.setAttribute('aria-label', 'Button');
      }
    });
  },

  renderDependencyGraph() {
    // Existing code for rendering dependency graph
  },

  setupKeyboardNavigation() {
    // Setup keyboard navigation logic
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const dialogs = document.querySelectorAll('[role="dialog"]:not([hidden])');
        dialogs.forEach((dialog) => {
          dialog.hidden = true;
          dialog.setAttribute('aria-hidden', 'true');
        });
      }
    });
  },

  setupFocusManagement() {
    // Setup focus management logic
    this.setupKeyboardNavigation();
  },

  setupSkipLinks() {
    // Setup skip links logic
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-9999px';
    skipLink.style.top = '0';
    skipLink.addEventListener('focus', () => {
      skipLink.style.left = '0';
      skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
      skipLink.style.left = '-9999px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
  },

  checkLandmarkElements() {
    // Check and ensure proper landmark elements
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main-content';
    }
  },

  addAccessibilityPropertiesToSvgElements() {
    // Add accessibility properties to SVG elements
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg) => {
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
      if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
        const title = svg.querySelector('title');
        if (title) {
          svg.setAttribute('aria-labelledby', 'svg-title');
          title.id = 'svg-title';
        }
      }
    });
  },

  fixFakeLinks() {
    // Fix fake links to use proper anchor elements
    const fakeLinks = document.querySelectorAll('[role="link"], a:not([href])');
    fakeLinks.forEach((link) => {
      if (link.tag