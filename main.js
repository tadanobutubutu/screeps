const { renderGraphContent } = require('./dependency-graph');

document.querySelector('#dependencyGraph .dependencyGraph').setAttribute('role', 'tree');
document.querySelector('#dependencyGraph .dependencyGraph').setAttribute('aria-label', 'Dependency Graph');

// Render dependency graph content
function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  document.querySelector('#dependencyGraph .dependencyGraph').innerHTML = data;
}

// Ensure unique landmarks
function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks goes here.
  // This function is to be added as per the issue report.
}

// Fix fake link issue
function fixFakeLinks() {
  // Implementation for fixing fake link issues goes here.
  // This function is to be added as per the issue report.
}

// Update the original export function to include the new method and keep the old one for calling from another file
module.exports = {
  renderDependencyGraphContent,
  ensureUniqueLandmarks,
  fixFakeLinks,
  renderGraphContent // original export preserves for calling from another file
};

// Call renderGraphContent function from another file
renderGraphContent(someData);

// Update SVGs in layout files for accessibility
const layoutFiles = [
  'app/layout.tsx',
  'dashboard/app/layout.tsx'
];

layoutFiles.forEach((filePath) => {
  const svgElements = document.querySelectorAll(`${filePath} svg`);
  svgElements.forEach((svg) => {
    if (!svg.querySelector('title') && !svg.querySelector('aria-label')) {
      // If the SVG has a text element but no title or aria-label, add an aria-label attribute
      const textElements = svg.querySelectorAll('text');
      if (textElements.length > 0) {
        svg.setAttribute('aria-label', textElements[0].textContent);
      } else {
        // If there is no text element, add aria-hidden="true" to indicate it's decorative
        svg.setAttribute('aria-hidden', 'true');
      }
    }
  });
});