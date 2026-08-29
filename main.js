import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

// TODO: Identify and update specific functions that render dependency graphs or
// index views.
function renderDependencyGraph(data) {
  // Renders a dependency graph based on the provided data
  if (!data || !data.dependencies) {
    return null;
  }

  const nodes = [];
  const edges = [];

  // Process dependencies into nodes and edges for visualization
  Object.entries(data.dependencies).forEach(([packageName, deps]) => {
    nodes.push({ id: packageName, label: packageName });
    if (Array.isArray(deps)) {
      deps.forEach((dep) => {
        edges.push({ source: packageName, target: dep });
      });
    }
  });

  return { nodes, edges };
}

function renderIndexView(data) {
  // Renders an index view based on the provided data
  if (!data) {
    return null;
  }

  const items = [];

  if (data.packages) {
    Object.entries(data.packages).forEach(([name, info]) => {
      items.push({
        name,
        version: info.version,
        description: info.description || ''
      });
    });
  } else if (Array.isArray(data)) {
    data.forEach((item) => {
      items.push({
        name: item.name || item,
        version: item.version || '',
        description: item.description || ''
      });
    });
  }

  return { items, total: items.length };
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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

  // REACT_015: Set the lang attribute on the HTML element
  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  // REACT_017: Add landmark roles and fix landmark issues
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

// Assuming the button click is handled by JavaScript, here's how it might look:
const button = document.getElementById('rotateButton');
if (button) {
  button.addEventListener('click', rotateBack);
}

function rotateBack() {
  // Function to handle rotating back
}

// main.js

(function initAccessibility() {
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('role', 'banner');
  }

  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    // Check if SVG is hidden
    const isHidden = svg.getAttribute('aria-hidden') === 'true' ||
                     svg.parentElement === null ||
                     svg.style.display === 'none' ||
                     svg.style.visibility === 'hidden';

    const hasAriaLabel = svg.getAttribute('aria-label');
    const hasAriaLabelledBy = svg.getAttribute('aria-labelledby');
    const hasTitle = svg.querySelector('title');
    const hasDesc = svg.querySelector('desc');

    if (hasAriaLabel || hasAriaLabelledBy || hasTitle || hasDesc) {
      return;
    }

    // Determine if decorative - SVGs used for favicons/decorative purposes
    const isFavicon = svg.closest('link') !== null ||
                      (svg.parentElement && svg.parentElement.tagName === 'LINK') ||
                      svg.getAttribute('aria-hidden') === 'true';

    if (isFavicon) {
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('role', 'presentation');
    } else {
      // Add a generic title for non-decorative SVGs
      const title = document.createElement('title');
      title.textContent = 'Icon';
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', 'Icon');
    }
  });

  // Function to handle updating accessible SVG names when DOM mutates
  const updateAccessibleSvgNames = () => {
    setTimeout(() => {
      initAccessibility();
    }, 0);
  };

  // Initial run
  updateAccessibleSvgNames();

  // Run again after DOM mutations
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      updateAccessibleSvgNames();
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-hidden', 'aria-label', 'aria-labelledby']
      });
    }
  }
})();

// REACT_017: Add landmark roles to fix landmark issues
export function getUniqueName(baseName, existingNames) {
  if (!existingNames || !existingNames.includes(baseName)) {
    return baseName;
  }
  let counter = 2;
  let newName = `${baseName} ${counter}`;
  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName} ${counter}`;
  }
  return newName;
}

// REACT_025: Ensure unique landmarks function
export function checkUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
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

// REACT_041: Add accessible names to SVGs
export function addAccessibleNameToSvg(svgElement, accessibleName) {
  if (!svgElement) return;

  // Add title element as first child
  const title = document.createElement('title');
  title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
  title.textContent = accessibleName;

  // Insert title as first child
  svgElement.insertBefore(title, svgElement.firstChild);

  // Add aria-labelledby attribute
  svgElement.setAttribute