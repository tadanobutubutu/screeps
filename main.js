// Import required module(s) - for fixing table structure issues
import './table-styles.css';

// main.js - Entry point for the application

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// Ensure all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
// (Preserve existing function for control)
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
      let generatedId = `${prefix}-${index}`;
      while (usedIds.has(generatedId)) {
        generatedId = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
      }
      landmark.id = generatedId;
      usedIds.add(generatedId);
      ids.push(generatedId);
    }
  });

  return ids;
}

// (Preserve existing function for control)
function setLanguageAttribute(languageCode) {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', languageCode);
  }
}

export function anotherFunction() {
  // More existing functionality
}

// TODO: Implement functions to render dependency graphs and display module structure for debugging purposes.

// This is a simple utility library with added dependency graph rendering and module structure display functionalities, bot logic for Screeps and functions to ensure the element has an id and add an aria-label.

// TODO: Update or create the affected functions to be accessible

let internalFunction1 = (arg1, arg2) => {
  // Implementation of the new function (adjust as necessary)
};

let internalFunction2 = () => {
  // Implementation of the new function (adjust as necessary)
};

/**
 * Ensures the element has an id. If the element doesn't have an id, generates one.
 * @param {HTMLElement} element - The element to check
 * @param {string} prefix - Optional prefix for the generated id
 * @returns {string} The id of the element
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const generatedId = `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = generatedId;
  return generatedId;
}

/**
 * Adds an aria-label to the element if it doesn't already have one
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 * @returns {void}
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }

  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

/**
 * Sets the lang attribute on the HTML element based on the page content
 * @param {string} languageCode - The language code (e.g., 'en', 'es', 'fr')
 */
function setLanguageAttribute(languageCode) {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', languageCode);
  }
}

// TODO: Address accessibility issues from insight report:

// Ensure all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
// Adds an aria-label to the dependencyGraph container if it doesn't already have one
function addDepGraphAriaLabel() {
  const container = document.getElementById('dependencyGraph');
  addAriaLabel(container, 'Dependency Graph');
}

// Fixes 26 table structure issues for accessibility
// Ensures tables have proper headers, captions, and scope attributes
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Add caption if missing
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('aria-label') || 'Data table';
      caption.classList.add('sr-only');
      table.prepend(caption);
    }

    // Ensure proper header structure with scope attributes
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        // Determine scope based on position
        const parent = th.parentElement;
        const isInThead = parent && parent.tagName === 'THEAD';
        th.setAttribute('scope', isInThead ? 'col' : 'row');
      }
    });
  });
}

// Adds/fixes 2 landmark issues by ensuring a main landmark exists
function addMainLandmark() {
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    const body = document.body;
    if (body) {
      // Wrap content in main element
      const children = Array.from(body.children).filter(
        (child) => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'HEADER', 'FOOTER', 'NAV'].includes(child.tagName)
      );
      if (children.length > 0) {
        const firstChild = children[0];
        body.insertBefore(mainElement, firstChild);
        children.forEach((child) => mainElement.appendChild(child));
      } else {
        body.appendChild(mainElement);
      }
    }
  }
  return mainElement;
}

// Adds accessible names to SVG elements that lack them
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    const hasAccessibleName =
      svg.hasAttribute('aria-label') ||
      svg.hasAttribute('aria-labelledby') ||
      svg.hasAttribute('role') ||
      svg.querySelector('title');

    if (!hasAccessibleName) {
      // Try to use nearby text or generate one
      const parent = svg.parentElement;
      const nearbyText = parent ? parent.textContent.trim().substring(0, 50) : '';
      const label = nearbyText || 'Decorative icon';
      svg.setAttribute('aria-label', label);
      svg.setAttribute('role', 'img');
    }
  });
}

// Ensures unique landmarks by removing duplicate main elements
function ensureUniqueLandmarks() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Keep the first <main> and convert others to <section> or <div>
    for (let i = 1; i < mainElements.length; i++) {
      const extraMain = mainElements[i];
      const section = document.createElement('section');
      section.setAttribute('role', 'region');
      while (extraMain.firstChild) {
        section.appendChild(extraMain.firstChild);
      }
      extraMain.parentNode.replaceChild(section, extraMain);
    }
  }
}

// Fixes fake link issues (e.g., divs/buttons styled as links but not using <a>)
// Replaces fake links with proper anchor elements
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('[role="link"], .fake-link, [data-fake-link]');
  fakeLinks.forEach((fakeLink) => {
    const href = fakeLink.getAttribute('data-href') || fakeLink.getAttribute('href') || '#';
    const text = fakeLink.textContent;
    const anchor = document.createElement('a');
    anchor.setAttribute('href', href);
    anchor.textContent = text;
    // Copy relevant attributes
    const classes = fakeLink.getAttribute('class');
    if (classes) {
      anchor.setAttribute('class', classes);
    }
    const id = fakeLink.getAttribute('id');
    if (id) {
      anchor.setAttribute('id', id);
    }
    fakeLink.parentNode.replaceChild(anchor, fakeLink);
  });
}

// TODO: Implement renderIndexView functionality
// Placeholder for now, replace with actual implementation
function renderIndexView() {
  // Implementation of the new function (adjust as necessary)
  // For example, this could be a function that renders the index view of the application
  // and is called from another part of the application logic
}

// ... (Preserve the existing code that needs to be preserved)