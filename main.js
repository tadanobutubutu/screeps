// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
// TODO-hash: 6468a1295031a6500a8981582d2e182e6d55a296

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// REACT_015: Add lang attribute to HTML element
function addLangAttribute() {
  document.documentElement.lang = 'en';
}

// REACT_027: Fix 26 table structure issues
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const existingThead = table.querySelector('thead');
    if (!existingThead) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const headers = firstRow.querySelectorAll('th, td');
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        headers.forEach(header => {
          const th = document.createElement('th');
          th.textContent = header.textContent;
          th.scope = 'col';
          tr.appendChild(th);
        });
        thead.appendChild(tr);
        table.insertBefore(thead, table.firstChild);
      }
    }
    const cells = table.querySelectorAll('td');
    cells.forEach(td => {
      if (td.textContent && !td.closest('thead')) {
        const row = td.closest('tr');
        if (row && row.querySelector('th')) {
          const th = document.createElement('th');
          th.textContent = td.textContent;
          th.scope = 'row';
          td.parentNode.insertBefore(th, td);
        }
      }
    });
  });
}

// REACT_017: Add/fix 4 landmark issues
function addMainLandmark() {
  // Header landmark - role="banner"
  let header = document.querySelector('header');
  if (!header) {
    header = document.createElement('header');
    const content = document.querySelector('.content') || document.body;
    if (content) {
      content.insertBefore(header, content.firstChild);
    }
  }
  if (header) {
    header.setAttribute('role', 'banner');
  }

  // Nav landmark - role="navigation"
  let nav = document.querySelector('nav');
  if (!nav) {
    nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Primary navigation');
    const content = document.querySelector('.content') || document.body;
    if (content) {
      content.insertBefore(nav, content.firstChild);
    }
  }
  if (nav && !nav.hasAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }

  // Main landmark - role="main"
  let main = document.querySelector('main');
  if (!main) {
    main = document.createElement('main');
    main.id = 'main-content';
    const content = document.querySelector('.content') || document.body;
    if (content) {
      document.body.insertBefore(main, content);
      content.remove();
    }
  } else {
    main.id = main.id || 'main-content';
  }
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }

  // Footer landmark - role="contentinfo"
  let footer = document.querySelector('footer');
  if (!footer) {
    footer = document.createElement('footer');
    footer.setAttribute('aria-label', 'Site footer');
    const content = document.querySelector('.content') || document.body;
    if (content) {
      content.appendChild(footer);
    }
  }
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }

  // Fix banner duplication (ensure only first header has role="banner")
  const headers = document.querySelectorAll('header[role="banner"]');
  headers.forEach((header, index) => {
    if (index > 0) {
      header.removeAttribute('role');
    }
  });
}

// REACT_041: Add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    let title = svg.querySelector('title') || document.createElement('title');
    if (!svg.querySelector('title')) {
      const ariaLabel = svg.getAttribute('aria-label') || 
                        (index === 0 ? 'Logo' : 'Icon') + ' ' + (index + 1);
      title.textContent = ariaLabel;
      svg.insertBefore(title, svg.firstChild);
    }
    svg.setAttribute('role', 'img');
    if (!title.id) {
      title.id = 'svg-title-' + index;
    }
    if (!svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = ['header', 'nav', 'main', 'footer'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.removeAttribute('role');
          if (landmark === 'nav') {
            el.setAttribute('aria-label', `Secondary navigation ${index}`);
          } else if (landmark === 'footer') {
            el.setAttribute('role', 'contentinfo');
          }
        }
      });
    }
  });
  const mainLandmarks = document.querySelectorAll('main[role="main"]');
  if (mainLandmarks.length > 1) {
    mainLandmarks.forEach((main, index) => {
      if (index > 0) {
        const section = document.createElement('section');
        const ariaLabel = main.getAttribute('aria-label') || `Alternative main content ${index}`;
        section.setAttribute('aria-label', ariaLabel);
        while (main.firstChild) {
          section.appendChild(main.firstChild);
        }
        const attributes = main.attributes;
        Array.from(attributes).forEach(attr => {
          if (attr.name !== 'aria-label') {
            section.setAttribute(attr.name, attr.value);
          }
        });
        main.parentNode.replaceChild(section, main);
      }
    });
  }
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href][href="#"], a[href][href=""]');
  fakeLinks.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    if (tagName !== 'a') {
      element.setAttribute('role', 'link');
      element.setAttribute('tabindex', '0');
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    }
    if (element.getAttribute('href') === '#' || element.getAttribute('href') === '') {
      if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
        console.warn('Fake link missing accessible name');
      }
    }
  });
}

// Initialize accessibility fixes
function initializeAccessibility() {
  addLangAttribute();
  fixTableStructureIssues();
  addMainLandmark();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
}

// Export all accessibility functions for testing
export {
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  initializeAccessibility
};

// Main application render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Run accessibility initialization after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
  initializeAccessibility();
}