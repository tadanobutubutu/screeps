// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Modify SVG elements in both layout files (line 7 in app/layout.tsx and dashboard/app/layout.tsx) to include aria-hidden="true"
document.querySelectorAll('svg').forEach((svg) => {
  if (!svg.hasAttribute('aria-hidden') && !svg.getAttribute('role')) {
    const title = svg.querySelector('title');
    if (!title) {
      const desc = svg.getAttribute('alt') || 'Graphic';
      title = document.createElement('title');
      title.textContent = desc;
      svg.insertBefore(title, svg.firstChild);
    }
    svg.setAttribute('aria-hidden', 'true');
  }
});

// Add function to handle the fake link issue
function handleFakeLinkClick(event) {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute('href')?.slice(1);
  const targetElement = targetId ? document.getElementById(targetId) : null;
  if (targetElement) {
    targetElement.click();
  }
}

// Apply the fix to all hash-only links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  if (!link.hasAttribute('role')) {
    link.addEventListener('click', handleFakeLinkClick);
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  }
});

// Function to add scope attributes to table header cells (REACT_027 fix)
function applyScopeToTableHeaders() {
  const tableHeaders = document.querySelectorAll('th:not([scope])');
  tableHeaders.forEach((th) => {
    const parent = th.parentElement;
    if (parent && parent.tagName === 'TR') {
      const parentTable = parent.closest('table');
      const thead = parentTable ? parentTable.querySelector('thead') : null;
      const rowIndex = thead ? Array.from(parent.children).indexOf(th) : -1;
      
      // Determine if this th is in the first column (row header) or column header
      if (thead && thead.contains(th)) {
        // It's a column header
        th.setAttribute('scope', 'col');
      } else if (rowIndex === 0) {
        // It's a row header
        th.setAttribute('scope', 'row');
      }
    }
  });
}

// Auto-apply scope attributes when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyScopeToTableHeaders);
} else {
  applyScopeToTableHeaders();
}

// Existing code remains unchanged
// ...

const root = createRoot(document.getElementById('root'));
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
      document.querySelectorAll('svg').forEach((svg) => {
        if (!svg.hasAttribute('aria-hidden') && !svg.getAttribute('role')) {
          const title = svg.querySelector('title');
          if (!title) {
            const desc = svg.getAttribute('alt') || 'Graphic';
            title = document.createElement('title');
            title.textContent = desc;
            svg.insertBefore(title, svg.firstChild);
          }
          svg.setAttribute('aria-hidden', 'true');
        }
      });
    },
    applyREACT027Fix: applyScopeToTableHeaders
  };
}