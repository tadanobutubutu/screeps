// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_025: Ensure unique landmarks (Updated code added below)
// - REACT_036: Fix 1 fake link issue

// TODO: Add back any required exports that might have been removed
// Here's an example of how to export a required function from another file:
// Import functions from other modules if needed
// const { someFunction } = require('./utils');

// Re-add the removed exports here: import { class1, function1, Object1 } from './path/to/module';
import { class1, function1, Object1 } from './path/to/module';
import { unique } from './utils';

// Accessibility fix for REACT_015: Add lang attribute to HTML element
const addLangAttribute = () => {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Assuming English for this example
  }
};

// Accessibility fix for REACT_041: Add accessible names to 2 SVGs
const addAccessibleNamesToSVGs = () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = svg.querySelector('title');
    if (!title) {
      const titleElement = document.createElement('title');
      titleElement.textContent = 'Accessible title for SVG';
      svg.insertBefore(titleElement, svg.firstChild);

      // Add aria-labelledby attribute to link the title
      const titleId = 'svg-title-' + Math.random().toString(36).substring(2, 9);
      titleElement.id = titleId;
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
};

// Function to add scope to table headers
const addScopeToTableHeaders = () => {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      // Determine if header is in thead (col) or first cell of row (row)
      const parentRow = header.closest('tr');
      const parentThead = header.closest('thead');
      const isFirstCell = parentRow && parentRow.querySelector('th, td') === header;
      
      if (parentThead) {
        header.setAttribute('scope', 'col');
      } else if (isFirstCell) {
        header.setAttribute('scope', 'row');
      }
    }
  });
};

// Rotate back function for unrotate button
const rotateBack = () => {
  // Placeholder for rotate back functionality
  console.log('Rotate back action triggered');
};

// Function to validate table structure and add scope to <th> elements
const validateTableStructureAndScopeTh = () => {
  const tables = document.querySelectorAll('table');

  tables.forEach(table => {
    // Ensure table has a caption if it doesn't have one and has headers
    const hasCaption = table.querySelector('caption');
    const headers = table.querySelectorAll('th');
    const hasHeaders = headers.length > 0;

    if (!hasCaption && hasHeaders) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table description'; // Generic caption
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure proper use of thead, tbody, tfoot
    const rows = table.querySelectorAll('tr');
    if (rows.length > 0) {
      // Check if first row is inside a thead
      let hasThead = table.querySelector('thead');
      let hasTbody = table.querySelector('tbody');
      let hasTfoot = table.querySelector('tfoot');

      // If no thead but there are headers, wrap first row( s) in thead
      if (!hasThead) {
        const firstRow = rows[0];
        const firstRowHeaders = firstRow.querySelectorAll('th');
        const firstRowHasHeaders = firstRowHeaders.length > 0;

        if (firstRowHasHeaders) {
          const thead = document.createElement('thead');
          thead.appendChild(firstRow);
          table.insertBefore(thead, table.firstChild);
        }
      }

      // Ensure there's a tbody for remaining rows
      if (!hasTbody && rows.length > 1) {
        const tbody = document.createElement('tbody');
        for (let i = 1; i < rows.length; i++) {
          // Check if row is not already in tfoot
          const isInTfoot = rows[i].closest('tfoot');
          if (!isInTfoot) {
            tbody.appendChild(rows[i]);
          }
        }
        if (tbody.children.length > 0) {
          table.appendChild(tbody);
        }
      }

      // Fix header- cell associations using headers attribute
      const allCells = table.querySelectorAll('td, th');
      allCells.forEach(cell => {
        // If cell has headers attribute, ensure it's valid
        const headersAttr = cell.getAttribute('headers');
        if (headersAttr) {
          const headerIds = headersAttr.split(' ');
          headerIds.forEach(headerId => {
            const header = document.getElementById(headerId);
            if (!header) {
              // Invalid header reference, remove the attribute
              cell.removeAttribute('headers');
            }
          });
        }
      });
    }

    // Add scope to table headers
    addScopeToTableHeaders();
  });
};

// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Example:
// const someVar = require('some-module');
// function init() { /* ... */ }
// module.exports.loop = function() { /* ... */ }
// ----- END ORIGINAL CODE -----

// Re-add the removed exports here: import { class1, function1, Object1 } from './path/to/module';

export { class1, function1, Object1, unique, validateTableStructureAndScopeTh, addLangAttribute, addAccessibleNamesToSVGs, fixFakeLink, wrapPrimaryContentInMain, fixLandmarkIssues };

