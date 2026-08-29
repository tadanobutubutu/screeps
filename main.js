import { dependencyGraphContent, indexContent } from './content';

// Ensure the root HTML element has a language attribute
if (document.documentElement) {
  document.documentElement.lang = 'en';
}

// Fix table structure issues
function fixTableStructure(table) {
  if (!table.thead) table.thead = document.createElement('thead');
  if (!table.tbody) table.tbody = document.createElement('tbody');
  if (!table.tfoot) table.tfoot = document.createElement('tfoot');
  return true;
}
if (Array.isArray(dependencyGraphContent.tables)) {
  dependencyGraphContent.tables.forEach(fixTableStructure);
}

// Add/maintain landmark issues
function addMainLandmark() {
  const mainLandmark = { id: 'main', name: 'Main Landmark', type: 'landmark' };
  dependencyGraphContent.landmarks.push(mainLandmark);
}
function addRegionLandmarks() {
  const regions = [
    { id: 'region1', name: 'Region 1', type: 'region' },
    { id: 'region2', name: 'Region 2', type: 'region' }
  ];
  dependencyGraphContent.landmarks.push(...regions);
}
function ensureUniqueLandmarks() {
  const ids = new Set();
  dependencyGraphContent.landmarks.forEach(l => {
    if (ids.has(l.id)) {
      throw new Error(`Duplicate landmark ID: ${l.id}`);
    }
    ids.add(l.id);
  });
}

// Add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = dependencyGraphContent.svgs || [];
  svgs.forEach(svg => {
    if (svg.alt) return;
    svg.alt = svg.tagName.toLowerCase().replace(/([a-z])([A-Z])/g, '$1 $2')
            .trim() || 'No description';
  });
}
function addAccessibleNamesToSVGs() {
  // Ensure every SVG has an alt attribute
  const svgs = dependencyGraphContent.svgs || [];
  svgs.forEach(svg => {
    if (!svg.alt) {
      svg.alt = svg.tagName.toLowerCase().replace(/([a-z])([A-Z])/g, '$1 $2')
              .trim() || 'No description';
    }
  });
}

// Fix fake link issue
function fixFakeLinkIssue() {
  const anchor = document.querySelector('a[href]');
  if (anchor && !anchor.matches('a[href^="http"]')) {
    anchor.href = '#';
  }
}

// Google sign-in logic
function googleSignIn() {
  // Placeholder for Google sign-in integration
  console.log('Google sign-in logic initialized');
}

// Replace my-button with actual button id
function fixButtonIdentifiers() {
  const btn = document.querySelector('.my-button');
  if (btn) {
    btn.id = 'submit-button';
  }
}

// Ensure dependencyGraph container has proper ARIA role
function ensureDependencyGraphAriaRole() {
  const container = document.getElementById('dependency-graph');
  if (container) {
    container.setAttribute('role', 'region');
  }
}

// Execute all fixes
fixTableStructure;
addMainLandmark();
addRegionLandmarks();
ensureUniqueLandmarks();
addSvgAccessibleNames();
addAccessibleNamesToSVGs();
fixFakeLinkIssue();
googleSignIn();
fixButtonIdentifiers();
ensureDependencyGraphAriaRole();

export default { dependencyGraphContent, indexContent };