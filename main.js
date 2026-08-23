// main.js

import React from 'react';

// Existing code from main.js that needs to be preserved
// ...

// New functions to fix the React SVG Accessible Name issue
const icons = {
  icon: '<svg ... viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" ...',
  apple: '<svg ... viewBox="0 0 100 100"><title>Apple Icon</title><text y="0.9em" ...',
};

/**
 * Adds lang attribute to the HTML root element.
 */
function addLangToHtml() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.getAttribute('lang')) {
      document.documentElement.setAttribute('lang', 'en');
    }
  }
}

/**
 * Adds a language attribute to an HTML element.
 * @param {React.ReactElement} element JSX element to add lang attribute
 */
function addLangAttribute(element) {
  if (!element || !element.props) {
    return element;
  }

  return React.cloneElement(element, {
    ...element.props,
    lang: element.props.lang || 'en',
  });
}

/**
 * Recursively processes children to add language attributes.
 * @param {React.ReactElement} element JSX element to process
 * @returns {React.ReactElement} Element with lang attributes added
 */
function processChildrenForLang(element) {
  if (!element || typeof element !== 'object') {
    return element;
  }

  if (element.props && element.props.children) {
    const processedChildren = React.Children.map(element.props.children, child => {
      if (child && typeof child === 'object' && child !== null && child.props) {
        return addLangAttribute(child);
      }
      return child;
    });

    return React.cloneElement(element, {
      ...element.props,
      children: processedChildren,
    });
  }

  if (element.props) {
    return addLangAttribute(element);
  }

  return element;
}

// Export functions for testing
export {
  addLangAttribute,
  processChildrenForLang,
  // Add the following functions for testing landmarks and SVG accessibility
  addAccessibleNameToSVG,
  getSVGAccessibleName,
  ensureUniqueAccessibleSVGIds,
  fixFakeLinkIssue,
  // ... keep the rest of the exports as is
  icons,
};

/**
 * Adds an accessible name to an SVG element.
 * @param {SVGElement} svgElement SVG element to modify
 * @param {string} accessibleName Accessible name to add
 */
function addAccessibleNameToSVG(svgElement, accessibleName) {
  if (!svgElement || !accessibleName) {
    return svgElement;
  }

  // Ensure role="img" is set
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }

  // Set aria-label for accessible name
  svgElement.setAttribute('aria-label', accessibleName);

  return svgElement;
}

/**
 * Gets the accessible name of an SVG element.
 * @param {SVGElement} svgElement SVG element to get name from
 * @returns {string} The accessible name (title, aria-label, or aria-labelledby)
 */
function getSVGAccessibleName(svgElement) {
  if (!svgElement) {
    return '';
  }

  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby reference
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const titleElement = svgElement.querySelector(`#${ariaLabelledby}`);
    if (titleElement) {
      return titleElement.textContent;
    }
  }

  // Fallback to title element
  const titleElement = svgElement.querySelector('title');
  if (titleElement) {
    return titleElement.textContent;
  }

  return '';
}

/**
 * Creates accessibility properties for an SVG element.
 * @param {string} accessibleName The accessible name for the SVG
 * @param {string} id The id of the SVG (optional)
 * @returns {Object} Object with role, aria-labelledby, aria-label, and id (if provided)
 */
function createAccessibilityProps(accessibleName, id) {
  if (!accessibleName) {
    return {
      role: 'img',
      'aria-hidden': 'true',
    };
  }

  return {
    role: 'img',
    'aria-label': accessibleName,
    'aria-labelledby': id,
  };
}

/**
 * Ensures landmarks are unique.
 * @param {Array} landmarks Array of landmarks to deduplicate
 * @returns {Array} Deduplicated landmarks
 */
function ensureUniqueAccessibleSVGIds(landmarks) {
  const unique = [];
  const seen = new Set();

  landmarks.forEach(landmark => {
    const id = landmark.id || landmark.getAttribute('id');
    if (!seen.has(id)) {
      seen.add(id);
      unique.push(landmark);
    }
  });

  return unique;
}

/**
 * Fixes a fake link issue by adding proper href and role attributes.
 * @param {HTMLElement} element The fake link element to fix
 * @param {string} href The href to add
 * @returns {HTMLElement} The fixed link element
 */
function fixFakeLinkIssue(element, href) {
  if (!element) {
    return element;
  }

  // Convert fake link to proper anchor element
  const anchorElement = document.createElement('a');
  anchorElement.href = href || '#';
  anchorElement.role = 'link';

  // Copy over existing attributes
  if (element.attributes) {
    Array.from(element.attributes).forEach(attr => {
      anchorElement.setAttribute(attr.name, attr.value);
    });
  }

  // Copy over existing content
  if (element.innerHTML) {
    anchorElement.innerHTML = element.innerHTML;
  }

  return anchorElement;
}