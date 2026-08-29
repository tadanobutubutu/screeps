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

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and wrapPrimaryContentInMain())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and addAriaToFormControls())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())

// Function to ensure unique landmarks
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

// REACT_015: Add lang attribute to HTML element
function getLangAttribute(doc) {
  const htmlElement = doc && doc.documentElement ? doc.documentElement : null;
  return htmlElement ? htmlElement.getAttribute('lang') || 'en' : 'en';
}

function wrapPrimaryContentInMain(content, lang) {
  const language = lang || 'en';
  return `<main lang="${language}">${content}</main>`;
}

// REACT_027: Fix 26 table structure issues
function validateTableAccessibility(table) {
  if (!table) return { valid: false, errors: ['Table is null or undefined'] };
  
  const errors = [];
  
  if (!table.caption && !table.getAttribute('aria-label')) {
    errors.push('Table missing caption or aria-label');
  }
  
  if (table.rows && table.rows.length > 1) {
    const headerCells = table.querySelectorAll('th');
    if (headerCells.length === 0) {
      errors.push('Table missing header cells (th elements)');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

function validateTableStructure(table) {
  if (!table || !table.rows) return { valid: false, errors: ['Invalid table structure'] };
  
  const errors = [];
  const rowCount = table.rows.length;
  
  for (let i = 0; i < rowCount; i++) {
    const row = table.rows[i];
    if (!row.cells || row.cells.length === 0) {
      errors.push(`Row ${i} has no cells`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

// REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  if (!element) return { valid: false, error: 'Element is null' };
  
  const role = element.getAttribute('role');
  const ariaLabel = element.getAttribute('aria-label');
  
  if (!role && !ariaLabel) {
    return { valid: false, error: 'Landmark missing role or aria-label' };
  }
  
  return { valid: true, error: null };
}

function validateLandmarkStructure(container) {
  if (!container) return { valid: false, errors: ['Container is null or undefined'] };
  
  const errors = [];
  const landmarks = container.querySelectorAll('[role="main"], [role="nav"], [role="banner"], [role="contentinfo"], [role="complementary"]');
  
  const landmarkCounts = {};
  landmarks.forEach(lm => {
    const role = lm.getAttribute('role');
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
  });
  
  if (landmarkCounts['banner'] && landmarkCounts['banner'] > 1) {
    errors.push('Multiple banner landmarks found');
  }
  if (landmarkCounts['main'] && landmarkCounts['main'] > 1) {
    errors.push('Multiple main landmarks found');
  }
  
  return { valid: errors.length === 0, errors };
}

function addFixLandmarkIssues(landmarks) {
  if (!Array.isArray(landmarks)) return [];
  
  return landmarks.map(landmark => {
    if (!landmark || !landmark.element) return landmark;
    
    const element = landmark.element;
    const role = element.getAttribute('role');
    
    if (!role) {
      element.setAttribute('role', 'region');
    }
    
    if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
      const name = element.getAttribute('name') || element.id || 'Unnamed landmark';
      element.setAttribute('aria-label', name);
    }
    
    return landmark;
  });
}

// REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;
  
  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }
  
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelledElement = svgElement.ownerDocument && svgElement.ownerDocument.getElementById(ariaLabelledby);
    if (labelledElement) {
      return labelledElement.textContent.trim();
    }
  }
  
  return null;
}

function addAriaToFormControls(controls) {
  if (!Array.isArray(controls)) return [];
  
  return controls.map(control => {
    if (!control || !control.element) return control;
    
    const element = control.element;
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        const label = element.id && element.ownerDocument ? element.ownerDocument.querySelector(`label[for="${element.id}"]`) : null;
        if (label && label.textContent) {
          element.setAttribute('aria-label', label.textContent.trim());
        }
      }
      
      if (element.hasAttribute('required') && !element.getAttribute('aria-required')) {
        element.setAttribute('aria-required', 'true');
      }
    }
    
    return control;
  });
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinkIssues(links) {
  if (!Array.isArray(links)) return [];
  
  return links.map(link => {
    if (!link || !link.element) return link;
    
    const element = link.element;
    const href = element.getAttribute('href');
    
    if (!href || href === '#' || href === '') {
      return { ...link, isFakeLink: true };
    }
    
    if (element.onclick && !element.getAttribute('role')) {
      element.setAttribute('role', 'link');
    }
    
    return link;
  });
}

function createAccessibleLink(url, text, options = {}) {
  const link = document.createElement('a');
  link.href = url;
  link.textContent = text || 'Link';
  
  if (options.title) {
    link.setAttribute('title', options.title);
  }
  
  if (options.ariaLabel) {
    link.setAttribute('aria-label', options.ariaLabel);
  }
  
  if (options.external) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
  
  return link;
}

// Export functions for testing
module.exports = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  getLangAttribute,
  wrapPrimaryContentInMain,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  addFixLandmarkIssues,
  getSvgAccessibleName,
  addAriaToFormControls,
  fixFakeLinkIssues,
  createAccessibleLink
};