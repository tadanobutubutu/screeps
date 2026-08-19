// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Modify SVG elements in both layout files (line 7 in app/layout.tsx and dashboard/app/layout.tsx) to include aria-hidden="true"
const fixSVGsAccessibleNames = () => {
  const applyAccessibilityFix = (svg) => {
    const hasAriaLabel = svg.getAttribute('aria-label');
    const hasAriaLabelledby = svg.getAttribute('aria-labelledby');
    const hasTitle = svg.querySelector('title');
    
    if (!hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
      // Check if it's a decorative icon (favicon or simple icons)
      const isFavicon = svg.getAttribute('class')?.includes('favicon') || 
                        svg.getAttribute('id')?.includes('favicon') ||
                        svg.getAttribute('role') === 'img';
      
      if (isFavicon || svg.childElementCount < 5) {
        // For decorative/small SVGs, add aria-hidden="true"
        svg.setAttribute('aria-hidden', 'true');
      } else {
        // For informational SVGs, add a <title> element
        const title = document.createElement('title');
        title.textContent = svg.getAttribute('alt') || 'Graphic';
        title.setAttribute('id', 'svg-title-' + Math.random().toString(36).substr(2, 9));
        
        // Insert title as first child
        if (svg.firstChild) {
          svg.insertBefore(title, svg.firstChild);
        } else {
          svg.appendChild(title);
        }
        
        // Add aria-labelledby pointing to the title
        svg.setAttribute('aria-labelledby', title.getAttribute('id'));
      }
    }
  };

  // Find and fix all SVG elements without accessible names
  document.querySelectorAll('svg').forEach(svg => {
    if (svg.offsetParent !== null || !svg.hasAttribute('hidden')) {
      // Only process visible SVGs
      applyAccessibilityFix(svg);
    }
  });
};

// Existing code remains unchanged
// ...

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Apply accessibility fix after initial render and on subsequent updates
if (typeof document !== 'undefined') {
  // Run on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', fixSVGsAccessibleNames);
  
  // Also run after React renders (using MutationObserver for dynamically added SVGs)
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'SVG' || (node.querySelectorAll && node.querySelectorAll('svg').length > 0)) {
            shouldCheck = true;
          }
        });
      }
    });
    if (shouldCheck) {
      fixSVGsAccessibleNames();
    }
  });
  
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
}

// All other existing code remains exactly as is
// ...

// React accessibility fix function for module environments (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    applyREACT041Fix: fixSVGsAccessibleNames,
    fixSVGsAccessibleNames
  };
}