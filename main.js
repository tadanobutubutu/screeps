const express = require('express');
const app = express();

// Accessibility middleware for ARIA live regions and focus management
app.use((req, res, next) => {
  // Set ARIA live region for dynamic content announcements
  res.locals.ariaLiveRegion = 'polite';

  // Helper to ensure focus management for dynamic content
  res.locals.manageFocus = function(elementId) {
    if (typeof document !== 'undefined' && elementId) {
      const element = document.getElementById(elementId);
      if (element && element.focus) {
        element.setAttribute('tabindex', '-1');
        element.focus();
      }
    }
  };

  // Helper for keyboard navigation
  res.locals.handleKeyboardNav = function(event, callback) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  // Helper to add lang attribute to HTML element (REACT_015)
  res.locals.setLangAttribute = function(lang = 'en') {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  next();
});

// Existing functions
function rotate() {
  // ... Kept unchanged
}

function rotateBack() {
  // ... Kept unchanged
}

function add(a, b) {
  // ... Kept unchanged
}

function subtract(a, b) {
  // ... Kept unchanged
}

function multiply(a, b) {
  // ... Kept unchanged
}

function divide(a, b) {
  // ... Kept unchanged
}

// Add a new function for addressing accessibility issues from insight report
function addressAccessibilityIssuesFromInsightReport() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.hasAttribute('aria-label')) {
      // Assume we can generate a label based on the button's text content
      const label = button.textContent.trim() || 'Button';
      addAriaLabel(button, label);
    }
  });
}

// Add a new function for adding `aria-label` to elements
function addAriaLabel(elem, label) {
  if (elem) {
    elem.setAttribute('aria-label', label);
  }
}

// Add a new function for addressing table structure issues
function fixTableStructureIssues() {
  document.querySelectorAll('table').forEach(table => {
    // Ensure thead exists; move the first row (assumed header) into it
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.rows[0];
      thead.appendChild(firstRow);
      const tbody = table.querySelector('tbody');
      if (tbody) {
        table.insertBefore(thead, tbody);
      } else {
        table.appendChild(thead);
      }
    }
    // Set scope='col' and role='colheader' on all th elements
    table.querySelectorAll('th').forEach(th => {
      th.setAttribute('scope', 'col');
      th.setAttribute('role', 'colheader');
    });
  });
}

// Add the new function to create in-page navigation (assuming that other functions for handling previous landmark issues are present)
function createInPageNavigation() {
  // ... Kept unchanged
}

// Add the new function: addLangAttribute (REACT_015)
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

// Add the new function: ensureUniqueLandmarks (REACT_025)
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], header, nav, main, aside, footer');
  const seenRoles = new Set();
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (seenRoles.has(role)) {
      // Generate a unique label for duplicate landmarks
      const count = document.querySelectorAll(`[role="${role}"]`).length;
      landmark.setAttribute('aria-label', `${role} ${count}`);
    } else {
      seenRoles.add(role);
    }
  });
}

// Add the new function: fixFakeLinkIssue (REACT_036)
function fixFakeLinkIssue() {
  // Find elements that look like links but aren't (e.g., spans, divs with click handlers)
  const fakeLinks = document.querySelectorAll('[onclick]:not(a):not(button):not([role="link"])');
  fakeLinks.forEach(elem => {
    // Convert to proper link or button
    if (elem.getAttribute('href')) {
      // Has href, make it a proper link
      elem.setAttribute('role', 'link');
      elem.setAttribute('tabindex', '0');
      // Add keyboard support
      elem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          elem.click();
        }
      });
    } else {
      // No href, make it a button
      elem.setAttribute('role', 'button');
      elem.setAttribute('tabindex', '0');
      elem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          elem.click();
        }
      });
    }
  });
}

