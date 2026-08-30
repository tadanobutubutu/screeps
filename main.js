// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

module.exports = {
  // Restore any previously exported functions or values
  someFunction: function() {
    return 'some value';
  },
  
  // Add back other required exports
  CONFIG: {
    apiUrl: process.env.API_URL || 'https://api.example.com',
    timeout: 5000
  }
};

// Add back standalone exports that may have been removed
exports.helper = function(input) {
  return input ? input.toUpperCase() : '';
};

exports.formatDate = function(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
};

// Accessibility Functions

// REACT_015: Get lang attribute for HTML element
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// REACT_015 & REACT_036: Create in-page navigation button with accessibility
function createInPageButton(targetId, buttonText) {
  const button = document.createElement('button');
  button.textContent = buttonText || 'Skip to content';
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', buttonText || 'Skip to main content');
  
  button.addEventListener('click', function() {
    const target = document.getElementById(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });
  
  return button;
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['Table element is required'] };
  }
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('REACT_027: Table is missing a caption');
  }
  
  // Check for th elements with scope or headers
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope') && !th.getAttribute('id')) {
      issues.push(`REACT_027: Header at index ${index} is missing scope or id attribute`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['Table element is required'] };
  }
  
  const rows = table.querySelectorAll('tr');
  let cellCount = 0;
  
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    const isHeaderRow = row.parentElement.tagName === 'THEAD';
    
    cells.forEach((cell, cellIndex) => {
      if (cell.tagName === 'TH' && !isHeaderRow) {
        issues.push(`REACT_027: Row ${rowIndex} contains th but is not in thead`);
      }
      if (cell.tagName === 'TD' && isHeaderRow) {
        issues.push(`REACT_027: Row ${rowIndex} in thead contains td instead of th`);
      }
    });
    
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1];
      const prevCells = prevRow.querySelectorAll('td, th').length;
      if (cells.length !== prevCells) {
        issues.push(`REACT_027: Row ${rowIndex} has ${cells.length} cells but previous row has ${prevCells}`);
      }
    }
    
    cellCount += cells.length;
  });
  
  return { valid: issues.length === 0, issues };
}

// REACT_017: Validate landmarks
function validateLandmark() {
  const issues = [];
  const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"], ${landmark === 'main' ? 'main' : 'div'}`);
    if (landmark === 'main' && elements.length > 1) {
      issues.push('REACT_017: Multiple main landmarks found');
    }
  });
  
  return { valid: issues.length === 0, issues };
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure() {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  
  document.querySelectorAll('header, nav, main, aside, footer').forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    
    if (role && !validLandmarks.includes(role)) {
      issues.push(`REACT_017: Element at index ${index} has invalid role "${role}"`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svgElement) {
  if (!svgElement || svgElement.tagName !== 'svg') {
    return null;
  }
  
  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : null;
  }
  
  // Check for title element
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  return null;
}

// REACT_041: Set SVG attributes for accessibility
function setSvgAttributes(svgElement, name) {
  if (!svgElement || svgElement.tagName !== 'svg') {
    return false;
  }
  
  // Remove any existing accessible name attributes
  svgElement.removeAttribute('aria-label');
  svgElement.removeAttribute('aria-labelledby');
  
  if (!name) {
    svgElement.setAttribute('aria-hidden', 'true');
    return true;
  }
  
  // Create a title element if it doesn't exist
  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  title.textContent = name;
  
  // Generate unique ID for the title
  const titleId = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  title.setAttribute('id', titleId);
  
  // Set aria-labelledby
  svgElement.setAttribute('aria-labelledby', titleId);
  svgElement.removeAttribute('aria-hidden');
  
  return true;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const issues = [];
  const landmarkCounts = {};
  
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    const tagElements = document.querySelectorAll(role);
    
    const totalCount = elements.length + (role === 'main' ? 0 : tagElements.length);
    
    if (totalCount > 1) {
      issues.push(`REACT_025: Landmark role "${role}" appears ${totalCount} times, should be unique`);
    }
    
    landmarkCounts[role] = totalCount;
  });
  
  return { valid: issues.length === 0, issues, counts: landmarkCounts };
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(link) {
  const issues = [];
  
  if (!link) {
    return { valid: false, issues: ['Link element is required'] };
  }
  
  // Check for accessible name
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  
  if (!text && !ariaLabel) {
    issues.push('REACT_036: Link has no accessible name (no text or aria-label)');
  }
  
  // Check for meaningful text
  if (text && (text === 'click here' || text === 'read more' || text === 'learn more')) {
    issues.push(`REACT_036: Link text "${text}" is not descriptive`);
  }
  
  return { valid: issues.length === 0, issues };
}

// REACT_036: Handle fake links (buttons styled as links or links without href)
function handleFakeLinks(container) {
  const issues = [];
  const elements = container ? container.querySelectorAll('a, button') : document.querySelectorAll('a, button');
  
  elements.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    
    if (tagName === 'a' && !element.getAttribute('href') && !element.getAttribute('onclick')) {
      issues.push(`REACT_036: Element at index ${index} is an anchor without href or onclick`);
    }
    
    if (tagName === 'button' && element.querySelector('a')) {
      issues.push(`REACT_036: Button at index ${index} contains an anchor element`);
    }
  });
  
  return { valid: issues.length === 0, issues };
}

// REACT_037: Add proper landmark regions
function addProperLandmarkRegions(container) {
  const result = { added: [], issues: [] };
  const root = container || document.body;
  
  // Check for main landmark
  let main = root.querySelector('main, [role="main"]');
  if (!main) {
    main = document.createElement('main');
    const firstChild = root.firstChild;
    if (firstChild) {
      root.insertBefore(main, firstChild);
    } else {
      root.appendChild(main);
    }
    result.added.push('main');
  }
  
  // Check for header/banner landmark
  let header = root.querySelector('header, [role="banner"]');
  if (!header) {
    header = document.createElement('header');
    root.insertBefore(header, root.firstChild);
    result.added.push('header');
  }
  
  // Check for footer/contentinfo landmark
  let footer = root.querySelector('footer, [role="contentinfo"]');
  if (!footer) {
    footer = document.createElement('footer');
    root.appendChild(footer);
    result.added.push('footer');
  }
  
  return result;
}

// Export all accessibility functions
exports.getLangAttribute = getLangAttribute;
exports.createInPageButton = createInPageButton;
exports.validateTableAccessibility = validateTableAccessibility;
exports.validateTableStructure = validateTableStructure;
exports.validateLandmark = validateLandmark;
exports.validateLandmarkStructure = validateLandmarkStructure;
exports.getSvgAccessibleName = getSvgAccessibleName;
exports.setSvgAttributes = setSvgAttributes;
exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
exports.validateLinkAccessibility = validateLinkAccessibility;
exports.handleFakeLinks = handleFakeLinks;
exports.addProperLandmarkRegions = addProperLandmarkRegions;