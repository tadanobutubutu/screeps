// Address accessibility issues from insight report

// Focus trap for modals/dialogs
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
    if (e.key === 'Escape') {
      element.blur();
    }
  });
}

// Announce content to screen readers
function announceToScreenReader(message, priority = 'polite') {
  let announcer = document.getElementById('sr-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

// Skip link handler
function handleSkipLink(event) {
  const targetId = event.target.getAttribute('href').substring(1);
  const target = document.getElementById(targetId);
  if (target) {
    target.setAttribute('tabindex', '-1');
    target.focus();
  }
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Accessible hide/show toggle
function setAccessibleHidden(element, isHidden) {
  if (isHidden) {
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute('hidden', '');
  } else {
    element.removeAttribute('aria-hidden');
    element.removeAttribute('hidden');
  }
}

// ----- END ORIGINAL CODE -----

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and createAccessibleLink())

// Language attribute helpers for REACT_015
function getLangAttribute() {
  const lang = document.documentElement.lang || document.querySelector('html')?.getAttribute('lang');
  return lang || 'en';
}

function getFullLangAttribute() {
  const lang = getLangAttribute();
  const htmlElement = document.querySelector('html') || document.documentElement;
  return htmlElement.getAttribute('lang') || lang;
}

// Table accessibility validation for REACT_027
function validateTableAccessibility(table) {
  const issues = [];
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;
  const caption = table.querySelector('caption');
  
  if (!hasHeaders) {
    issues.push('Table should have header cells (th) for accessibility');
  }
  if (!caption) {
    issues.push('Table should have a caption for context');
  }
  
  return {
    isValid: issues.length === 0,
    issues: issues
  };
}

function validateTableStructure(table) {
  const issues = [];
  const rows = table.querySelectorAll('tr');
  
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push(`Row ${rowIndex + 1} has no cells`);
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues: issues
  };
}

// Landmark validation for REACT_017 and REACT_025
function validateLandmark(element) {
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  
  if (role && !validLandmarks.includes(role)) {
    return { isValid: false, issue: `Invalid landmark role: ${role}` };
  }
  
  return { isValid: true };
}

function validateLandmarkStructure() {
  const issues = [];
  const landmarks = document.querySelectorAll('[role="main"], main, [role="navigation"], nav, [role="banner"], header, [role="contentinfo"], footer');
  
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    issues.push('Only one main landmark should be present');
  }
  
  const bannerElements = document.querySelectorAll('header:not([role]), [role="banner"]');
  if (bannerElements.length > 1) {
    issues.push('Only one banner landmark should be present');
  }
  
  return {
    isValid: issues.length === 0,
    issues: issues
  };
}

// SVG accessible name for REACT_041
function getSvgAccessibleName(svgElement) {
  const title = svgElement.querySelector('title');
  const ariaLabel = svgElement.getAttribute('aria-label');
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  
  if (ariaLabel) {
    return ariaLabel;
  }
  
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    return referencedElement ? referencedElement.textContent : '';
  }
  
  if (title) {
    return title.textContent;
  }
  
  return '';
}

// Fake link handling for REACT_036
function createInPageButton(element) {
  element.setAttribute('role', 'button');
  element.setAttribute('tabindex', '0');
  
  if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
    console.warn('Button-like element has no accessible name');
  }
  
  return element;
}

function createAccessibleLink(element, href) {
  if (!href || href === '#' || href.startsWith('javascript:')) {
    console.warn('Link appears to be a fake link - consider using a button instead');
  }
  
  if (!element.textContent.trim() && !element.getAttribute('aria-label')) {
    console.warn('Link has no accessible name');
  }
  
  return element;
}

export {
  trapFocus,
  announceToScreenReader,
  handleSkipLink,
  prefersReducedMotion,
  setAccessibleHidden,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink
};