// Add the new function: addProperLandmarkRegions (referenced in exports)
function addProperLandmarkRegions() {
  // Ensure main landmark exists
  if (!document.querySelector('main, [role="main"]')) {
    const mainContent = document.querySelector('#main-content, .main-content, [role="main"]');
    if (mainContent) {
      mainContent.setAttribute('role', 'main');
    } else {
      // Wrap primary content in main
      wrapPrimaryContentInMain(document.body);
    }
  }
  
  // Ensure banner landmark
  if (!document.querySelector('header, [role="banner"]')) {
    const header = document.querySelector('header, .header, #header');
    if (header) header.setAttribute('role', 'banner');
  }
  
  // Ensure navigation landmarks
  document.querySelectorAll('nav, .nav, #nav, .navigation').forEach((nav, index) => {
    if (!nav.hasAttribute('role')) nav.setAttribute('role', 'navigation');
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
  
  // Ensure contentinfo landmark
  if (!document.querySelector('footer, [role="contentinfo"]')) {
    const footer = document.querySelector('footer, .footer, #footer');
    if (footer) footer.setAttribute('role', 'contentinfo');
  }
  
  // Ensure complementary landmarks
  document.querySelectorAll('aside, .sidebar, .complementary').forEach((aside, index) => {
    if (!aside.hasAttribute('role')) aside.setAttribute('role', 'complementary');
    if (!aside.hasAttribute('aria-label') && !aside.hasAttribute('aria-labelledby')) {
      aside.setAttribute('aria-label', `Complementary ${index + 1}`);
    }
  });
}

// Call the new functions to address accessibility issues
addressAccessibilityIssuesFromInsightReport();
fixTableStructureIssues();
createInPageNavigation();
fixSvgAccessibilityIssues();
fixReactLandmarkIssue();
addLangAttribute();
ensureUniqueLandmarks();
fixFakeLinkIssue();
addProperLandmarkRegions();

// Add the new function: wrapPrimaryContentInMain
function wrapPrimaryContentInMain(primaryContent) {
  // ... Kept unchanged
}

// Add the new function to check if an element is within a landmark
function isWithinLandmark(elem, landmarks) {
  // ... Kept unchanged
}

// Add the new function to wrap an element in a landmark
function wrapInLandmark(elem, landmarkRole) {
  // ... Kept unchanged
}

// Add the new function to fix SVG accessible name issues
function fixSvgAccessibilityIssues() {
  // ... Kept unchanged
}

// Add the new function to address REACT_017 React Landmarks issue
function fixReactLandmarkIssue() {
  // ... Kept unchanged
}

// New functions from origin/main for addressing accessibility issues
function addLandmark(element, role = 'banner', id) {
  if (!id) id = element.id || 'landmark-' + Date.now();
  element.setAttribute('role', role);
  element.setAttribute('id', id);
}

function addAccessibleSvgName(svg, name) {
  if (svg.firstChild && svg.firstChild.nodeName === 'svg') {
    addAccessibleLabel(svg, name);
  }
}

function ensureUniqueLandmarkIds(elements) {
  const ids = new Set();
  elements.forEach((element) => {
    const id = element.id;
    if (ids.has(id)) {
      const index = ids.size + 1;
      element.id = id + '-' + index;
    }
    ids.add(id);
  });
}

function setFakeLinkAsVisible(link) {
  if (link) {
    link.setAttribute('aria-hidden', 'false');
    link.setAttribute('role', 'button');
  }
}

// Helper function to add accessible labels to elements
function addAccessibleLabel(element, label) {
  if (element) {
    element.setAttribute('aria-label', label);
    element.setAttribute('role', 'button');
  }
  return element;
}

// Helper function to announce content changes to screen readers
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

// Helper to trap focus within a container (for modals)
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'a[href], area[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
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
}

// Add the new functions to the exports
module.exports = {
  // ... Kept unchanged
  addressAccessibilityIssuesFromInsightReport: addressAccessibilityIssuesFromInsightReport,
  fixTableStructureIssues: fixTableStructureIssues,
  addProperLandmarkRegions: addProperLandmarkRegions,
  wrapPrimaryContentInMain: wrapPrimaryContentInMain,
  isWithinLandmark: isWithinLandmark,
  wrapInLandmark: wrapInLandmark,
  fixSvgAccessibilityIssues: fixSvgAccessibilityIssues,
  fixReactLandmarkIssue: fixReactLandmarkIssue,
  addLangAttribute: addLangAttribute,
  ensureUniqueLandmarks: ensureUniqueLandmarks,
  fixFakeLinkIssue: fixFakeLinkIssue,
  // New exports from origin/main
  addLandmark: addLandmark,
  addAccessibleSvgName: addAccessibleSvgName,
  ensureUniqueLandmarkIds: ensureUniqueLandmarkIds,
  setFakeLinkAsVisible: setFakeLinkAsVisible,
  addAccessibleLabel: addAccessibleLabel,
  announceToScreenReader: announceToScreenReader,
  trapFocus: trapFocus,
  // ... Kept unchanged
};