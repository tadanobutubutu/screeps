const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, getLangAttribute, validateAccessibilityReport, exportUtils, addressAccessibilityIssues, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, focusTrap, checkAccessibility } = main;

// Utility function to create a web resource button suitable for accessibility (e.g., Github, Stack Overflow, etc.)
function createWebResourceButton(options = {}) {
    const {
        label,
        url,
        icon = null,
        iconAltText = '',
        ariaLabel = null,
        className = 'web-resource-btn',
        target = '_blank',
        rel = 'noopener noreferrer'
    } = options;

    const button = document.createElement('a');
    button.href = url;
    button.className = className;
    button.target = target;
    button.rel = rel;
    
    // Set accessible name - prefer explicit ariaLabel, fallback to label
    const accessibleName = ariaLabel || label;
    button.setAttribute('aria-label', accessibleName);
    
    // Add text content
    if (label) {
        button.textContent = label;
    }
    
    // Handle icon accessibility
    if (icon) {
        if (typeof icon === 'string') {
            // If icon is an SVG string
            button.insertAdjacentHTML('afterbegin', icon);
            const svg = button.querySelector('svg');
            if (svg) {
                svg.setAttribute('aria-hidden', 'true');
                if (iconAltText) {
                    svg.setAttribute('aria-label', iconAltText);
                }
            }
        } else if (icon instanceof HTMLElement) {
            // If icon is already an DOM element
            icon.setAttribute('aria-hidden', 'true');
            button.insertBefore(icon, button.firstChild);
        }
    }
    
    return button;
}

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport(container, containerReport) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (!containerReport || !containerReport.issues) {
    return fixes;
  }

  // Add lang attribute to HTML element if missing
  const htmlEl = container.querySelector('html') || (container.ownerDocument && container.ownerDocument.querySelector('html'));
  if (htmlEl && !htmlEl.hasAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en');
    fixes.langAdded = true;
  }

  // Add main landmark if missing
  const mainElement = container.querySelector('main');
  if (!mainElement) {
    const body = container.querySelector('body');
    if (body) {
      const newMain = document.createElement('main');
      while (body.firstChild) {
        newMain.appendChild(body.firstChild);
      }
      body.appendChild(newMain);
      fixes.mainLandmarkAdded = true;
    }
  }

  // Update the existing function using the new functions for rendering graph/index
  renderDependencyGraphs(container);
  fixButtonIdentifiers(container);
  fixDependencyGraphAria(container);
  addMainLandmarkToIndex(container);

  // Fix landmark issues
  validateLandmark(container);
  validateLandmarkStructure(container);

  // Fix SVG accessible names
  const svgElements = container.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', accessibleName);
      fixes.svgNamesAdded++;
    }
  });

  // Fix fake link issues (elements that look like links but are missing href)
  const fakeLinks = container.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    link.setAttribute('href', '#' + (link.id || `link-${Date.now()}`));
    link.setAttribute('role', 'link');
    fixes.fakeLinksFixed++;
  });

  // Validate accessibility report
  const accessibilityReport = validateAccessibilityReport(container);
  if (accessibilityReport && accessibilityReport.length > 0) {
    log(`Accessibility report contains ${accessibilityReport.length} remaining issues`, 'warn');
  }

  // Implement focus trap for keyboard navigation
  focusTrap(container);

  if (fixes.langAdded) {
    log('Lang attribute added to HTML element', 'info');
  }

  if (fixes.mainLandmarkAdded) {
    log('Main landmark added', 'info');
  }

  // Check for new accessibility issues
  const newAccessibilityIssues = checkAccessibility(container);
  if (newAccessibilityIssues.length > 0) {
    log(`New accessibility issues found: ${newAccessibilityIssues.join(', ')}`, 'error');
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0;
  if (landmarkFixesCount > 0) {
    log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info');
  }

  const svgFixes = fixes.svgNamesAdded || 0;
  if (svgFixes > 0) {
    log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0;
  if (fakeLinkFixes > 0) {
    log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
  }

  return fixes;
}

// Accessibility-related function to be added
function checkAccessibility(content) {
  // Placeholder for accessibility checking logic
  // This function should be implemented to check for accessibility issues
  // For now, it just returns an empty array
  return [];
}