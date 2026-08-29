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

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;
    
    const identifier = landmark.id || landmark.name || JSON.stringify(landmark);
    
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

function validateTableAccessibility(table) {
  if (!table) {
    return { valid: false, errors: ['Table is not provided'] };
  }

  const errors = [];
  const warnings = [];

  if (!table.tagName || table.tagName.toLowerCase() !== 'table') {
    errors.push('Element is not a <table> element');
  }

  if (table.caption && !table.caption.trim()) {
    errors.push('Table has an empty <caption> element');
  } else if (!table.caption && !table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
    warnings.push('Table is missing a <caption> or aria-label/aria-labelledby attribute');
  }

  if (table.summary && !table.summary.trim()) {
    errors.push('Table has an empty summary attribute');
  }

  const rows = table.rows || [];
  if (rows.length === 0) {
    errors.push('Table has no rows');
  } else {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.cells || [];
      for (let j = 0; j < cells.length; j++) {
        const cell = cells[j];
        if (cell.tagName && cell.tagName.toLowerCase() === 'td' && !cell.scope) {
          const rowSpan = parseInt(cell.getAttribute('rowspan') || '1', 10);
          if (rowSpan > 1) {
            warnings.push(`Cell at row ${i}, column ${j} uses rowspan but is not a <th> with scope`);
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

function validateTableStructure(table) {
  if (!table) {
    return { valid: false, errors: ['Table is not provided'] };
  }

  const errors = [];
  const warnings = [];

  if (!table.tagName || table.tagName.toLowerCase() !== 'table') {
    errors.push('Element is not a <table> element');
  }

  const rows = table.rows || [];
  if (rows.length === 0) {
    errors.push('Table has no rows');
    return { valid: false, errors, warnings };
  }

  const firstRowCellCount = (rows[0].cells || []).length;
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].cells || [];
    if (cells.length !== firstRowCellCount) {
      errors.push(`Row ${i} has ${cells.length} cells, expected ${firstRowCellCount}`);
    }
  }

  const thead = table.tHead;
  const tbody = table.tBodies;
  const tfoot = table.tFoot;

  if (thead && thead.rows.length > 0) {
    const headerCells = thead.rows[0].cells || [];
    for (let i = 0; i < headerCells.length; i++) {
      const cell = headerCells[i];
      if (cell.tagName && cell.tagName.toLowerCase() === 'th' && !cell.scope) {
        warnings.push(`Header cell at index ${i} is missing a scope attribute`);
      }
    }
  }

  if (tbody.length === 0) {
    errors.push('Table has no <tbody> section');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  validateTableAccessibility,
  validateTableStructure
};