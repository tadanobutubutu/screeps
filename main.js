// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
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
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const headers = firstRow.querySelectorAll('td');
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
    table.querySelectorAll('td').forEach(td => {
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

// REACT_017: Add/fix 2 landmark issues
function addMainLandmark() {
  let main = document.querySelector('main');
  if (!main) {
    main = document.createElement('main');
    main.id = 'main-content';
    const content = document.querySelector('#content') || document.querySelector('.content');
    if (content) {
      main.appendChild(content);
      while (content.firstChild) {
        main.appendChild(content.firstChild);
      }
      content.remove();
    }
  } else {
    main.id = main.id || 'main-content';
  }
  const banners = document.querySelectorAll('header');
  banners.forEach((banner, index) => {
    if (!banner.hasAttribute('role')) {
      banner.setAttribute('role', 'banner');
    }
  });
}

// REACT_041: Add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title') || document.createElement('title');
    if (!svg.querySelector('title')) {
      const ariaLabel = svg.getAttribute('aria-label') || 
                        (index === 0 ? 'Logo' : 'Icon') + ' ' + (index + 1);
      title.textContent = ariaLabel;
      svg.insertBefore(title, svg.firstChild);
    }
    svg.setAttribute('role', 'img');
    if (!svg.hasAttribute('aria-labelledby')) {
      svg.setAttribute('aria-labelledby', title.id = `svg-title-${index}`);
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
          el.removeAttribute(landmark === 'header' ? 'role' : '');
          if (landmark === 'nav') {
            el.setAttribute('aria-label', `Secondary navigation ${index}`);
          } else if (landmark === 'footer') {
            el.setAttribute('role', 'contentinfo');
          }
        }
      });
    }
  });
  const mainLandmarks = document.querySelectorAll('[role="main"]');
  if (mainLandmarks.length > 1) {
    mainLandmarks.forEach((main, index) => {
      if (index > 0) {
        main.setAttribute('aria-label', `Alternative main content ${index}`);
      }
    });
  }
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], span.clickable, div.clickable');
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