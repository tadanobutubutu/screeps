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

// New functions for addressing accessibility issues
function fixTableStructureIssues() {
  // Placeholder for the implementation of fixing table structure issues
}

function ensureUniqueLandmarks() {
  // Placeholder for the implementation of ensuring unique landmark IDs
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
    'a[href], area[href], input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

// Additional accessibility functions referenced in issue
// REACT_015: Add lang attribute to HTML element
function addLangAttribute(lang = 'en') {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

// REACT_017: Add main landmark to page
function addMainLandmark(id = 'main-content') {
  if (typeof document !== 'undefined') {
    const main = document.createElement('main');
    main.setAttribute('id', id);
    return main;
  }
}

// REACT_027: Add scope attribute to table header cells
function addScopeToHeaderCells(table, scope = 'col') {
  if (table && typeof document !== 'undefined') {
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach((th) => {
      th.setAttribute('scope', scope);
    });
  }
}

// REACT_036: Convert fake links (href="#") to accessible buttons
function fixFakeLink(fakeLink) {
  if (!fakeLink || fakeLink.tagName !== 'A') return null;
  
  const href = fakeLink.getAttribute('href');
  if (href !== '#') return null;

  // Create a proper button element to replace the fake link
  const button = document.createElement('button');
  
  // Copy relevant attributes from the link
  if (fakeLink.id) button.id = fakeLink.id;
  if (fakeLink.className) button.className = fakeLink.className;
  if (fakeLink.textContent) button.textContent = fakeLink.textContent;
  
  // Copy inline styles if any
  const inlineStyles = fakeLink.getAttribute('style');
  if (inlineStyles) button.setAttribute('style', inlineStyles);
  
  // Copy data attributes
  Array.from(fakeLink.attributes).forEach(attr => {
    if (attr.name.startsWith('data-')) {
      button.setAttribute(attr.name, attr.value);
    }
  });

  // Replace the fake link with the button
  fakeLink.parentNode.replaceChild(button, fakeLink);
  
  return button;
}

// Find and fix all fake links in the document
function fixAllFakeLinks() {
  if (typeof document === 'undefined') return [];
  
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  const fixedElements = [];
  
  fakeLinks.forEach((link) => {
    const fixed = fixFakeLink(link);
    if (fixed) fixedElements.push(fixed);
  });
  
  return fixedElements;
}

module.exports = {
  app,
  addLandmark,
  addAccessibleSvgName,
  ensureUniqueLandmarkIds,
  setFakeLinkAsVisible,
  addAccessibleLabel,
  announceToScreenReader,
  trapFocus,
  addLangAttribute,
  addMainLandmark,
  addScopeToHeaderCells,
  fixFakeLink,
  fixAllFakeLinks,
  fixTableStructureIssues,
  ensureUniqueLandmarks
};