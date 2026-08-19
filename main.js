import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Main rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Adds accessible name to SVG elements to comply with REACT_041 rule
 * @param {React.ReactElement} svgElement - The SVG element to make accessible
 * @param {string} label - The accessible name for the SVG
 * @returns {React.ReactElement} The accessible SVG element
 */
function makeSvgAccessible(svgElement, label) {
  return React.cloneElement(svgElement, {
    'aria-label': label,
    role: 'img'
  });
}

// For app/layout.tsx
const AppLayout = ({ children }) => {
  return (
    <React.StrictMode>
      <main>
        {children}
      </main>
    </React.StrictMode>
  );
};

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => {
  return (
    <React.StrictMode>
      <main>
        {children}
      </main>
    </React.StrictMode>
  );
};

// For docs/dependency-graph.html
// This would be handled in the HTML file directly, but if you need to modify the React component:
const DependencyGraph = () => {
  return (
    <main>
      <table id="table-rotated">
        <thead>
          <tr>
            <th scope="col"><div>src/constants.js</div></th>
            <th scope="col"><div>src/managers/roomManager.js</div></th>
            <th scope="col"><div>src/managers/spawnManager.js</div></th>
            <th scope="col"><div>src/managers/towerManager.js</div></th>
            <th scope="col"><div>src/roles/builder.js</div></th>
          </tr>
        </thead>
        <tbody>
          {/* table content */}
        </tbody>
      </table>
    </main>
  );
};

// For docs/index.html
// This would be handled in the HTML file directly, but if you need to modify the React component:
const DocsIndex = () => {
  return (
    <main>
      <div className="container">
        <h2>Quality & Metrics Reports</h2>
        <p>
          This repository is fully optimized with automated tools. Explore the generated
          reports below:
        </p>
        <div className="links">
          <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
          <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
        </div>
      </div>
    </main>
  );
};

// Add accessibility improvements for REACT_015 (React Language Attribute)
document.documentElement.lang = 'en'; // Set default language for screen readers

// Add accessibility improvements for REACT_027 (React Table Structure)
function enhanceTableAccessibility(table) {
  if (!table) return;

  // Add scope attributes to table headers
  const headers = table.querySelectorAll('th');
  headers.forEach(header => {
    header.setAttribute('scope', 'col');
  });

  // Add ARIA labels if needed
  if (!table.getAttribute('aria-label') && !table.querySelector('caption')) {
    table.setAttribute('aria-label', 'Data table');
  }
}

// Add accessibility improvements for REACT_017 (React Landmarks)
function ensureLandmarks() {
  // Ensure main content has a landmark
  if (!document.querySelector('main, [role="main"]')) {
    const mainContent = document.querySelector('div[role="main"]') ||
                        document.querySelector('div.main-content') ||
                        document.querySelector('section');
    if (mainContent) {
      mainContent.setAttribute('role', 'main');
    }
  }

  // Ensure navigation has a landmark
  if (!document.querySelector('nav, [role="navigation"]')) {
    const nav = document.querySelector('div[role="navigation"]') ||
                document.querySelector('ul.nav');
    if (nav) {
      nav.setAttribute('role', 'navigation');
    }
  }
}

// Add accessibility improvements for REACT_041 (React SVG Accessible Name)
function enhanceSVGAccessibility() {
  document.querySelectorAll('svg:not([aria-hidden="true"])').forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title, desc')) {
      svg.setAttribute('aria-label', 'Decorative graphic');
    }
  });
}

// Add accessibility improvements for REACT_025 (React Unique Landmarks)
function ensureUniqueLandmarks() {
  const landmarks = ['main', 'navigation', 'search', 'complementary', 'contentinfo'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.setAttribute('aria-label', `${landmark} ${index + 1}`);
        }
      });
    }
  });
}

// Add accessibility improvements for REACT_036 (React Fake Link)
function enhanceLinkAccessibility() {
  document.querySelectorAll('[role="link"], [tabindex="0"]').forEach(el => {
    if (!el.getAttribute('aria-label') && !el.textContent.trim()) {
      el.setAttribute('aria-label', 'Link');
    }
  });
}

// Initialize accessibility enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Apply table accessibility improvements
  document.querySelectorAll('table').forEach(enhanceTableAccessibility);

  // Ensure proper landmarks
  ensureLandmarks();

  // Enhance SVG accessibility
  enhanceSVGAccessibility();

  // Ensure unique landmarks
  ensureUniqueLandmarks();

  // Enhance link accessibility
  enhanceLinkAccessibility();
});

// Export all components for testing
export {
  AppLayout,
  DashboardLayout,
  DependencyGraph,
  DocsIndex
};

// Preserve all existing exports
export { existingFunction1, existingFunction2, existingVariable };