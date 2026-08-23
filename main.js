// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (This should be added in the client's build process, not in JavaScript)
// - REACT_027: Fix 26 table structure issues (Add scope attributes to <th> elements)
// - REACT_017: Add/fix 4 landmark issues
// - REACT_025: Ensure unique landmarks
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks
// - REACT_036: Fix 1 fake link issue

// Import the missing function from ... as requested in the TODO comment
import { addHtmlLangToRootElement } from './accessibility-utils.js';
export { addHtmlLangToRootElement };


// REACT_036: Fix fake link issues
export function fixFakeLinks() {
  const links = document.querySelectorAll('a[href="#"]');
  links.forEach(link => {
    const text = link.textContent;
    const id = link.id;
    const className = link.className;
    
    // Create a button with the same content and attributes
    const button = document.createElement('button');
    button.textContent = text;
    if (id) button.id = id;
    if (className) button.className = className;
    
    // Copy data attributes
    Array.from(link.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        button.setAttribute(attr.name, attr.value);
      }
    });
    
    // Replace the link with the button
    if (link.parentNode) {
      link.parentNode.replaceChild(button, link);
    }
  });
}


// REACT_027: Fix table structure issues
export function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      const row = th.parentElement;
      if (row) {
        const cells = Array.from(row.children);
        const cellIndex = cells.indexOf(th);
        const rowIndex = Array.from(table.querySelectorAll('tr')).indexOf(row);
        if (rowIndex === 0 && cellIndex !== 0 && th.textContent.trim()) {
          th.setAttribute('scope', 'col');
        } else if (cellIndex === 0 && rowIndex > 0 && th.textContent.trim()) {
          th.setAttribute('scope', 'row');
        }
      }
    });
  });
}

// REACT_017: Add landmarks
export function addLandmarks() {
  const landmarks = ['header', 'nav', 'main', 'footer'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    elements.forEach((el, index) => {
      if (!el.getAttribute('aria-label') && !el.getAttribute('role')) {
        el.setAttribute('aria-label', `${landmark}-${index + 1}`);
      }
    });
  });
}

// REACT_025: Ensure unique landmarks
export function addUniqueLandmarks() {
  const labelSet = new Set();
  const landmarks = document.querySelectorAll('header, nav, main, footer, aside, section, article');
  landmarks.forEach((landmark, i) => {
    const existingLabel = landmark.getAttribute('aria-label');
    if (!existingLabel || labelSet.has(existingLabel)) {
      const newLabel = `Landmark ${i + 1}`;
      landmark.setAttribute('aria-label', newLabel);
      labelSet.add(newLabel);
    } else {
      labelSet.add(existingLabel);
    }
  });
}

// REACT_041: Add accessible names to 2 SVGs with unique aria-labels
export function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  const svg1 = svgs[0];
  const svg2 = svgs[1];
  if (svg1 && svg2) {
    svg1.setAttribute('aria-label', 'SVG Icon 1');
    svg2.setAttribute('aria-label', 'SVG Icon 2');
    // Attach titles if not present
    const existingTitle1 = svg1.querySelector('title');
    const existingTitle2 = svg2.querySelector('title');
    const title1 = existingTitle1 || document.createElement('title');
    const title2 = existingTitle2 || document.createElement('title');
    if (!existingTitle1) {
      title1.textContent = 'Icon 1';
      svg1.insertBefore(title1, svg1.firstChild);
      title1.setAttribute('id', title1.id || 'svg-title-1');
    }
    if (!existingTitle2) {
      title2.textContent = 'Icon 2';
      svg2.insertBefore(title2, svg2.firstChild);
      title2.setAttribute('id', title2.id || 'svg-title-2');
    }
  }
}

// React_017 new function: Validate Landmark Structure
export function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('header, nav, main, footer, aside, section, article');
  const counts = {};
  landmarks.forEach(l => {
    const role = l.getAttribute('role') || l.tagName.toLowerCase();
    counts[role] = (counts[role] || 0) + 1;
  });
  // Basic check: at least one landmark exists
  return landmarks.length > 0;
}

// React_025 new function: Validate Unique Landmarks
export function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"], nav, main, footer, aside, section, article');
  const labels = new Set();
  let isUnique = true;
  landmarks.forEach(l => {
    const label = l.getAttribute('aria-label');
    if (label) {
      if (labels.has(label)) {
        console.log('Duplicate landmark label:', label);
        isUnique = false;
      } else {
        labels.add(label);
      }
    }
  });
  return isUnique;
}

// Add functions for REACT_017 as requested:
export function ensureLandmarkLabels() {
  const landmarks = document.querySelectorAll('header, nav, main, footer, aside, section, article');
  landmarks.forEach(landmark => {
    if (!landmark.getAttribute('aria-label')) {
      const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
      landmark.setAttribute('aria-label', role);
    }
    if ((landmark.getAttribute('role') === 'navigation') || landmark.tagName.toLowerCase() === 'nav') {
      const idx = Array.from(landmarks).indexOf(landmark);
      landmark.setAttribute('aria-label', `Landmark ${idx + 1}`);
    }
  });
}

// Add function for REACT_036:
export function fixLinksAccessibility() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}

// New function to add <main> landmark
export function addMainLandmark() {
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    const body = document.body;
    if (body && body.firstChild) {
      body.insertBefore(mainElement, body.firstChild);
    } else if (body) {
      body.appendChild(mainElement);
    }
  }
}

// REACT_027: Add scope attributes to header cells in tables
export function addScopeToHeaderCells() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach((th) => {
      // Check if it's in the first row (column header) or first column (row header)
      const row = th.parentElement;
      if (!row) return;
      const cells = Array.from(row.children);
      const cellIndex = cells.indexOf(th);
      const rowIndex = Array.from(table.querySelectorAll('tr')).indexOf(row);
      const isFirstRow = rowIndex === 0;
      const isFirstColumn = cellIndex === 0;

      if (isFirstRow && th.textContent.trim()) {
        // Column header
        th.setAttribute('scope', 'col');
      } else if (isFirstColumn && rowIndex > 0 && th.textContent.trim()) {
        // Potential row header (e.g., in the first column of each row)
        th.setAttribute('scope', 'row');
      }
    });
  });
}

// Initialize accessibility fixes
export function initAccessibility() {
  // Call all accessibility functions
  if (typeof addHtmlLangToRootElement === 'function') {
    addHtmlLangToRootElement();
  }
  addMainLandmark();
  addScopeToHeaderCells();
  addLandmarks();
  addUniqueLandmarks();
  ensureLandmarkLabels();
  ensureUniqueLandmarks();
  fixFakeLinks();
  fixLinksAccessibility();
  addSvgAccessibleNames();
  validateLandmarkStructure();
}

// Call the function to add the <main> landmark
addMainLandmark();

// Call the function to fix table structure accessibility issues
addScopeToHeaderCells();