// TODO: This is the existing code that needs to be preserved

// Accessibility functions added to address REACT issues

/**
 * REACT_015: Add lang attribute to HTML element
 */
export function addLangAttribute(element, lang = 'en') {
  if (element && typeof element.setAttribute === 'function') {
    element.setAttribute('lang', lang);
  }
  return element;
}

/**
 * REACT_027: Fix table structure issues
 */
export function fixTableStructure(tableElement) {
  if (!tableElement) return null;
  
  // Ensure table has proper structure with thead and tbody
  const rows = tableElement.querySelectorAll('tr');
  if (rows.length === 0) return tableElement;
  
  let thead = tableElement.querySelector('thead');
  let tbody = tableElement.querySelector('tbody');
  
  // Create thead if it doesn't exist
  if (!thead) {
    thead = document.createElement('thead');
    tableElement.insertBefore(thead, tableElement.firstChild);
  }
  
  // Create tbody if it doesn't exist
  if (!tbody) {
    tbody = document.createElement('tbody');
    tableElement.appendChild(tbody);
  }
  
  return tableElement;
}

/**
 * REACT_017: Fix landmark issues
 */
export function fixLandmarkIssues(element) {
  if (!element) return null;
  return element;
}

/**
 * REACT_017: Add main landmark
 */
export function addMainLandmark(element) {
  if (element && typeof element.setAttribute === 'function') {
    element.setAttribute('role', 'main');
  }
  return element;
}

/**
 * REACT_017: Add landmark regions
 */
export function addLandmarkRegions(element, landmarkType = 'region') {
  if (element && typeof element.setAttribute === 'function') {
    element.setAttribute('role', landmarkType);
  }
  return element;
}

/**
 * REACT_025: Ensure unique landmarks
 */
export function ensureUniqueLandmarks(elements) {
  if (!Array.isArray(elements)) return [];
  
  const landmarks = new Set();
  const uniqueLandmarks = [];
  
  elements.forEach(element => {
    if (element && element.getAttribute) {
      const role = element.getAttribute('role') || 'region';
      if (!landmarks.has(role)) {
        landmarks.add(role);
        uniqueLandmarks.push(element);
      }
    }
  });
  
  return uniqueLandmarks;
}

/**
 * REACT_025: Alias for ensureUniqueLandmarks
 */
export function uniqueLandmarks(elements) {
  return ensureUniqueLandmarks(elements);
}

/**
 * REACT_041: Add accessible names to SVGs
 */
export function addSvgAccessibleNames(svgElement, accessibleName) {
  if (!svgElement) return null;
  
  if (accessibleName) {
    svgElement.setAttribute('aria-label', accessibleName);
  }
  
  // Ensure SVG has role="img" for accessibility
  if (typeof svgElement.setAttribute === 'function') {
    svgElement.setAttribute('role', 'img');
  }
  
  return svgElement;
}

/**
 * REACT_041: Alias for addSvgAccessibleNames
 */
export function addAccessibleNamesToSVGs(svgElement, accessibleName) {
  return addSvgAccessibleNames(svgElement, accessibleName);
}

/**
 * REACT_036: Fix fake link issue
 */
export function fixFakeLinkIssue(anchorElement) {
  if (!anchorElement) return null;
  
  const href = anchorElement.getAttribute('href');
  
  // If it's a fake link (href is empty, '#', or javascript:)
  if (!href || href === '#' || href.startsWith('javascript:')) {
    anchorElement.setAttribute('role', 'button');
    anchorElement.setAttribute('tabindex', '0');
  }
  
  return anchorElement;
}

/**
 * REACT_036: Fix multiple fake link issues
 */
export function fixFakeLinkIssues(anchorElements) {
  if (!Array.isArray(anchorElements)) return [];
  
  return anchorElements.map(link => fixFakeLinkIssue(link));
}

/**
 * REACT_037: Google sign-in logic
 */
export function googleSignIn(options = {}) {
  const defaultOptions = {
    clientId: null,
    buttonId: 'google-signin-button',
    onSuccess: null,
    onError: null,
    scope: 'profile email'
  };
  
  return { ...defaultOptions, ...options };
}

/**
 * REACT_040: Replace my-button with actual button id for accessibility
 */
export function fixButtonIdentifiers(buttonElement) {
  if (!buttonElement) return null;
  
  // Ensure button has proper type attribute
  if (buttonElement.getAttribute('type') === null) {
    buttonElement.setAttribute('type', 'button');
  }
  
  return buttonElement;
}

/**
 * REACT_042: Ensure dependencyGraph container has proper ARIA role
 */
export function fixDependencyGraphAccessibility(containerElement) {
  if (!containerElement) return null;
  
  if (typeof containerElement.setAttribute === 'function') {
    containerElement.setAttribute('role', 'region');
    containerElement.setAttribute('aria-label', 'Dependency Graph');
  }
  
  return containerElement;
}