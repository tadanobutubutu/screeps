// Accessibility improvements and updates

// Commit: a1b76c558a04b5add2d9001c234dd80c5c58ff6c

// Commit: a3c5cf541ab167e23402b298c1007dab267aff41

import React from 'react';

const {
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
    button.addEventListener('click', onClick);
    return button;
  },

  createAccessibleDialog(id, title, content, closeLabel = 'Close') {
    const dialog = document.createElement('dialog');
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
          this.announce('Skipped to main content');
        }
      });
    }

    document.querySelectorAll('img:not([alt])').forEach((img) => {
      if (!img.alt) {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }
    });

    document.querySelectorAll('input, select, textarea').forEach((input) => {
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