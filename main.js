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
      let generatedId = `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
      while (usedIds.has(generatedId)) {
        generatedId = `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
      }
      landmark.id = generatedId;
      usedIds.add(generatedId);
      ids.push(generatedId);
    }
  });

  return ids;
}

function setLanguageAttribute(languageCode = 'en') {
  const htmlElement = document.documentElement || document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', languageCode);
  }
}

export function anotherFunction() {
  // More existing functionality
  return 'anotherFunction executed';
}

function wrapContentInMain(container) {
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

function addMainLandmark() {
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    const body = document.body;
    if (body) {
      // Wrap content in main element
      const firstChild = body.firstChild;
      if (firstChild) {
        body.insertBefore(mainElement, firstChild);
      } else {
        body.appendChild(mainElement);
      }
    }
  }
  return mainElement;
}

function addSvgAccessibleNames() {
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

function ensureUniqueLandmarks() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Keep the first <main> and convert others to <section> or <div>
    for (let i = 1; i < mainElements.length; i++) {
      const element = mainElements[i];
      const newElement = document.createElement('section');
      newElement.id = `section-${i}`;
      // Copy attributes
      Array.from(element.attributes).forEach((attr) => {
        newElement.setAttribute(attr.name, attr.value);
      });
      // Move children
      while (element.firstChild) {
        newElement.appendChild(element.firstChild);
      }
      element.parentNode.replaceChild(newElement, element);
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

function setSvgAttributes(svgElement, options = {}) {
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
  svgElement.setAttribute('focusable', 'false');

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
    const hasAriaLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby');
    const hasDescriptiveChild = svg.querySelector('title, desc');

    if (!hasRole && !hasAriaLabel && !hasDescriptiveChild) {
      // Add default accessibility props to bare SVGs
      setSvgAttributes(svg, { label: 'Decorative SVG' });
    }
  });
}

function setupAccessibility() {
  // Add lang attribute with default English
  setLanguageAttribute('en');

  // Ensure skip links work properly
  const skipLink = document.querySelector('a[href^="#"]');
  if (skipLink) {
    skipLink.addEventListener('click', (