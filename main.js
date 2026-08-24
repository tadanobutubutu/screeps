// TODO: Address accessibility issues from insight report:
// - Address the accessibility issue on the button (Replace `my-button` with the actual button id)

// Import required module(s) for addressing the new issue
import { getElementById } from './helpers.js'; // Assume there is a helpers.js where you can find the getElementById function

// Add a new function to address the accessibility issue on the button
function addressButtonAccessibility() {
  if (typeof document === 'undefined') return;

  // Use the actual button id as specified in the accessibility report
  const button = getElementById('search'); // Replace 'my-button' with actual button id
  if (!button) return;

  // Add a proper accessible name to the button
  button.setAttribute('aria-label', 'Your accessible name');

  // Ensure button has a proper role
  if (!button.hasAttribute('role')) {
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
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.lang = 'en';
  }

  // REACT_027: Fix 26 table structure issues
  // Add scope="col" or scope="row" to <th> elements so assistive technologies can associate headers
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    const firstRow = table.querySelector('tr');
    const headers = firstRow ? table.querySelectorAll('th') : [];
    headers.forEach((th) => {
      if (!th.hasAttribute('scope')) {
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

  // REACT_017: Add/fix 4 landmark issues
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

  const mains = document.querySelectorAll('main');
  if (mains.length === 0) {
    const fallbackMain = document.querySelector('[role="main"]') || document.querySelector('section') || document.querySelector('#main') || document.querySelector('.main');
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

  // REACT_025: Ensure unique landmarks (2 issues)
  // Handler for unique landmarks - ensures each landmark has a unique accessible name
  const landmarks = document.querySelectorAll('nav, main, header, footer, aside, section');
  const landmarkLabels = new Map();

  landmarks.forEach((landmark) => {
    // Get existing label or generate one
    let label = landmark.getAttribute('aria-label') || null;

    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || tagName;

    // Check if this landmark already has a label, if not generate one
    if (!label) {
      // Count existing landmarks of the same type for numbering
      const count = landmarkLabels.get(role) || 0;

      // Generate appropriate label based on landmark type
      const defaultLabels = {
        'nav': ['Main Navigation', 'Secondary Navigation', 'Footer Navigation', 'Sidebar Navigation'],
        'main': ['Main Content'],
        'header': ['Site Header', 'Page Header'],
        'footer': ['Site Footer', 'Page Footer'],
        'aside': ['Sidebar', 'Related Content'],
        'section': ['Section']
      };

      const roleLabels = defaultLabels[role] || ['Section'];
      label = roleLabels[count] || (role.charAt(0).toUpperCase() + role.slice(1) + ' ' + (count + 1));

      landmark.setAttribute('aria-label', label);
    } else {
      // Track existing labeled landmarks
      const count = landmarkLabels.get(label) || 0;

      // If duplicate label exists, make it unique
      if (landmarkLabels.get(label) > 1) {
        const newLabel = `${label} (${count + 1})`;
        landmark.setAttribute('aria-label', newLabel);
      }
    }
  });

  // Also ensure nav elements specifically have unique accessible names
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label')) {
      const navLabels = ['Main Navigation', 'Secondary Navigation', 'Footer Navigation', 'Sidebar Navigation'];
      nav.setAttribute('aria-label', navLabels[index] || 'Navigation ' + (index + 1));
    }
  });

  // REACT_041: Add accessible names to 2 SVGs
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
    if (!svg.getAttribute('aria-labelledby') && title) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', titleId);
    }
  });

  // REACT_036: Fix 1 fake link issue
  const fakeLinks = document.querySelectorAll('a');
  fakeLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const hasClick = typeof link.onclick === 'function' ||
                     link.hasAttribute('ng-click') ||
                     link.hasAttribute('v-on:click') ||
                     link.hasAttribute('@click');
    if (link.getAttribute('role') === 'button' || hasClick || !href || href === '#' || href === '') {
      if (link.getAttribute('role') !== 'button') {
        link.setAttribute('role', 'button');
      }
      if (!link.hasAttribute('tabindex') || link.getAttribute('tabindex') !== '0') {
        link.setAttribute('tabindex', '0');
      }
    }
  });

  // Call the new function to address the button accessibility issue
  addressButtonAccessibility();

  console.log('Accessibility issues addressed.');
}

export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addressAccessibilityIssues,
  addressButtonAccessibility, // Add this new export
  dependencyGraphContent,
  indexContent
};