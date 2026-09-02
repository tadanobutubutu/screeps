const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function validateLandmark(landmark) {
  const errors = [];
  const validLandmarks = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary'];
  const role = landmark.getAttribute('role');
  if (!validLandmarks.includes(role)) {
    errors.push('Invalid landmark role');
  }
  return errors;
}

function validateTableAccessibility(tableElement) {
  const issues = [];
  if (!tableElement.querySelector('caption')) {
    issues.push('Table missing caption');
  }
  if (!tableElement.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }
  const headerCells = tableElement.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      issues.push('Missing scope attribute on header cell');
    }
  });
  return issues;
}

function validateTableStructure(tableElement) {
  if (!tableElement.querySelectorAll('tr').length) {
    console.warn('Table has no rows');
    return false;
  }
  return true;
}

function ensureUniqueLandmarks() {
  const allLandmarks = document.querySelectorAll('[role]');
  let hasMain = false;
  let hasNavigation = false;

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role === 'main') hasMain = true;
    if (role === 'navigation') hasNavigation = true;
  });

  if (!hasMain) {
    console.warn('Missing main landmark');
  }
  if (!hasNavigation) {
    console.warn('Missing navigation landmark');
  }

  return hasMain && hasNavigation;
}

module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks
};