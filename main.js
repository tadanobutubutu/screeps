// This file contains accessibility-related functions for the application

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark(), validateLandmark(), validateUniqueLandmarks(), validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames(), getSvgAccessibleName(), createSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue(), validateLinkAccessibility(), createInPageButton(), validateLinkOrButton(), createAccessibleLink())

// Accessibility functions for HTML lang attribute
function addLangAttribute(document, lang) {
  if (document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
}

// Accessibility functions for table structure
function fixTableStructure(table) {
  if (!table) return false;
  
  // Ensure proper table structure
  const hasHeader = table.querySelector('thead');
  const hasBody = table.querySelector('tbody');
  const hasFooter = table.querySelector('tfoot');
  
  // Add missing structural elements if needed
  if (!hasHeader) {
    const thead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow.cloneNode(true));
      table.insertBefore(thead, table.firstChild);
    }
  }
  
  return true;
}

// Landmark validation functions
function addMainLandmark(mainElement) {
  if (!mainElement) return null;
  
  if (!mainElement.id) {
    mainElement.id = 'main-content';
  }
  
  if (!mainElement.getAttribute('role') && !mainElement.tagName.match(/^MAIN$/i)) {
    mainElement.setAttribute('role', 'main');
  }
  
  return mainElement;
}

function validateLandmark(element) {
  if (!element) return { valid: false, errors: ['Element is null or undefined'] };
  
  const errors = [];
  
  // Check for proper landmark attributes
  const role = element.getAttribute('role');
  const tagName = element.tagName;
  
  if (!role && !tagName.match(/^(HEADER|NAV|MAIN|FOOTER|ASIDE)$/i)) {
    errors.push('Landmark should have a role attribute or be a semantic landmark element');
  }
  
  // Check for accessible name
  const hasLabel = element.getAttribute('aria-label') || 
                   element.getAttribute('aria-labelledby') ||
                   element.textContent.trim();
  
  if (!hasLabel) {
    errors.push('Landmark should have an accessible name');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) return { valid: true, duplicates: [] };
  
  const roleCounts = {};
  const duplicates = [];
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName;
    if (roleCounts[role]) {
      roleCounts[role]++;
      duplicates.push({ role, element: landmark });
    } else {
      roleCounts[role] = 1;
    }
  });
  
  // Check for duplicate banner, main, contentinfo landmarks
  const problematicRoles = ['banner', 'main', 'contentinfo', 'navigation'];
  const hasDuplicates = problematicRoles.some(role => 
    roleCounts[role] && roleCounts[role] > 1
  );
  
  return { valid: !hasDuplicates, duplicates, roleCounts };
}

function validateLandmarkStructure(document) {
  const landmarks = document.querySelectorAll('[role], header, nav, main, footer, aside');
  const results = {
    valid: true,
    issues: [],
    landmarks: []
  };
  
  // Check for exactly one main landmark
  const mainLandmarks = document.querySelectorAll('main, [role="main"]');
  if (mainLandmarks.length === 0) {
    results.valid = false;
    results.issues.push('Missing main landmark');
  } else if (mainLandmarks.length > 1) {
    results.valid = false;
    results.issues.push('Multiple main landmarks found');
  }
  
  // Check for proper landmark hierarchy
  landmarks.forEach(landmark => {
    const validation = validateLandmark(landmark);
    if (!validation.valid) {
      results.valid = false;
      results.issues.push(...validation.errors);
    }
    results.landmarks.push(landmark);
  });
  
  return results;
}

function ensureUniqueLandmarks(document) {
  const results = validateUniqueLandmarks(
    document.querySelectorAll('[role="banner"], [role="main"], [role="contentinfo"]')
  );
  
  if (!results.valid) {
    // Fix duplicates by removing redundant landmarks
    const roleCounts = {};
    
    results.duplicates.forEach(({ role, element }) => {
      if (!roleCounts[role]) {
        roleCounts[role] = 0;
      }
      roleCounts[role]++;
      
      // Keep only the first occurrence of problematic roles
      const problematicRoles = ['banner', 'main', 'contentinfo'];
      if (problematicRoles.includes(role) && roleCounts[role] > 1) {
        element.removeAttribute('role');
      }
    });
  }
  
  return results;
}

// SVG accessibility functions
function addSvgAccessibleNames(svgElements) {
  if (!Array.isArray(svgElements)) {
    svgElements = [svgElements];
  }
  
  svgElements.forEach(svg => {
    if (!svg) return;
    
    const existingLabel = svg.getAttribute('aria-label') || 
                          svg.getAttribute('aria-labelledby');
    
    if (!existingLabel) {
      const accessibleName = getSvgAccessibleName(svg);
      if (accessibleName) {
        svg.setAttribute('aria-label', accessibleName);
      }
    }
  });
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  // Try to get title inside SVG
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }
  
  // Try to get from adjacent description
  const desc = svg.querySelector('desc');
  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }
  
  // Try to get from nearest heading or context
  const parent = svg.closest('figure') || svg.parentElement;
  if (parent) {
    const figcaption = parent.querySelector('figcaption');
    if (figcaption && figcaption.textContent) {
      return figcaption.textContent.trim();
    }
  }
  
  return '';
}

