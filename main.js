// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// Commit: a3c5cf541ab167e23402b298c1007dab267aff41

import React from 'react';
import PropTypes from 'prop-types';

const {
  getLangAttribute,
  getFullLangAttribute,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibilityHelpers');

// Export affected functions and Main component to make them accessible
module.exports = {
  ...affectedFunctions,
  Main: Main,
};

const a11yStore = {
  liveRegion: null,
  
  init() {
    this.setupSkipLinks();
    this.createLiveRegion();
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
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(skipLink.getAttribute('href').slice(1));
        if (target) {
          target.tabIndex = -1;
          target.focus();
          this.announceToScreenReader('Skip to main content');
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
    element.setAttribute('role', 'article');
    element.setAttribute('tabindex', '0');
  },

  newNecessaryFunction() {
    const accessibleElements = document.querySelectorAll('[data-a11y]');
    accessibleElements.forEach((el) => {
      const a11yType = el.getAttribute('data-a11y');
      switch (a11yType) {
        case 'button':
          el.setAttribute('role', 'button');
          if (!el.textContent && !el.getAttribute('aria-label')) {
            console.warn('Accessible button missing label');
          }
          break;
        case 'link':
          el.setAttribute('role', 'link');
          break;
        default:
          break;
      }
    });
  },

  handleAccessibilityIssues() {
    this.checkLandmarkElements();
    this.setupFocusManagement();
    this.updateLiveRegion();
  },

  addressAccessibilityIssue038() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingMap = {};
    
    headings.forEach((heading) => {
      const level = heading.tagName.toLowerCase();
      if (!headingMap[level]) {
        headingMap[level] = 0;
      }
      headingMap[level]++;
      
      if (!heading.id) {
        heading.id = `${level}-${headingMap[level]}`;
      }
    });
  },

  renderDependencyGraph() {
    const graphContainer = document.getElementById('dependency-graph');
    if (graphContainer) {
      graphContainer.setAttribute('role', 'img');
      graphContainer.setAttribute('aria-label', 'Dependency graph visualization');
    }
  },

  setupKeyboardNavigation() {
    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    interactiveElements.forEach((el, index) => {
      el.setAttribute('data-tab-index', index);
    });
  },

  setupFocusManagement() {
    const focusableElements = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeDialog = document.querySelector('[role="dialog"]:not([hidden])');
        if (activeDialog) {
          activeDialog.hidden = true;
          activeDialog.setAttribute('aria-hidden', 'true');
        }
      }
    });
  },

  setupSkipLinks() {
    const existingSkipLink = document.querySelector('.skip-link');
    if (!existingSkipLink) {
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
    }
  },

  checkLandmarkElements() {
    const banners = document.querySelectorAll('[role="banner"], header');
    const mains = document.querySelectorAll('[role="main"], main');
    const navigations = document.querySelectorAll('[role="navigation"], nav');
    
    if (banners.length > 1) {
      for (let i = 1; i < banners.length; i++) {
        banners[i].removeAttribute('role');
      }
    }
    
    if (mains.length > 1) {
      for (let i = 1; i < mains.length; i++) {
        mains[i].removeAttribute('role');
      }
    }
    
    navigations.forEach((nav, index) => {
      if (nav.getAttribute('aria-label')) {
        return;
      }
      const labels = ['Footer navigation', 'Secondary navigation', 'Utility navigation', 'Legal navigation'];
      if (index < labels.length) {
        nav.setAttribute('aria-label', labels[index]);
      } else {
        nav.setAttribute('aria-label', `Navigation section ${index + 1}`);
      }
    });
  },

  addSvgAccessibility() {
    const svgs = document.querySelectorAll('svg:not([role]), svg[role="img"]');
    svgs.forEach((svg) => {
      if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        svg.setAttribute('role', 'img');
        const title = svg.querySelector('title');
        if (title) {
          const titleId = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
          title.id = titleId;
          svg.setAttribute('aria-labelledby', titleId);
        } else {
          svg.setAttribute('aria-label', 'Decorative graphic');
        }
      }
    });
  },

  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[role="link"], [data-fake-link]');
    fakeLinks.forEach((link) => {
      const href = link.getAttribute('data-href') || link.getAttribute('href');
      if (href) {
        const newLink = document.createElement('a');
        newLink.href = href;
        newLink.textContent = link.textContent;
        new