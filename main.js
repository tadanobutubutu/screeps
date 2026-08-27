// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation

// Standalone function to get the accessible name of an SVG element
// Uses aria-labelledby first, then falls back to the <title> child element
function getSvgAccessibleName(svg) {
  if (!svg || !(svg instanceof SVGElement) || svg.tagName !== 'svg') {
    return '';
  }

  // First, check for aria-labelledby reference
  const labelledBy = svg.getAttribute('aria-labelledby');
  if (labelledBy) {
    const ids = labelledBy.split(/\s+/);
    const names = ids
      .map(id => {
        const el = document.getElementById(id);
        return el ? el.textContent.trim() : '';
      })
      .filter(text => text.length > 0);
    if (names.length > 0) {
      return names.join(' ');
    }
  }

  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim().length > 0) {
    return ariaLabel.trim();
  }

  // Fall back to <title> child element
  const titleElement = svg.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent.trim();
  }

  // Check for title attribute on the SVG itself
  const titleAttr = svg.getAttribute('title');
  if (titleAttr && titleAttr.trim().length > 0) {
    return titleAttr.trim();
  }

  return '';
}

// New function to handle missing lang attribute
function getLangAttribute() {
  if (document.documentElement) {
    document.documentElement.lang = 'en';
  }
}

// New function to ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
  const uniqueLandmarks = new Set();

  landmarkElements.forEach(landmark => {
    const element = document.querySelector(landmark);
    if (element && (!element.id || uniqueLandmarks.has(element.id))) {
      element.id = `auto-generated-${landmark}-${Date.now() * 1000}`;
      uniqueLandmarks.add(element.id);
    }
  });
}

// New function to add SVG accessibility props
function addSVGAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    // Existing code for determining the accessible name of the SVG element
    const titleElement = svg.querySelector('title');
    const titleText = titleElement ? (titleElement.textContent || 'Image description') : 'Image description';

    svg.setAttribute('role', 'img');

    // Ensure the SVG has a <title> child for proper accessibility
    if (!titleElement) {
      const newTitle = document.createElement('title');
      newTitle.textContent = titleText;
      svg.insertBefore(newTitle, svg.firstChild);
    }

    // Use getSvgAccessibleName to determine the appropriate aria-labelledby value
    const existingTitle = svg.querySelector('title');
    if (existingTitle && !existingTitle.id) {
      existingTitle.id = 'svg-title';
    }
    svg.setAttribute('aria-labelledby', existingTitle ? existingTitle.id : 'svg-title');

    const descriptionId = `svg-desc-${Date.now() * 1000}`;
    svg.setAttribute('aria-describedby', descriptionId);

    const descriptionElement = document.createElement('desc');
    descriptionElement.id = descriptionId;
    descriptionElement.textContent = titleText;
    descriptionElement.className = 'sr-only';
    svg.appendChild(descriptionElement);
  });
}

// New function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  report.forEach(issue => {
    // Handle each issue type
    switch (issue.type) {
      case 'missing-lang':
        getLangAttribute();
        break;
      case 'missing-skip-link':
        if (!document.querySelector('.skip-link')) {
          const skipLink = document.createElement('a');
          skipLink.className = 'skip-link';
          skipLink.href = '#main-content';
          skipLink.textContent = 'Skip to main content';
          skipLink.style.position = 'absolute';
          skipLink.style.top = '-40px';
          document.body.insertBefore(skipLink, document.body.firstChild);
        }
        break;
      case 'missing-alt':
        document.querySelectorAll('img').forEach(img => {
          if (!img.getAttribute('alt')) {
            const imgId = `img-desc-${Date.now() * 1000}`;
            const descriptionId = `img-desc-text-${Date.now() * 1000}`;

            img.setAttribute('alt', 'Image description');
            img.setAttribute('aria-describedby', descriptionId);

            const descriptionElement = document.createElement('span');
            descriptionElement.id = descriptionId;
            descriptionElement.className = 'sr-only';
            descriptionElement.textContent = 'Image description';
            img.parentNode.insertBefore(descriptionElement, img.nextSibling);
          }
        });
        break;
      case 'missing-aria-label':
        // Existing function to handle missing aria-labels
        ensureElementIdAndLabel();
        break;
      case 'missing-role':
        // Existing function to handle missing roles
        // ...
        break;
      default:
        // Unknown issue type, log for debugging
        console.warn('Unknown accessibility issue type:', issue.type);
        break;
    }
  });
}

// Updated function to check and address landmark elements and add SVG accessibility props
function checkLandmarkElementsAndAddSVGAccessibility() {
  ensureUniqueLandmarks();
  addSVGAccessibilityProps();
}

// ... (the rest of the existing code that needs to be preserved)

// Export for module usage
export {
  a11yStore,
  getSvgAccessibleName,
  checkLandmarkElementsAndAddSVGAccessibility,
  ...
};