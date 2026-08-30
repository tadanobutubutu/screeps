import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Main entry point for the React application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Accessibility enhancement: Set lang attribute on document
document.documentElement.lang = 'en';

// Helper function to generate unique IDs for accessibility attributes
export const generateId = (prefix = 'a11y') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Accessibility helper: Announce messages to screen readers
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};

// Skip link functionality for keyboard navigation
export const initSkipLinks = () => {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
};

// Initialize accessibility features on mount
if (typeof window !== 'undefined') {
  window.addEventListener('load', initSkipLinks);
}

// Add new function to address the accessibility issue REACT_043: Make header focusable
export const makeHeaderFocusable = () => {
  // code to make the header element focusable
  // Example: Adding tabindex to the header
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('tabindex', '0');
  }
};

// New function or changes requested
export const addressAccessibilityIssues = (insightReport) => {
  // Handle case where insightReport is null, undefined, or not an object
  if (!insightReport || typeof insightReport !== 'object') {
    console.warn('Invalid insight report provided to addressAccessibilityIssues');
    return;
  }

  const accessibilityIssues = insightReport.accessibility || [];

  if (!Array.isArray(accessibilityIssues) || accessibilityIssues.length === 0) {
    console.log('No accessibility issues found in the insight report');
    return;
  }

  console.log(`Found ${accessibilityIssues.length} accessibility issues:`);

  accessibilityIssues.forEach((issue, index) => {
    if (issue && typeof issue === 'object') {
      const description = issue.description || 'No description available';
      const severity = issue.severity || 'unknown';
      const impact = issue.impact || 'unknown';
      const selector = issue.selector || 'unknown selector';

      console.log(`Issue ${index + 1}:`);
      console.log(`  Description: ${description}`);
      console.log(`  Severity: ${severity}`);
      console.log(`  Impact: ${impact}`);
      console.log(`  Selector: ${selector}`);

      // Attempt to address the issue based on type
      if (issue.type) {
        switch (issue.type) {
          case 'color-contrast':
            console.log('  Action: Consider adjusting color contrast for better visibility');
            break;
          case 'alt-text':
            console.log('  Action: Add or improve alt text for images');
            break;
          case 'aria-label':
            console.log('  Action: Add or improve aria-label attributes');
            break;
          case 'heading-order':
            console.log('  Action: Review and fix heading hierarchy order');
            break;
          default:
            console.log(`  Action: Review and address ${issue.type} issue`);
        }
      }

      console.log('---');
    }
  });
};

// Merge the code from both branches
export const fixFakeLinkIssues = () => {
  // Fix fake link issues
};

export const createAccessibleLink = () => {
  // Create accessible link
};

export const validateLinkAccessibility = () => {
  // Existing code...
};

export const handleFakeLinks = () => {
  // Existing code...
};

// New function to fix accessibility issues as per the insight report
export const fixAccessibilityIssues = () => {
  document.documentElement.setAttribute('lang', getLangAttribute());
  createInPageButton();
  const table = document.getElementById('myTable');
  if (table) {
    validateTableAccessibility(table);
    validateTableStructure(table);
  }
  validateLandmark();
  validateLandmarkStructure();
  const svg = document.getElementById('mySvg');
  if (svg) {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
  }
  validateLinkAccessibility();
  handleFakeLinks();
  // Note: addressAccessibilityIssues requires an insightReport parameter, so it's called separately when needed
};

// Note: The following functions are referenced in fixAccessibilityIssues but not defined in the provided code.
// They should be implemented or imported from appropriate modules:
// - getLangAttribute
// - createInPageButton
// - validateTableAccessibility
// - validateTableStructure
// - validateLandmark
// - validateLandmarkStructure
// - getSvgAccessibleName
// - setSvgAttributes