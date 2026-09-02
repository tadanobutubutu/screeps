// main.js - Accessibility-focused implementation

// TODO: This is the existing code that needs to be preserved
// ... (existing code)

function validateTableAccessibility(table, index) {
  const issues = [];

  if (!table) {
    issues.push(`Table at index ${index}: Table element is missing or null`);
    return issues;
  }

  // Validate table structure and accessibility
  if (!table.rows) {
    issues.push('Table has no rows');
    return issues;
  }

  const headerRow = table.querySelector('thead tr');
  if (!headerRow) {
    issues.push('Table missing header row');
    return issues;
  }

  const dataRows = Array.from(table.tBrowsersByTag('tr')).filter(row => row.children.length > 0);
  if (dataRows.length === 0) {
    issues.push('Table has no data rows');
    return issues;
  }

  // Check for td/th elements
  const cells = table.querySelectorAll('tr td, tr th');
  if (cells.length === 0) {
    issues.push('Table has no cells');
    return issues;
  }

  return issues;
}

function validateTableStructure() {
  const issues = [];
  const tables = document.querySelectorAll('table');

  tables.forEach((table, index) => {
    const tableIssues = validateTableAccessibility(table, index);
    issues.push(...tableIssues);
  });

  // Additional structure validation
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    if (rows.length === 0) continue;

    // Ensure caption exists
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }

    // Check for proper row structure
    rows.forEach(row => {
      if (row.children.length === 0) continue;
    });
  });

  return issues;
}

function ensureElementIdAndAriaLabel(element) {
  if (!element.id) {
    element.id = `generated-id-${Date.now()}`;
  }
  if (!element.ariaLabel) {
    element.setAttribute('aria-label', 'default label');
  }
}

function getSvgAccessibleName(svg) {
  // Try to get accessible name from various attributes
  return svg.getAttribute('aria-label') ||
         svg.getAttribute('title') ||
         svg.getAttribute('alt') ||
         svg.getAttribute('data-name') || null;
}

function setSvgAttributes(svg) {
  // Set default SVG attributes for accessibility
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.hasAttribute('focusable')) {
    svg.setAttribute('focusable', 'true');
  }
}

function renderDependencyGraphs(svgElements) {
  const accessibleName = getSvgAccessibleName(svgElements);
  if (accessibleName) {
    // Use accessibleName
    console.log(`Using accessible name: ${accessibleName}`);
  }

  setSvgAttributes(svgElements);
}

function countDependencies() {
  const fs = require('fs');
  const packageJsonPath = require('path').join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  return {
    dependencies: Object.keys(dependencies).length,
    devDependencies: Object.keys(devDependencies).length,
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };

  const landmarkRoles = [
    'banner',
    'main',
    'navigation',
    'search',
    'contentinfo',
    'complementary',
    'region',
    'form'
  ];

  checkLandmarkElement('[role="main"], main', 'main', {
    'main': 'main',
    'header': 'banner',
    'nav': 'navigation',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'form': 'form',
    'section': 'region'
  });

  checkLandmarkElement('[role="banner"], header', 'banner');
  checkLandmarkElement('[role="navigation"], nav', 'navigation');
  checkLandmarkElement('[role="contentinfo"], footer', 'contentinfo');
  checkLandmarkElement('[role="complementary"],