// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_025: Ensure unique landmarks

// Accessibility helper function for keyboard navigation
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  element.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  });
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

// Function to ensure landmarks have unique identifiers
function ensureUniqueLandmarks() {
  // Query all landmark roles to ensure unique IDs across all landmark types
  const landmarkRoles = [
    'banner', 'main', 'navigation', 'search', 
    'contentinfo', 'complementary', 'region', 'form'
  ];
  
  const landmarks = document.querySelectorAll(landmarkRoles.join(', '));
  
  // Set to track used ID suffixes for quick lookup
  const usedSuffixes = new Set();
  const landmarkIds = [];;

  function generateUniqueId() {
    return `landmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  return obj;
}

// REACT_015: Get lang attribute for HTML element
function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement.getAttribute('lang') || 'en';
}

// REACT_015: Create in-page button with proper accessibility
function createInPageButton(text, onClick, options = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.addEventListener('click', onClick);
  
  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel);
  }
  if (options.ariaExpanded !== undefined) {
    button.setAttribute('aria-expanded', options.ariaExpanded);
  }
  if (options.ariaControls) {
    button.setAttribute('aria-controls', options.ariaControls);
  }
  if (options.className) {
    button.className = options.className;
  }
  
  return button;
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table.querySelector('caption') && !table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
    issues.push('Table missing accessible name (caption, aria-label, or aria-labelledby)');
  }
  
  const headers = table.querySelectorAll('th');
  headers.forEach((header, index) => {
    if (!header.getAttribute('scope') && !header.id) {
      issues.push(`Header cell at index ${index} missing scope attribute or id`);
    }
  });
  
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push(`Row ${rowIndex} has no cells`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
  const issues = [];
  
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');
  
  if (!thead && !table.querySelector('th')) {
    issues.push('Table missing header section (thead or th elements)');
  }
  
  if (thead) {
    const headerRows = thead.querySelectorAll('tr');
    headerRows.forEach((row, index) => {
      const ths = row.querySelectorAll('th');
      if (ths.length === 0) {
        issues.push(`Header row ${index} has no th elements`);
      }
    });
  }
  
  if (tbody) {
    const bodyRows = tbody.querySelectorAll('tr');
    bodyRows.forEach((row, index) => {
      const tds = row.querySelectorAll('td');
      if (tds.length === 0 && row.querySelectorAll('th').length === 0) {
        issues.push(`Body row ${index} has no cells`);
      }
    });
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_017: Validate landmark
function validateLandmark(element) {
  const issues = [];
  const validRoles = ['banner', 'main', 'navigation', 'search', 'contentinfo', 'complementary', 'region', 'form'];
  const role = element.getAttribute('role');
  
  if (!role && !['header', 'main', 'nav', 'footer', 'aside', 'section', 'form'].includes(element.tagName.toLowerCase())) {
    issues.push('Element is not a valid landmark');
  } else if (role && !validRoles.includes(role)) {
    issues.push(`Invalid landmark role: ${role}`);
  }
  
  if (role === 'region' && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    issues.push('Region landmark must have accessible name');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="navigation"], [role="search"], [role="contentinfo"], [role="complementary"], [role="region"], [role="form"], header, main, nav, footer, aside, section, form');
  const issues = [];
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  const bannerLandmarks = document.querySelectorAll('[role="banner"], header');
  const contentinfoLandmarks = document.querySelectorAll('[role="contentinfo"], footer');
  
  if (mainLandmarks.length === 0) {
    issues.push('Page missing main landmark');
  } else if (mainLandmarks.length > 1) {
    issues.push('Page has multiple main landmarks');
  }
  
  if (bannerLandmarks.length > 1) {
    issues.push('Page has multiple banner landmarks');
  }
  
  if (contentinfoLandmarks.length > 1) {
    issues.push('Page has multiple contentinfo landmarks');
  }
  
  landmarks.forEach((landmark) => {
    const existingIds = uniqueIds.map((id) => {
      const parts = id.split('-');
      return parts.length > 1 ? parts[1] : id;
    });
    let id;

    do {
      id = generateUniqueId();
    } while (existingIds.includes(id.split('-')[1]));

    uniqueIds.push(id);
    landmark.id = id;
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_017: Validate landmark attributes
function validateLandmarkAttributes(landmark) {
  const issues = [];
  const role = landmark.getAttribute('role');
  
  if (role === 'region') {
    if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      issues.push('Region landmark requires aria-label or aria-labelledby');
    }
  }
  
  if (landmark.id && document.querySelectorAll(`#${landmark.id}`).length > 1) {
    issues.push(`Duplicate landmark ID: ${landmark.id}`);
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svg) {
  if (svg.getAttribute('aria-label')) {
    return svg.getAttribute('aria-label');
  }
  if (svg.getAttribute('aria-labelledby')) {
    const id = svg.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    if (labelElement) return labelElement.textContent;
  }
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  return '';
}

// REACT_041: Set SVG attributes for accessibility
function setSvgAttributes(svg, options = {}) {
  if (options.role) {
    svg.setAttribute('role', options.role);
  } else if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  
  if (options.ariaLabel) {
    svg.setAttribute('aria-label', options.ariaLabel);
  }
  
  if (options.ariaLabelledBy) {
    svg.setAttribute('aria-labelledby', options.ariaLabelledBy);
  }
  
  if (options.ariaDescribedBy) {
    svg.setAttribute('aria-describedby', options.ariaDescribedBy);
  }
  
  if (options.focusable !== undefined) {
    svg.setAttribute('focusable', options.focusable);
  }
  
  if (options.title) {
    let titleElement = svg.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      svg.insertBefore(titleElement, svg.firstChild);
    }
    titleElement.textContent = options.title;
  }
  
  if (options.desc) {
    let descElement = svg.querySelector('desc');
    if (!descElement) {
      descElement = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
      svg.appendChild(descElement);
    }
    descElement.textContent = options.desc;
  }
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(link) {
  const issues = [];
  
  if (!link.textContent.trim() && !link.getAttribute('aria-label') && !link.getAttribute('aria-labelledby')) {
    issues.push('Link missing accessible name');
  }
  
  const href = link.getAttribute('href');
  if (!href || href === '#' || href.startsWith('javascript:')) {
    if (link.tagName === 'A' && !link.hasAttribute('role')) {
      issues.push('Link has invalid or missing href attribute');
    }
  }
  
  if (link.hasAttribute('target') && link.getAttribute('target') === '_blank') {
    if (!link.getAttribute('rel') || !link.getAttribute('rel').includes('noopener')) {
      issues.push('Link with target="_blank" missing rel="noopener"');
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_036: Handle fake links (elements that look like links but aren't)
function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('[onclick]:not(a):not(button):not([role="button"]):not([role="link"])');
  const issues = [];
  
  fakeLinks.forEach((element) => {
    issues.push({
      element,
      message: 'Element has onclick handler but is not a proper interactive element',
      fix: () => {
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            element.click();
          }
        });
      }
    });
  });
  
  // Render edges (connections between nodes)
  edges.forEach(edge => {
    const sourceEl = document.getElementById(edge.source);
    const targetEl = document.getElementById(edge.target);
    
    if (sourceEl) ensureElementHasId(sourceEl, 'node-source');
    if (targetEl) ensureElementHasId(targetEl, 'node-target');
    
    const edgeElement = document.createElement('div');
    edgeElement.className = 'graph-edge';
    edgeElement.setAttribute('data-source', edge.source);
    edgeElement.setAttribute('data-target', edge.target);
    graphContainer.appendChild(edgeElement);
  });
  
  // Ensure footer has contentinfo role
  const footer = document.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
    landmarks.push({ element: footer, role: 'contentinfo' });
  }
  
  // Ensure aside has complementary role
  const asides = document.querySelectorAll('aside');
  asides.forEach((aside, index) => {
    if (!aside.getAttribute('role')) {
      aside.setAttribute('role', 'complementary');
      if (asides.length > 1 && !aside.getAttribute('aria-label') && !aside.getAttribute('aria-labelledby')) {
        aside.setAttribute('aria-label', `Complementary ${index + 1}`);
      }
      landmarks.push({ element: aside, role: 'complementary' });
    }
  });
  
  // Ensure form has form role if it's a landmark form
  const forms = document.querySelectorAll('form[aria-label], form[aria-labelledby]');
  forms.forEach((form) => {
    if (!form.getAttribute('role')) {
      form.setAttribute('role', 'form');
      landmarks.push({ element: form, role: 'form' });
    }
  });
  
  return landmarks;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeAccessibility,
    setupKeyboardNavigation,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    // New accessibility functions
    getLangAttribute,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    validateLandmarkAttributes,
    getSvgAccessibleName,
    setSvgAttributes,
    validateLinkAccessibility,
    handleFakeLinks,
    createAccessibleButton,
    addProperLandmarkRegions,
    ensureUniqueLandmarks
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityFeatures = initializeAccessibility();
  });
}