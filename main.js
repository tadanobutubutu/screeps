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
  return 'anotherFunction executed';
}

function addDependencyGraphAccessibility(container) {
  const container = document.querySelector('.dependencyGraph');
  addAriaLabel(container, 'Dependency Graph');
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Wrap tables in a main element if not already
    if (!table.closest('main')) {
      const main = document.createElement('main');
      table.parentNode.insertBefore(main, table);
      main.appendChild(table);
    }
  });
}

function validateTableAccessibility(tables) {
  tables.forEach((table) => {
    // Validate that tables have proper accessibility attributes
    if (!table.getAttribute('role') && !table.querySelector('caption')) {
      // Add role="table" for accessibility
      table.setAttribute('role', 'table');
    }
    // Ensure proper table structure
    const headers = table.querySelectorAll('th');
    headers.forEach((th) => {
      if (!th.getAttribute('scope')) {
        // Determine if header is for column or row
        const parent = th.parentElement;
        if (parent && parent.tagName === 'TR') {
          const cells = Array.from(parent.children);
          const thIndex = cells.indexOf(th);
          if (thIndex === 0) {
            th.setAttribute('scope', 'row');
          } else {
            th.setAttribute('scope', 'col');
          }
        }
      }
    });
  });
}

export function addMainLandmark() {
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

export function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    // Merge the changes from both branches
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        const titleText = title.textContent;
        if (titleText) {
          svg.setAttribute('aria-label', titleText);
        }
      }
    }
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
    // Preserve existing functionality
    const href = fakeLink.getAttribute('data-href');
    if (href) {
      fakeLink.setAttribute('role', 'link');
      fakeLink.setAttribute('tabindex', '0');
      fakeLink.addEventListener('click', () => {
        window.location.href = href;
      });
      fakeLink.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          window.location.href = href;
        }
      });
    }
  });
}

function addSvgAccessibilityProps(svgElement, options = {}) {
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

  // Make SVG focusable for keyboard navigation
  svgElement.setAttribute('tabindex', '0');

  return svgElement;
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) {
    return '';
  }
  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  // Check for aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) {
      return labelElement.textContent;
    }
  }
  // Check for title element
  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent;
  }
  return '';
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

export function setupAccessibility() {
  // Add lang attribute with default English
  setLanguageAttribute('en');

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