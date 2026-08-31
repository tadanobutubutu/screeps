const http = require('http');
const url = require('url');
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');
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
  handleCredentialResponse,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  addressAccessibilityIssues
} = require('./utilities');
const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport } = require('./utilities');
const { main } = require('./utilities');
const { functionA, functionB } = require('./functionModule');

// Function to validate table accessibility
const validateTableAccessibility = (html) => {
  const issues = [];
  
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let match;
  
  while ((match = tableRegex.exec(html)) !== null) {
    const tableContent = match[0];
    const tableNumber = (html.slice(0, match.index).match(/<table/gi) || []).length + 1;
    
    const hasCaption = /<caption[^>]*>[\s\S]*?<\/caption>/i.test(tableContent);
    if (!hasCaption) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} is missing a <caption> element for accessibility`,
        suggestion: 'Add a <caption> element immediately after the <table> tag to describe the purpose of the table'
      });
    }
    
    const hasHeaders = /<th[^>]*>/i.test(tableContent);
    if (!hasHeaders) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} appears to be a data table but has no <th> (table header) elements`,
        suggestion: 'Add <th> elements for column or row headers to improve accessibility for screen readers'
      });
    }
    
    const thMatches = tableContent.match(/<th[^>]*>/gi) || [];
    thMatches.forEach((thTag, index) => {
      if (!/scope=["'](row|col|rowgroup|colgroup)["']/i.test(thTag)) {
        issues.push({
          type: 'table',
          severity: 'info',
          message: `Table ${tableNumber} header ${index + 1} is missing a 'scope' attribute`,
          suggestion: 'Add scope="col", scope="row", scope="rowgroup", or scope="colgroup" to <th> elements'
        });
      }
    });
    
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
    
    const hasMultipleHeaders = (tableContent.match(/<th/gi) || []).length > 1;
    if (hasMultipleHeaders) {
      const hasHeadersAttr = /headers=["'][^"']+["']/.test(tableContent);
      const hasIdAttr = /id=["'][^"']+["']/.test(tableContent.replace(/<th/gi, '<td'));
      
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
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    return { status: 'error', message: 'Invalid credential response' };
  }
  return { status: 'success', credential: credentialResponse };
}

const a11yStore = {
  addSVGAccessibilityProps: setSvgAccessibilityProps,
  addAccessibleNamesToSVGs: addAccessibleNamesToSVGs,
  fixTableStructureIssues: fixTableStructureIssues,
  fixFakeLinkIssues: fixFakeLinkIssues,
  fixLandmarkIssues: fixLandmarkIssues,
  addLandmarkRegions: addLandmarkRegions,
  fixImageAltTexts: fixImageAltTexts,
  googleSignIn: googleSignIn,
  handleCredentialResponse: handleCredentialResponse,
  ensureElementHasId: ensureElementHasId,
  ensureElementHasIdOrigin: ensureElementHasIdOrigin,
  addAriaLabel: addAriaLabel,
  renderDependencyGraphs: renderDependencyGraphs,
  fixButtonIdentifiers: fixButtonIdentifiers,
  fixDependencyGraphAria: fixDependencyGraphAria,
  addMainLandmarkToIndex: addMainLandmarkToIndex,
  addressAccessibilityIssues: addressAccessibilityIssues,
  createInPageButton: createInPageButton,
  createWebResourceButton: createWebResourceButton,
  validateLandmark: validateLandmark,
  validateLandmarkStructure: validateLandmarkStructure,
  validateAccessibilityReport: validateAccessibilityReport,
  main: main,
  functionA: functionA,
  functionB: functionB,
  a11yStoreContent: dependencyGraphContent,
  indexContent: indexContent,
  prefersReducedMotion() {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  },

  prefersHighContrast() {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-contrast: more)').matches;
    }
    return false;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (typeof document === 'undefined') return;
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  createLiveRegion() {
    if (typeof document === 'undefined') return;
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
    this.liveRegion = liveRegion;
  },

  announce(message, priority) {
    if (typeof document === 'undefined' || !this.liveRegion) return;
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element, elemIndex) => {
      const landmarks = document.querySelectorAll(`[role="${element}"], ${element}`);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '' || !landmark.id) {
          landmark.setAttribute('id', `${element}-${elemIndex}-${index}`);
        }

        if (landmarks.length > 1) {
          if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', element);
          }
        }
      });
    });
  }
};

// Existing rendering functions (preserving existing exports and functions)
const renderGraphIndex = (graphData) => {
  renderDependencyGraphs(graphData);
  a11yStore.addSVGAccessibilityProps();
  a11yStore.addAccessibleNamesToSVGs();
  a11yStore.fixTableStructureIssues();
  a11yStore.fixFakeLinkIssues();
  a11yStore.fixLandmarkIssues();
  a11yStore.addLandmarkRegions();
  a11yStore.fixImageAltTexts();
  a11yStore.ensureElementHasId();
  a11yStore.addMainLandmarkToIndex();
  a11yStore.checkLandmarkElements();
};

module.exports = {
  http,
  url,
  validateTableAccessibility,
  appState,
  getActiveSessionsCount,
  validateSession,
  handleCredentialResponse,
  a11yStore,
  renderGraphIndex,
  renderDependencyGraphs,
  main,
  functionA,
  functionB
};