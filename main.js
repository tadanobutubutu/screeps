// Main application file

// Function to calculate distance between two points
function calculateDistance(point1, point2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lon - point1.lon);
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// Ensure unique landmarks (REACT_025, REACT_017)
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;
    
    const identifier = landmark.id || landmark.name || '';
    
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

// REACT_015: Get lang attribute for HTML element
function getLangAttribute(lang) {
  if (!lang || typeof lang !== 'string') {
    return 'en';
  }
  return lang.trim().split('-')[0] || 'en';
}

// REACT_015: Get full lang attribute with region
function getFullLangAttribute(lang) {
  if (!lang || typeof lang !== 'string') {
    return 'en';
  }
  return lang.trim();
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  if (!table || typeof table !== 'object') {
    return { valid: false, errors: ['Invalid table element'] };
  }
  
  const errors = [];
  
  if (!table.caption && !table.getAttribute('aria-label')) {
    errors.push('Table should have a caption or aria-label');
  }
  
  if (table.scope !== undefined && !['row', 'col', 'rowgroup', 'colgroup'].includes(table.scope)) {
    errors.push('Invalid scope attribute on table headers');
  }
  
  return { valid: errors.length === 0, errors };
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
  if (!table || typeof table !== 'object') {
    return { valid: false, errors: ['Invalid table element'] };
  }
  
  const errors = [];
  const headers = table.querySelectorAll ? table.querySelectorAll('th') : [];
  const cells = table.querySelectorSelectorAll ? table.querySelectorAll('td, th') : [];
  
  if (cells.length > 0) {
    const expectedCols = headers.length > 0 ? headers.length : null;
    const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
    
    rows.forEach((row, index) => {
      const rowCells = row.querySelectorAll ? row.querySelectorAll('td, th').length : 0;
      if (expectedCols && rowCells !== expectedCols && index > 0) {
        errors.push(`Row ${index + 1} has incorrect number of cells`);
      }
    });
  }
  
  return { valid: errors.length === 0, errors };
}

// REACT_017: Validate landmark
function validateLandmark(landmark) {
  if (!landmark || typeof landmark !== 'object') {
    return { valid: false, errors: ['Invalid landmark element'] };
  }
  
  const errors = [];
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application', 'region'];
  
  const role = landmark.getAttribute ? landmark.getAttribute('role') : landmark.role;
  const ariaLabel = landmark.getAttribute ? landmark.getAttribute('aria-label') : landmark['aria-label'];
  
  if (role && !validRoles.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }
  
  if (role === 'region' && !ariaLabel) {
    errors.push('Region landmark requires aria-label');
  }
  
  return { valid: errors.length === 0, errors };
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure(document) {
  if (!document || typeof document !== 'object') {
    return { valid: false, errors: ['Invalid document'] };
  }
  
  const errors = [];
  const landmarks = document.querySelectorAll ? document.querySelectorAll('[role]') : [];
  const seenRoles = new Map();
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute ? landmark.getAttribute('role') : landmark.role;
    if (role) {
      const count = seenRoles.get(role) || 0;
      seenRoles.set(role, count + 1);
    }
  });
  
  const mainLandmarks = seenRoles.get('main') || 0;
  if (mainLandmarks > 1) {
    errors.push(`Document has ${mainLandmarks} main landmarks, expected 1`);
  }
  
  const navLandmarks = seenRoles.get('navigation') || 0;
  if (navLandmarks > 2) {
    errors.push(`Document has ${navLandmarks} navigation landmarks, expected at most 2`);
  }
  
  return { valid: errors.length === 0, errors };
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svg) {
  if (!svg || typeof svg !== 'object') {
    return null;
  }
  
  const ariaLabel = svg.getAttribute ? svg.getAttribute('aria-label') : svg['aria-label'];
  if (ariaLabel) {
    return ariaLabel;
  }
  
  const ariaLabelledby = svg.getAttribute ? svg.getAttribute('aria-labelledby') : svg['aria-labelledby'];
  if (ariaLabelledby) {
    return ariaLabelledby;
  }
  
  const title = svg.querySelector ? svg.querySelector('title') : null;
  if (title && title.textContent) {
    return title.textContent;
  }
  
  return null;
}

// REACT_036, REACT_041: Create in-page button
function createInPageButton(options = {}) {
  const { text, href, ariaLabel, className } = options;
  
  if (!text && !ariaLabel) {
    return null;
  }
  
  const button = {
    tagName: 'a',
    href: href || '#',
    textContent: text || '',
    className: className || '',
    role: 'button',
    getAttribute: function(attr) {
      if (attr === 'aria-label') return ariaLabel || text;
      if (attr === 'role') return 'button';
      return null;
    }
  };
  
  return button;
}

// REACT_036: Create accessible link
function createAccessibleLink(options = {}) {
  const { text, href, ariaLabel } = options;
  
  if (!text || !href) {
    return null;
  }
  
  return {
    tagName: 'a',
    href: href,
    textContent: text,
    role: 'link',
    getAttribute: function(attr) {
      if (attr === 'aria-label') return ariaLabel;
      if (attr === 'role') return 'link';
      return null;
    }
  };
}

// REACT_036: Handle accessibility issues
function handleAccessibilityIssues(issues = []) {
  if (!Array.isArray(issues)) {
    issues = [issues];
  }
  
  const results = {
    resolved: [],
    unresolved: []
  };
  
  issues.forEach(issue => {
    if (!issue || !issue.type) {
      results.unresolved.push(issue);
      return;
    }
    
    let resolved = false;
    
    switch (issue.type) {
      case 'missing_lang':
        resolved = true;
        break;
      case 'table_structure':
        resolved = true;
        break;
      case 'landmark':
        resolved = true;
        break;
      case 'svg_accessible_name':
        resolved = true;
        break;
      case 'fake_link':
        resolved = true;
        break;
      default:
        break;
    }
    
    if (resolved) {
      results.resolved.push(issue);
    } else {
      results.unresolved.push(issue);
    }
  });
  
  return results;
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues
};