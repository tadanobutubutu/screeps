// main.js

// TODO: Implement validateLandmark functionality
function validateLandmark(landmark) {
  // Check if landmark exists
  if (!landmark) {
    return false;
  }

  // Check if landmark has required properties
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    return false;
  }

  // Check if landmark has valid coordinates
  if (landmark.coordinates) {
    if (typeof landmark.coordinates.lat !== 'number' || typeof landmark.coordinates.lng !== 'number') {
      return false;
    }
    
    // Validate latitude range (-90 to 90)
    if (landmark.coordinates.lat < -90 || landmark.coordinates.lat > 90) {
      return false;
    }
    
    // Validate longitude range (-180 to 180)
    if (landmark.coordinates.lng < -180 || landmark.coordinates.lng > 180) {
      return false;
    }
  }

  return true;
}

// REACT_015: Add lang attribute to HTML element
function getLangAttribute(element) {
  if (!element) {
    return null;
  }
  
  // Return existing lang attribute or detect from element
  return element.getAttribute ? element.getAttribute('lang') || element.lang || null : null;
}

// REACT_015 & REACT_036: Create in-page navigation button
function createInPageButton(options = {}) {
  const { id = 'in-page-nav', label = 'Skip to content', target = '#main-content' } = options;
  
  return {
    id,
    label,
    target,
    className: 'in-page-button',
    ariaLabel: label,
    role: 'button',
    tabIndex: 0
  };
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  if (!table) {
    return { valid: false, errors: ['Table is null or undefined'] };
  }
  
  const errors = [];
  
  // Check if table has proper scope attributes
  if (!table.scope) {
    errors.push('Table missing scope attribute');
  }
  
  // Check for caption
  if (!table.caption) {
    errors.push('Table missing caption');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
  if (!table) {
    return { valid: false, errors: ['Table is null or undefined'] };
  }
  
  const errors = [];
  
  // Check for proper table headers (th elements)
  if (!table.headers || table.headers.length === 0) {
    errors.push('Table missing header cells');
  }
  
  // Check for consistent column count
  if (table.rows && table.rows.length > 0) {
    const headerCount = table.headers ? table.headers.length : 0;
    table.rows.forEach((row, index) => {
      if (row.length !== headerCount) {
        errors.push(`Row ${index} has inconsistent column count`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svg) {
  if (!svg) {
    return null;
  }
  
  // Check aria-label
  if (svg.getAttribute) {
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) {
      return ariaLabel;
    }
    
    // Check aria-labelledby
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
      return { type: 'aria-labelledby', id: ariaLabelledby };
    }
    
    // Check title element
    const title = svg.querySelector('title');
    if (title && title.textContent) {
      return title.textContent;
    }
  }
  
  return null;
}

// REACT_041: Set SVG accessibility attributes
function setSvgAttributes(svg, options = {}) {
  if (!svg) {
    return false;
  }
  
  const { accessibleName, role = 'img', description = null } = options;
  
  if (accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
  }
  
  if (role) {
    svg.setAttribute('role', role);
  }
  
  if (description) {
    // Add or update title element
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      svg.insertBefore(title, svg.firstChild);
    }
    title.textContent = description;
  }
  
  return true;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
  if (!landmarks || !Array.isArray(landmarks)) {
    return { valid: false, duplicates: [], message: 'Invalid landmarks array' };
  }
  
  const seen = new Map();
  const duplicates = [];
  
  landmarks.forEach((landmark, index) => {
    const key = landmark.role || landmark.tagName;
    if (seen.has(key)) {
      duplicates.push({ index, landmark, firstIndex: seen.get(key) });
    } else {
      seen.set(key, index);
    }
  });
  
  return {
    valid: duplicates.length === 0,
    duplicates,
    uniqueLandmarks: landmarks.filter((l, i) => !duplicates.find(d => d.index === i))
  };
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(link) {
  if (!link) {
    return { valid: false, errors: ['Link is null or undefined'] };
  }
  
  const errors = [];
  
  // Check for accessible name
  const text = link.textContent ? link.textContent.trim() : '';
  const ariaLabel = link.getAttribute ? link.getAttribute('aria-label') : null;
  
  if (!text && !ariaLabel) {
    errors.push('Link has no accessible name');
  }
  
  // Check for href
  if (!link.href && link.getAttribute && link.getAttribute('href') !== '#') {
    errors.push('Link missing valid href');
  }
  
  // Check for proper role if not an anchor
  if (link.tagName && link.tagName !== 'A' && link.tagName !== 'BUTTON') {
    if (!link.role) {
      errors.push('Non-semantic link missing role attribute');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// REACT_036: Handle fake links (links that aren't anchor tags)
function handleFakeLinks(elements) {
  if (!elements || !Array.isArray(elements)) {
    return { converted: [], warnings: [] };
  }
  
  const converted = [];
  const warnings = [];
  
  elements.forEach((element) => {
    if (element.tagName && element.tagName !== 'A' && element.tagName !== 'BUTTON') {
      const onclick = element.getAttribute ? element.getAttribute('onclick') : null;
      const href = element.getAttribute ? element.getAttribute('href') : null;
      
      if (onclick || href) {
        warnings.push({
          element,
          message: 'Fake link detected (non-anchor with click handler)',
          suggestion: 'Use <a> or <button> element instead'
        });
        
        // Add button role and accessibility attributes
        if (element.setAttribute) {
          element.setAttribute('role', 'button');
          if (!element.getAttribute('aria-label') && !element.textContent) {
            warnings.push({
              element,
              message: 'Element has no accessible name'
            });
          }
        }
        
        converted.push(element);
      }
    }
  });
  
  return { converted, warnings };
}

// REACT_037: Add proper landmark regions
function addProperLandmarkRegions(document) {
  if (!document) {
    return { added: [], message: 'Document not provided' };
  }
  
  const added = [];
  const requiredLandmarks = ['banner', 'navigation', 'main', 'contentinfo', 'complementary'];
  
  requiredLandmarks.forEach(role => {
    const existing = document.querySelector(`[role="${role}"]`);
    if (!existing) {
      const landmark = document.createElement('div');
      landmark.setAttribute('role', role);
      landmark.setAttribute('aria-label', role);
      added.push({ role, element: landmark });
    }
  });
  
  return {
    added,
    message: `Added ${added.length} landmark regions`
  };
}

module.exports = { 
  validateLandmark,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions
};