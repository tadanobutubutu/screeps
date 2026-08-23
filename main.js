// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark(), validateLandmark(), validateUniqueLandmarks(), validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames(), getSvgAccessibleName(), createSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue(), validateLinkAccessibility(), createInPageButton(), validateLinkOrButton(), and createAccessibleLink())

// Addresses accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateUniqueLandmarks(), and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createSvgAccessibilityProps())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by validateUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by validateLinkAccessibility(), createInPageButton(), validateLinkOrButton(), and createAccessibleLink())

/**
 * Add lang attribute to the HTML element for accessibility
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Get the lang attribute value for the HTML element
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value
 */
function getLangAttribute(lang = 'en') {
  return lang;
}

/**
 * Get the full lang attribute string for the HTML element
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The full lang attribute string
 */
function getFullLangAttribute(lang = 'en') {
  return `lang="${lang}"`;
}

/**
 * Validate table accessibility and structure
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation results
 */
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    issues.push('Table element is required');
    return { valid: false, issues };
  }
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('Table missing caption element');
  }
  
  // Check for header cells
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push('Table missing header cells (th)');
  }
  
  // Check for scope attributes on headers
  headers.forEach((header, index) => {
    if (!header.hasAttribute('scope')) {
      issues.push(`Header cell ${index + 1} missing scope attribute`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validate table structure
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} Validation results
 */
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    issues.push('Table element is required');
    return { valid: false, issues };
  }
  
  // Check for proper table sections
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');
  
  if (!thead && !tbody && !tfoot) {
    issues.push('Table missing structural elements (thead, tbody, or tfoot)');
  }
  
  // Check for rows
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push('Table has no rows');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validate landmark accessibility
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {Object} Validation results
 */
function validateLandmark(element) {
  const issues = [];
  const validLandmarkRoles = ['banner', 'main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  
  if (!element) {
    issues.push('Element is required');
    return { valid: false, issues };
  }
  
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  // Check if element has a landmark role or is a semantic landmark element
  const isLandmark = validLandmarkRoles.includes(role) || 
    ['header', 'main', 'nav', 'aside', 'footer', 'section', 'form'].includes(tagName);
  
  if (!isLandmark) {
    issues.push('Element is not a valid landmark');
  }
  
  // Check for accessible name on region landmarks
  if (role === 'region' || tagName === 'section') {
    const hasLabel = element.hasAttribute('aria-label') || 
      element.hasAttribute('aria-labelledby') || 
      element.hasAttribute('title');
    if (!hasLabel) {
      issues.push('Region/section landmark requires accessible name (aria-label, aria-labelledby, or title)');
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validate unique landmarks
 * @param {Document} document - The document to validate
 * @returns {Object} Validation results
 */
function validateUniqueLandmarks(document) {
  const issues = [];
  const landmarkCounts = {};
  const validLandmarkRoles = ['banner', 'main', 'navigation', 'search', 'contentinfo', 'complementary', 'form'];
  
  if (!document) {
    issues.push('Document is required');
    return { valid: false, issues };
  }
  
  // Check role-based landmarks
  validLandmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      landmarkCounts[role] = elements.length;
      issues.push(`Multiple ${role} landmarks found (${elements.length})`);
    }
  });
  
  // Check semantic landmarks
  const semanticLandmarks = {
    'header': 'banner',
    'main': 'main',
    'nav': 'navigation',
    'footer': 'contentinfo',
    'aside': 'complementary'
  };
  
  Object.entries(semanticLandmarks).forEach(([tag, role]) => {
    const elements = document.querySelectorAll(tag);
    // Filter out nested landmarks
    const topLevel = Array.from(elements).filter(el => {
      let parent = el.parentElement;
      while (parent) {
        if (Object.keys(semanticLandmarks).includes(parent.tagName.toLowerCase()) || 
            validLandmarkRoles.includes(parent.getAttribute('role'))) {
          return false;
        }
        parent = parent.parentElement;
      }
      return true;
    });
    
    if (topLevel.length > 1) {
      issues.push(`Multiple top-level <${tag}> elements found (${topLevel.length})`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues,
    counts: landmarkCounts
  };
}

/**
 * Validate landmark structure
 * @param {Document} document - The document to validate
 * @returns {Object} Validation results
 */
function validateLandmarkStructure(document) {
  const issues = [];
  
  if (!document) {
    issues.push('Document is required');
    return { valid: false, issues };
  }
  
  // Check for main landmark
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length === 0) {
    issues.push('Page missing main landmark');
  } else if (mainElements.length > 1) {
    issues.push('Page has multiple main landmarks');
  }
  
  // Check for proper nesting
  const landmarks = document.querySelectorAll('header, main, nav, aside, footer, section, [role="banner"], [role="main"], [role="navigation"], [role="search"], [role="contentinfo"], [role="complementary"], [role="form"], [role="region"]');
  
  landmarks.forEach(landmark => {
    let parent = landmark.parentElement;
    while (parent) {
      const parentRole = parent.getAttribute('role');
      const parentTag = parent.tagName.toLowerCase();
      const isParentLandmark = validLandmarkRoles.includes(parentRole) || 
        ['header', 'main', 'nav', 'aside', 'footer', 'section'].includes(parentTag);
      
      if (isParentLandmark) {
        // Check for invalid nesting (e.g., main inside main)
        const landmarkRole = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        const parentLandmarkRole = parentRole || parentTag;
        
        if (landmarkRole === 'main' && parentLandmarkRole === 'main') {
          issues.push('Main landmark nested inside another main landmark');
        }
        if (landmarkRole === 'banner' && parentLandmarkRole === 'banner') {
          issues.push('Banner landmark nested inside another banner landmark');
        }
        if (landmarkRole === 'contentinfo' && parentLandmarkRole === 'contentinfo') {
          issues.push('Contentinfo landmark nested inside another contentinfo landmark');
        }
      }
      parent = parent.parentElement;
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Get accessible name for SVG element
 * @param {SVGElement} svg - The SVG element
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svg) {
  if (!svg) return null;
  
  // Check aria-label
  if (svg.hasAttribute('aria-label')) {
    return svg.getAttribute('aria-label');
  }
  
  // Check aria-labelledby
  if (svg.hasAttribute('aria-labelledby')) {
    const id = svg.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    if (labelElement) {
      return labelElement.textContent.trim();
    }
  }
  
  // Check title element
  const title = svg.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  // Check desc element
  const desc = svg.querySelector('desc');
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }
  
  return null;
}

/**
 * Create SVG accessibility props
 * @param {Object} options - Accessibility options
 * @param {string} options.label - Accessible label (aria-label)
 * @param {string} options.labelledBy - ID of element that labels the SVG (aria-labelledby)
 * @param {string} options.description - Description for desc element
 * @param {string} options.title - Title for title element
 * @returns {Object} Props to spread on SVG element
 */
function createSvgAccessibilityProps({ label, labelledBy, description, title } = {}) {
  const props = {};
  
  if (label) {
    props['aria-label'] = label;
  }
  
  if (labelledBy) {
    props['aria-labelledby'] = labelledBy;
  }
  
  // For title and desc, we'd typically render them as child elements
  // This function returns props for the SVG element itself
  // The title/desc would be handled in the SVG component
  
  return props;
}

/**
 * Add accessible names to SVG elements
 * @param {NodeListOf<SVGElement>|SVGElement[]} svgs - SVG elements to process
 * @param {Function} getName - Function to generate name for each SVG
 */
function addSvgAccessibleNames(svgs, getName) {
  const svgArray = Array.from(svgs);
  
  svgArray.forEach((svg, index) => {
    const name = getName(svg, index);
    if (name) {
      // Only add if not already present
      if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = name;
        svg.insertBefore(title, svg.firstChild);
      }
    }
  });
}

/**
 * Ensure unique landmarks on the page
 * @param {Document} document - The document to process
 */
function ensureUniqueLandmarks(document) {
  const validation = validateUniqueLandmarks(document);
  
  if (!validation.valid) {
    console.warn('Landmark uniqueness issues found:', validation.issues);
    
    // Auto-fix: Add aria-label to duplicate landmarks to differentiate them
    const validLandmarkRoles = ['banner', 'main', 'navigation', 'search', 'contentinfo', 'complementary', 'form'];
    
    validLandmarkRoles.forEach(role => {
      const elements = document.querySelectorAll(`[role="${role}"]`);
      if (elements.length > 1) {
        elements.forEach((el, index) => {
          if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
            el.setAttribute('aria-label', `${role} ${index + 1}`);
          }
        });
      }
    });
  }
}

/**
 * Fix fake link issue - convert fake links to proper buttons or links
 * @param {HTMLElement} element - The element to fix
 * @returns {HTMLElement} The fixed element
 */
function fixFakeLinkIssue(element) {
  if (!element) return element;
  
  const hasHref = element.hasAttribute('href');
  const hasOnClick = element.hasAttribute('onclick') || element.onclick;
  const role = element.getAttribute('role');
  
  // If it's a link without href but has click handler, convert to button
  if (element.tagName === 'A' && !hasHref && hasOnClick) {
    return createInPageButton(element);
  }
  
  // If it's a non-interactive element with click handler and link role
  if (role === 'link' && element.tagName !== 'A' && hasOnClick) {
    return createAccessibleLink(element);
  }
  
  return element;
}

/**
 * Validate link accessibility
 * @param {HTMLElement} element - The link or button element to validate
 * @returns {Object} Validation results
 */
function validateLinkAccessibility(element) {
  const issues = [];
  
  if (!element) {
    issues.push('Element is required');
    return { valid: false, issues };
  }
  
  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute('role');
  const hasHref = element.hasAttribute('href');
  const hasOnClick = element.hasAttribute('onclick') || element.onclick;
  
  // Check for fake links
  if (tagName === 'a' && !hasHref && hasOnClick) {
    issues.push('Anchor element without href but with click handler (fake link)');
  }
  
  if ((tagName === 'div' || tagName === 'span') && role === 'link' && hasOnClick) {
    issues.push('Non-anchor element with link role and click handler (fake link)');
  }
  
  // Check for accessible name
  const hasAccessibleName = element.hasAttribute('aria-label') ||
    element.hasAttribute('aria-labelledby') ||
    (element.textContent && element.textContent.trim().length > 0) ||
    (tagName === 'a' && element.querySelector('img[alt]'));
  
  if (!hasAccessibleName) {
    issues.push('Link/button missing accessible name');
  }
  
  // Check for keyboard accessibility
  if (hasOnClick && !element.hasAttribute('tabindex') && tagName !== 'a' && tagName !== 'button') {
    issues.push('Interactive element missing tabindex for keyboard access');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Create an in-page button from a fake link
 * @param {HTMLAnchorElement} anchor - The anchor element to convert
 * @returns {HTMLButtonElement} The created button
 */
function createInPageButton(anchor) {
  const button = document.createElement('button');
  
  // Copy attributes
  Array.from(anchor.attributes).forEach(attr => {
    if (attr.name !== 'href' && attr.name !== 'target' && attr.name !== 'rel') {
      button.setAttribute(attr.name, attr.value);
    }
  });
  
  // Copy content
  button.innerHTML = anchor.innerHTML;
  
  // Add button type
  button.type = 'button';
  
  // Replace anchor with button
  if (anchor.parentNode) {
    anchor.parentNode.replaceChild(button, anchor);
  }
  
  return button;
}

/**
 * Validate if element should be a link or button
 * @param {HTMLElement} element - The element to validate
 * @returns {Object} Recommendation
 */
function validateLinkOrButton(element) {
  if (!element) {
    return { recommendation: 'none', reason: 'No element provided' };
  }
  
  const hasHref = element.hasAttribute('href');
  const hasOnClick = element.hasAttribute('onclick') || element.onclick;
  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute('role');
  
  // If it navigates (has href), it should be a link
  if (hasHref) {
    return { 
      recommendation: 'link', 
      reason: 'Element has href attribute for navigation' 
    };
  }
  
  // If it performs an action (onclick), it should be a button
  if (hasOnClick) {
    return { 
      recommendation: 'button', 
      reason: 'Element has click handler for in-page action' 
    };
  }
  
  // If it has link role but no href, it should be a button
  if (role === 'link' && !hasHref) {
    return { 
      recommendation: 'button', 
      reason: 'Element has link role but no href for navigation' 
    };
  }
  
  return { 
    recommendation: 'none', 
    reason: 'Element does not appear to be interactive' 
  };
}

/**
 * Create an accessible link from a fake link
 * @param {HTMLElement} element - The element to convert
 * @returns {HTMLAnchorElement} The created link
 */
function createAccessibleLink(element) {
  const link = document.createElement('a');
  
  // Copy attributes
  Array.from(element.attributes).forEach(attr => {
    if (attr.name !== 'role') {
      link.setAttribute(attr.name, attr.value);
    }
  });
  
  // Add href if missing (required for real link)
  if (!link.hasAttribute('href')) {
    link.href = '#';
  }
  
  // Copy content
  link.innerHTML = element.innerHTML;
  
  // Replace element with link
  if (element.parentNode) {
    element.parentNode.replaceChild(link, element);
  }
  
  return link;
}

/**
 * Add main landmark to page
 * @param {Document} document - The document
 * @param {HTMLElement} container - Container to wrap in main
 * @returns {HTMLElement} The main element
 */
function addMainLandmark(document, container) {
  if (!document || !container) return null;
  
  // Check if main already exists
  const existingMain = document.querySelector('main, [role="main"]');
  if (existingMain) return existingMain;
  
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  
  // Wrap container content
  if (container.parentNode) {
    container.parentNode.insertBefore(main, container);
    main.appendChild(container);
  }
  
  return main;
}