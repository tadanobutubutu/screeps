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
  ensureElementIdOrigin,
  ensureElementId,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  transformInputData
} = main;

const accessibilityUtils = {
  initSkipLink: () => {
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
  },

  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
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

  newFocusTrap: (element) => {
    if (!element) return originNewFocusTrap(element);
    const focusable = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    });
  },

  addLandmarkToDocument: (landmarkRole, landmarkName, container = document.body) => {
    const landmark = document.createElement('div');
    landmark.setAttribute('role', landmarkRole);
    landmark.setAttribute('aria-label', landmarkName);
    container.appendChild(landmark);
    return landmark;
  },

  getUniqueLandmarkIndex: (landmarks) => {
    let index = 0;
    const map = new Map();

    for (let i = 0; i < landmarks.length; i++) {
      const landmark = landmarks[i];

      if (!map.has(landmark.id)) {
        map.set(landmark.id, true);
        index++;
      }
    }

    return index;
  },

  addUniqueIdsToLandmarks: (landmarks) => {
    let index = 0;
    const map = new Map();

    for (let i = 0; i < landmarks.length; i++) {
      const landmark = landmarks[i];

      if (!map.has(landmark.id)) {
        landmark.id = `landmark-${index++}`;
        map.set(landmark.id, true);
      }
    }
  },

  findNonUniqueLandmark: (landmarks) => {
    const seenIds = new Set();
    let nonUniqueLandmark = null;

    for (let i = 0; i < landmarks.length; i++) {
      const landmark = landmarks[i];

      if (seenIds.has(landmark.id)) {
        nonUniqueLandmark = landmark;
        break;
      }

      seenIds.add(landmark.id);
    }

    return nonUniqueLandmark;
  }
};

function addLandmark(container, role, name) {
  return accessibilityUtils.addLandmarkToDocument(role, name, container);
}

function validateAndAssignLandmarkRole(element) {
  if (element.getAttribute('role') !== undefined) return;
  if (element.tagName === 'MAIN') {
    const mainLandmark = accessibilityUtils.addLandmarkToDocument('main', 'Main content');
    mainLandmark.appendChild(element);
    element.setAttribute('id', 'main-content');
    return;
  }

  const landmarks = document.querySelectorAll('[role="main"], [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"], [role="footer"]');
  const uniqueIndex = accessibilityUtils.getUniqueLandmarkIndex(landmarks);
  accessibilityUtils.addLandmarkToDocument(element.getAttribute('role') || 'region', `landmark-${uniqueIndex}`, element.parentNode);
  element.setAttribute('id', `landmark-${uniqueIndex}`);
}

// Adjust the following functions to resolve the issues regarding duplicate landmarks
function validateLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"], [role="footer"]');

  if (landmarks.length === 6) {
    accessibilityUtils.addUniqueIdsToLandmarks(landmarks);
    return;
  }

  const nonUniqueLandmark = accessibilityUtils.findNonUniqueLandmark(landmarks);

  if (nonUniqueLandmark) {
    nonUniqueLandmark.setAttribute('id', nonUniqueLandmark.id || `landmark-${Math.random().toString(36).substr(2, 9)}`);
  }
}

function fixFakeLinkIssue(links) {
  links.forEach((link) => {
    if (!link.getAttribute('href')) {
      link.setAttribute('role', 'button');
      link.setAttribute('aria-label', 'Fake link');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        announceToScreenReader(`Clicked on non-link: ${link.textContent}`);
      });
    }
  });
}

// Rest of the code...