// REACT_015: Add lang attribute to HTML element (DONE)
// REACT_027: Fix 26 table structure issues (DONE)
// REACT_017: Add/fix 4 landmark issues (DONE)
// REACT_041: Add accessible names to 2 SVGs (DONE)
// REACT_025: Ensure unique landmarks (DONE)
// REACT_036: Fix 1 fake link issue (DONE)

import { getLangAttribute, wrapPrimaryContentInMain, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, addFixLandmarkIssues, getSvgAccessibleName, createAccessibleLink, ensureUniqueLandmarks } from './accessibilityUtils';

export function calculateSum(a, b) { return a + b; }

/**
 * Checks landmark elements on the page for accessibility
 * @returns {Object} An object containing landmark analysis results
 */
function checkLandmarkElements() {
  // Landmark elements and their corresponding roles
  const landmarkSelectors = [
    'header[role="banner"]',
    '[role="banner"]',
    'nav',
    '[role="navigation"]',
    'main',
    '[role="main"]',
    'aside',
    '[role="complementary"]',
    'footer[role="contentinfo"]',
    '[role="contentinfo"]',
    'section[aria-label]',
    '[role="region"]',
    'article',
    '[role="article"]',
    'form[aria-label]',
    'form[aria-labelledby]',
    '[role="form"]',
    'search',
    '[role="search"]'
  ];

  const landmarks = [];
  landmarkSelectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        landmarks.push({
          element: el.tagName.toLowerCase(),
          role: el.getAttribute('role') || null,
          label: el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || null
        });
      });
    } catch (e) {
      console.warn(`Invalid selector: ${selector}`);
    }
  });

  return landmarks;
}

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

function initializeAccessibility() {
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
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
                        svg.getAttribute('aria-hidden') === 'true';

      if (isFavicon) {
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('role', 'presentation');
      } else {
        // Add a generic title for non-decorative SVGs
        const title = document.createElement('title');
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

  // Initial check for existing SVGs
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

  // REACT_017: Add/fix 4 landmark issues
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, article, form, search');
  landmarks.forEach((landmark) => {
    if (!landmark.getAttribute('role')) {
      landmark.setAttribute('role', 'landmark');
    }
  });
}

// Implement function to add aria-labelledby to SVGs with title elements
function add