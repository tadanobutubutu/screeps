// main.js - Accessibility-focused implementation

function validateTableAccessibility(table, index) {
  const issues = [];

  if (!table) {
    issues.push(`Table at index ${index}: Table element is missing or null`);
    return issues;
  }

  // Check for table headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push(`Table at index ${index}: No table headers (th) found`);
  }

  // Check for proper caption or aria-label
  const caption = table.querySelector('caption');
  const ariaLabel = table.getAttribute('aria-label');
  if (!caption && !ariaLabel) {
    issues.push(`Table at index ${index}: Missing caption or aria-label`);
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

  return issues;
}

function validateLandmark(element) {
  const issues = [];

  if (!element) {
    issues.push('Landmark element is missing or null');
    return issues;
  }

  // Check for valid landmark role
  const validLandmarkRoles = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];
  const role = element.getAttribute('role');
  
  if (!role || !validLandmarkRoles.includes(role)) {
    issues.push(`Landmark element missing valid role. Expected one of: ${validLandmarkRoles.join(', ')}`);
  }

  // Check for accessible name if required
  if (role !== 'main' && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    issues.push(`Landmark element with role "${role}" should have an accessible name`);
  }

  return issues;
}

function validateLandmarkStructure() {
  const issues = [];
  const landmarks = document.querySelectorAll('[role="main"], [role="nav"], [role="header"], [role="footer"], [role="aside"], [role="section"], [role="article"]');

  landmarks.forEach((landmark, index) => {
    const landmarkIssues = validateLandmark(landmark);
    issues.push(...landmarkIssues);
  });

  return issues;
}

function getSvgAccessibleName(svgElements) {
  const accessibleNames = [];
  
  svgElements.forEach((svg, index) => {
    let name = svg.getAttribute('aria-label') || 
               svg.getAttribute('title') || 
               svg.getAttribute('aria-labelledby');
    
    if (!name) {
      name = `SVG element at index ${index}`;
    }
    
    accessibleNames.push({
      element: svg,
      name: name
    });
  });
  
  return accessibleNames;
}

function setSvgAttributes(svgElements) {
  svgElements.forEach((svg, index) => {
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
    
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('title')) {
      svg.setAttribute('aria-label', `SVG graphic ${index + 1}`);
    }
  });
}

function validateTableStructureIssues(element) {
  const issues = [];
  
  if (!element) {
    issues.push('Element is null or undefined');
    return issues;
  }

  // Check if it's a table element
  if (element.tagName !== 'TABLE') {
    issues.push('Element is not a table');
    return issues;
  }

  // Validate table structure
  const rows = element.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push('Table has no rows');
  }

  // Check for consistent column counts
  let firstRowColumns = -1;
  rows.forEach((row, index) => {
    const columns = row.querySelectorAll('td, th').length;
    if (firstRowColumns === -1) {
      firstRowColumns = columns;
    } else if (columns !== firstRowColumns) {
      issues.push(`Row ${index} has ${columns} columns, expected ${firstRowColumns}`);
    }
  });

  return issues;
}

function validateLandmarkIssues(element) {
  const issues = [];
  
  if (!element) {
    issues.push('Element is null or undefined');
    return issues;
  }

  const role = element.getAttribute('role');
  const validLandmarkRoles = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];
  
  if (!role) {
    issues.push('Element has no role attribute');
  } else if (!validLandmarkRoles.includes(role)) {
    issues.push(`Invalid landmark role: ${role}`);
  }

  // Check for duplicate landmarks
  const allLandmarks = document.querySelectorAll(`[role="${role}"]`);
  if (allLandmarks.length > 1 && role !== 'article' && role !== 'section') {
    issues.push(`Duplicate landmark role "${role}" found`);
  }

  return issues;
}

function addSvgAccessibleNames(svgElement) {
  if (!svgElement) return;

  // Try to generate a meaningful accessible name
  const existingName = svgElement.getAttribute('aria-label') || 
                       svgElement.getAttribute('title');
  
  if (!existingName) {
    // Use surrounding text or context
    const parentText = svgElement.parentElement?.textContent?.trim();
    const fallbackName = parentText || 'Interactive SVG graphic';
    svgElement.setAttribute('aria-label', fallbackName);
  }
}

function ensureUniqueLandmarks() {
  const issues = [];
  const landmarkCounts = {};
  const landmarks = document.querySelectorAll('[role="main"], [role="nav"], [role="header"], [role="footer"], [role="aside"], [role="section"], [role="article"]');

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
  });

  // Check for duplicates that should be unique
  const uniqueLandmarks = ['main', 'header', 'footer'];
  uniqueLandmarks.forEach(role => {
    if (landmarkCounts[role] > 1) {
      issues.push(`Multiple "${role}" landmarks found - should be unique`);
    }
  });

  return issues;
}

function fixFakeLinks(linkElements) {
  linkElements.forEach(link => {
    // Check if link has meaningful text
    const linkText = link.textContent?.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const title = link.getAttribute('title');
    
    if (!linkText && !ariaLabel && !title) {
      // Add default accessible name
      link.setAttribute('aria-label', 'Link to ' + (link.href || 'unknown destination'));
    }
    
    // Check for empty links
    if (linkText === '' && !ariaLabel && !title) {
      link.setAttribute('aria-label', 'Empty link - requires accessible name');
    }
  });
}

export {
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateTableStructureIssues,
  validateLandmarkIssues,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks
};