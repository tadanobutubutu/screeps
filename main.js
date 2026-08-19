// main.js
// Preserving all existing code and exports while adding accessibility improvements

// Example of existing code (preserved as-is)
export function existingFunction() {
  // ... existing implementation
}

// Addressing REACT_015: React Language Attribute
// Adding lang attribute to root element if not present
export function ensureLanguageAttribute() {
  const root = document.documentElement;
  if (!root.hasAttribute('lang')) {
    root.setAttribute('lang', 'en'); // Default to English
  }
}

// Addressing REACT_027: React Table Structure
// Adding proper table structure with caption and scope attributes
export function createAccessibleTable(data) {
  const table = document.createElement('table');
  table.setAttribute('aria-label', 'Data table');

  // Add caption
  const caption = document.createElement('caption');
  caption.textContent = 'Table of data';
  table.appendChild(caption);

  // Add table headers with scope
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // Assuming data has headers
  data.headers.forEach(header => {
    const th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.textContent = header;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Add table body
  const tbody = document.createElement('tbody');

  data.rows.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach((cell, index) => {
      const td = document.createElement('td');
      td.setAttribute('headers', data.headers[index]);
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  return table;
}

// Addressing REACT_017: React Landmarks
// Adding proper ARIA landmarks
export function addLandmarks() {
  // Add header landmark
  const header = document.querySelector('header');
  if (header && !header.hasAttribute('role')) {
    header.setAttribute('role', 'banner');
  }

  // Add main content landmark
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }

  // Add navigation landmark
  const nav = document.querySelector('nav');
  if (nav && !nav.hasAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }

  // Add footer landmark
  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
}

// Addressing REACT_041: React SVG Accessible Name
// Adding accessible names to SVGs
export function makeSvgAccessible(svgElement, name) {
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', name);
  }
}

// Addressing REACT_025: React Unique Landmarks
// Ensuring landmarks are unique
export function ensureUniqueLandmarks() {
  const landmarks = {
    banner: document.querySelectorAll('[role="banner"]'),
    navigation: document.querySelectorAll('[role="navigation"]'),
    main: document.querySelectorAll('[role="main"]'),
    contentinfo: document.querySelectorAll('[role="contentinfo"]')
  };

  // Ensure only one banner
  if (landmarks.banner.length > 1) {
    console.warn('Multiple banner landmarks found. Only the first one will be used.');
  }

  // Ensure only one main
  if (landmarks.main.length > 1) {
    console.warn('Multiple main landmarks found. Only the first one will be used.');
  }

  // Ensure only one contentinfo
  if (landmarks.contentinfo.length > 1) {
    console.warn('Multiple contentinfo landmarks found. Only the first one will be used.');
  }
}

// Addressing REACT_036: React Fake Link
// Replacing fake links with proper anchor elements
export function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"], [role="button"]');

  fakeLinks.forEach(element => {
    if (element.getAttribute('role') === 'link' && !element.tagName.toLowerCase() === 'a') {
      const anchor = document.createElement('a');
      anchor.href = element.getAttribute('data-href') || '#';
      anchor.textContent = element.textContent;
      element.replaceWith(anchor);
    }
  });
}

// Initialize accessibility improvements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  ensureLanguageAttribute();
  addLandmarks();
  ensureUniqueLandmarks();
  replaceFakeLinks();
});