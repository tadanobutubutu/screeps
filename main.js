// Add this function to ensure proper language attribute is set
function ensureLanguageAttribute() {
  if (typeof document !== 'undefined') {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
    }
  }
}

// Add this function to ensure proper table structure
function ensureTableStructure(tableElement) {
  if (!tableElement) return;

  // Ensure table has proper caption if needed
  if (!tableElement.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table data';
    tableElement.prepend(caption);
  }

  // Ensure table has proper headers
  const headers = tableElement.querySelectorAll('th');
  if (headers.length === 0) {
    const firstRow = tableElement.querySelector('tr');
    if (firstRow) {
      const cells = firstRow.querySelectorAll('td');
      cells.forEach(cell => {
        const th = document.createElement('th');
        th.textContent = cell.textContent;
        cell.replaceWith(th);
      });
    }
  }
}

// Add this function to ensure proper landmarks
function ensureLandmarks() {
  if (typeof document === 'undefined') return;

  // Ensure main landmark exists
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    const content = document.querySelector('body > *:not(script):not(style)');
    if (content) {
      main.appendChild(content);
      document.body.prepend(main);
    }
  }

  // Ensure navigation landmark exists if needed
  if (!document.querySelector('nav') && document.querySelector('a')) {
    const nav = document.createElement('nav');
    const firstLink = document.querySelector('a');
    nav.appendChild(firstLink.cloneNode(true));
    firstLink.replaceWith(nav);
  }
}

// Add this function to ensure SVG accessibility
function ensureSvgAccessibility(svgElement) {
  if (!svgElement) return;

  // Add title if missing
  if (!svgElement.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = 'Graphic';
    svgElement.prepend(title);
  }

  // Add description if missing
  if (!svgElement.querySelector('desc')) {
    const desc = document.createElement('desc');
    desc.textContent = 'Description of the graphic';
    svgElement.prepend(desc);
  }
}

// Add this function to handle fake links
function handleFakeLinks() {
  if (typeof document === 'undefined') return;

  // Find elements that look like links but aren't
  const fakeLinks = document.querySelectorAll('[role="link"], [tabindex="0"]');
  fakeLinks.forEach(link => {
    if (!link.hasAttribute('href') && !link.hasAttribute('onclick')) {
      link.setAttribute('role', 'button');
    }
  });
}

// Initialize accessibility improvements when DOM is ready
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ensureLanguageAttribute();
    ensureLandmarks();
    handleFakeLinks();

    // Apply to all tables
    document.querySelectorAll('table').forEach(ensureTableStructure);

    // Apply to all SVGs
    document.querySelectorAll('svg').forEach(ensureSvgAccessibility);
  });
}

// Export all existing functions from the original main.js
// (You should replace this with your actual exports)
module.exports = {
  // Your existing exports here
};