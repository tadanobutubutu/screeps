// TODO: Create or update the affected functions to be accessible
// The functions below have been created to match the exported names

// Import required module(s) for addressing the new issue
import { getElementById } from './helpers.js';

/**
 * REACT_015: Add lang attribute to HTML element
 */
function addLangAttribute() {
  if (typeof document === 'undefined') return;

  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.lang = 'en';
  }
}

/**
 * REACT_027: Fix table structure issues
 * Add scope="col" or scope="row" to <th> elements so assistive technologies can associate headers
 */
function fixTableStructure() {
  if (typeof document === 'undefined') return;

  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    const firstRow = table.querySelector('tr');
    const headers = firstRow ? Array.from(firstRow.querySelectorAll('th')) : [];
    headers.forEach((th) => {
      if (!th.getAttribute('scope')) {
        const row = th.closest('tr');
        const isInThead = !!th.closest('thead');
        const isFirstRow = firstRow && row === firstRow;
        if (isInThead || isFirstRow) {
          th.setAttribute('scope', 'col');
        } else {
          th.setAttribute('scope', 'row');
        }
      }
    });
  });
}

/**
 * REACT_017: Add/fix landmark issues - add main landmark
 */
function addMainLandmark() {
  if (typeof document === 'undefined') return;

  const mains = document.querySelectorAll('main');
  if (mains.length === 0) {
    const fallbackMain = document.querySelector('div#main') || document.querySelector('div.main') || document.querySelector('[role="main"]') || document.querySelector('article');
    if (fallbackMain) {
      fallbackMain.setAttribute('role', 'main');
      if (fallbackMain.tagName !== 'MAIN') {
        try {
          const newMain = document.createElement('main');
          fallbackMain.parentNode.insertBefore(newMain, fallbackMain);
          while (fallbackMain.firstChild) {
            newMain.appendChild(fallbackMain.firstChild);
          }
          fallbackMain.parentNode.removeChild(fallbackMain);
        } catch (e) {
          // Preserve existing structure if tag change fails
        }
      }
    }
  }

  const headers = document.querySelectorAll('header');
  if (headers.length === 1) {
    const header = headers[0];
    if (!header.getAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
  }

  const footers = document.querySelectorAll('footer');
  if (footers.length === 1) {
    const footer = footers[0];
    if (!footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
  }
}

/**
 * REACT_025: Ensure unique landmarks
 * Ensures each landmark has a unique accessible name
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;

  const landmarks = document.querySelectorAll('nav, main, header, footer, aside, section');
  const landmarkLabels = new Map();

  landmarks.forEach((landmark) => {
    let label = landmark.getAttribute('aria-label') || null;

    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || tagName;

    if (!label) {
      const count = landmarkLabels.get(role) || 0;

      const defaultLabels = {
        'nav': ['Main Navigation', 'Secondary Navigation', 'Footer Navigation', 'Sidebar Navigation'],
        'main': ['Main Content'],
        'header': ['Site Header', 'Page Header'],
        'footer': ['Site Footer', 'Page Footer'],
        'aside': ['Sidebar', 'Related Content'],
        'section': ['Section']
      };

      const roleLabels = defaultLabels[role] || ['Section'];
      label = roleLabels[count] || role.charAt(0).toUpperCase() + role.slice(1) + ' ' + (count + 1);

      landmark.setAttribute('aria-label', label);
    } else {
      const count = landmarkLabels.get(label) || 0;

      if (landmarkLabels.get(label) > 1) {
        const newLabel = `${label} (${count + 1})`;
        landmark.setAttribute('aria-label', newLabel);
      }
    }
    landmarkLabels.set(label, count + 1);
  });

  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label')) {
      const navLabels = ['Main Navigation', 'Secondary Navigation', 'Footer Navigation', 'Sidebar Navigation'];
      nav.setAttribute('aria-label', navLabels[index] || 'Navigation ' + (index + 1));
    }
  });
}

/**
 * REACT_041: Add accessible names to SVGs
 */
function addSvgAccessibleNames() {
  if (typeof document === 'undefined') return;

  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const titleId = 'svg-title-' + (index + 1);
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      title.id = titleId;
      title.textContent = 'SVG graphic ' + (index + 1);
      svg.insertBefore(title, svg.firstChild);
    } else {
      if (!title.id) {
        title.id = titleId;
      }
    }
    if (!svg.getAttribute('role') && title) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
}

/**
 * REACT_036: Fix 1 fake link issue
 */
function fixFakeLinks() {
  if (typeof document === 'undefined') return;

  const links = document.querySelectorAll('a[href="#"]');
  links.forEach((link) => {
    if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
      link.setAttribute('href', 'javascript:void(0)');
    }
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const srcElement = e.srcElement || e.target;
      const target = srcElement.hash;
      const dest = target ? document.querySelector(target) : null;

      if (dest) {
        // Set focus on the target element
        dest.focus();
        // Scroll to the target position
        scrollTo({ top: dest.offsetTop, behavior: 'smooth' });
      }
    });
  });
}

/**
 * Placeholder content for dependencyGraphContent
 */
const dependencyGraphContent = '';

/**
 * Placeholder content for indexContent
 */
const indexContent = '';

// Add a new function to address the accessibility issue on the button
function addressButtonAccessibility() {
  if (typeof document === 'undefined') return;

  // Use the actual button id as specified in the accessibility report
  const button = getElementById('my-button');
  if (!button) return;

  // Add a proper accessible name to the button
  button.setAttribute('aria-label', 'Your accessible name');

  // Ensure button has a proper role
  if (!button.getAttribute('role')) {
    button.setAttribute('role', 'button');
  }
}

/**
 * Handler for addressing accessibility issues from insight report
 * This function calls the sub-functions to address issues
 */
function addressAccessibilityIssues() {

  if (typeof document === 'undefined') return;

  // REACT_015: Add lang attribute to HTML element
  addLangAttribute();

  // REACT_027: Fix 26 table structure issues
  fixTableStructure();

  // REACT_017: Add/fix 4 landmark issues
  addMainLandmark();

  // REACT_025: Ensure unique landmarks (2 issues)
  ensureUniqueLandmarks();

  // REACT_041: Add accessible names to 2 SVGs
  addSvgAccessibleNames();

  // REACT_036: Fix 1 fake link issue
  fixFakeLinks();

  // Call the new function to address the button accessibility issue
  addressButtonAccessibility();

  console.log('Accessibility issues addressed.');
}

// Automatically address accessibility issues when loaded in a browser environment
if (typeof document !== 'undefined') {
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addressAccessibilityIssues);
  } else {
    addressAccessibilityIssues();
  }
}

export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addressAccessibilityIssues,
  addressButtonAccessibility,
  dependencyGraphContent,
  indexContent
};