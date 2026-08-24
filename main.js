// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
//
// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

// Original code preserved below
// ...


// TODO: Import required module( s) and export the new necessary function(s) here in main.js
import { dependencyGraphContent } from ...
import { indexContent } from './indexContent.js';
import { addLangAttribute } from ...
import { fixTableStructure } from ...
import { addMainLandmark } from './addMainLandmark.js';
import { ensureUniqueLandmarks } from ...
import { addSvgAccessibleNames } from ...
import { fixFakeLinkIssue } from ...

/**
 * Table restructuring function
 * Restructures tables to ensure proper semantic structure (thead, tbody, tfoot)
 * and adds appropriate scope attributes to header cells for accessibility
 * @returns {number} Number of tables restructured
 */
function fixTableStructure() {
  if (typeof document === 'undefined') return 0;

  const tables = document.querySelectorAll('table');
  let tablesRestructured = 0;

  tables.forEach((table) => {
    let restructured = false;

    // Check if table has a thead
    let thead = table.querySelector('thead');
    const allRows = table.querySelectorAll(':scope > tr');
    const directRows = Array.from(allRows).filter(row => row.parentElement === table);

    // If no thead exists and first row contains th elements, create thead
    if (!thead && directRows.length > 0) {
      const firstRow = directRows[0];
      const hasThInFirstRow = firstRow.querySelector('th');

      if (hasThInFirstRow) {
        thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
        restructured = true;
      }
    }

    // Check if table has a tbody
    let tbody = table.querySelector('tbody');
    const tbodyDirectRows = Array.from(directRows).filter(row => {
      const parent = row.parentElement;
      return parent === table || parent === thead;
    });

    if (!tbody) {
      // Wrap remaining direct rows in tbody
      tbody = document.createElement('tbody');
      tbodyDirectRows.forEach(row => {
        tbody.appendChild(row);
      });

      // Find the correct position to insert tbody
      const theadNext = table.querySelector('thead');
      if (theadNext) {
        table.insertBefore(tbody, theadNext.nextSibling);
      } else {
        table.appendChild(tbody);
      }
      restructured = true;
    }

    // Add scope attributes to th elements
    const thElements = table.querySelectorAll('th');
    thElements.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        const row = th.closest('tr');
        const isInThead = th.closest('thead');

        if (isInThead) {
          th.setAttribute('scope', 'col');
        } else {
          th.setAttribute('scope', 'row');
        }
        restructured = true;
      }
    });

    if (restructured) {
      tablesRestructured++;
    }
  });

  return tablesRestructured;
}

// TODO: Implement function for addressing accessibility issues from insight report
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
    const headers = firstRow ? Array.from(firstRow.querySelectorAll('th')) : [];
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

  // REACT_017: Add/fix 2 landmark issues
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
    const fallbackMain = document.querySelector('[role="main"]') || document.querySelector('div[id="main"]') || document.querySelector('div.main');
    if (fallbackMain) {
      fallbackMain.setAttribute('role', 'main');
      if (!mains.length && fallbackMain.tagName !== 'MAIN') {
        fallbackMain.tagName = 'MAIN';
      }
    }
  }

  // REACT_025: Ensure unique landmarks (2 issues)
  // Handler for unique landmarks - ensures each landmark has a unique accessible name
  const landmarks = document.querySelectorAll('main, header, footer, aside, section');
  const landmarkLabels = new Map();
  
  landmarks.forEach((landmark) => {
    // Get existing label or generate one
    let label = landmark.getAttribute('aria-label') || 
                landmark.getAttribute('aria-labelledby') ? document.getElementById(landmark.getAttribute('aria-labelledby'))?.textContent : null;
    
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || tagName;
    
    // Check if this landmark already has a label, if not generate one
    if (!label) {
      // Count existing landmarks of the same type for numbering
      const count = landmarkLabels.get(role) || 0;
      landmarkLabels.set(role, count + 1);
      
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
      label = roleLabels[count] || role.charAt(0).toUpperCase() + role.slice(1) + ' ' + (count + 1);
      
      landmark.setAttribute('aria-label', label);
    } else {
      // Track existing labeled landmarks
      const count = landmarkLabels.get(label) || 0;
      landmarkLabels.set(label, count + 1);
      
      // If duplicate label exists, make it unique
      if (landmarkLabels.get(label) > 1) {
        const newLabel = `${label} ${landmarkLabels.get(label)}`;
        landmark.setAttribute('aria-label', newLabel);
      }
    }
  });

  // Also ensure nav elements specifically have unique accessible names
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
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
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', titleId);
    }
  });

  // REACT_036: Fix 1 fake link issue
  const fakeLinks = document.querySelectorAll('a[onclick]');
  fakeLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const hasClick = typeof link.onclick === 'function' || link.hasAttribute('onclick');
    if (link.getAttribute('role') === 'button' || hasClick || !href || href === '#' || href === '') {
      if (link.getAttribute('role') !== 'button') {
        link.setAttribute('role', 'button');
      }
      if (!link.getAttribute('tabindex') && link.getAttribute('tabindex') !== '0') {
        link.setAttribute('tabindex', '0');
      }
    }
  });

  console.log('Accessibility issues addressed.');
}

/**
 * Handler to ensure unique landmarks in the document
 * Assigns unique aria-labels to landmarks that don't have accessible names
 * @returns {number} Number of landmarks that were labeled
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return 0;
  
  let count = 0;
  
  // Get all landmark elements
  const landmarkSelectors = 'nav, main, header, footer, aside, section';
  const landmarks = document.querySelectorAll(landmarkSelectors);
  
  // Track labels to ensure uniqueness
  const labelCounts = {};
  
  landmarks.forEach((landmark) => {
    const tagName = landmark.tagName.toLowerCase();
    const currentLabel = landmark.getAttribute('aria-label');
    const labelledBy = landmark.getAttribute('aria-labelledby');
    
    // Skip if already has an accessible name
    if (currentLabel || labelledBy) {
      // Track and make unique if duplicates exist
      if (currentLabel) {
        if (!labelCounts[currentLabel]) {
          labelCounts[currentLabel] = 1;
        } else {
          labelCounts[currentLabel]++;
          const newLabel = `${currentLabel} ${labelCounts[currentLabel]}`;
          landmark.setAttribute('aria-label', newLabel);
          count++;
        }
      }
      return;
    }
    
    // Generate unique label based on landmark type
    const defaultLabels = {
      'nav': ['Main Navigation', 'Secondary Navigation', 'Footer Navigation', 'Sidebar Navigation'],
      'main': ['Main Content'],
      'header': ['Site Header', 'Page Header'],
      'footer': ['Site Footer', 'Page Footer'],
      'aside': ['Sidebar', 'Related Content'],
      'section': ['Section']
    };
    
    const labels = defaultLabels[tagName] || ['Section'];
    
    // Find next available label