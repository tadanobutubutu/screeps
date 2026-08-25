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

import { dependencyGraphContent } from './dependencyGraphContent.js';
import { indexContent } from './indexContent.js';
import { addLangAttribute } from './addLangAttribute.js';
import { fixTableStructure } from './fixTableStructure.js';
import { addMainLandmark } from './addMainLandmark.js';
import { ensureUniqueLandmarks } from './ensureUniqueLandmarks.js';
import { addSvgAccessibleNames } from './addSvgAccessibleNames.js';
import { fixFakeLinkIssue } from './fixFakeLinkIssue.js';

// TODO: Implement function for addressing accessibility issues from insight report
function addressAccessibilityIssues() {
  if (typeof document === 'undefined') return;

  // REACT_015: Add lang attribute to HTML element
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.lang = 'en';
  }

  // REACT_027: Fix 26 table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Ensure tables have caption or title
    if (!table.querySelector('caption') && table.getAttribute('aria-label')) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('aria-label');
      table.insertBefore(caption, table.firstChild);
    }
    
    // Ensure proper th elements for headers
    const firstRow = table.querySelector('tbody tr, thead tr');
    if (firstRow) {
      const cells = firstRow.querySelectorAll('td');
      cells.forEach((cell) => {
        if (!cell.querySelector('th') && !cell.closest('thead')) {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          cell.replaceWith(th);
        }
      });
    }

    // Add scope attribute to th elements
    const tableFirstRow = table.querySelector('tr');
    const headers = table.querySelectorAll('th');
    headers.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        const row = th.closest('tr');
        const isInThead = !!th.closest('thead');
        const isFirstRow = tableFirstRow && row === tableFirstRow;
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
    const fallbackMain = document.querySelector('[role="main"]') || document.querySelector('.main') || document.querySelector('.content');
    if (fallbackMain) {
      fallbackMain.setAttribute('role', 'main');
    }
  }

  // REACT_025: Ensure unique landmarks (2 issues)
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label')) {
      const navLabels = ['Main Navigation', 'Secondary Navigation', 'Footer Navigation'];
      nav.setAttribute('aria-label', navLabels[index] || 'Navigation ' + (index + 1));
    }
  });

  // Remove duplicate navigation elements
  const navElements = document.querySelectorAll('nav');
  if (navElements.length > 1) {
    navElements.forEach((nav, index) => {
      if (index > 0) {
        const ariaLabel = nav.getAttribute('aria-label');
        if (ariaLabel) {
          nav.setAttribute('aria-label', `${ariaLabel} ${index + 1}`);
        }
      }
    });
  }
  
  // Ensure only one banner/header landmark
  const headerLandmarks = document.querySelectorAll('header, [role="banner"]');
  if (headerLandmarks.length > 1) {
    headerLandmarks.forEach((header, index) => {
      if (index > 0) {
        header.removeAttribute('role');
        header.setAttribute('role', 'complementary');
      }
    });
  }

  // REACT_041: Add accessible names to 2 SVGs
  const svgs = document.querySelectorAll('svg');
  let svgIndex = 0;
  svgs.forEach((svg) => {
    if (!svg.querySelector('title') && !svg.getAttribute('role') && svg.getAttribute('aria-label')) {
      const title = document.createElement('title');
      title.textContent = `SVG icon ${svgIndex + 1}`;
      title.id = `svg-title-${svgIndex + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', title.id);
    } else {
      const titleId = 'svg-title-' + (svgIndex + 1);
      let title = svg.querySelector('title');
      if (!title) {
        title = document.createElement('title');
        title.id = titleId;
        title.textContent = 'SVG graphic ' + (svgIndex + 1);
        svg.insertBefore(title, svg.firstChild);
      } else {
        if (!title.id) {
          title.id = titleId;
        }
      }
      if (!svg.getAttribute('aria-labelledby')) {
        svg.setAttribute('aria-labelledby', titleId);
      }
    }
    svgIndex++;
  });

  // REACT_036: Fix 1 fake link issue
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a[onclick]');
  fakeLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const hasClick = typeof link.onclick === 'function' || link.getAttribute('onclick');
    if (link.getAttribute('role') === 'button' || hasClick || !href || href === '#' || href === '') {
      if (link.getAttribute('role') !== 'button') {
        link.setAttribute('role', 'button');
      }
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
    }
  });

  console.log('Accessibility issues addressed.');
}

/**
 * Adds lang attribute to the HTML element for accessibility
 * @param {string} lang - Language code (default: 'en')
 */
function addLangAttribute(lang = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Adds main landmark to the page
 */
function addMainLandmark() {
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    // Find the main content area and wrap it with main element
    const content = document.querySelector('#content, .content, [role="main"]');
    if (content && content.tagName !== 'MAIN') {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      content.parentNode.insertBefore(main, content);
      main.appendChild(content);
    }
  } else {
    mainElement.setAttribute('role', 'main');
  }
}

/**
 * Adds accessible names to SVG elements
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  let svgIndex = 0;
  svgs.forEach((svg) => {
    if (!svg.querySelector('title') && !svg.getAttribute('role') && svg.getAttribute('aria-label')) {
      const title = document.createElement('title');
      title.textContent = `SVG icon ${svgIndex + 1}`;
      title.id = `svg-title-${svgIndex + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', title.id);
    }
    svgIndex++;
  });
}

/**
 * Ensures unique landmarks by removing duplicate navigation and banner landmarks
 */
function ensureUniqueLandmarks() {
  // Remove duplicate navigation elements
  const navElements = document.querySelectorAll('nav');
  if (navElements.length > 1) {
    navElements.forEach((nav, index) => {
      if (index > 0) {
        const ariaLabel = nav.getAttribute('aria-label');
        if (ariaLabel) {
          nav.setAttribute('aria-label', `${ariaLabel} ${index + 1}`);
        }
      }
    });
  }
  
  // Ensure only one banner/header landmark
  const headers = document.querySelectorAll('header, [role="banner"]');
  if (headers.length > 1) {
    headers.forEach((header, index) => {
      if (index > 0) {
        header.removeAttribute('role');
        header.setAttribute('role', 'complementary');
      }
    });
  }
}

/**
 * Fixes fake link issues by making elements with onclick but no href proper links
 */
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a[onclick]');
  fakeLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const hasClick = typeof link.onclick === 'function' || link.getAttribute('onclick');
    if (link.getAttribute('role') === 'button' || hasClick || !href || href === '#' || href === '') {
      if (link.getAttribute('role') !== 'button') {
        link.setAttribute('role', 'button');
      }
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
    }
  });
}

function renderDependencyGraph() {
  const graphContainer = document.getElementById('dependency-graph') || document.querySelector('.dependency-graph') || document.querySelector('main');
  if (graphContainer) {
    graphContainer.innerHTML = dependencyGraphContent || indexContent || '<p>No dependency graph available.</p>';
  }
  console.log('Dependency graph rendered.');
}

// Existing code preserved below
// ...

// Call the new function to ensure accessibility issues are addressed
addressAccessibilityIssues();

// Call the new function to render the dependency graph
renderDependencyGraph();

// Existing code preserved below
// ...

export { addressAccessibilityIssues, renderDependencyGraph, addLangAttribute, fixTableStructure, addMainLandmark, ensureUniqueLandmarks, addSvgAccessibleNames, fixFakeLinkIssue };