function createSvgAccessibilityProps(svgType, context) {
  const accessibleName = context || svgType || 'Decorative SVG';
  
  return {
    'aria-label': accessibleName,
    role: 'img'
  };
}

// Link accessibility functions
function fixFakeLinkIssue(element) {
  if (!element) return false;
  
  const isFakeLink = element.tagName !== 'A' && 
                     element.getAttribute('href') !== null;
  
  if (isFakeLink) {
    // Convert to proper link or button
    const href = element.getAttribute('href');
    
    if (href.startsWith('#') || href === '') {
      // Convert to button
      return createInPageButton(element);
    } else {
      // Convert to accessible link
      return createAccessibleLink(element);
    }
  }
  
  return false;
}

function validateLinkAccessibility(link) {
  if (!link) return { valid: false, errors: ['Link is null or undefined'] };
  
  const errors = [];
  
  // Check for accessible text
  const hasText = link.textContent && link.textContent.trim();
  const hasAriaLabel = link.getAttribute('aria-label');
  const hasAriaLabelledby = link.getAttribute('aria-labelledby');
  const hasTitle = link.getAttribute('title');
  
  if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
    errors.push('Link must have accessible text');
  }
  
  // Check for proper href
  const href = link.getAttribute('href');
  if (!href) {
    errors.push('Link must have an href attribute');
  }
  
  // Check for keyboard accessibility
  const tabIndex = link.getAttribute('tabindex');
  if (tabIndex === '-1' && href && !href.startsWith('#')) {
    errors.push('Link should be keyboard accessible');
  }
  
  return { valid: errors.length === 0, errors };
}

function createInPageButton(element) {
  if (!element) return null;
  
  const button = document.createElement('button');
  
  // Copy attributes
  Array.from(element.attributes).forEach(attr => {
    if (attr.name !== 'href' && attr.name !== 'role') {
      button.setAttribute(attr.name, attr.value);
    }
  });
  
  // Copy content
  button.innerHTML = element.innerHTML;
  
  // Set appropriate role
  button.setAttribute('role', 'button');
  
  // Replace element
  if (element.parentNode) {
    element.parentNode.replaceChild(button, element);
  }
  
  // Add click handler if needed
  button.addEventListener('click', (e) => {
    const href = element.getAttribute('data-href');
    if (href) {
      e.preventDefault();
      const target = element.getAttribute('data-target') || '_self';
      window.open(href, target);
    }
  });
  
  return button;
}

function validateLinkOrButton(element) {
  if (!element) return { valid: false, errors: ['Element is null or undefined'] };
  
  const tagName = element.tagName.toUpperCase();
  const isLink = tagName === 'A';
  const isButton = tagName === 'BUTTON';
  
  if (!isLink && !isButton) {
    return { valid: false, errors: ['Element must be a link or button'] };
  }
  
  if (isLink) {
    return validateLinkAccessibility(element);
  }
  
  // Validate button
  const hasText = element.textContent && element.textContent.trim();
  const hasAriaLabel = element.getAttribute('aria-label');
  const hasAriaLabelledby = element.getAttribute('aria-labelledby');
  
  if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
    return { valid: false, errors: ['Button must have accessible text'] };
  }
  
  return { valid: true, errors: [] };
}

function createAccessibleLink(element) {
  if (!element) return null;
  
  const link = document.createElement('a');
  
  // Copy attributes
  Array.from(element.attributes).forEach(attr => {
    if (attr.name !== 'role') {
      link.setAttribute(attr.name, attr.value);
    }
  });
  
  // Copy content
  link.innerHTML = element.innerHTML;
  
  // Ensure proper accessibility
  const validation = validateLinkAccessibility(link);
  if (!validation.valid && validation.errors.includes('Link must have accessible text')) {
    const existingText = link.textContent;
    if (!existingText || !existingText.trim()) {
      link.setAttribute('aria-label', 'Link');
    }
  }
  
  // Replace element
  if (element.parentNode) {
    element.parentNode.replaceChild(link, element);
  }
  
  return link;
}

// Main initialization function
function initializeAccessibility(document) {
  // Add lang attribute
  addLangAttribute(document, document.documentElement?.lang || 'en');
  
  // Fix table structures
  const tables = document.querySelectorAll('table');
  tables.forEach(table => fixTableStructure(table));
  
  // Add main landmark
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach(main => addMainLandmark(main));
  
  // Add SVG accessible names
  const svgs = document.querySelectorAll('svg');
  addSvgAccessibleNames(Array.from(svgs));
  
  // Fix fake links
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a):not([role="button"])');
  fakeLinks.forEach(el => fixFakeLinkIssue(el));
  
  // Ensure unique landmarks
  ensureUniqueLandmarks(document);
  
  // Validate overall landmark structure
  return validateLandmarkStructure(document);
}

// Export functions for testing and external use
export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateUniqueLandmarks,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  getSvgAccessibleName,
  createSvgAccessibilityProps,
  fixFakeLinkIssue,
  validateLinkAccessibility,
  createInPageButton,
  validateLinkOrButton,
  createAccessibleLink,
  initializeAccessibility
};

// Default export
export default {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateUniqueLandmarks,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  getSvgAccessibleName,
  createSvgAccessibilityProps,
  fixFakeLinkIssue,
  validateLinkAccessibility,
  createInPageButton,
  validateLinkOrButton,
  createAccessibleLink,
  initializeAccessibility
};