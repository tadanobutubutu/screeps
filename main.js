// main.js - Application entry point with accessibility improvements

// Import required modules
import { v4 as uuidv4 } from 'uuid';
import { createElement } from 'react';
import { getDocument, getLangAttribute } from '.';
import { createInPageButton, handleAccessibilityIssues, createAccessibleLink } from "yourNewModule";
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// Utility functions for the application

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function capitalizeFirstLetter(string) {
  if (typeof string !== 'string' || string.length === 0) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Function to trigger accessibility mode
function triggerAccessibilityMode() {
  const doc = getDocument();
  if (doc) {
    doc.body.setAttribute('data-accessibility-mode', 'enabled');
  }
}

// Implement the handleErrorState function to handle the new accessibility issue
function handleErrorState(errorElement, container, trigger = false) {
  if (!errorElement) return;

  const doc = getDocument();
  if (!doc) return;

  // Wrap the error in a <section> element
  const errorSection = doc.createElement('section');
  errorSection.setAttribute('role', 'alert');
  errorSection.setAttribute('aria-live', 'assertive');

  if (typeof errorElement === 'string') {
    errorSection.textContent = errorElement;
  } else {
    errorSection.appendChild(errorElement);
  }

  if (container) {
    const errorContainer = doc.createElement('div');
    errorContainer.setAttribute('class', 'error-container');
    errorContainer.setAttribute('role', 'alert');
    errorContainer.appendChild(errorSection);
    container.appendChild(errorContainer);
  }

  // If trigger is true, trigger the accessibility mode
  if (trigger) {
    triggerAccessibilityMode();
  }
}

// Implement the handleAccessibilityError function that wraps handleErrorState with triggering the accessibility mode
function handleAccessibilityError(errorElement, container) {
  handleErrorState(errorElement, container, true);
}

// Function to render dependency graph using dependencyGraphContent
function renderDependencyGraph(container) {
  createInPageButton();
  handleAccessibilityIssues(dependencyGraphContent(getDocument(), container));
}

// Function to render index view using indexContent
function renderIndexView(container) {
  createInPageButton();
  handleAccessibilityIssues(indexContent(getDocument(), container));
}

// Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----
// TODO: Any additional changes requested in the issue
// main.js - Accessibility improvements implementation

// Accessibility utilities
const AccessibilityManager = {
  // Live region for screen reader announcements
  createLiveRegion() {
    const region = document.createElement('div');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('role', 'status');
    region.className = 'sr-only';
    region.id = 'live-region';
    document.body.appendChild(region);
    return region;
  },

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    const region = document.getElementById('live-region') || this.createLiveRegion();
    region.setAttribute('aria-live', priority);
    region.textContent = '';
    setTimeout(() => {
      region.textContent = message;
    }, 100);
  },

  // Focus management - move focus to target element
  focusElement(selector) {
    const element = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;
    if (element && typeof element.focus === 'function') {
      element.focus();
      return true;
    }
    return false;
  },

  // Trap focus within a container (for modals/dialogs)
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  },

  // Handle escape key to close modals
  handleEscapeKey(callback) {
    return (e) => {
      if (e.key === 'Escape') {
        callback();
      }
    };
  },

  // Reduce motion preference detection
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // High contrast mode detection
  isHighContrastMode() {
    return window.matchMedia('(forced-colors: active)').matches;
  }
};

// TODO: Implement the required changes to improve accessibility
// Placeholder implementation – actual accessibility enhancements would be added here

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AccessibilityManager
  };
}

// Global accessibility object
window.AccessibilityManager = AccessibilityManager;

export { addLangAttribute, ensureElementId, handleAccessibilityError, handleErrorState, renderDependencyGraph, renderIndexView, getFullLangAttribute, AccessibilityManager };