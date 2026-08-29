import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

// TODO: Identify and update specific functions that render dependency graphs or
// display module structure for debugging purposes.

function function3() {
  // TODO: Implement new function3 logic here
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', 'en');
    fetchData();
  }, []);

  // REACT_017: Add landmark roles to fix landmark issues
  // REACT_025: Ensure unique landmarks
  // REACT_036: Fix fake link issues
  // REACT_041: Add accessible names to SVGs

  // REACT_015 & REACT_017: Ensure document has lang attribute and proper landmark structure
  return (
    <div className="app-container">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  );
}

export function getUniqueLandmarkName(baseName, existingNames) {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }
  let counter = 2;
  let newName = `${baseName}-${counter}`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName}-${counter}`;
  }
  return newName;
}

export function validateUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
  const landmarkNames = new Set();
  const issues = [];

  landmarks.forEach((landmark) => {
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledby = landmark.getAttribute('aria-labelledby');
    const tagName = landmark.tagName.toLowerCase();

    // Determine the landmark name
    let landmarkName = ariaLabel || ariaLabelledby || tagName;

    if (landmarkNames.has(landmarkName)) {
      issues.push({
        element: landmark,
        message: `Duplicate landmark found: "${landmarkName}". Use unique aria-label or aria-labelledby.`,
        severity: 'warning'
      });
    } else {
      landmarkNames.add(landmarkName);
    }
  });

  return issues;
}

export function addSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) return;

  // Add title element as first child
  const title = document.createElement('title');
  title.id = `svg-title-${Date.now()}`;
  title.textContent = accessibleName;

  // Insert title as first child
  svgElement.insertBefore(title, svgElement.firstChild);

  // Add aria-labelledby attribute
  svgElement.setAttribute('aria-labelledby', title.id);
}

export function isValidLink(element) {
  // ... existing code ...
}

export function addScopeToHeaders(tableElement) {
  // ... existing code ...
}

function addressAccessibilityIssues(insightReport) {
  insightReport.forEach(issue => {
    console.log(`Addressing issue: ${issue.issue}`);
    // TODO: Implement solution to the issue
    console.log(`Solution: ${issue.solution}`);
    // ... code to apply the solution ...
  });
}

function newFunction() {
  // implementation of new function
}

module.exports.newFunction = newFunction;

// Dependency graph / module structure rendering functions for debugging purposes

/**
 * Builds an adjacency list representation of the module dependency graph.
 * @param {Array<{name: string, dependencies: string[]}>} modules
 * @returns {Object<string, string[]>}
 */
function buildDependencyGraph(modules) {
  const graph = {};
  if (!Array.isArray(modules)) {
    return graph;
  }
  modules.forEach((module) => {
    if (module && typeof module.name === 'string') {
      graph[module.name] = Array.isArray(module.dependencies) ? module.dependencies : [];
    }
  });
  return graph;
}

/**
 * Renders the dependency graph as an ASCII tree for debugging purposes.
 * @param {Object<string, string[]>} graph
 * @param {string} rootName
 * @returns {string}
 */
function renderDependencyGraph(graph, rootName) {
  if (!graph || typeof graph !== 'object') {
    return '';
  }
  if (!rootName || !graph[rootName]) {
    return Object.keys(graph).map((key) => renderDependencyGraph(graph, key)).join('\n');
  }
  const lines = [];
  const visited = new Set();

  function walk(node, prefix, isLast) {
    if (visited.has(node)) {
      lines.push(`${prefix}${isLast ? '└── ' : '├── '}${node} (circular)`);
      return;
    }
    visited.add(node);
    lines.push(`${prefix}${isLast ? '└── ' : '├── '}${node}`);
    const children = graph[node] || [];
    children.forEach((child, index) => {
      const last = index === children.length - 1;
      walk(child, prefix + (isLast ? '    ' : '│   '), last);
    });
  }

  walk(rootName, '', true);
  return lines.join('\n');
}

/**
 * Renders a flat module structure list showing each module and its direct dependencies.
 * Useful for quick debugging of module relationships.
 * @param {Object<string, string[]>} graph
 * @returns {string}
 */
function renderModuleStructure(graph) {
  if (!graph || typeof graph !== 'object') {
    return '';
  }
  return Object.keys(graph)
    .map((name) => {
      const deps = (graph[name] || []).join(', ');
      return `${name} -> [${deps}]`;
    })
    .join('\n');
}

/**
 * Logs the dependency graph and module structure to the console for debugging.
 * @param {Array<{name: string, dependencies: string[]}>} modules
 * @param {string} [rootName]
 */
function debugModuleStructure(modules, rootName) {
  const graph = buildDependencyGraph(modules);
  // eslint-disable-next-line no-console
  console.log('=== Module Structure ===');
  // eslint-disable-next-line no-console
  console.log(renderModuleStructure(graph));
  if (rootName) {
    // eslint-disable-next-line no-console
    console.log('=== Dependency Graph ===');
    // eslint-disable-next-line no-console
    console.log(renderDependencyGraph(graph, rootName));
  }
}

export {
  function3,
  App,
  getUniqueLandmarkName,
  validateUniqueLandmarks,
  addSvgAccessibleName,
  isValidLink,
  addScopeToHeaders,
  addressAccessibilityIssues,
  announceToScreenReader,
  trapFocus,
  manageFocusOnNavigation,
  prefersReducedMotion,
  setAriaExpanded,
  hasAccessibleName,
  newFunction,
  buildDependencyGraph,
  renderDependencyGraph,
  renderModuleStructure,
  debugModuleStructure
};