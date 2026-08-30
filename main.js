// TODO: This is the existing code that needs to be preserved

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return document.documentElement.lang;
}

function setLangAttribute(lang) {
  document.documentElement.lang = lang;
}

// REACT_017 & REACT_025: Add landmark roles and ensure unique landmarks
function addLandmarkRole(element, role) {
  if (element) {
    element.setAttribute('role', role);
  }
}

function addUniqueLandmarkLabel(element, baseId) {
  if (element) {
    const uniqueId = `${baseId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    element.setAttribute('id', uniqueId);
    return uniqueId;
  }
  return null;
}

function setMainLandmark(element) {
  if (element) {
    element.setAttribute('role', 'main');
    addUniqueLandmarkLabel(element, 'main-content');
  }
}

function setNavigationLandmark(element, label) {
  if (element) {
    element.setAttribute('role', 'navigation');
    if (label) {
      element.setAttribute('aria-label', label);
    }
    addUniqueLandmarkLabel(element, 'nav');
  }
}

function setBannerLandmark(element) {
  if (element) {
    element.setAttribute('role', 'banner');
    addUniqueLandmarkLabel(element, 'banner');
  }
}

function setContentinfoLandmark(element) {
  if (element) {
    element.setAttribute('role', 'contentinfo');
    addUniqueLandmarkLabel(element, 'contentinfo');
  }
}

// REACT_041: Add accessible names to SVGs
function addAccessibleSvgName(svgElement, name) {
  if (svgElement && svgElement.tagName.toLowerCase() === 'svg') {
    svgElement.setAttribute('aria-label', name);
    
    // Also add title element inside SVG for better accessibility
    let titleElement = svgElement.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      titleElement.textContent = name;
      svgElement.insertBefore(titleElement, svgElement.firstChild);
    } else {
      titleElement.textContent = name;
    }
    
    // Link title with aria-labelledby
    const titleId = `svg-title-${Date.now()}`;
    titleElement.setAttribute('id', titleId);
    svgElement.setAttribute('aria-labelledby', titleId);
  }
}

// REACT_036: Fix fake link issue
function fixFakeLink(element) {
  if (element && element.tagName.toLowerCase() === 'a') {
    const href = element.getAttribute('href');
    
    // Check if it's a fake link (no href or just '#')
    if (!href || href === '#' || href === '') {
      // Convert to button element
      const button = document.createElement('button');
      
      // Copy all attributes
      Array.from(element.attributes).forEach(attr => {
        if (attr.name !== 'href') {
          button.setAttribute(attr.name, attr.value);
        }
      });
      
      // Copy inner content
      button.innerHTML = element.innerHTML;
      
      // Copy classes and styles
      button.className = element.className;
      button.style.cssText = element.style.cssText;
      
      // Add tabindex to make it keyboard accessible
      if (!button.hasAttribute('tabindex')) {
        button.setAttribute('tabindex', '0');
      }
      
      return button;
    }
  }
  return element;
}

// REACT_027: Add scope attribute to th elements
function addScopeToTh(thElement, scope) {
  if (thElement && thElement.tagName.toLowerCase() === 'th') {
    thElement.setAttribute('scope', scope);
  }
}

function processTableHeaders(tableElement) {
  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    return;
  }
  
  const headerRow = tableElement.querySelector('thead tr');
  if (headerRow) {
    const thElements = headerRow.querySelectorAll('th');
    thElements.forEach(th => {
      addScopeToTh(th, 'col');
    });
  }
  
  // Process row headers
  const bodyRows = tableElement.querySelectorAll('tbody tr');
  bodyRows.forEach(row => {
    const firstTh = row.querySelector('th');
    if (firstTh) {
      addScopeToTh(firstTh, 'row');
    }
  });
}

module.exports = {
  getLangAttribute,
  setLangAttribute,
  addLandmarkRole,
  addUniqueLandmarkLabel,
  setMainLandmark,
  setNavigationLandmark,
  setBannerLandmark,
  setContentinfoLandmark,
  addAccessibleSvgName,
  fixFakeLink,
  addScopeToTh,
  processTableHeaders
};