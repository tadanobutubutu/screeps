// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Modify SVG elements in both layout files (line 7 in app/layout.tsx and dashboard/app/layout.tsx) to include aria-hidden="true"
document.addEventListener('DOMContentLoaded', () => {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const title = svg.querySelector('title');
    if (!title) {
      const desc = svg.getAttribute('alt') || 'Graphic';
      const newTitle = document.createElement('title');
      newTitle.textContent = desc;
      svg.insertBefore(newTitle, svg.firstChild);
      svg.setAttribute('role', 'img');
    }
    svg.setAttribute('aria-hidden', 'true');
  });
});

// Add function to handle the fake link issue
function handleFakeLinkClick(event) {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute('href').substring(1);
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    targetElement.click();
  }
}

// Apply the fix to all hash-only links
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', handleFakeLinkClick);
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });
});

// Add function to handle table structure issues
function ensureTableAccessibility() {
  document.querySelectorAll('table').forEach(table => {
    // Ensure table has a caption
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table data';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure table has proper headers
    const headers = table.querySelectorAll('th');
    if (headers.length > 0) {
      table.setAttribute('role', 'grid');
      headers.forEach((header, index) => {
        header.setAttribute('scope', 'col');
        header.setAttribute('id', `col-header-${index}`);
      });

      // Associate cells with headers
      const rows = table.querySelectorAll('tr');
      rows.forEach((row, rowIndex) => {
        if (rowIndex > 0) { // Skip header row
          const cells = row.querySelectorAll('td');
          cells.forEach((cell, cellIndex) => {
            if (cellIndex < headers.length) {
              cell.setAttribute('headers', `col-header-${cellIndex}`);
            }
          });
        }
      });
    }
  });
}

// Add function to handle landmark issues
function ensureLandmarkAccessibility() {
  // Ensure main content has a landmark
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.getAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }

  // Ensure navigation has a landmark
  const nav = document.querySelector('nav');
  if (nav && !nav.getAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }
}

// Apply accessibility fixes on DOM load
document.addEventListener('DOMContentLoaded', () => {
  ensureTableAccessibility();
  ensureLandmarkAccessibility();
});

// Existing code remains unchanged
// ...

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// All other existing code remains exactly as is
// ...

// React accessibility fix function for module environments (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    applyREACT041Fix: () => {
      const svgElements = document.querySelectorAll('svg');
      svgElements.forEach(svg => {
        const title = svg.querySelector('title');
        if (!title) {
          const desc = svg.getAttribute('alt') || 'Graphic';
          const newTitle = document.createElement('title');
          newTitle.textContent = desc;
          svg.insertBefore(newTitle, svg.firstChild);
          svg.setAttribute('role', 'img');
        }
        svg.setAttribute('aria-hidden', 'true');
      });
    }
  };
}