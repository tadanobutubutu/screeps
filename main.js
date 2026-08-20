// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Modify SVG elements in both layout files (line 7 in app/layout.tsx and dashboard/app/layout.tsx) to include aria-hidden="true"
document.querySelectorAll('svg').forEach(svg => {
  if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
    const title = svg.querySelector('title');
    if (!title) {
      const desc = svg.getAttribute('alt') || 'Graphic';
      title = document.createElement('title');
      title.textContent = desc;
      svg.appendChild(title);
    }
    svg.setAttribute('aria-hidden', 'true');
  }
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
    if (!table.getAttribute('role')) {
      table.setAttribute('role', 'table');
    }

    table.querySelectorAll('thead, tbody, tfoot').forEach(section => {
      if (!section.getAttribute('role')) {
        section.setAttribute('role', section.tagName.toLowerCase());
      }
    });

    table.querySelectorAll('th, td').forEach(cell => {
      if (!cell.getAttribute('role')) {
        cell.setAttribute('role', cell.tagName.toLowerCase());
      }
    });
  });
}

// Add function to handle landmark issues
function ensureLandmarkAccessibility() {
  const landmarks = {
    'header': 'banner',
    'nav': 'navigation',
    'main': 'main',
    'footer': 'contentinfo',
    'aside': 'complementary'
  };

  Object.keys(landmarks).forEach(tag => {
    document.querySelectorAll(tag).forEach(element => {
      if (!element.getAttribute('role') && !element.getAttribute('aria-label')) {
        element.setAttribute('role', landmarks[tag]);
      }
    });
  });
}

// Add function to handle SVG accessible name issues
function ensureSVGAccessibility() {
  document.querySelectorAll('svg').forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
      const title = svg.querySelector('title');
      if (!title) {
        const desc = svg.getAttribute('alt') || 'Graphic';
        const titleElement = document.createElement('title');
        titleElement.textContent = desc;
        svg.appendChild(titleElement);
      }
      svg.setAttribute('aria-hidden', 'true');
    }
  });
}

// Add function to handle unique landmark issues
function ensureUniqueLandmarks() {
  const landmarkCounts = {};

  document.querySelectorAll('[role]').forEach(element => {
    const role = element.getAttribute('role');
    if (['banner', 'navigation', 'main', 'complementary', 'contentinfo'].includes(role)) {
      landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
    }
  });

  Object.keys(landmarkCounts).forEach(role => {
    if (landmarkCounts[role] > 1) {
      const elements = document.querySelectorAll(`[role="${role}"]`);
      elements.forEach((element, index) => {
        if (index > 0) {
          element.setAttribute('aria-label', `${role} ${index + 1}`);
        }
      });
    }
  });
}

// Initialize all accessibility fixes on DOM load
document.addEventListener('DOMContentLoaded', () => {
  ensureTableAccessibility();
  ensureLandmarkAccessibility();
  ensureSVGAccessibility();
  ensureUniqueLandmarks();

  // Existing fake link fix
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', handleFakeLinkClick);
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });
});

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
      document.querySelectorAll('svg').forEach(svg => {
        if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
          const title = svg.querySelector('title');
          if (!title) {
            const desc = svg.getAttribute('alt') || 'Graphic';
            title = document.createElement('title');
            title.textContent = desc;
            svg.appendChild(title);
          }
          svg.setAttribute('aria-hidden', 'true');
        }
      });
    }
  };
}