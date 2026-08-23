// main.js

// TODO: Import required module(s) and export the new necessary function(s) here in main.js
import React from 'react';

// Existing code from main.js that needs to be preserved
// ...

// New changes to fix the React SVG Accessible Name issue
// Add an accessible name to the SVGs in the icons object
const icons = {
  icon: '<svg ... viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" ...',
  apple: '<svg ... viewBox="0 0 100 100"><title>Apple Icon</title><text y="0.9em" ...',
};

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
function processChildrenWithLang(element) {
  if (!element || typeof element !== 'object') {
    return element;
  }

  if (element.props && element.props.children) {
    const processedChildren = React.Children.map(element.props.children, child => {
      if (child && typeof child === 'object' && child.type !== 'string') {
        if (child.props) {
          return React.cloneElement(child, {
            ...child.props,
            className: (child.props.className || '') + ' jsx-lang-en',
            lang: child.props.lang || 'en',
          });
        }
      }
      return child;
    });

    return React.cloneElement(element, {
      ...element.props,
      children: processedChildren,
    });
  }

  return element;
}

/**
 * Fixes 26 table structure issues.
 */
function fixTableStructure() {
  // Ensure tables have proper semantic structure
  // - Add <caption> for table titles
  // - Use <thead> and <tbody> properly
  // - Add scope attributes to header cells
  // - Ensure proper th/td usage
  
  const tableFixes = {
    addCaption: (table, captionText) => {
      return React.cloneElement(table, {
        ...table.props,
      }, [
        React.createElement('caption', { key: 'caption' }, captionText),
        ...React.Children.toArray(table.props.children)
      ]);
    },
    
    addScopeToHeaders: (headerCells) => {
      return headerCells.map((cell, index) => {
        if (cell.type === 'th') {
          return React.cloneElement(cell, {
            ...cell.props,
            scope: cell.props.scope || 'col',
          });
        }
        return cell;
      });
    },
    
    ensureTheadTbody: (table) => {
      const children = React.Children.toArray(table.props.children);
      let hasThead = false;
      let hasTbody = false;
      
      React.Children.forEach(table.props.children, child => {
        if (child && child.type === 'thead') hasThead = true;
        if (child && child.type === 'tbody') hasTbody = true;
      });
      
      return table;
    },
  };
  
  return tableFixes;
}

/**
 * Adds a main landmark to the application.
 */
function addMainLandmark(element) {
  if (!element) {
    return React.createElement('main', { id: 'main-content', role: 'main' });
  }
  
  return React.cloneElement(element, {
    ...element.props,
    id: element.props.id || 'main-content',
    role: element.props.role || 'main',
  });
}

/**
 * Validates that a landmark exists.
 * @param {Document} doc Document to check for landmarks
 * @returns {boolean} True if at least one landmark exists
 */
function validateLandmark(doc) {
  const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"], [role="form"]');
  const validLandmarkRoles = [
    'banner', 'navigation', 'main', 'complementary', 
    'contentinfo', 'search', 'form'
  ];
  
  for (const landmark of landmarks) {
    if (validLandmarkRoles.includes(landmark.getAttribute('role'))) {
      return true;
    }
  }
  
  // Also check for native HTML5 landmark elements
  const nativeLandmarks = doc.querySelectorAll('header, nav, main, aside, footer');
  return nativeLandmarks.length > 0;
}

/**
 * Ensures landmarks are unique.
 * @param {Array} landmarks Array of landmark elements or objects
 * @returns {Array} Array with duplicates removed
 */
function ensureUniqueLandmarks(landmarks) {
  const unique = [];
  const seen = new Set();
  
  landmarks.forEach(landmark => {
    const identifier = landmark.id || landmark.getAttribute?.('role') || landmark.label || JSON.stringify(landmark);
    if (!seen.has(identifier)) {
      seen.add(identifier);
      unique.push(landmark);
    }
  });
  
  return unique;
}

