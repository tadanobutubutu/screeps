// Import required module(s) - for fixing table structure issues and SVG accessibility issues
import './table-styles.css';

// main.js - Entry point for the application

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// Ensure all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
// Update or create the affected functions to be accessible
// Address additional accessibility issues by fixing table structure issues

export function ensureUniqueLandmarks(landmarks, prefix = 'landmark') {
  if (!landmarks || !Array.isArray(landmarks)) {
    throw new Error('Landmarks array is required');
  }

  const ids = [];
  const usedIds = new Set();

  landmarks.forEach((landmark, index) => {
    if (!landmark) {
      return;
    }

    if (landmark.id) {
      if (usedIds.has(landmark.id)) {
        const newId = `${prefix}-${index}`;
        landmark.id = newId;
        usedIds.add(newId);
        ids.push(newId);
      } else {
        usedIds.add(landmark.id);
        ids.push(landmark.id);
      }
    } else {
      let generatedId = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      while (usedIds.has(generatedId)) {
        generatedId = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      landmark.id = generatedId;
      usedIds.add(generatedId);
      ids.push(generatedId);
    }
  });

  return ids;
}

export function setLanguageAttribute(languageCode) {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.lang = languageCode;
  }
}

export function anotherFunction() {
  // More existing functionality
}

export function addDependencyGraphAriaLabel() {
  const container = document.querySelector('.dependencyGraph');
  if (container) {
    addAriaLabel(container, 'Dependency Graph');
  }
}

export function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // ... (Preserve existing functionality)
  });
}

export function addMainLandmark() {
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    const body = document.body;
    if (body) {
      // Wrap content in main element
      // ... (Preserve existing functionality)
    }
  }
  return mainElement;
}

export function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    // ... (Merge the changes from both branches)
  });
}

export function ensureUniqueLandmarksMultiple() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Keep the first <main> and convert others to <section> or <div>
    // ... (Preserve existing functionality)
  }
}

export function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('.fake-link, [data-fake-link]');
  fakeLinks.forEach((fakeLink) => {
    // ... (Preserve existing functionality)
  });
}

export function enhanceSvgAccessibility(svgElement, options = {}) {
  if (!svgElement) {
    return;
  }

  const { label, role = 'img' } = options;

  // Ensure SVG has a role for accessibility
  if (role) {
    svgElement.setAttribute('role', role);
  }

  // Set aria-label if a label is provided
  if (label) {
    svgElement.setAttribute('aria-label', label);
  }

  // Make SVG focusable for keyboard navigation
  svgElement.setAttribute('tabindex', '0');

  return svgElement;
}

export function enhanceSVGsAccessibility() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach((svg) => {
    // Skip if already has accessibility attributes
    const hasRole = svg.hasAttribute('role');
    const hasAriaLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby') || svg.hasAttribute('aria-describedby');
    const hasDescriptiveChild = svg.querySelector('title, desc');

    if (!hasRole && !hasAriaLabel && !hasDescriptiveChild) {
      // Add default accessibility props to bare SVGs
      enhanceSvgAccessibility(svg, { label: 'SVG Icon' });
    }
  });
}

export function setupAccessibility() {
  // Add lang attribute with default English
  setLanguageAttribute('en');

  // Ensure skip links work properly
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const targetId = skipLink.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.tabIndex = -1;
        target.focus();
      }
    });
  }

  // Enhance SVG accessibility for all SVGs on the page
  enhanceSVGsAccessibility();
}

export let internalFunction1 = (arg1, arg2) => {
  // Implementation of the new function (adjust as necessary)
};

export let internalFunction2 = () => {
  // Implementation of the new function (adjust as necessary)
};

export function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {