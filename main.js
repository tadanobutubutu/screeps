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

export function existingFunction2() {
  // existing implementation
}

// New function to fix the React SVG Accessible Name issue
function fixSVGAccessibleName(svgString) {
  // Check if the SVG string already contains an accessible name
  if (svgString.includes('<title>') || svgString.includes('aria-label') || svgString.includes('aria-hidden')) {
    return svgString;
  }

  // Create a temporary SVG element to parse the SVG string
  const tempSVG = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  const svgRoot = tempSVG.documentElement;

  // Check if the SVG is decorative and does not need an accessible name
  const isDecorative = svgRoot.querySelector('title') || svgRoot.querySelector('desc');
  if (isDecorative) {
    return svgString.replace('<svg', '<svg aria-hidden="true"');
  }

  // Add an aria-label to the SVG if it's not decorative
  const svgWithAriaLabel = svgString.replace('<svg', '<svg aria-label="SVG description"');
  return svgWithAriaLabel;
}

// To make it testable, export the function
export { fixSVGAccessibleName };

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

// New function to add proper landmark regions to the document
function addLandmarkRegions() {
  const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
  const existingLandmarks = new Set();

  // Detect existing landmarks to avoid duplicates
  landmarkElements.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    elements.forEach(element => {
      if (element.id) {
        existingLandmarks.add(element.id);
      }
    });
  });

  // Ensure a <main> landmark exists
  if (!document.querySelector('main')) {
    const mainElement = document.createElement('main');
    mainElement.id = `auto-generated-main-${Date.now() * 1000}`;
    const body = document.body;
    if (body) {
      // Move all body children that are not landmarks into the new <main>
      const children = Array.from(body.children);
      children.forEach(child => {
        if (!landmarkElements.includes(child.tagName.toLowerCase())) {
          mainElement.appendChild(child);
        }
      });
      body.appendChild(mainElement);
    }
  }

  // Ensure a <nav> landmark exists
  if (!document.querySelector('nav')) {
    const navElement = document.createElement('nav');
    navElement.id = `auto-generated-nav-${Date.now() * 1000}`;
    navElement.setAttribute('aria-label', 'Main navigation');
    const body = document.body;
    if (body) {
      body.insertBefore(navElement, body.firstChild);
    }
  }

  // Ensure a <header> landmark exists
  if (!document.querySelector('header')) {
    const headerElement = document.createElement('header');
    headerElement.id = `auto-generated-header-${Date.now() * 1000}`;
    const mainElement = document.querySelector('main');
    if (mainElement && mainElement.parentNode) {
      mainElement.parentNode.insertBefore(headerElement, mainElement);
    } else {
      const body = document.body;
      if (body) {
        body.insertBefore(headerElement, body.firstChild);
      }
    }
  }

  // Ensure a <footer> landmark exists
  if (!document.querySelector('footer')) {
    const footerElement = document.createElement('footer');
    footerElement.id = `auto-generated-footer-${Date.now() * 1000}`;
    const body = document.body;
    if (body) {
      body.appendChild(footerElement);
    }
  }

  // Ensure uniqueness of all landmark IDs
  ensureUniqueLandmarks();
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
      case 'missing-landmark-regions':
        // Add proper landmark regions to the document
        addLandmarkRegions();
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
module.exports = {
  existingFunction2,
  fixSVGAccessibleName,
  getSvgAccessibleName,
  getLangAttribute,
  ensureUniqueLandmarks,
  addSVGAccessibilityProps,
  addLandmarkRegions,
  addressAccessibilityIssues,
  checkLandmarkElementsAndAddSVGAccessibility,
};

// Also export for ES modules if needed
export {
  existingFunction2,
  fixSVGAccessibleName,
  getSvgAccessibleName,
  getLangAttribute,
  ensureUniqueLandmarks,
  addSVGAccessibilityProps,
  addLandmarkRegions,
  addressAccessibilityIssues,
  checkLandmarkElementsAndAddSVGAccessibility,
};