import React from 'react';
import { render } from 'react-dom';
import { addLangAttribute, fixTableStructure, fixLandmarkIssues, addMainLandmark, addLandmarkRegions, ensureUniqueLandmarks, uniqueLandmarks, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, googleSignIn, decodeJwtResponse, fixButtonIdentifiers, ensureElementHasId, addAriaLabel, renderDependencyGraphs } from './AccessibilityHelpers';

// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

// Accessibility utilities
const accessibility = {
  // Ensure keyboard navigation for custom components
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  },

  // Announce changes to screen readers
  announce(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      announcer.textContent = message;
      setTimeout(() => document.body.removeChild(announcer), 1000);
    }, 100);
  },

  // Handle escape key for modal/dialog close
  handleEscapeKey(callback) {
    const handler = (e) => {
      if (e.key === 'Escape') {
        callback();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  },

  // Reduce motion for users who prefer it
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};

// Initialize accessibility features
function initAccessibility() {
  // Add skip link functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.tabIndex = -1;
        target.focus();
        e.preventDefault();
      }
    });
  }

  // Ensure all images have alt attributes
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      console.warn('Accessibility: Image missing alt attribute');
    }
  });

  // Ensure form inputs have associated labels
  document.querySelectorAll('input, select, textarea').forEach((input) => {
    if (!input.id) return;
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label && !input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
      console.warn(`Accessibility: Input ${input.id || input.name} missing label`);
    }
  });
}

// Access the dependencyGraph container and ensure it has proper ARIA role
const dependencyGraph = document.getElementById('dependencyGraph');

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

// Required changes to fix the React SVG Accessible Name issue
function addAccessibleName(svgString) {
  // This function adds an `aria-label` attribute to the SVG if it doesn't already have one
  // and returns the modified SVG string.
  // Note: This is a simplified example and might need adjustments based on the actual SVG structure.
  const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const svgElement = svg.documentElement;
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG');
  }
  return new XMLSerializer().serializeToString(svg);
}

// Example usage of the function
const originalSvgString = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>';
const modifiedSvgString = addAccessibleName(originalSvgString);

// Export functions
module.exports = {
  accessibility,
  initAccessibility
};