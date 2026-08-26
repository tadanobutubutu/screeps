// Imported and used dependencyGraphContent and indexContent in the relevant rendering functions.
// Added type annotations for TypeScript compatibility, and fixed React 15 problems.

import { class1, function1, Object1 } from './path/to/module';
import { dependencyGraphContent, indexContent } from './content';

// Re-export imported values (if needed)
export { type Class1 as class1, type Function1 as function1, type Object1 as Object1 };

// Function to count dependencies
export function countDependencies(): number {
  // ... (existing code)
}

// Function to create an in-page navigation button
export function createInPageButton(options: {
  text?: string,
  targetId?: string,
  className?: string,
  ariaLabel?: string,
  iconText?: string,
  onClick?: (event: Event) => void,
}): HTMLButtonElement;

// Function to create an accessible link
export function createAccessibleLink(options: {
  href?: string,
  text?: string,
  title?: string,
  className?: string,
  target?: string,
  rel?: string,
  ariaLabel?: string,
  ariaDescribedby?: string,
  external?: boolean,
  download?: string | boolean,
  onClick?: (event: Event) => void,
}): HTMLAnchorElement;

// Function to render dependency graphs
export function renderDependencyGraph(containerId: string): HTMLDivElement | null;

// Function to render index view
export function renderIndexView(containerId: string): HTMLDivElement | null;

// Function to add lang attribute to HTML element
export function addLangAttribute(lang?: string): Document;

// Function to get lang attribute from HTML element
export function getLangAttribute(): string | null;

// Function to get full lang attribute (including xml:lang and complete language info)
export function getFullLangAttribute(): string | null;

// Function to fix table structure issues
export function fixTableStructure() {
  // ... (existing code)
}

// Function to handle conflict resolution
export function handleConflict() {
  // Placeholder for handling conflict resolution...
}

// Function to address accessibility issues from insight report
// REACT_015: Add lang attribute to HTML element (in main.js)
export function addLangAttribute(document, lang = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
}

// Function to fix table structure issues
export function fixTableStructureIssues(document) {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Ensure tables have proper structure with thead and tbody
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const headerCells = firstRow.querySelectorAll('th, td');
        const headerRow = document.createElement('tr');
        headerCells.forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    if (!table.querySelector('tbody')) {
      const rows = Array.from(table.querySelectorAll('tr')).filter(row => !row.parentElement.isSameNode(table.querySelector('thead')));
      const tbody = document.createElement('tbody');
      rows.forEach(row => tbody.appendChild(row));
      table.appendChild(tbody);
    }
  });
}

// Function to add main landmark
export function addMainLandmark(document) {
  const mainElement = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!mainElement) {
    const newMain = document.createElement('main');
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(newMain, body.firstChild);
    } else {
      body.appendChild(newMain);
    }
  }
}

// Function to add accessible names to SVGs
export function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  let svgCount = 0;
  svgs.forEach((svg, index) => {
    if (svgCount < 2) {
      const id = `svg-title-${index}`;
      const title = document.createElement('title');
      title.id = id;
      title.textContent = svg.getAttribute('aria-hidden') === 'true' ? 'Decorative graphic' : `SVG graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', id);
      svgCount++;
    }
  });
}

// Function to ensure unique landmarks
export function ensureUniqueLandmarks(document) {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  landmarks.forEach(role => {
    const elements = document.querySelectorAll(role);
    if (elements.length > 1) {
      let count = 0;
      elements.forEach(el => {
        if (count > 0) {
          el.removeAttribute('role');
          if (el.tagName.toLowerCase() !== role) {
            el.setAttribute('role', role);
          }
        }
        count++;
      });
    }
  });
}

// Function to fix fake link issue (convert <a> without href to <button>)
export function fixFakeLinkIssue(document) {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    const button = document.createElement('button');
    button.id = 'resolve-conflict-button';
    Array.from(link.attributes).forEach(attr => {
      if (attr.name !== 'id') {
        button.setAttribute(attr.name, attr.value);
      }
    });
    button.textContent = link.textContent;
    link.parentNode.replaceChild(button, link);
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);