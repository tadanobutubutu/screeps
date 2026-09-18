// Import required module(s) - for fixing table structure issues and SVG accessibility issues
import './table-styles.css';

// main.js - Entry point for the application

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch)
// Code for version 1 implementation goes here.

let newFeatureV1 = (param) => {
  // Version 1 implementation of the new feature
  console.log('Version 1 feature executed with:', param);
  return { version: 1, status: 'active', data: param };
};

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// Addressed accessibility issues from insight report:
// REACT_015: Add lang attribute to HTML element
if (typeof document !== 'undefined') {
  const htmlElement = document.querySelector('html');
  if (htmlElement) htmlElement.setAttribute('lang', 'en');
}

// REACT_025: Add other accessibility changes as per the insight report
function applyInsightReportAccessibility() {
  // Ensure the dependencyGraph container has a proper ARIA role and label
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'region');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
  }

  // Address table structure issues
  document.querySelectorAll('table').forEach((table) => {
    const caption = table.querySelector('caption');
    if (!caption) {
      const newCaption = document.createElement('caption');
      newCaption.textContent = 'Data Table';
      table.insertBefore(newCaption, table.firstChild);
    }
  });

  // Ensure main landmark exists
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    if (document.body) document.body.appendChild(mainElement);
  }

  // Ensure all landmark elements have unique ids; generate if missing
  const landmarks = document.querySelectorAll('main, header, nav, aside, footer, [role="main"], [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
  const usedIds = new Set();
  landmarks.forEach((landmark, index) => {
    if (!landmark) return;
    if (landmark.id) {
      if (usedIds.has(landmark.id)) {
        const newId = 'landmark-' + index;
        landmark.id = newId;
        usedIds.add(newId);
      } else {
        usedIds.add(landmark.id);
      }
    } else {
      let generatedId = 'landmark-' + index;
      while (usedIds.has(generatedId)) {
        generatedId = 'landmark-' + Math.random().toString(36).substr(2, 9);
      }
      landmark.id = generatedId;
      usedIds.add(generatedId);
    }
  });

  // Add accessible names to bare SVG elements
  document.querySelectorAll('svg').forEach((svg) => {
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
    if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
      svg.setAttribute('aria-label', 'Graphic');
    }
  });

  // Fix fake link issues by ensuring keyboard accessibility
  const fakeLinks = document.querySelectorAll('[role="link"], .fake-link, [data-fake-link]');
  fakeLinks.forEach((fakeLink) => {
    if (!fakeLink.hasAttribute('tabindex')) {
      fakeLink.setAttribute('tabindex', '0');
    }
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyInsightReportAccessibility);
  } else {
    applyInsightReportAccessibility();
  }
}

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
      let generatedId = `${prefix}-${Math.floor(Math.random() * 900000) + 100000}`;
      while (usedIds.has(generatedId)) {
        generatedId = `${prefix}-${Math.floor(Math.random() * 900000) + 100000}`;
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
    htmlElement.setAttribute('lang', languageCode || 'en');
  }
}

export function anotherFunction() {
  // More existing functionality
  return true;
}

export function addDependencyGraphAriaLabel() {
  const container = document.getElementById('dependencyGraph');
  addAriaLabel(container, 'Dependency Graph');
}

export function fixTableStructureIssues() {
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
      const existingContent = Array.from(body.childNodes);
      existingContent.forEach(node => mainElement.appendChild(node));
      body.appendChild(mainElement);
    }
  }
  return mainElement;
}

export function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    const title = svg.querySelector('title');
    if (title) {
      const id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      title.id = id;
      svg.setAttribute('aria-labelledby', id);
    } else {
      svg.setAttribute('aria-label', 'Image');
    }
  });
}

export function ensureUniqueLandmarks() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    for (let i = 1; i < mainElements.length; i++) {
      const newElement = document.createElement('section');
      newElement.setAttribute('aria-label', `Section ${i + 1}`);
      mainElements[i].parentNode.replaceChild(newElement, mainElements[i]);
    }
  }
}

export function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('[role="link"], .fake-link, [data-fake-link]');
  fakeLinks.forEach((fakeLink) => {
    const href = fakeLink.getAttribute('data-href');
    if (href) {
      fakeLink.setAttribute('href', href);
      fakeLink.setAttribute('role', 'link');
      fakeLink.setAttribute('tabindex', '0');
    }
  });
}

export function addSVGAccessibilityProps(svgElement, options = {}) {
  if (!svgElement) {
    return;
  }

  const { label, role = 'img' } = options;

  if (role) {
    svgElement.setAttribute('role', role);
  }

  if (label) {
    svgElement.setAttribute('aria-label', label);
  }

  svgElement.setAttribute('focusable', 'false');

  return svgElement;
}

export function enhanceSVGsAccessibility() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach((svg) => {
    const hasRole = svg.getAttribute('role');
    const hasAriaLabel = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby');
    const hasDescriptiveChild = svg.querySelector('title, desc');

    if (!hasRole && !hasAriaLabel && !hasDescriptiveChild) {
      setSvgAttributes(svg, { label: 'Decorative image' });
    }
  });
}

export function setupAccessibility() {
  // Add lang attribute with default English
  setLanguageAttribute();

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

  enhanceSVGsAccessibility();
}

let internalFunction1 = (arg1, arg2) => {
  return arg1 + arg2;
};

let internalFunction2 = () => {
  return true;
};

export function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const generatedId = `${prefix}-${Math.floor(Math.random() * 900000) + 100000}`;
  element.id = generatedId;
  return generatedId;
}

// Assuming main.js has a <html> tag, add the lang attribute based on your content
export function setLanguageAttribute(languageCode) {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', languageCode);
  }
}