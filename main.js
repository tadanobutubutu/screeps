const main = require('./utilities')

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility
} = main

import React from 'react'
import { render } from 'react-dom'
import {
  googleSignIn,
  decodeJwtResponse
} from './AccessibilityHelpers'

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport (container, report) {
  if (!report || !report.issues) {
    return;
  }

  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  }

  // Add lang attribute to HTML element if missing
  const htmlEl =
    document.documentElement ||
    (container.ownerDocument && container.ownerDocument.documentElement)
  if (htmlEl) {
    if (!htmlEl.lang) {
      htmlEl.lang = 'en';
      fixes.langAdded = true;
    }
  }

  // Add main landmark if missing
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    const body = container.querySelector('body');
    if (body) {
      const newMain = document.createElement('main');
      body.insertBefore(newMain, body.firstChild);
      fixes.mainLandmarkAdded = true;
    }
  }

  // Update the existing function using the new functions for rendering graph/index
  renderDependencyGraphs(container)
  fixButtonIdentifiers(container)

  addressAccessibilityIssues(container, {
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    addAriaLabel
  });

  // Fix landmark issues
  validateLandmark(container);

  // Fix SVG accessible names
  const svgElements = container.querySelectorAll('svg');
  [...svgElements].forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-labelledby', svg.id || `svg-${Math.random().toString(36).substr(2, 9)}`);
      const titleId = `${svg.id || 'svg'}-title`;
      svg.setAttribute('aria-labelledby', titleId);
      svg.appendChild(document.createElement('title')).id = titleId;
      fixes.svgNamesAdded++;
    }
  });

  // Fix fake link issues (elements that look like links but are missing href)
  const fakeLinks = container.querySelectorAll(
    'button:not([aria-haspopup]):not([aria-controls]):not([aria-expanded]):not([aria-label]):not([aria-labelledby])'
  );
  [...fakeLinks].forEach(fakeLink => {
    fakeLink.setAttribute('aria-label', 'link');
    fixes.fakeLinksFixed++;
  });

  // Validate accessibility report
  const accessibilityReport = checkAccessibility(container);
  if (accessibilityReport && accessibilityReport.length > 0) {
    console.log(`Accessibility report contains ${accessibilityReport.length} remaining issues`);
  }

  if (fixes.langAdded) {
    console.log('Lang attribute added to HTML element');
  }

  if (fixes.mainLandmarkAdded) {
    console.log('Main landmark added');
  }

  // Check for new accessibility issues
  const newAccessibilityIssues = checkAccessibility(container);
  if (newAccessibilityIssues.length > 0) {
    console.log(`New accessibility issues found: ${newAccessibilityIssues.join(', ')}`);
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0;
  if (landmarkFixesCount > 0) {
    console.log(`Fixed ${landmarkFixesCount} unique landmarks`);
  }

  const svgFixes = fixes.svgNamesAdded || 0;
  if (svgFixes > 0) {
    console.log(`Fixed accessible names for ${svgFixes} SVGs`);
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0;
  if (fakeLinkFixes > 0) {
    console.log(`Fixed fake link issues for ${fakeLinkFixes} elements`);
  }

  googleSignIn();
  fixButtonIdentifiers();
}

// Implement the function for addressing accessibility issues from insight report
function checkAccessibilityForReport (content) {
  // Placeholder for accessibility checking logic
  // This function should be implemented to check for accessibility issues
  // For now, it just returns an empty array
  return [];
}

// New rendering function
function renderGraphIndex(content, options = {}) {
  return content;
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  return function(e) {
    const isTab = e.key === 'Tab';
    if (!isTab) return;
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
}

module.exports = {
  createInPageButton,
  createWebResourceButton,
  implementAccessibilityFixesFromReport,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility,
  checkAccessibilityForReport,
  renderGraphIndex,
  trapFocus
};