// ==== NEW CODE TO ADDRESS REACT_036 (Fake Link) ====
// Replace the hash‑only <a id="unrotate"> with a proper <button>
// This ensures keyboard and screen‑reader users get correct activation behavior.

const fixFakeLink = () => {
  const link = document.getElementById('unrotate');
  if (!link) return;

  // Create a button with the same visual text and id
  const button = document.createElement('button');
  button.type = 'button';
  button.id = link.id;
  button.textContent = link.textContent;

  // If there was any click handling on the original <a>, re‑attach it.
  // Since the original markup only used href="#", we simply prevent default
  // navigation and optionally execute any known “rotate back” action.
  button.addEventListener('click', (e) => {
    e.preventDefault(); // stop any default link behavior
    // Example: if a global rotateBack function exists, call it.
    // Adjust this to match whatever functionality was intended.
    if (typeof rotateBack === 'function') {
      rotateBack();
    }
  });

  // Replace the <a> with the new <button>
  link.parentNode.replaceChild(button, link);
};

// ==== NEW CODE TO ADDRESS REACT_025 (Unique Landmarks) ====
// Wrap primary content in a <main> element to ensure unique landmarks
// This helps screen reader users navigate the page structure

const wrapPrimaryContentInMain = () => {
  // Check if main element already exists to avoid duplication
  const existingMain = document.querySelector('main');
  if (existingMain) return;

  // Find the primary content container
  // Looking for common primary content patterns
  const primaryContentSelectors = [
    '#primary-content',
    '#main-content',
    '#content',
    '.primary-content',
    '.main-content',
    '[role="main"]'
  ];

  let primaryContent = null;
  for (const selector of primaryContentSelectors) {
    const element = document.querySelector(selector);
    if (element && !element.closest('main')) {
      primaryContent = element;
      break;
    }
  }

  // If no specific primary content selector found,
  // wrap the first content section that appears after header/hero sections
  if (!primaryContent) {
    const bodyChildren = Array.from(document.body.children);
    const headerElements = document.querySelectorAll('header, .hero, .banner');

    // Find content that comes after typical header elements
    for (const child of bodyChildren) {
      const isHeader = Array.from(headerElements).some(header =>
        header.contains(child) || header === child
      );

      if (!isHeader && child.textContent.trim() && !child.closest('main')) {
        // Skip navigation, aside, and footer elements
        const tagName = child.tagName.toLowerCase();
        if (!['NAV', 'ASIDE', 'FOOTER', 'HEADER'].includes(tagName)) {
          primaryContent = child;
          break;
        }
      }
    }
  }

  // If we found primary content, wrap it in a main element
  if (primaryContent) {
    const mainElement = document.createElement('main');

    // Get the parent of the primary content
    const parent = primaryContent.parentNode;
    if (parent) {
      // Insert main element before the primary content
      parent.insertBefore(mainElement, primaryContent);
      // Move the primary content inside the main element
      mainElement.appendChild(primaryContent);
    }
  }
};

// ==== NEW CODE TO ADDRESS REACT_017 (Landmark Issues) ====
// Add/fix 4 landmark issues: banner, navigation, contentinfo, and main landmarks

const fixLandmarkIssues = () => {
  // 1. Banner landmark: role="banner"
  let banner = document.querySelector('[role="banner"]');
  if (!banner) {
    const header = document.querySelector('header');
    if (header) {
      header.setAttribute('role', 'banner');
      banner = header;
    }
  }

  // 2. Navigation landmarks: role="navigation" for nav elements
  const navElements = document.querySelectorAll('nav');
  navElements.forEach(nav => {
    if (!nav.hasAttribute('role') || nav.getAttribute('role') !== 'navigation') {
      nav.setAttribute('role', 'navigation');
    }
  });

  // 3. Contentinfo landmark: role="contentinfo"
  let contentinfo = document.querySelector('[role="contentinfo"]');
  if (!contentinfo) {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.setAttribute('role', 'contentinfo');
      contentinfo = footer;
    }
  }

  // 4. Main landmark: role="main"
  let mainElement = document.querySelector('main');
  if (mainElement) {
    if (!mainElement.hasAttribute('role') || mainElement.getAttribute('role') !== 'main') {
      mainElement.setAttribute('role', 'main');
    }
  }
};

// Run the fixes once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  fixFakeLink();
  wrapPrimaryContentInMain();
  fixLandmarkIssues();
});