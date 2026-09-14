// Accessibility improvements and updates

// Commit: a1b76c558a04b5add2d9001c234dd80c5c58ff6c

// Commit: a1b76c558a04b5add2d9001c234dd80c5c58ff6c

import React from 'react';

import {
  getLangAttribute,
  getFullLangAttribute,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createAccessibleLink,
} = require('./utils/a11y-helpers');

const affectedFunctions = {
  getLangAttribute,
  getFullLangAttribute,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibility-utils');

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
    this.createLiveRegion();
    this.setupSkipLinks();
    this.setupFocusManagement();
    this.fixFakeLinks();
    this.initAccessibility();
    this.checkLandmarkElements();
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
    const dialog = document.createElement('dialog');
    dialog.id = id;
    ... 'dialog');
    ... `${id}-title`);
    ... 'true');

    const titleEl = ...
    titleEl.id = `${id}-title`;
    titleEl.textContent = title;

    const closeButton = ... closeLabel, () => {
      dialog.hidden = true;
      ... 'true');
    });

    dialog.appendChild(titleEl);
    dialog.appendChild(content);
    dialog.appendChild(closeButton);

    return dialog;
  },

  announceToScreenReader(message, priority = 'polite') {
    const announcement = ...
    announcement.setAttribute('role', 'status');
    ... priority);
    ... 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    ...
    setTimeout(() => announcement.remove(), 1000);
  },

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, ...
    );
    const firstElement = ...
    const lastElement = focusableElements[focusableElements.length - 1];

    ... (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          ...
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          ...
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
      ... (e) => {
        e.preventDefault();
        const target = ...
        if (target) {
          target.tabIndex = -1;
          target.focus();
          ... to main content');
        }
      }
    }

    document.querySelectorAll('img:not([alt])').forEach((img) => {
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
      const label = ...
      if (!label && input.type !== 'hidden') {
        input.setAttribute('aria-label', input.getAttribute('placeholder') || input.name || 'Form input');
      }
    });

    // REACT_017 & REACT_025: Initialize landmark checks
    this.checkLandmarkElements();
  },

  createLiveRegion() {
    if (this.liveRegion) return;

    const region = ...
    region.setAttribute('role', 'status');
    ... 'polite');
    ... 'true');
    region.className = 'sr-only';
    region.id = 'a11y-live-region';
    ...
    this.liveRegion = region;
  },

  announce(message, priority = 'polite') {
    if (!this.liveRegion) ...

    ... priority);
    this.liveRegion.textContent = '';

    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  makeAccessible(element) {
    if (!element) return;
    
    element.setAttribute('role', element.tagName.toLowerCase());
    
    if (element.tagName === 'BUTTON' || element.tagName === 'A') {
      if (!element.textContent && !element.getAttribute('aria-label')) {
        console.warn('Interactive element missing accessible name');
      }
    }
    
    return element;
  },

  newNecessaryFunction() {
    // New function for handling accessibility updates
    this.checkLandmarkElements();
    this.setupFocusManagement();
    return true;
  },

  handleAccessibilityIssues() {
    // Handle accessibility issues from report
    const issues = ['REACT_015', 'REACT_017', 'REACT_025', 'REACT_036', 'REACT_041'];
    issues.forEach(issue => {
      switch (issue) {
        case 'REACT_015':
          if (!document.documentElement.lang) {
            document.documentElement.lang = 'en';
          }
          break;
        case 'REACT_017':
          this.checkLandmarkElements();
          break;
        case 'REACT_025':
          this.checkLandmarkElements();
          break;
        case 'REACT_036':
          this.fixFakeLinks();
          break;
        case 'REACT_041':
          this.addSvgAccessibleNames();
          break;
      }
    });
  },

  addressAccessibilityIssue038() {
    // Address accessibility issue 038
    document.querySelectorAll('[role="button"]').forEach(el => {
      el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
  },

  renderDependencyGraph() {
    // Existing code for rendering dependency graph
    const container = document.getElementById('dependency-graph');
    if (!container) return;
    
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', 'Dependency graph visualization');
  },

  setupFocusManagement() {
    // Setup focus management logic
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('[aria-expanded="true"]').forEach(el => {
          el.setAttribute('aria-expanded', 'false');
        });
      }
    });
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
    const landmarks = {
      'header[role="banner"]': document.querySelector('header[role="banner"]'),
      'nav[role="navigation"]': document.querySelector('nav[role="navigation"]'),
      'main[role="main"]': document.querySelector('main[role="main"]'),
      'footer[role="contentinfo"]': document.querySelector('footer[role="contentinfo"]'),
    };

    Object.entries(landmarks).forEach(([selector, element]) => {
      if (!element) {
        console.warn(`Missing landmark: ${selector}`);
      }
    });
  },

  addSvgAccessibleNames() {
    // Add accessibility properties to SVG elements
    document.querySelectorAll('svg').forEach((svg, index) => {
      if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        const title = svg.querySelector('title');
        if (title) {
          const titleId = `svg-title-${index}`;
          title.id = titleId;
          svg.setAttribute('aria-labelledby', titleId);
        } else {
          svg.setAttribute('role', 'img');
          svg.setAttribute('aria-label', 'Decorative graphic');
        }
      }
    });
  },

  fixFakeLinks() {
    // Fix fake links to use proper anchor elements
    document.querySelectorAll('[role="link"]').forEach(el => {
      if (!el.href) {
        console.warn('Element with role="link" is not an actual anchor element');
      }
    });
  },

  updateLiveRegion() {
    // Update live region for screen readers
    if (this.liveRegion) {
      this.liveRegion.textContent = '';
    }
  },
};

function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');

  if (title && title.textContent) {
    return title.textContent.trim();
  }

  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labeledElement = document.getElementById(ariaLabelledby);
    if (labeledElement && labeledElement.textContent) {
      return labeledElement.textContent.trim();
    }
  }

  return 'SVG graphic';
}

function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach(issue => {
    // Integrated the logic from both branches to address accessibility issues
    switch (issue.code) {
      case 'REACT_015':
        document.documentElement.lang = issue.value || 'en';
        break;
      case 'REACT