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
function addLandmark(element, role = 'banner', id) {
  if (!id) id = element.id || 'landmark-' + Date.now();
  element.setAttribute('role', role);
  element.setAttribute('id', id);
}

function addAccessibleSvgName(svg, name) {
  if (svg.firstChild && svg.nodeName === 'svg') {
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
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

module.exports = app;