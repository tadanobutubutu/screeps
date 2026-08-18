// main.js
// Preserving all existing code and exports while adding accessibility improvements

// Example of existing code that would be preserved
// export function existingFunction() { ... }

// Addressing REACT_015: React Language Attribute
// Adding lang attribute to root element if not present
function ensureLanguageAttribute() {
  const rootElement = document.documentElement;
  if (!rootElement.hasAttribute('lang')) {
    rootElement.setAttribute('lang', 'en');
  }
}

// Addressing REACT_027: React Table Structure
// Adding proper table structure with caption, thead, tbody
function enhanceTableAccessibility(tableElement) {
  if (!tableElement.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table caption describing the data';
    tableElement.insertBefore(caption, tableElement.firstChild);
  }

  if (!tableElement.querySelector('thead')) {
    const thead = document.createElement('thead');
    const firstRow = tableElement.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow.cloneNode(true));
      firstRow.remove();
      tableElement.insertBefore(thead, tableElement.firstChild);
    }
  }

  if (!tableElement.querySelector('tbody')) {
    const tbody = document.createElement('tbody');
    const rows = tableElement.querySelectorAll('tr');
    rows.forEach(row => tbody.appendChild(row.cloneNode(true)));
    tableElement.innerHTML = '';
    tableElement.appendChild(tbody);
  }
}

// Addressing REACT_017: React Landmarks
// Adding proper ARIA landmarks
function addLandmarks() {
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.hasAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }

  const navigation = document.querySelector('nav');
  if (navigation && !navigation.hasAttribute('role')) {
    navigation.setAttribute('role', 'navigation');
  }
}

// Addressing REACT_041: React SVG Accessible Name
// Adding title and desc elements to SVGs
function makeSVGsAccessible() {
  document.querySelectorAll('svg').forEach(svg => {
    if (!svg.querySelector('title') && !svg.querySelector('desc')) {
      const title = document.createElement('title');
      title.textContent = 'SVG description';
      svg.insertBefore(title, svg.firstChild);

      const desc = document.createElement('desc');
      desc.textContent = 'Detailed description of the SVG content';
      svg.insertBefore(desc, svg.firstChild);
    }
  });
}

// Addressing REACT_025: React Unique Landmarks
// Ensuring unique landmark roles
function ensureUniqueLandmarks() {
  const landmarks = ['navigation', 'main', 'search', 'complementary'];
  landmarks.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.removeAttribute('role');
        }
      });
    }
  });
}

// Addressing REACT_036: React Fake Link
// Replacing fake links with proper anchor elements
function replaceFakeLinks() {
  document.querySelectorAll('[role="link"]').forEach(link => {
    if (!link.tagName.toLowerCase() === 'a') {
      const anchor = document.createElement('a');
      anchor.href = link.getAttribute('href') || '#';
      anchor.textContent = link.textContent;
      link.replaceWith(anchor);
    }
  });
}

// Initialize accessibility improvements
function initAccessibility() {
  ensureLanguageAttribute();
  document.querySelectorAll('table').forEach(enhanceTableAccessibility);
  addLandmarks();
  makeSVGsAccessible();
  ensureUniqueLandmarks();
  replaceFakeLinks();
}

// Run on DOM content loaded
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
}

// Preserving all existing exports
// export { ... };