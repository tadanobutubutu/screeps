import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Accessibility fix functions
export function addLangAttribute() {
  document.documentElement.lang = 'en';
}

export function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead') && table.querySelector('tr:first-child th')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
      }
    }
  });
}

export function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.setAttribute('role', 'button');
    }
  });
}

// Add ARIA labels to SVGs that don't have an accessible name
export function addAriaLabelToSVGsWithoutAccessibleName(svgs) {
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        svg.setAttribute('aria-label', title.textContent);
      }
    }
  });
}

// Ensure elements have an id and add aria-label where missing
export function ensureElementsHaveIdAndAriaLabel() {
  const elements = document.querySelectorAll('[data-dependency-graph]');
  elements.forEach(el => {
    if (!el.id) {
      el.id = 'dependency-graph-element';
    }
    if (!el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', 'Dependency Graph');
    }
  });
}

// Add proper landmark regions based on insight report data
export function addProperLandmarkRegions(data) {
  data.forEach(item => {
    if (item.role && item.selector) {
      const elements = document.querySelectorAll(item.selector);
      elements.forEach(el => {
        el.setAttribute('role', item.role);
        if (item.label) {
          el.setAttribute('aria-label', item.label);
        }
      });
    }
  });
}

// Render dependency graphs with proper accessibility attributes
export function renderDependencyGraphs(data) {
  const graphContainer = document.querySelector('.dependency-graph, [data-dependency-graph]');
  if (graphContainer && data) {
    data.forEach(item => {
      if (item.id) {
        const element = document.getElementById(item.id);
        if (element) {
          element.setAttribute('role', item.role || 'tree');
          if (item.label) {
            element.setAttribute('aria-label', item.label);
          }
        }
      }
    });
  }
}

// Generalized accessibility improvements
export function improveAccessibility() {
  // Ensure the dependencyGraph container has a proper ARIA role
  const dependencyGraph = document.querySelector('.dependency-graph, [data-dependency-graph]');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
  }

  // Add appropriate ARIA labels to SVGs without accessible name
  addAriaLabelToSVGsWithoutAccessibleName(document.querySelectorAll('svg'));

  // Ensure all clickable elements are focusable
  const focusable = document.querySelectorAll('[role="link"]');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });
}

// Function to address insight report issues
export function addressInsightIssues(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    if (issue.code === 'REACT_025') {
      ensureUniqueLandmarks();
    }
    if (issue.code === 'REACT_017') {
      // Handle REACT_017 issue - ensuring proper ARIA labels and descriptions
      const affectedElements = issue.elements || [];
      affectedElements.forEach(el => {
        if (!el['aria-label'] && !el.label) {
          el['aria-label'] = el.id || 'unnamed-element';
        }
      });
      // Add proper landmark regions from insight report data
      addProperLandmarkRegions(issue.data || []);
    }
  });
}

// Initialize accessibility fixes
export function initAccessibility() {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
  improveAccessibility();
  ensureElementsHaveIdAndAriaLabel();
  renderDependencyGraphs();
}

// New function or changes requested in the issue
function newFunction() {
  // Implementation of the new function
}

// Existing exports (do not remove or rename)
export function existingFunction() {
  // Implementation of the existing function
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerServiceWorker();