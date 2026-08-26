// Restore previously removed exports and address accessibility issues from insight report
// Ensure the dependencyGraph container has a proper ARIA role
const { renderGraphContent } = require('./dependency-graph');

const dependencyGraph = document.querySelector('#dependencyGraph .dependencyGraph');
if (dependencyGraph) {
  dependencyGraph.setAttribute('role', 'tree');
  dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
}

// Render dependency graph content
function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  const container = document.getElementById('dependencyGraph');
  if (container) {
    container.innerHTML = data;
  }
}

// Ensure unique landmarks
function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks goes here.
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
  const seen = new Set();
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (seen.has(role)) {
      landmark.removeAttribute('role');
    } else {
      seen.add(role);
    }
  });
}

// Fix fake link issue
function fixFakeLinks() {
  // Implementation for fixing fake link issues goes here.
  // This function is to be added as per the issue report.
  const fakeLinks = document.querySelectorAll('span[role="link"], div[role="link"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
    if (!link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Button');
    }
  });
}

// Fix table structure issues for better accessibility
function fixTableStructureIssues() {
  // Ensure all tables have proper structure with thead and tbody
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Check if table has a thead
    let thead = table.querySelector('thead');
    
    // If no thead, create one and move first row to it
    if (!thead) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.querySelector('tbody') || table.firstChild);
      }
    }
    
    // Ensure table has tbody
    let tbody = table.querySelector('tbody');
    if (!tbody) {
      tbody = document.createElement('tbody');
      // Move remaining rows (not in thead) to tbody
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        if (!row.parentNode.classList?.contains('thead')) {
          tbody.appendChild(row);
        }
      });
      // If we had a thead, append tbody after it
      if (thead) {
        table.appendChild(tbody);
      } else {
        table.insertBefore(tbody, table.firstChild);
      }
    }
  });
}

// New function to implement accessibility fixes
function implementNewFunction() {
  // Apply accessibility fixes defined in this module
  fixFakeLinks();
  ensureUniqueLandmarks();
  fixTableStructureIssues();
}

// Export the module functions
module.exports = {
  renderDependencyGraphContent,
  ensureUniqueLandmarks,
  fixFakeLinks,
  implementNewFunction
};