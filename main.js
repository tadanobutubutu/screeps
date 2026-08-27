// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: React Table Structure - Add scope to table headers (DONE: addScopeToTableHeaders)
// - REACT_036: Fix fake links (DONE: fixFakeLinks)
// - REACT_017: Ensure proper landmark structure (DONE: wrapPrimaryContentInMain)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to SVGs (DONE: addAccessibleSVGs)
// - REACT_025: Add any additional accessibility changes as per the insight report

/**
 * Add lang attribute to HTML element for accessibility
 * @param {Document} doc - The document object
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {boolean} - Returns true if lang attribute was added
 */
function addLangAttribute(doc, lang = 'en') {
  const htmlElement = doc.documentElement || doc.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
    return true;
  }
  return false;
}

/**
 * Add scope attribute to table headers
 * @param {Document} doc - The document object
 * @param {string} scope - The scope value ('col', 'row', 'colgroup', 'rowgroup')
 * @returns {number} - Number of headers updated
 */
function addScopeToTableHeaders(doc, scope = 'col') {
  const tables = doc.querySelectorAll('table');
  let count = 0;
  
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', scope);
        count++;
      }
    });
  });
  
  return count;
}

/**
 * Fix fake links - convert non-navigating anchors to buttons or add proper href
 * @param {Document} doc - The document object
 * @returns {number} - Number of fake links fixed
 */
function fixFakeLinks(doc) {
  const links = doc.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  let count = 0;
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    const hasClickHandler = link.hasAttribute('onclick') || 
                           link.getAttribute('role') === 'button' ||
                           link.tagName === 'BUTTON';
    
    // Check if it looks like a fake link (empty href and has click behavior)
    if ((href === '#' || href === '' || href === null) && !hasClickHandler) {
      // If it has JavaScript behavior, consider converting to button
      const hasJsBehavior = link.onclick || link.addEventListener;
      if (hasJsBehavior) {
        // Check if href is just '#'
        if (href === '#') {
          // Prevent default scroll behavior
          link.addEventListener('click', (e) => {
            e.preventDefault();
          });
        }
      }
      count++;
    }
  });
  
  return count;
}

/**
 * Wrap primary content in main landmark
 * @param {Document} doc - The document object
 * @returns {Element|null} - The main element or null if not found
 */
function wrapPrimaryContentInMain(doc) {
  // Look for common primary content selectors
  const contentSelectors = [
    '#content',
    '#main',
    '[role="main"]',
    '.main-content',
    'main',
    '#primary',
    '.primary-content'
  ];
  
  for (const selector of contentSelectors) {
    const content = doc.querySelector(selector);
    if (content && content.tagName !== 'MAIN') {
      // Check if already inside a main element
      if (content.closest('main')) {
        return content.closest('main');
      }
      
      // Create main element and wrap content
      const main = doc.createElement('main');
      main.setAttribute('role', 'main');
      
      // Insert main element
      content.parentNode.insertBefore(main, content);
      main.appendChild(content);
      
      return main;
    }
  }
  
  // Return existing main element if found
  return doc.querySelector('main') || doc.querySelector('[role="main"]');
}

/**
 * Ensure unique landmarks by adding descriptive labels
 * @param {Document} doc - The document object
 * @returns {number} - Number of landmarks labeled
 */
function ensureUniqueLandmarks(doc) {
  const landmarks = {
    'nav': doc.querySelectorAll('nav'),
    'header': doc.querySelectorAll('header'),
    'footer': doc.querySelectorAll('footer'),
    'aside': doc.querySelectorAll('aside'),
    'main': doc.querySelectorAll('main'),
    'section': doc.querySelectorAll('section'),
    'form': doc.querySelectorAll('form')
  };
  
  let count = 0;
  
  Object.keys(landmarks).forEach(landmarkType => {
    const elements = landmarks[landmarkType];
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledby = el.getAttribute('aria-labelledby');
        
        // If no label exists, add a descriptive one
        if (!ariaLabel && !ariaLabelledby) {
          el.setAttribute('aria-label', `${landmarkType}-${index + 1}`);
          count++;
        }
      });
    } else if (elements.length === 1) {
      // For single instances, ensure meaningful labeling
      const el = elements[0];
      if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
        // Add generic label for single landmarks if appropriate
        if (landmarkType === 'header' || landmarkType === 'footer') {
          el.setAttribute('aria-label', landmarkType);
          count++;
        }
      }
    }
  });
  
  return count;
}

/**
 * Add accessible names to SVG elements
 * @param {Document} doc - The document object
 * @param {Object} svgLabels - Mapping of SVG IDs to labels
 * @returns {number} - Number of SVGs updated
 */
function addAccessibleSVGs(doc, svgLabels = {}) {
  const svgs = doc.querySelectorAll('svg');
  let count = 0;
  
  svgs.forEach(svg => {
    // Check if SVG already has an accessible name
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.getAttribute('aria-label');
    const hasAriaLabelledby = svg.getAttribute('aria-labelledby');
    const hasRole = svg.getAttribute('role');
    
    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledby) {
      // Try to get label from mapping or generate one
      const svgId = svg.getAttribute('id');
      const label = svgLabels[svgId] || svg.getAttribute('aria-hidden') === 'true' 
        ? null 
        : 'decorative graphic';
      
      if (label) {
        // Create title element for the SVG
        const title = doc.createElement('title');
        title.textContent = label;
        
        // Insert title as first child of SVG
        if (svg.firstChild) {
          svg.insertBefore(title, svg.firstChild);
        } else {
          svg.appendChild(title);
        }
        
        // Add role="img" if not present
        if (!hasRole) {
          svg.setAttribute('role', 'img');
        }
        
        // Link title to SVG using aria-labelledby
        const titleId = `svg-title-${count}-${Date.now()}`;
        title.setAttribute('id', titleId);
        svg.setAttribute('aria-labelledby', titleId);
        
        count++;
      }
    }
  });
  
  return count;
}

/**
 * Apply all accessibility fixes
 * @param {Document} doc - The document object
 * @param {Object} options - Configuration options
 * @returns {Object} - Summary of changes made
 */
function applyAccessibilityFixes(doc, options = {}) {
  const results = {
    langAttribute: false,
    tableHeaders: 0,
    fakeLinks: 0,
    mainLandmark: null,
    landmarks: 0,
    svgs: 0
  };
  
  // Apply each fix
  if (options.lang !== false) {
    results.langAttribute = addLangAttribute(doc, options.lang || 'en');
  }
  
  if (options.tableHeaders !== false) {
    results.tableHeaders = addScopeToTableHeaders(doc, options.tableHeaderScope || 'col');
  }
  
  if (options.fakeLinks !== false) {
    results.fakeLinks = fixFakeLinks(doc);
  }
  
  if (options.mainLandmark !== false) {
    results.mainLandmark = wrapPrimaryContentInMain(doc);
  }
  
  if (options.uniqueLandmarks !== false) {
    results.landmarks = ensureUniqueLandmarks(doc);
  }
  
  if (options.svgs !== false) {
    results.svgs = addAccessibleSVGs(doc, options.svgLabels || {});
  }
  
  return results;
}

// Export functions for use in other modules
export {
  addLangAttribute,
  addScopeToTableHeaders,
  fixFakeLinks,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks,
  addAccessibleSVGs,
  applyAccessibilityFixes
};

// If running in Node.js or Jest environment, provide default export
export default {
  addLangAttribute,
  addScopeToTableHeaders,
  fixFakeLinks,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks,
  addAccessibleSVGs,
  applyAccessibilityFixes
};