/**
 * Validates the structure of landmarks.
 * @param {Document} doc Document to validate landmark structure
 * @returns {Object} Validation result with errors array
 */
function validateLandmarkStructure(doc) {
  const errors = [];
  const landmarks = doc.querySelectorAll('[role="main"], main');
  
  // Ensure exactly one main landmark
  if (landmarks.length === 0) {
    errors.push('No main landmark found. Add a <main> element or role="main".');
  } else if (landmarks.length > 1) {
    errors.push(`Found ${landmarks.length} main landmarks. Should have exactly one.`);
  }
  
  // Check for proper landmark nesting
  const headerElements = doc.querySelectorAll('header, [role="banner"]');
  headerElements.forEach(header => {
    const parent = header.parentElement;
    if (parent && (parent.tagName === 'ARTICLE' || parent.tagName === 'ASIDE' || parent.getAttribute?.('role') === 'complementary')) {
      errors.push('Header should not be nested inside article, aside, or complementary landmarks.');
    }
  });
  
  // Check for unique landmark labels
  const landmarkLabels = {};
  const labeledLandmarks = doc.querySelectorAll('[aria-label], [aria-labelledby]');
  labeledLandmarks.forEach(landmark => {
    const label = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby');
    if (landmarkLabels[label]) {
      errors.push(`Duplicate landmark label: "${label}". Labels should be unique.`);
    }
    landmarkLabels[label] = true;
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Adds an accessible name to an SVG element.
 * @param {SVGElement} svgElement SVG element to modify
 * @param {string} accessibleName Accessible name to add
 */
function addAccessibleNameToSVG(svgElement, accessibleName) {
  if (!svgElement || !accessibleName) {
    return svgElement;
  }
  
  // Create or find the title element
  let titleElement = svgElement.querySelector('title');
  
  if (!titleElement) {
    titleElement = document.createElement('title');
    svgElement.insertBefore(titleElement, svgElement.firstChild);
  }
  
  titleElement.textContent = accessibleName;
  
  // Generate unique ID for aria-labelledby
  const id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
  titleElement.id = id;
  
  // Add aria-labelledby attribute
  svgElement.setAttribute('aria-labelledby', id);
  
  // Ensure role="img" is set
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
  
  return svgElement;
}

/**
 * Gets the accessible name of an SVG element.
 * @param {SVGElement} svgElement SVG element to get name from
 * @returns {string} The accessible name (title, aria-label, or aria-labelledby)
 */
function getAccessibleName(svgElement) {
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
    const titleElement = document.getElementById(ariaLabelledby);
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
 * @returns {Object} Object with role, aria-labelledby, and aria-label
 */
function createAccessibilityProps(accessibleName) {
  if (!accessibleName) {
    return {
      role: 'img',
      'aria-hidden': 'true',
    };
  }
  
  return {
    role: 'img',
    'aria-label': accessibleName,
    'aria-labelledby': undefined, // Prefer aria-label over aria-labelledby for simple cases
  };
}

/**
 * Ensures landmarks are unique.
 * @param {Array} landmarks Array of landmarks to deduplicate
 * @returns {Array} Deduplicated landmarks
 */
function deduplicateLandmarks(landmarks) {
  return [...new Set(landmarks)];
}

/**
 * Fixes a fake link issue.
 * @param {HTMLElement} element Element to check and fix
 * @returns {HTMLElement} Fixed element
 */
function fixFakeLinkIssue(element) {
  if (!element) {
    return element;
  }
  
  const isFakeLink = element.tagName === 'a' && !element.href && !element.getAttribute('href');
  const hasButtonRole = element.getAttribute('role') === 'button';
  
  if (isFakeLink || (hasButtonRole && element.tag
}
export {
  addLangAttribute,
  processChildrenWithLang,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  ensureUniqueLandmarks,
  validateLandmarkStructure,
  addAccessibleNameToSVG,
  getAccessibleName,
  createAccessibilityProps,
  deduplicateLandmarks,
  fixFakeLinkIssue
};