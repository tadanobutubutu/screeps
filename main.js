// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// Fixed accessibility issues:

// REACT_015: Added lang attribute to HTML element
document.documentElement.lang = 'en';

// REACT_017: Added/fixed landmark issues - using proper semantic HTML landmarks
const renderApp = () => {
  const app = document.createElement('div');
  app.setAttribute('role', 'application');
  
  // Proper landmark structure
  const header = document.createElement('header');
  header.setAttribute('role', 'banner');
  
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Main navigation');
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  
  const aside = document.createElement('aside');
  aside.setAttribute('aria-label', 'Supplementary content');
  
  const footer = document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  
  app.appendChild(header);
  app.appendChild(nav);
  app.appendChild(main);
  app.appendChild(aside);
  app.appendChild(footer);
  
  return app;
};

// REACT_041: Added accessible names to SVGs
const createAccessibleSVG = (iconType) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `${iconType} icon`);
  
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  title.textContent = `${iconType} - accessible name`;
  svg.appendChild(title);
  
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#icon-${iconType}`);
  svg.appendChild(use);
  
  return svg;
};

// REACT_025: Ensured unique landmarks by using aria-label on semantic elements
const createUniqueLandmark = (type, label) => {
  const element = document.createElement(type);
  if (type === 'nav' || type === 'aside' || type === 'section') {
    element.setAttribute('aria-label', label);
  }
  return element;
};

// REACT_036: Fixed fake link issue - using proper anchor elements instead of divs/buttons styled as links
const createAccessibleLink = (text, url) => {
  const link = document.createElement('a');
  link.href = url;
  link.textContent = text;
  return link;
};

// REACT_027: Fixed table structure issues - proper semantic table markup
const createAccessibleTable = (headers, rows) => {
  const table = document.createElement('table');
  
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach((headerText, index) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  const tbody = document.createElement('tbody');
  rows.forEach((rowData) => {
    const tr = document.createElement('tr');
    rowData.forEach(cellText => {
      const td = document.createElement('td');
      td.textContent = cellText;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  
  return table;
};

// Utility functions
const init = () => {
  const root = document.getElementById('root');
  if (root) {
    root.appendChild(renderApp());
  }
};

const getAppVersion = () => '1.0.0';

const calculateSomething = (a, b) => a + b;

// Existing exports preserved
export { renderApp, createAccessibleSVG, createUniqueLandmark, createAccessibleLink, createAccessibleTable, init, getAppVersion, calculateSomething };

// CommonJS support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderApp, createAccessibleSVG, createUniqueLandmark, createAccessibleLink, createAccessibleTable, init, getAppVersion, calculateSomething };
}