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

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svgElement) {
  if (!svgElement || typeof svgElement !== 'object') {
    return '';
  }
  
  // Check for aria-label
  if (svgElement['aria-label']) {
    return svgElement['aria-label'];
  }
  
  // Check for aria-labelledby reference
  if (svgElement['aria-labelledby']) {
    return svgElement['aria-labelledby'];
  }
  
  // Check for title element
  if (svgElement.title) {
    return svgElement.title;
  }
  
  // Check for desc element
  if (svgElement.desc) {
    return svgElement.desc;
  }
  
  return '';
}

// REACT_036: Fix fake link issue
function personName(name, options = {}) {
  if (!name || typeof name !== 'string') {
    return '';
  }
  
  // Ensure person names are not treated as fake links
  // Return properly formatted name with accessibility support
  return name.trim();
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(htmlString, lang = 'en') {
  if (typeof htmlString !== 'string') {
    return htmlString;
  }
  
  // Check if html tag already has lang attribute
  if (/<html[^>]*lang=/i.test(htmlString)) {
    // Update existing lang attribute
    return htmlString.replace(/lang="[^"]*"/i, `lang="${lang}"`);
  }
  
  // Add lang attribute to html tag
  return htmlString.replace(/<html([^>]*)>/i, `<html$1 lang="${lang}">`);
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
  if (!table || typeof table !== 'object') {
    return { valid: false, errors: ['Invalid table object'] };
  }
  
  const errors = [];
  
  // Check for thead
  if (!table.thead) {
    errors.push('Missing thead element');
  }
  
  // Check for tbody
  if (!table.tbody) {
    errors.push('Missing tbody element');
  }
  
  // Check th elements have scope attribute
  if (table.thead && table.thead.rows) {
    table.thead.rows.forEach(row => {
      row.cells.forEach(cell => {
        if (cell.tagName === 'TH' && !cell.scope) {
          errors.push('TH element missing scope attribute');
        }
      });
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// REACT_027: Fix table structure
function fixTableStructure(table) {
  if (!table || typeof table !== 'object') {
    return table;
  }
  
  const fixedTable = { ...table };
  
  // Ensure tbody exists
  if (!fixedTable.tbody && fixedTable.rows) {
    fixedTable.tbody = { rows: fixedTable.rows };
    delete fixedTable.rows;
  }
  
  // Ensure th elements have scope attribute
  if (fixedTable.thead && fixedTable.thead.rows) {
    fixedTable.thead.rows.forEach(row => {
      row.cells.forEach(cell => {
        if (cell.tagName === 'TH' && !cell.scope) {
          cell.scope = 'col';
        }
      });
    });
  }
  
  return fixedTable;
}

// REACT_017: Add main landmark
function addMainLandmark(landmarks) {
  if (!Array.isArray(landmarks)) {
    return landmarks;
  }
  
  const hasMain = landmarks.some(l => l && l.role === 'main');
  
  if (!hasMain) {
    landmarks.push({ role: 'main', label: 'Main content' });
  }
  
  return landmarks;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;
    
    const identifier = landmark.id || landmark.name || landmark.role || JSON.stringify(landmark);
    
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  personName,
  addLangAttribute,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark
};