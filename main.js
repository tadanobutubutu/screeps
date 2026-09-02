const fs = require('fs');
const main = require('./utilities');

const {
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateTableStructureComprehensive,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    getLangAttribute,
    validateAccessibilityReport,
    announceToScreenReader,
    handleKeyboardNav,
    newFocusTrap: originNewFocusTrap,
    exportUtils,
    addressAccessibilityIssues,
    handleCredentialResponse,
    ensureElementHasId: ensureElementIdOrigin,
    ensureElementId,
    renderDependencyGraphs,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
    renderAdditionalContent,
    transformInputData
} = main;

const accessibilityUtils = {
    initSkipLink: function () {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        }
    },
    trapFocus: function (element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
    },
    announceToScreenReader: function (message, priority) {
        if (priority === undefined) {
            priority = 'polite';
        }
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.position = 'absolute';
        announcer.style.left = '-9999px';
        announcer.textContent = message;
        document.body.appendChild(announcer);
        setTimeout(function () {
            announcer.remove();
        }, 1000);
    },
    handleKeyboardNav: function (e, handlers) {
        const key = e.key;
        if (handlers[key]) {
            handlers[key](e);
        }
    },
    newFocusTrap: function (element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        });
    }
};

function renderDependencyGraph(data) {
    // Implementation for rendering dependency graphs
    return {
        nodes: data.nodes || [],
        edges: data.edges || []
    };
}

function generateAccessibilityReport(issues) {
    const report = {
        timestamp: new Date().toISOString(),
        totalIssues: issues.length,
        critical: issues.filter(i => i.impact === 'critical').length,
        serious: issues.filter(i => i.impact === 'serious').length,
        moderate: issues.filter(i => i.impact === 'moderate').length,
        minor: issues.filter(i => i.impact === 'minor').length,
        issues: issues.map(issue => ({
            id: issue.id,
            impact: issue.impact,
            description: issue.description,
            help: issue.help,
            helpUrl: issue.helpUrl,
            nodes: issue.nodes.map(node => ({
                html: node.html,
                target: node.target
            }))
        }))
    };

    if (typeof validateAccessibilityReport === 'function') {
        validateAccessibilityReport(report);
    }

    return report;
}

function getTables() {
    return appData.tables;
}

function getConfig() {
    return { ...appData.config };
}

function setConfig(config) {
    appData.config = { ...appData.config, ...config };
}

// Implement the new function(s) here

// Access the dependencyGraph container and ensure it has proper ARIA role
const dependencyGraph = document.querySelector('.dependency-graph');

if (dependencyGraph) {
    // Set appropriate ARIA role for the dependency graph container
    // Using 'region' role for a contained section of content
    if (!dependencyGraph.getAttribute('role')) {
        dependencyGraph.setAttribute('role', 'region');
    }

    // Add accessible label if not already present
    if (!dependencyGraph.getAttribute('aria-label')) {
        dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
    }
}

/**
 * Adds landmark roles to appropriate elements and fixes landmark issues.
 * Addresses REACT_017: Add landmark roles and fix landmark issues.
 */
function addLandmarkRoles () {
  // Add role="main" to <main> elements
  document.querySelectorAll('main').forEach(el => {
    if (!el.hasAttribute('role')) {
      el.setAttribute('role', 'main')
    }
  })
  // Add role="navigation" to <nav> elements
  document.querySelectorAll('nav').forEach(el => {
    if (!el.hasAttribute('role')) {
      el.setAttribute('role', 'navigation')
    }
  })
  // Add role="complementary" to <aside> elements
  document.querySelectorAll('aside').forEach(el => {
    if (!el.hasAttribute('role')) {
      el.setAttribute('role', 'complementary')
    }
  })
  // Add role="banner" to <header> elements
  document.querySelectorAll('header').forEach(el => {
    if (!el.hasAttribute('role')) {
      el.setAttribute('role', 'banner')
    }
  })
  // Add role="contentinfo" to <footer> elements
  document.querySelectorAll('footer').forEach(el => {
    if (!el.hasAttribute('role')) {
      el.setAttribute('role', 'contentinfo')
    }
  })
  // Add role="region" to <section> elements that lack a role and have no accessible name
  document.querySelectorAll('section').forEach(el => {
    if (!el.hasAttribute('role') && !el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
      el.setAttribute('role', 'region')
    }
  })

  // Fix landmark issues: ensure landmarks have accessible names
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="complementary"], [role="banner"], [role="contentinfo"], [role="region"]');
  landmarks.forEach(landmark => {
    if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      console.warn('Landmark missing accessible name:', landmark)
    }
  })
}

/**
 * Ensures that landmark roles are unique across the page.
 * Addresses REACT_025: Ensure unique landmarks.
 */
function ensureUniqueLandmarks () {
  const landmarkRoles = ['main', 'navigation', 'complementary', 'banner', 'contentinfo', 'region']
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`)
    if (elements.length > 1) {
      console.warn(`Multiple elements with role="${role}" found. Landmarks should be unique.`)
      // Optionally, add aria-label to differentiate them
      elements.forEach((el, index) => {
        if (!el.hasAttribute('aria-label')) {
          el.setAttribute('aria-label', `${role} ${index + 1}`)
        }
      })
    }
  })
}

// Export functions for use in other modules
module.exports = {
  initSkipLink: accessibilityUtils.initSkipLink,
  trapFocus: accessibilityUtils.trapFocus,
  newFocusTrap: accessibilityUtils.newFocusTrap,
  announceToScreenReader: accessibilityUtils.announceToScreenReader,
  handleKeyboardNav: accessibilityUtils.handleKeyboardNav,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementId: accessibilityUtils.ensureElementId,
  renderDependencyGraphs,
  validateTableStructure,
  validateTableStructureComprehensive,
  addLandmarkRoles,
  ensureUniqueLandmarks,
  accessibilityUtils,
  getConfig,
  setConfig
};