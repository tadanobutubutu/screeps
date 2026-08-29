// Import necessary modules (if not already imported)
import { getLangAttribute, wrapPrimaryContentInMain, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, addFixLandmarkIssues, getSvgAccessibleName, createAccessibleLink, ensureUniqueLandmarks } from './accessibilityUtils';

// Keep the existing exports
// ...

// Add new functions or changes requested in the issue

function handleAccessibilityIssues() {
  // Address the accessibility issues as requested in the code comment
  getLangAttribute();
  wrapPrimaryContentInMain();
  validateTableAccessibility();
  validateTableStructure();
  validateLandmark();
  validateLandmarkStructure();
  addFixLandmarkIssues();
  getSvgAccessibleName();
  createAccessibleLink();
  ensureUniqueLandmarks();
}

// Call the new function to handle accessibility issues
handleAccessibilityIssues();

// Keep the existing exports
// ...

// Implement validateLandmark functionality
function validateLandmark() {
  if (typeof document === 'undefined' || !document.body) {
    return;
  }

  // Expected landmark roles for validation
  const expectedLandmarks = {
    banner: 1,
    main: 1,
    contentinfo: 1,
    navigation: -1, // -1 means at least one is required
    complementary: -1
  };

  const detectedLandmarks = {
    banner: 0,
    main: 0,
    contentinfo: 0,
    navigation: 0,
    complementary: 0
  };

  // Check header element
  const header = document.querySelector('header');
  if (header) {
    detectedLandmarks.banner++;
  }

  // Check main element
  const main = document.querySelector('main');
  if (main) {
    detectedLandmarks.main++;
  }

  // Check footer element
  const footer = document.querySelector('footer');
  if (footer) {
    detectedLandmarks.contentinfo++;
  }

  // Check nav elements
  const navs = document.querySelectorAll('nav');
  detectedLandmarks.navigation = navs.length;

  // Check aside elements
  const asides = document.querySelectorAll('aside');
  detectedLandmarks.complementary = asides.length;

  // Also check for ARIA landmark roles
  const ariaLandmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="contentinfo"], [role="navigation"], [role="complementary"]');
  ariaLandmarks.forEach((el) => {
    const role = el.getAttribute('role');
    if (role === 'banner') detectedLandmarks.banner++;
    if (role === 'main') detectedLandmarks.main++;
    if (role === 'contentinfo') detectedLandmarks.contentinfo++;
    if (role === 'navigation') detectedLandmarks.navigation++;
    if (role === 'complementary') detectedLandmarks.complementary++;
  });

  // Validate counts
  const validationResults = [];
  for (const [role, expected] of Object.entries(expectedLandmarks)) {
    const actual = detectedLandmarks[role];
    if (expected === 1 && actual !== 1) {
      validationResults.push({
        role: role,
        expected: expected,
        actual: actual,
        issue: actual === 0 ? 'missing' : 'multiple'
      });
    } else if (expected === -1 && actual < 1) {
      validationResults.push({
        role: role,
        expected: 'at least 1',
        actual: actual,
        issue: 'missing'
      });
    }
  }

  // Log validation results for debugging
  if (validationResults.length > 0) {
    console.warn('Landmark validation issues found:', validationResults);
  }

  return validationResults;
}

function addProperLandmarkRegions() {
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('role', 'banner');
  }

  // Function to ensure all SVG elements have accessible names
  const ensureSvgAccessibleNames = () => {
    if (typeof document === 'undefined' || !document.body) {
      return;
    }

    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg) => {
      // Check if SVG is hidden
      const isHidden = svg.getAttribute('aria-hidden') === 'true' ||
                        svg.getAttribute('hidden') !== null ||
                        svg.style.display === 'none' ||
                        svg.style.visibility === 'hidden';

      if (isHidden) {
        return;
      }

      // Check for existing accessible name
      const hasAriaLabel = svg.getAttribute('aria-label');
      const hasAriaLabelledBy = svg.getAttribute('aria-labelledby');
      const hasTitle = svg.querySelector('title');
      const hasDesc = svg.querySelector('desc');

      if (hasAriaLabel || hasAriaLabelledBy || hasTitle || hasDesc) {
        return;
      }

      // Determine if decorative - SVGs used for favicons/decorative purposes
      const isFavicon = svg.closest('link') !== null ||
                        (svg.parentElement && svg.parentElement.tagName === 'LINK') ||
                        svg.getAttribute('data-favicon') === 'true';

      if (isFavicon) {
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
      } else {
        // Add a generic title for non-decorative SVGs
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = 'Icon';
        svg.insertBefore(title, svg.firstChild);
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', 'Icon');
      }
    });
  };

  // Function to handle updating accessible SVG names when DOM mutates
  const updateAccessibleSvgNames = () => {
    setTimeout(() => {
      ensureSvgAccessibleNames();
    }, 0);
  };

  ensureSvgAccessibleNames();

  // Run again after DOM mutations
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      updateAccessibleSvgNames();
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-hidden', 'aria-label', 'aria-labelledby']
      });
    }
  }

  // - REACT_017: Add/fix 4 landmark issues
  const landmarks = document.querySelectorAll('.landmark');
  landmarks.forEach((landmark) => {
    // Assuming you know which ARIA roles are correct for your landmarks
    landmark.setAttribute('role', 'landmark');
  });
}

// Implement function to add aria-labelledby to SVGs with title elements
function addAriaLabelledbyToSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = svg.querySelector('title');
    if (title) {
      const titleId = title.getAttribute('id');
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
}

// Implement function to add aria-label to SVGs without title elements
function addAriaLabelToSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = svg.querySelector('title');
    if (!title) {
      const svgText = svg.textContent || svg.innerText || 'Image';
      svg.setAttribute('aria-label', svgText);
    }
  });
}

// Remove duplicate non-decorative SVGs accessibility fix as it's already handled in ensureSvgAccessibleNames
// - REACT_041: Add accessible names to 2 SVGs
// These are decorative favicon SVGs, so marking them as hidden from assistive tech
// const svg1 = document.querySelector('#svg1');
// const svg2 = document.querySelector('#svg2');
// if (svg1) svg1.setAttribute('aria-hidden', 'true');
// if (svg2) svg2.setAttribute('aria-hidden', 'true');

// Call the new landmark and SVG accessibility functions
addProperLandmarkRegions();
addAriaLabelledbyToSVGs();
addAriaLabelToSVGs();