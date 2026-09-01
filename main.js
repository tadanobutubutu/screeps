// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report

// TODO: Add back any required exports that might have been removed
// TODO: Identify and update specific functions as needed
// Main module
// Dependency imports
const http = require('http');
const url = require('url');

// Accessibility utilities exports
const { 
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
  handleCredentialResponse: handleCredentialResponseUtil, 
  ensureElementHasId, 
  ensureElementHasIdOrigin, 
  addAriaLabel, 
  renderDependencyGraphs, 
  fixButtonIdentifiers, 
  fixDependencyGraphAria, 
  addMainLandmarkToIndex, 
  addressAccessibilityIssues,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  dependencyGraphContent,
  indexContent,
  functionA,
  functionB,
  main
} = require('./utilities');

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
    const hasHeaders = /<th[^>]*>[\s\S]*?<\/th>/i.test(tableContent);
    if (!hasHeaders) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} appears to be a data table but has no <th> (table header) elements`,
        suggestion: 'Add <th> elements for column or row headers to improve accessibility for screen readers'
      });
    }
    
    // Check for scope attributes on th elements
    const thMatches = (tableContent.match(/<th[^>]*>[\s\S]*?<\/th>/gi) || []);
    thMatches.forEach((thTag, index) => {
      if (!/scope\s*=/i.test(thTag)) {
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
    const thElements = tableContent.match(/<th[^>]*>[\s\S]*?<\/th>/gi) || [];
    const hasMultipleHeaders = thElements.length > 1;
    if (hasMultipleHeaders) {
      const hasHeadersAttr = /headers\s*=/i.test(tableContent);
      const hasIdAttr = /<th[^>]*id\s*=/i.test(tableContent);
      
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

function handleCredentialResponse(credentialResponse) {
  // Process credential response - basic implementation
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    return { status: 'error', message: 'Invalid credential response' };
  }
  return { status: 'success', credential: credentialResponse };
}

const a11yStore = {
  liveRegion: null,
  
  setLiveRegion(element) {
    this.liveRegion = element;
  },
  
  getLiveRegion() {
    return this.liveRegion;
  },
  
  prefersReducedMotion() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },
  
  announce(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';
    // Force reflow to ensure announcement
    void this.liveRegion.offsetHeight;
    this.liveRegion.textContent = message;
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    const results = [];
    
    landmarkElements.forEach((element) => {
      if (typeof document === 'undefined') return;
      const landmarks = document.querySelectorAll(element);
      landmarks.forEach((landmark, index) => {
        if (!landmark.id) {
          landmark.id = `${element}-${index}`;
        }

        if (landmarks.length > 1 && element === 'main') {
          landmark.setAttribute('aria-label', landmark.id);
        }
      });
    });
    
    return results;
  },

  validateFocusManagement() {
    const focusableElements = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    if (typeof document === 'undefined') return { valid: true };
    
    const focusable = document.querySelectorAll(focusableElements);
    return { valid: focusable.length > 0 };
  },

  getTheme() {
    return this._theme || 'light';
  },

  setTheme(theme) {
    this._theme = theme;
  }
};

// Export all accessibility-related functions and utilities
module.exports = {
  // Accessibility functions
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
  handleCredentialResponse,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  addressAccessibilityIssues,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  validateTableAccessibility,
  
  // Content functions
  dependencyGraphContent,
  indexContent,
  
  // Core functions
  main,
  functionA,
  functionB,
  
  // Session management
  appState,
  getActiveSessionsCount,
  validateSession,
  
  // Accessibility store
  a11yStore
};