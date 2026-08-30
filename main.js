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

function generateUniqueId(prefix = 'id', length = 9) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = `${prefix}-`;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function ensureUniqueLandmarks(landmarks, prefix = 'landmark') {
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
      let generatedId = generateUniqueId(prefix);
      while (usedIds.has(generatedId)) {
        generatedId = generateUniqueId(prefix);
      }
      landmark.id = generatedId;
      usedIds.add(generatedId);
      ids.push(generatedId);
    }
  });

  return ids;
}

function setLanguageAttribute(languageCode = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.lang = languageCode;
  }
}

export function anotherFunction() {
  // More existing functionality
}

function addDependencyGraphAccessibility(container) {
  const container = document.querySelector('.dependencyGraph');
  addAriaLabel(container, 'Dependency Graph');
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // ... (Preserve existing functionality)
  });
}

function addMainLandmark() {
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    const body = document.body;
    if (body) {
      // Wrap content in main element
      body.insertBefore(mainElement, body.firstChild);
    }
  }
  return mainElement;
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    // ... (Merge the changes from both branches)
  });
}

function ensureUniqueMainLandmarks() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Keep the first <main> and convert others to <section> or <div>
    for (let i = 1; i < mainElements.length; i++) {
      const section = document.createElement('section');
      while (mainElements[i].firstChild) {
        section.appendChild(mainElements[i].firstChild);
      }
      mainElements[i].parentNode.replaceChild(section, mainElements[i]);
    }
  }
}

function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('.fake-link, [data-fake-link]');
  fakeLinks.forEach((fakeLink) => {
    // ... (Preserve existing functionality)
  });
}

function addSvgAccessibilityProps(svgElement, options = {}) {
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

function enhanceSVGsAccessibility() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach((svg) => {
    // Skip if already has accessibility attributes
    const hasRole = svg.hasAttribute('role');
    const hasAriaLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby') || svg.hasAttribute('aria-describedby');
    const hasDescriptiveChild = svg.querySelector('title, desc');

    if (!hasRole && !hasAriaLabel && !hasDescriptiveChild) {
      // Add default accessibility props to bare SVGs
      addSvgAccessibilityProps(svg, { label: 'Decorative SVG' });
    }
  });
}

function setupAccessibility() {
  // Add lang attribute with default English
  setLanguageAttribute();

  // Ensure skip links work properly
  const skipLink = document.querySelector('.skip-link, [href="#main"]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const targetId = skipLink.getAttribute('href').substring(1);
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

let internalFunction1 = (arg1, arg2) => {
  // Implementation of the new function (adjust as necessary)
};

let internalFunction2 = () => {
  // Implementation of the new function (adjust as necessary)
};

function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const generatedId = generateUniqueId(prefix);
  element.id = generatedId;
  return generatedId;
}

function addAriaLabel(element, label) {
  if (!element) return;
  element.setAttribute('aria-label', label);
}

// Export for use in other modules if needed
export { ensureUniqueLandmarks, setupAccessibility, addMainLandmark, ensureUniqueMainLandmarks };