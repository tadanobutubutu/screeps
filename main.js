// TODO: Add back any required exports that might have been removed
// TODO: Identify and update specific functions as needed
// Main module
// Dependency imports
const http = require('http');
const url = require('url');
const { dependencyGraphContent } = require('./content');
const { indexContent } = require('./content');
const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, addressAccessibilityIssues } = require('./utilities');
const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport } = require('./utilities');

const { main } = require('./utilities');
const { functionA, functionB } = require('./functions');

// Function to validate table accessibility
const validateTableAccessibility = (html) => {
  const issues = [];
  
  // Check if HTML contains tables
  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  let match;
  let tableCount = 0;
  
  while ((match = tableRegex.exec(html)) !== null) {
    const tableContent = match[0];
    tableCount++;
    const tableNumber = tableCount;
    
    // Check for caption
    const hasCaption = /<caption[\s\S]*?<\/caption>/i.test(tableContent);
    if (!hasCaption) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} is missing a <caption> element for accessibility`,
        suggestion: 'Add a <caption> element immediately after the <table> tag to describe the purpose of the table'
      });
    }
    
    // Check for th elements
    const hasHeaders = /<th[\s\S]*?>/i.test(tableContent);
    if (!hasHeaders) {
      issues.push({
        type: 'table',
        severity: 'warning',
        message: `Table ${tableNumber} appears to be a data table but has no <th> (table header) elements`,
        suggestion: 'Add <th> elements for column or row headers to improve accessibility for screen readers'
      });
    }
    
    // Check for scope attributes on th elements
    const thMatches = tableContent.match(/<th[\s\S]*?>/gi) || [];
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
    const hasThead = /<thead[\s\S]*?>/i.test(tableContent);
    const hasTbody = /<tbody[\s\S]*?>/i.test(tableContent);
    
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
    const hasMultipleHeaders = (thMatches || []).length > 1;
    if (hasMultipleHeaders) {
      const hasHeadersAttr = /headers=["'][^"']*["']/i.test(tableContent);
      const hasIdAttr = /<th[^>]*\sid=["'][^"']*["'][^>]*>/i.test(tableContent);
      
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

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.setAttribute('role', 'status');
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.className = 'sr-only';
      document.body.appendChild(this.liveRegion);
    }
    this.announce(message, priority);
  },

  announce(message, priority = 'polite') {
    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = '';
      setTimeout(() => {
        this.liveRegion.textContent = message;
      }, 100);
    }
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmarks = document.querySelectorAll(element);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.id = `${element}-${index + 1}`;
        }

        if (landmarks.length > 1) {
          if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', `${element} section ${index + 1}`);
          }
        }
      });
    });
  }
};

/**
 * Focus trap implementation for keyboard navigation
 * Keeps focus within a specified container element
 */
function newFocusTrap(container) {
  if (!container || typeof container !== 'object') {
    throw new Error('newFocusTrap requires a valid container element');
  }

  const focusableSelectors = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  let containerElement = container;
  
  // If container is a string selector, get the element
  if (typeof container === 'string') {
    containerElement = document.querySelector(container);
    if (!containerElement) {
      throw new Error(`newFocusTrap: Element not found for selector: ${container}`);
    }
  }

  let isActive = false;
  let previousActiveElement = null;

  const getFocusableElements = () => {
    return Array.from(containerElement.querySelectorAll(focusableSelectors))
      .filter(el => {
        return el.offsetParent !== null; // Element is visible
      });
  };

  const handleKeyDown = (event) => {
    if (!isActive || event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  const activate = () => {
    if (isActive) return;
    
    isActive = true;
    previousActiveElement = document.activeElement;
    
    // Set tabindex on container if not already focusable
    if (!containerElement.hasAttribute('tabindex')) {
      containerElement.setAttribute('tabindex', '-1');
    }
    
    // Focus the container or first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      containerElement.focus();
    }
    
    document.addEventListener('keydown', handleKeyDown);
  };

  const deactivate = () => {
    if (!isActive) return;
    
    isActive = false;
    document.removeEventListener('keydown', handleKeyDown);
    
    // Return focus to previously active element
    if (previousActiveElement && previousActiveElement.focus) {
      previousActiveElement.focus();
    }
  };

  const destroy = () => {
    deactivate();
    containerElement = null;
  };

  return {
    activate,
    deactivate,
    destroy,
    isActive: () => isActive
  };
}

module.exports = {
  validateTableAccessibility,
  getActiveSessionsCount,
  validateSession,
  handleCredentialResponse,
  a11yStore,
  newFocusTrap,
  appState
};