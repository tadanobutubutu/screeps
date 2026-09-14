// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by imported components/index.html)
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

// Commit: c5dfb8e6099f598498cc531ac0c7aec74b60c762

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
} = ...

// Export affected functions and Main component to make them accessible
module.exports = {
  ...affectedFunctions,
  Main: Main,
};

const a11yStore = {
  init() {
    ...
    ...
    ...
    this.setupSkipLinks();
    ...
    ...
    this.fixFakeLinks();
    this.initAccessibility();
    this.fixFakeLinks();
    this.checkLandmarkElements();
    this.setDocumentLang();
  },

  setDocumentLang() {
    const lang = getLangAttribute();
    if (lang && document.documentElement) {
      document.documentElement.lang = lang;
    }
  },

  createAccessibleButton(id, label, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.setAttribute('aria-label', label);
    button.textContent = label;
    ... onClick);
    return button;
  },

  createAccessibleDialog(id, title, content, closeLabel = 'Close') {
    const dialog = ...
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
    ...
    ...

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
    const skipLink = ...
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

    ... => {
      if ... {
        img.setAttribute('alt', '');
        img.setAttribute('role', 'presentation');
      }
    });

    ... select, ... => {
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
    // REACT_017: Add landmark roles and fix landmark issues
    if (!element) return;

    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    const role = element.getAttribute('role');

    // Add appropriate landmark roles to semantic elements if missing
    const landmarkMap = {
      'header': 'banner',
      'nav': 'navigation',
      'main': 'main',
      'footer': 'contentinfo',
      'aside': 'complementary',
      'section': 'region',
      'form': 'form',
    };

    if (landmarkMap[tagName] && !role) {
      element.setAttribute('role', landmarkMap[tagName]);
    }

    // REACT_025: Ensure unique landmarks by adding descriptive labels
    if (role && ['navigation', 'complementary', 'banner', 'contentinfo', 'search'].includes(role)) {
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        // Add generic accessible name if no label exists
        const accessibleNames = {
          'navigation': 'Main navigation',
          'complementary': 'Supplementary content',
          'banner': 'Site header',
          'contentinfo': 'Site footer',
          'search': 'Search'
        };
        if (accessibleNames[role]) {
          element.setAttribute('aria-label', accessibleNames[role]);
        }
      }
    }

    // Make images accessible
    if (tagName === 'img' && !element.alt) {
      element.setAttribute('alt', '');
      element.setAttribute('role', 'presentation');
    }

    // Ensure form inputs have labels
    if (['input', 'select', 'textarea'].includes(tagName)) {
      if (!element.id) {
        element.id = `input-${Math.random().toString(36).substr(2, 9)}`;
      }
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (!label && element.type !== 'hidden') {
        element.setAttribute('aria-label', element.name || 'Form input');
      }
    }

    return element;
  },

  newNecessaryFunction(accessibilityReport) {
    // REACT_025: Ensure unique landmarks - process accessibility report
    if (!accessibilityReport || !Array.isArray(accessibilityReport)) {
      return { processed: false, issues: [] };
    }

    const processedIssues = [];
    const landmarkCounts = {};

    accessibilityReport.forEach(issue => {
      if (issue.code === 'REACT_025' || issue.code === 'REACT_017') {
        // Track landmark occurrences for uniqueness
        const landmarkType = issue.element?.getAttribute('role') || 'unknown';
        landmarkCounts[landmarkType] = (landmarkCounts[landmarkType] || 0) + 1;
        processedIssues.push({
          ...issue,
          processed: true,
          occurrence: landmarkCounts[landmarkType]
        });
      } else {
        processedIssues.push(issue);
      }
    });

    return { processed: true, issues: processedIssues, landmarkCounts };
  },

  handleAccessibilityIssues(accessibilityReport) {
    if (!accessibilityReport || !Array.isArray(accessibilityReport)) return;

    accessibilityReport.forEach(issue => {
      const { element, code, message } = issue;

      if (!element) return;

      switch (code) {
        case 'REACT_017':
          // Add landmark roles
          this.addLandmarkRole(element);
          break;
        case 'REACT_025':
          // Ensure unique landmarks
          this.makeAccessible(element);
          break;
        case 'REACT_036':
          // Fix fake links - already handled in fixFakeLinks
          break;
        case 'REACT_041':
          // Add accessible names to SVGs
          this.addAccessibleSvgName(element);
          break;
        default:
          // Generic accessibility fix
          this.makeAccessible(element);
          break;
      }
    });
  },

  ... {
    // Existing code for addressing accessibility issue 038
    addressAccessibilityIssue038(element) {
      // Add accessibility attributes for issue 038
      if (element) {
        element.setAttribute('role', 'region');
        if (!element.id) {
          element.id = `a11y-region-${Date.now()}`;
        }
      }
      return element;
    }
  },

  renderDependencyGraph(container, dependencies, options = {}) {
    // Render dependency graph with accessibility improvements
    const {
      title = 'Dependency Graph',
      description = 'Visual representation of project dependencies and their relationships',
      nodeLabel = (node) => node.name || node.id,
      onNodeClick = null,
    } = options;

    // Create accessible container
    const graphContainer = document.createElement('div');
    graphContainer.setAttribute('role', 'img');
    graphContainer.setAttribute('aria-label', `${title}: ${description}`);
    graphContainer.setAttribute('tabindex', '0');

    // Create description for screen readers
    const descriptionEl = document.createElement('div');
    descriptionEl.id = 'dependency-graph-description';
    descriptionEl.className = 'sr-only';
    descriptionEl.textContent = `${title}. ${description}. Contains ${dependencies.length} dependencies.`;

    graphContainer.appendChild(descriptionEl);

    // Create keyboard navigation instructions
    const instructionsEl = document.createElement('div');
    instructionsEl.className = 'sr-only';
    instructionsEl.id = 'dependency-graph-instructions';
    instructionsEl.textContent = 'Use arrow keys to navigate between dependency nodes. Press Enter to select a node.';
    graphContainer.appendChild(instructionsEl);

    // Focus management for keyboard navigation
    let currentFocusIndex = 0;
    const focusableNodes = [];

    // Create graph nodes
    const nodes = [];
    dependencies.forEach((dep, index) => {
      const node = document.createElement('div');
      node.setAttribute('role', 'button');
      node.setAttribute('tabindex', index === 0 ? '0' : '-1');
      node.setAttribute('aria-describedby', 'dependency-graph-instructions');
      node.id = `dep-node-${dep.id || index}`;
      node.className = 'dependency-node';
      node.textContent = nodeLabel(dep);

      // Add accessibility attributes
      if (dep.version) {
        node.setAttribute('aria-label', `${nodeLabel(dep)}, version ${dep.version}`);
      } else {
        node.setAttribute('aria-label', nodeLabel(dep));
      }

      if (onNodeClick) {
        node.addEventListener('click', () => {
          node.setAttribute('aria-pressed', 'true');
          onNodeClick(dep);
        });

        node.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            node.setAttribute('aria-pressed', 'true');
            onNodeClick(dep);
          }
        });
      }

      nodes.push(node);
      focusableNodes.push(node);
      graphContainer.appendChild(node);
    });

    // Keyboard navigation
    graphContainer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        currentFocusIndex = Math.min(currentFocusIndex + 1, focusableNodes.length - 1);
        focusableNodes[currentFocusIndex].focus();
        focusableNodes[currentFocusIndex].setAttribute('tabindex', '0');
        focusableNodes.forEach((node, i) => {
          if (i !== currentFocusIndex) node.setAttribute('tabindex', '-1');
        });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        currentFocusIndex = Math.max(currentFocusIndex - 1, 0);
        focusableNodes[currentFocusIndex].focus();
        focusableNodes[currentFocusIndex].setAttribute('tabindex', '0');
        focusableNodes.forEach((node, i) => {
          if (i !== currentFocusIndex) node.setAttribute('tabindex', '-1');
        });
      }
    });

    // Initial focus announcement
    graphContainer.addEventListener('focus', () => {
      this.announce(`Dependency graph focused. ${focusableNodes.length} dependencies available.`);
    });

    if (container) {
      container.appendChild(graphContainer);
    }

    return graphContainer;
  },

  ... {
    // Setup keyboard navigation logic
    setupKeyboardNavigation() {
      // Handle keyboard events for accessibility
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          // Close any open dialogs
          const dialogs = document.querySelectorAll('[role="dialog"]:not([hidden])');
          dialogs.forEach(dialog => {
            dialog.hidden = true;
          });
        }
      });
    }
  },

  setupFocusManagement() {
    // Setup focus management logic
  },

  setupSkipLinks() {
    // Setup skip links logic
    const skipLink = document.querySelector('.skip-link, [href^="#skip"]');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = skipLink.getAttribute('href').substring(1);
        const target = document.getElementById(targetId) || document.querySelector('[role="main"]');
        if (target) {
          target.tabIndex = -1;
          target.focus();
        }
      });
    }
  },

  checkLandmarkElements() {
    // REACT_025: Check and ensure proper landmark elements with unique identifiers
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
    const landmarkCounts = {};
    const landmarkLabels = {};

    landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      const label = landmark.getAttribute('aria-label');

      if (!landmarkCounts[role]) {
        landmarkCounts[role] = 0;
      }
      landmarkCounts[role]++;

      // Track labels for uniqueness
      if (label) {
        if (!landmarkLabels[role]) {
          landmarkLabels[role] = new Set();
        }
        landmarkLabels[role].add(label);
      }

      // Ensure unique landmarks by adding labels to duplicates
      if (landmarkCounts[role] > 1 && !label) {
        const uniqueLabels = {
          'navigation': ['Main navigation', 'Secondary navigation', 'Footer navigation'],
          'complementary': ['Sidebar', 'Related content']
        };

        if (uniqueLabels[role] && uniqueLabels[role][landmarkCounts[role] - 2]) {
          landmark.setAttribute('aria-label', uniqueLabels[role][landmarkCounts[role] - 2]);
        }
      }

      // REACT_017: Add semantic HTML elements if role is missing
      if (!landmark.tagName) return;

      const tagName = landmark.tagName.toLowerCase();
      const semanticToRole = {
        'header': 'banner',
        'nav': 'navigation',
        'main': 'main',
        'footer': 'contentinfo',
        'aside': 'complementary'
      };

      if (semanticToRole[tagName] && !role) {
        landmark.setAttribute('role', semanticToRole[tagName]);
      }
    });

    return landmarkCounts;
  },

  ... {
    // Add accessibility properties to SVG elements
    addAccessibleSvgName(svgElement) {
      if (!svgElement || svgElement.tagName?.toLowerCase() !== 'svg')