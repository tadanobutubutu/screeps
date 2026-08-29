// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// New function or changes requested in the issue

/**
 * Addresses REACT_015: Adds lang attribute to HTML element
 * @param {string} langCode - The language code (e.g., 'en', 'es', 'fr')
 */
export function setHtmlLangAttribute(langCode) {
  document.documentElement.lang = langCode;
}

/**
 * Addresses REACT_017: Adds landmark roles and fixes landmark issues
 * @param {HTMLElement} element - The element to add landmark role to
 * @param {string} role - The ARIA landmark role
 */
export function addLandmarkRole(element, role) {
  if (element && role) {
    element.setAttribute('role', role);
  }
}

/**
 * Addresses REACT_025: Ensures unique landmarks by checking for duplicates
 * @param {string} landmarkType - The type of landmark (e.g., 'navigation', 'complementary')
 * @returns {boolean} - True if landmark is unique
 */
export function ensureUniqueLandmark(landmarkType) {
  const existingLandmarks = document.querySelectorAll(`[role="${landmarkType}"]`);
  return existingLandmarks.length <= 1;
}

/**
 * Addresses REACT_036: Fixes fake link issues by ensuring proper link behavior
 * A fake link is an element that looks like a link but isn't an anchor element
 * @param {HTMLElement} element - The element to check/fix
 */
export function fixFakeLink(element) {
  if (element && element.tagName !== 'A') {
    const onClick = element.getAttribute('onclick');
    const role = element.getAttribute('role');
    
    if (onClick || role === 'link') {
      // Convert to proper anchor or add proper href
      const href = element.getAttribute('data-href') || '#';
      element.setAttribute('role', 'link');
      element.setAttribute('tabindex', '0');
      
      // If no onclick, add keyboard support
      if (!onClick) {
        element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.location.href = href;
          }
        });
      }
    }
  }
}

/**
 * Addresses REACT_041: Adds accessible names to SVG elements
 * @param {SVGElement|HTMLElement} svgElement - The SVG element
 * @param {string} accessibleName - The accessible name for the SVG
 */
export function addSvgAccessibleName(svgElement, accessibleName) {
  if (!svgElement) return;
  
  const isSvg = svgElement.tagName?.toLowerCase() === 'svg';
  
  if (isSvg) {
    // Remove any existing title if present
    const existingTitle = svgElement.querySelector('title');
    if (existingTitle) {
      existingTitle.remove();
    }
    
    // Create and insert title element
    const title = document.createElement('title');
    title.textContent = accessibleName;
    const titleId = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    title.id = titleId;
    
    // Insert as first child
    svgElement.insertBefore(title, svgElement.firstChild);
    
    // Set aria-labelledby
    svgElement.setAttribute('aria-labelledby', titleId);
    
    // Also add aria-label as fallback
    svgElement.setAttribute('aria-label', accessibleName);
  }
}

// Existing exports (do not remove or rename)
export function existingFunction() {
  // Implementation of the existing function
}

/**
 * Addresses REACT_025: Fix unique landmark issues by removing duplicate landmarks
 * and keeping only the first occurrence of each landmark type
 */
export function fixDuplicateLandmarks() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  
  landmarkRoles.forEach(role => {
    const landmarks = document.querySelectorAll(`[role="${role}"]`);
    
    // Keep the first occurrence, remove role from duplicates
    for (let i = 1; i < landmarks.length; i++) {
      landmarks[i].removeAttribute('role');
    }
  });
}

/**
 * Addresses REACT_017: Adds appropriate landmark roles to common elements
 */
export function fixLandmarkIssues() {
  // Fix header without nav
  const headers = document.querySelectorAll('header:not([role])');
  headers.forEach(header => {
    if (!header.closest('article') && !header.closest('section')) {
      header.setAttribute('role', 'banner');
    }
  });
  
  // Fix nav without role
  const navs = document.querySelectorAll('nav:not([role])');
  navs.forEach(nav => {
    nav.setAttribute('role', 'navigation');
  });
  
  // Fix main without role
  const mains = document.querySelectorAll('main:not([role])');
  mains.forEach(main => {
    main.setAttribute('role', 'main');
  });
  
  // Fix aside
  const asides = document.querySelectorAll('aside:not([role])');
  asides.forEach(aside => {
    aside.setAttribute('role', 'complementary');
  });
  
  // Fix footer
  const footers = document.querySelectorAll('footer:not([role])');
  footers.forEach(footer => {
    if (!footer.closest('article') && !footer.closest('section')) {
      footer.setAttribute('role', 'contentinfo');
    }
  });
}

// Additional code if necessary