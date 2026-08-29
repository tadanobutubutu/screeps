// Complete updated main.js

// Main application file
// TODO: This is the existing code that needs to be preserved

// TODO: Identify and update specific functions that render dependency graphs or
// index views.

const fs = require('fs');
const path = require('path');

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Function to add lang attribute to HTML element
function addLangAttribute(element, lang) {
  if (element && element.setAttribute) {
    element.setAttribute('lang', lang);
  }
}

// Function to fix table structure issues (placeholder)
function fixTableStructure(table) {
  // Example implementation: add proper header and row semantics
  if (!table || !table.tagName || table.tagName.toLowerCase() !== 'table') {
    return;
  }
  
  // Ensure table has a caption
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table caption';
    table.insertBefore(caption, table.firstChild);
  }
  
  // Ensure table has a thead
  let thead = table.querySelector('thead');
  if (!thead) {
    thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    // Add default header cells
    for (let i = 0; i < 3; i++) {
      const th = document.createElement('th');
      th.textContent = `Header ${i + 1}`;
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.insertBefore(thead, table.querySelector('caption') ? table.children[1] : table.firstChild);
  }
  
  // Ensure all rows have proper td/th structure
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    cells.forEach((cell, index) => {
      if (!cell.hasAttribute('scope')) {
        if (row.closest('thead')) {
          cell.setAttribute('scope', 'col');
        } else if (row.closest('tbody')) {
          cell.setAttribute('scope', 'row');
        }
      }
    });
  });
}

// Function to add main landmark
function addMainLandmark(element) {
  if (element && element.setAttribute) {
    element.setAttribute('role', 'main');
  }
}

// Ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;
    const key = landmark.id || landmark.tagName;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Renders a dependency graph visualization
 * @param {Object} dependencies - The dependencies object
 * @returns {string} - HTML string for the dependency graph
 */
function renderDependencyGraph(dependencies) {
    const nodes = [];
    const edges = [];
    
    for (const [name, version] of Object.entries(dependencies)) {
        nodes.push({ id: name, label: `${name}@${version}` });
        
        // For nested dependencies, create edges
        if (typeof version === 'object' && version.dependencies) {
            for (const dep of Object.keys(version.dependencies)) {
                edges.push({ from: name, to: dep });
            }
        }
    }
    
    return JSON.stringify({ nodes, edges });
}

/**
 * Renders the index view with all packages
 * @param {Array} packages - List of packages to display
 * @returns {string} - HTML string for the index view
 */
function renderIndexView(packages) {
    let html = '<!DOCTYPE html><html><head><title>Dependencies</title></head><body>';
    html += '<h1>Dependency Index</h1>';
    html += '<ul>';
    
    for (const pkg of packages) {
        html += `<li>${pkg.name} - ${pkg.version}</li>`;
    }
    
    html += '</ul></body></html>';
    return html;
}

/**
 * Main entry point for the application
 */
function main() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const graphData = renderDependencyGraph(packageJson.dependencies || {});
    const indexHtml = renderIndexView([{ name: 'example', version: '1.0.0' }]);
    
    return { graphData, indexHtml };
}

// Function to add accessible names to SVG elements
function addSvgAccessibleNames(svgElement, accessibleName) {
  if (svgElement && svgElement.setAttribute) {
    svgElement.setAttribute('aria-label', accessibleName);
    svgElement.setAttribute('role', 'img');
  }
}

// Function to fix fake link issue
function fixFakeLinkIssue(linkElement) {
  if (!linkElement || !linkElement.tagName || linkElement.tagName.toLowerCase() !== 'a') {
    return;
  }
  
  const href = linkElement.getAttribute('href');
  const textContent = linkElement.textContent?.trim();
  
  // If link appears to be a fake (no href or empty text), make it real
  if (!href || !textContent) {
    linkElement.setAttribute('href', '#');
    linkElement.setAttribute('aria-label', textContent || 'Link');
    linkElement.setAttribute('role', 'button');
  }
}

// Export functions for testing
module.exports = {
  toRad,
  ensureUniqueLandmarks,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  renderDependencyGraph,
  renderIndexView,
  main
};