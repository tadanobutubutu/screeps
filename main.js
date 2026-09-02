const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  name: 'ScreepsBot',
  version: '1.0.0',
  debug: false,
  apiUrl: process.env.API_URL || 'https://example.com',
  timeout: 5000,
  landmarkRoles,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxLandmarks: 50
};

function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

// Accessibility functions for tables (merged from both branches)
function validateTableStructure(tableElement) {
  const rows = tableElement.querySelectorAll('tr');
  if (rows.length === 0) {
      console.warn('Table has no rows');
      return false;
  }
  return true;
}

function validateTableCellsScope(tableElement) {
  const cells = tableElement.querySelectorAll('th, td');
  if (cells.length > 0) {
    cells.forEach((cell, index) => {
      const scope = cell.getAttribute('scope');
      if (scope !== null && `${index}` !== scope) {
        console.warn(`Cell at index ${index} has incorrect scope: ${scope}`);
      }
    });
  }
}

// Accessibility functions for landmarks (merged from both branches)
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role]');
  let hasMain = false;
  let hasNavigation = false;

  landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
  });

  if (!hasMain) console.warn('Missing main landmark');
  if (!hasNavigation) console.warn('Missing navigation landmark');

  return hasMain && hasNavigation;
}
function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

// ... (Unchanged rest of the code)