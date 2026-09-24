const fs = require('fs');
const main = require('./utilities');

const {
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader,
  handleKeyboardNav,
  newFocusTrap: originNewFocusTrap,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse,
  ensureElementId: ensureElementIdOrigin,
  ensureElementHasIdOrigin,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  transformInputData,
  addSvgAccessibleName,
  initSkipLink,
  trapFocus,
  announceToScreenReader: originalAnnounceToScreenReader,
  newFocusTrap,
  ensureElementId,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addAriaLabel
} = main;

// Helper function to fix fake links (REACT_036 - React Fake Link)
const fixFakeLinks = (container) => {
  const fakeLinks = container.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    if (!link.hasAttribute('role') || link.getAttribute('role') !== 'button') {
      link.setAttribute('role', 'button');
    }
    if (!link.hasAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
  });
  return fakeLinks.length;
};

// Helper function to ensure unique landmarks (REACT_025 - React Unique Landmarks)
const ensureUniqueLandmarks = (container) => {
  const landmarks = container.querySelectorAll('header, nav, main, footer, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]');
  const seenTypes = {};
  let fixedCount = 0;
  
  landmarks.forEach(landmark => {
    const tag = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || '';
    const key = `${tag}-${role}`;
    
    if (seenTypes[key]) {
      // Remove duplicate landmark role, keep the element but without landmark role
      if (landmark.hasAttribute('role')) {
        landmark.removeAttribute('role');
        fixedCount++;
      }
    } else {
      seenTypes[key] = true;
    }
  });
  
  return fixedCount;
};

// Helper function to ensure landmarks have accessible names (REACT_017 - React Landmarks)
const ensureLandmarksHaveNames = (container) => {
  const landmarks = container.querySelectorAll('header, nav, main, footer, aside, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
  let fixedCount = 0;
  
  landmarks.forEach(landmark => {
    const hasLabel = landmark.hasAttribute('aria-label') || 
                     landmark.hasAttribute('aria-labelledby') ||
                     landmark.hasAttribute('title');
    
    if (!hasLabel) {
      // Add aria-label based on landmark type
      const tag = landmark.tagName.toLowerCase();
      const role = landmark.getAttribute('role');
      
      if (tag === 'nav' || role === 'navigation') {
        landmark.setAttribute('aria-label', 'Navigation');
      } else if (tag === 'aside' || role === 'complementary') {
        landmark.setAttribute('aria-label', 'Complementary content');
      } else if (tag === 'header' || role === 'banner') {
        landmark.setAttribute('aria-label', 'Header');
      } else if (tag === 'footer' || role === 'contentinfo') {
        landmark.setAttribute('aria-label', 'Footer');
      }
      fixedCount++;
    }
  });
  
  return fixedCount;
};

const accessibilityUtils = {
  initSkipLink,
  trapFocus,
  newFocusTrap: (element) => {
    if (!element) return;
    const focusable = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleTab = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    
    element.addEventListener('keydown', handleTab);
    return () => element.removeEventListener('keydown', handleTab);
  },
  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },
  ensureElementId,
  addAriaLabel,
  addLangAttribute,
  addSvgAccessibleName,
  getSvgAccessibleName,
  getLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addMainLandmarkToIndex,
  validateLandmarkStructure,
  fixFakeLinks,
  ensureUniqueLandmarks,
  ensureLandmarksHaveNames
};

module.exports = {
  ...main,
  ...accessibilityUtils,
};