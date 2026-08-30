// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

_Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_

<!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// Preserve existing functionality
// Importing the necessary functions (for illustration purposes)
import { getLangAttribute, createInPageButton, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure, ensureUniqueLandmarks as ensureLandmarkUniqueness } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks, createAccessibleLink } from './utils/linkAccessibilityUtils';

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// Internal set to track used landmark IDs
// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function createLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.floor(Math.random() * 9000) + 1000;
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (element && !element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Adds lang attribute as per the issue requirement
 */
function addLangAttribute() {
  const elementToModify = document.documentElement;
  const langValue = getLangAttribute() || 'en';
  if (elementToModify) {
    elementToModify.setAttribute('lang', langValue);
  }
}

// Accessibility implementation functions for REACT issues

/**
 * Addresses REACT_015: Add lang attribute to HTML element
 */
function handleReact015() {
  const htmlElement = document.documentElement;
  const langAttr = getLangAttribute() || getFullLangAttribute() || 'en';
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', langAttr);
  }
}

/**
 * Addresses REACT_017: Add landmark roles and fix landmark issues
 * Addresses REACT_025: Ensure unique landmarks (2 issues)
 */
function handleReact017AndReact025() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  
  landmarks.forEach(landmark => {
    validateLandmark(landmark);
    validateLandmarkStructure(landmark);
    
    // Ensure unique landmark IDs
    if (landmark.id) {
      const existingIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
      if (existingIds.filter(id => id === landmark.id).length > 1) {
        landmark.id = createLandmarkId(landmark.tagName.toLowerCase());
      }
    } else {
      landmark.id = createLandmarkId(landmark.tagName.toLowerCase());
    }
  });
  
  ensureLandmarkUniqueness();
}

/**
 * Addresses REACT_041: Add accessible names to 2 SVGs
 */
function handleReact041() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
    
    // Ensure SVG has accessible name
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby') && !svg.hasAttribute('title')) {
      svg.setAttribute('aria-label', `SVG icon ${index + 1}`);
    }
  });
}

/**
 * Addresses REACT_036: Fix 1 fake link issue
 */
function handleReact036() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.hasAttribute('onclick') || link.classList.contains('button') || link.getAttribute('role') === 'button') {
      createAccessibleLink(link);
    }
  });
  
  handleFakeLinks();
  
  // Additional fake link detection - elements that look like links but aren't
  const suspiciousLinks = document.querySelectorAll('span[onclick], div[onclick], button');
  suspiciousLinks.forEach(element => {
    const onclickAttr = element.getAttribute('onclick');
    if (onclickAttr && (onclickAttr.includes('window.location') || onclickAttr.includes('document.location'))) {
      const newLink = document.createElement('a');
      newLink.href = element.getAttribute('onclick').match(/['"]([^'"]+)['"]/)?.[1] || '#';
      newLink.textContent = element.textContent;
      newLink.setAttribute('role', 'button');
      element.parentNode.replaceChild(newLink, element);
    }
  });
}

/**
 * Main accessibility initialization function
 */
function initAccessibility() {
  // REACT_015: Add lang attribute to HTML element
  handleReact015();
  
  // REACT_017 and REACT_025: Handle landmark issues
  handleReact017AndReact025();
  
  // REACT_041: Add accessible names to SVGs
  handleReact041();
  
  // REACT_036: Fix fake link issues
  handleReact036();