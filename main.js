// Main module
// Dependency imports
const http = require('http');
const url = require('url');
const { 
  dependencyGraphContent, 
  indexContent, 
  addLangAttribute, 
  fixTableStructureIssues, 
  addMainLandmark, 
  ensureUniqueLandmarks, 
  setSvgAccessibilityProps, 
  addAccessibleNamesToSVGs, 
  fixFakeLinkIssue, 
  fixFakeLinkIssues, 
  fixLandmarkIssues, 
  addLandmarkRegions, 
  uniqueLandmarks, 
  fixImageAltTexts, 
  googleSignIn, 
  ensureElementHasId, 
  ensureElementHasIdOrigin, 
  addAriaLabel, 
  renderDependencyGraphs, 
  fixButtonIdentifiers, 
  fixDependencyGraphAria, 
  addMainLandmarkToIndex, 
  addressAccessibilityIssues 
} = require('./utilities');
const { 
  createInPageButton, 
  createWebResourceButton, 
  validateLandmark, 
  validateLandmarkStructure, 
  validateAccessibilityReport 
} = require('./utilities');

const { main } = require('./utilities');
const { functionA, functionB } = require('./utilities');

// App state for session management
const appState = {
  sessions: new Map()
};

// Helper functions for session management
function getActiveSessionsCount() {
  return appState.sessions.size;
}

function validateSession(sessionId) {
  return appState.sessions.get(sessionId) || null;
}

// Function to validate table accessibility
const validateTableAccessibility = (html) => {
  const issues = [];
  
  // Check if HTML contains tables
  const tableRegex = /<table[^>]*>[\s\S]*?<\/table>/gi;
  let match;
  
  while ((match = tableRegex.exec(html)) !== null) {
    const tableContent = match[0];
    const tableNumber = (html.slice(0, match.index).match(/<table/gi) || []).length + 1;
    
    // Check for caption
    const hasCaption = /<caption[^>]*>[\s\S]*?<\/caption>/i.test(tableContent);
    if (!hasCaption) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} is missing a <caption> element for accessibility`,
        suggestion: 'Add a <caption> element immediately after the <table> tag to describe the purpose of the table'
      });
    }
    
    // Check for th elements
    const hasHeaders = /<th[^>]*>/i.test(tableContent);
    if (!hasHeaders) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} appears to be a data table but has no <th> (table header) elements`,
        suggestion: 'Add <th> elements for column or row headers to improve accessibility for screen readers'
      });
    }
    
    // Check for scope attributes on th elements
    const thMatches = tableContent.match(/<th[^>]*>/gi) || [];
    thMatches.forEach((thTag, index) => {
      if (!thTag.includes('scope=')) {
        issues.push({
          type: 'table',
          severity: 'info',
          message: `Table ${tableNumber} header ${index + 1} is missing a 'scope' attribute`,
          suggestion: 'Add scope="col", scope="row", scope="rowgroup", or scope="colgroup" to <th> elements'
        });
      }
    });
    
    // Check for thead and tbody structure
    const hasThead = /<thead[^>]*>[\s\S]*?<\/thead>/i.test(tableContent);
    const hasTbody = /<tbody[^>]*>[\s\S]*?<\/tbody>/i.test(tableContent);
    
    if (!hasThead) {
      issues.push({
        type: 'table',
        severity: 'info',
        message: `Table ${tableNumber} is missing <thead> element`,
        suggestion: 'Wrap header rows in a <thead> element for better semantic structure'
      });
    }
    
    if (!hasTbody) {
      issues.push({
        type: 'table',
        severity: 'info',
        message: `Table ${tableNumber} is missing <tbody> element`,
        suggestion: 'Wrap data rows in a <tbody> element for better semantic structure'
      });
    }
    
    // Check for id and headers attributes for complex tables
    const thElements = tableContent.match(/<th[^>]*>/gi) || [];
    const hasMultipleHeaders = thElements.length > 1;
    if (hasMultipleHeaders) {
      const hasHeadersAttr = /headers=["'][^"']+["']/i.test(tableContent);
      const hasIdAttr = /<th[^>]*\sid=["'][^"']+["'][^>]*>/i.test(tableContent) || /<td[^>]*\sid=["'][^"']+["'][^>]*>/i.test(tableContent);
      
      if (!hasIdAttr && !hasHeadersAttr) {
        issues.push({
          type: 'table',
          severity: 'warning',
          message: `Table ${tableNumber} has multiple headers but may not have proper id/headers associations`,
          suggestion: 'For complex tables, ensure header cells have unique id attributes and data cells have headers attributes referencing those ids'
        });
      }
    }
  }
  
  return issues;
};

// Re-add the required exports for functionA and functionB
// Assuming that they are objects with properties X, Y, and Z
const { functionA: exportedFunctionA, functionB: exportedFunctionB } = require('./utilities');

// Focus trap function for keyboard navigation
function trapFocus(containerElement) {
  if (!containerElement || typeof containerElement !== 'object') {
    return null;
  }

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const focusableElements = containerElement.querySelectorAll(focusableSelectors);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  let previouslyFocused = null;

  function handleKeyDown(event) {
    if (event.key !== 'Tab') {
      return;
    }

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  function activateTrap() {
    previouslyFocused = document.activeElement;
    if (firstFocusable) {
      firstFocusable.focus();
    }
    containerElement.addEventListener('keydown', handleKeyDown);
  }

  function deactivateTrap() {
    containerElement.removeEventListener('keydown', handleKeyDown);
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }
  }

  return {
    activate: activateTrap,
    deactivate: deactivateTrap,
    getFocusableElements: () => focusableElements
  };
}

// Export for testing
module.exports = {
  validateTableAccessibility,
  trapFocus,
  getActiveSessionsCount,
  validateSession,
  appState,
  exportedFunctionA,
  exportedFunctionB
};