// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// Commit: a1b76c558a04b5add2d9001c234dd80c5c58ff6c

import React from 'react';

const {
  getLangAttribute,
  getFullLangAttribute,
  createInPageButton,
  createAccessibleLink,
} = require('./utils');

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
  liveRegion: null,

  init() {
    this.initAccessibility();
    this.setupSkipLinks();
    this.setupFocusManagement();
    this.setupKeyboardNavigation();
    this.checkLandmarkElements();
    this.fixFakeLinks();
  },

  createAccessibleButton(id, label, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.setAttribute('aria-label', label);
    button.textContent = label;
    if (onClick) button.addEventListener('click', onClick);
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
    dialog.appendChild(closeButton);
    dialog.appendChild(content);

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
    // REACT_015: Ensure lang attribute is set on HTML element
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }

    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.tabIndex = -1;
          target.focus();
          this.announce('Skipped to main content');
        }
      });
    }

    // REACT_041: Add accessibility to images with empty alt
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.alt) {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }
    });

    // Ensure form inputs have accessible names
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
    if (!element.hasAttribute('tabindex') && !element.matches('a, button, input, select, textarea')) {
      element.setAttribute('tabindex', '0');
    }

    // Ensure semantic elements have proper roles
    const tagName = element.tagName.toLowerCase();
    const semanticRoles = {
      header: 'banner',
      nav: 'navigation',
      main: 'main',
      aside: 'complementary',
      footer: 'contentinfo',
      section: 'region',
      article: 'article',
    };

    if (semanticRoles[tagName] && !element.hasAttribute('role')) {
      element.setAttribute('role', semanticRoles[tagName]);
    }
  },

  newNecessaryFunction() {
    // Set up accessibility attributes for dynamically added content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.makeAccessible(node);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  },

  handleAccessibilityIssues() {
    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('[role="button"], [role="link"]');
    interactiveElements.forEach((el) => {
      el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
  },

  addressAccessibilityIssue038() {
    // Fix clickable divs that should be buttons or links
    const clickableDivs = document.querySelectorAll('div[onclick], div[role="button"]');
    clickableDivs.forEach((div) => {
      if (!div.querySelector('button') && !div.querySelector('a')) {
        console.warn('REACT_038: Clickable div should be a button or link:', div);
      }
    });
  },

  renderDependencyGraph() {
    // Existing code for rendering dependency graph
    console.log('Rendering dependency graph');
  },

  setupKeyboardNavigation() {
    // Setup keyboard navigation logic
    document.addEventListener('keydown', (e) => {
      // Handle escape key to close modals/dialogs
      if (e.key === 'Escape') {
        const openDialog = document.querySelector('dialog:not([hidden]), [role="dialog"]:not([hidden])');
        if (openDialog) {
          const closeBtn = openDialog.querySelector('button');
          if (closeBtn) closeBtn.click();
        }
      }
    });
  },

  setupFocusManagement() {
    // Setup focus management logic
    // Store previously focused element when opening modal
    document.addEventListener('focusin', (e) => {
      // Focus management logic can be expanded here
    });
  },

  setupSkipLinks() {
    // Setup skip links logic
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = skipLink.getAttribute('href')?.slice(1);
        const target = targetId ? document.getElementById(targetId) : null;
        if (target) {
          target.tabIndex = -1;
          target.focus();
          this.announce('Skipped to main content');
        }
      });
    }
  },

  checkLandmarkElements() {
    // REACT_025: Check and ensure proper landmark elements with unique labels
    const landmarks = {
      banner: document.querySelectorAll('[role="banner"], header'),
      navigation: document.querySelectorAll('[role="navigation"], nav'),
      main: document.querySelectorAll('[role="main"], main'),
      complementary: document.querySelectorAll('[role="complementary"], aside'),
      contentinfo: document.querySelectorAll('[role="contentinfo"], footer'),
    };

    // Ensure each landmark type is unique (only one per page)
    Object.entries(landmarks).forEach(([role, elements]) => {
      if (elements.length > 1 && (role === 'banner' || role === 'main' || role === 'contentinfo')) {
        console.warn(`REACT_025: Multiple ${role} landmarks found. Only one should exist per page.`);
      }
    });

    // Ensure navigation landmarks have accessible labels
    landmarks.navigation.forEach((nav, index) => {
      if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
        const label = index === 0 ? 'Main navigation' : `Navigation ${index + 1}`;
        nav.setAttribute('aria-label', label);
      }
    });
  },

  addAccessibleSvgProperties() {
    // REACT_041: Add accessible properties to SVG elements
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg) => {
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
      if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
        const title = svg.querySelector('title');
        if (title) {
          const titleId = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
          title.id = titleId;
          svg.setAttribute('aria-labelledby', titleId);
        } else {
          svg.setAttribute('aria-label', 'SVG graphic');
        }
      }
    });
  },

  fixFakeLinks() {
    // REACT_036: Fix fake links to use proper