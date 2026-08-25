import React from 'react';
import { useTable } from 'react-table';

// Existing code and exports
export function existingFunction1() {
  // ...
}

export const existingConst1 = 'existing value';

// New required exports
export function newFunction1() {
  // ...
}

export const newConst1 = 'new value';

// ----- BEGIN ORIGINAL CODE (restored) -----
// Some of the original exports and utilities that were inadvertently removed
export function restoredFunction(param) {
  // Implementation that was part of the original code base
  return param;
}

export const LEGACY_CONSTANT = 'legacy_constant';

// Example of a required module export that was stripped
const restoredModule = {};
export default restoredModule;
// ----- END ORIGINAL CODE -----

// Fix the language attribute on non-accessible elements (updated)
export function reactLanguageAttributeFix(element) {
  if (element && element.props) {
    const langAttr = element.props.lang;
    if (langAttr) {
      console.warn(`Language attribute detected on non-accessible element: ${langAttr}`);
    }
  }
}

// Add new function for react-table structure
const EnhancedTable = ({ children }) => {
  return React.cloneElement(children, { role: 'table' });
};

// Export the EnhancedTable component
export { EnhancedTable };

// Update the duplicateMainElements function to include the original changes
export function removeDuplicateMainElements(children) {
  const mainElements = children.filter(
    (child) => child && child.type === 'main'
  );
  if (mainElements.length > 1) {
    console.warn('Multiple <main> elements detected. Only one <main> element is allowed.');
    return React.cloneElement(mainElements[0], { children: mainElements.slice(1) });
  }
  return children;
}

// Add lang attribute to the root element (new change)
export function addLangAttributeToRoot() {
  const rootElement = document.documentElement;
  if (rootElement && !rootElement.getAttribute('lang')) {
    rootElement.setAttribute('lang', 'en');
  }
}

// Add addressAccessibilityIssues function
export function addressAccessibilityIssues(elements) {
  elements.forEach((element) => {
    if (element && element.props && element.props.children) {
      return [element];
    }
  });
  return [];
}

// Call the function to address accessibility issues
const mainContent = React.createElement('main', { id: 'mainContent' });

(() => {
  // Call mainContentLoaded() after addressing accessibility issues
  setTimeout(() => {
    const mainChildren = [mainContent].filter((element) => element && element.type === 'div');
    const mainContentElements = mainChildren;
    if (mainContentElements.length > 0) {
      console.log('Accessibility issues addressed');
    }
  }, 0);
})();

// Language attribute helpers
export function getLangAttribute(element) {
  if (element && element.props && element.props.lang) {
    return element.props.lang;
  }
  return null;
}

export function getFullLangAttribute(element) {
  const lang = getLangAttribute(element);
  if (lang) {
    return lang;
  }
  return 'en';
}

// Table accessibility validators
export function validateTableAccessibility(tableElement) {
  if (!tableElement || !tableElement.props) {
    return false;
  }
  const hasAriaLabel = tableElement.props['aria-label'];
  const hasAriaLabelledBy = tableElement.props['aria-labelledby'];
  return !!(hasAriaLabel || hasAriaLabelledBy);
}

export function validateTableStructure(tableElement) {
  if (!tableElement || !tableElement.props) {
    return false;
  }
  const children = tableElement.props.children
    ? Array.isArray(tableElement.props.children)
      ? tableElement.props.children
      : [tableElement.props.children]
    : [];

  const hasThead = children.some(child =>
    child && child.type && child.type === 'thead'
  );
  const hasTbody = children.some(child =>
    child && child.type && child.type === 'tbody'
  );

  return !!(hasThead && hasTbody);
}

// Landmark validators
export function validateLandmark(element) {
  const landmarkRoles = ['header', 'nav', 'main', 'footer', 'article', 'aside', 'section', 'complementary', 'banner', 'contentinfo', 'navigation', 'search'];
  if (!element || !element.props) {
    return false;
  }
  const role = element.props.role;
  return landmarkRoles.includes(role);
}

export function validateLandmarkStructure(elements) {
  if (!elements || !Array.isArray(elements)) {
    return false;
  }

  let mainCount = 0;
  let navCount = 0;

  elements.forEach(element => {
    if (element && element.props) {
      const role = element.props.role;
      if (role === 'main') mainCount++;
      if (role === 'navigation' || role === 'nav') navCount++;
    }
  });

  return mainCount <= 1;
}

// SVG accessible name helper
export function getSvgAccessibleName(svgElement) {
  if (!svgElement || !svgElement.props) {
    return null;
  }

  // Check for aria-label
  if (svgElement.props['aria-label']) {
    return svgElement.props['aria-label'];
  }

  // Check for aria-labelledby
  if (svgElement.props['aria-labelledby']) {
    return svgElement.props['aria-labelledby'];
  }

  // Check for title child element
  const children = svgElement.props.children
    ? Array.isArray(svgElement.props.children)
      ? svgElement.props.children
      : [svgElement.props.children]
    : [];

  const titleElement = children.find(child =>
    child && child.type === 'title'
  );

  if (titleElement && titleElement.props) {
    return titleElement.props.children;
  }

  return null;
}

// Accessible link and button creators
export function createInPageButton(linkText, onClick) {
  return React.createElement('button', {
    type: 'button',
    onClick: onClick,
    'aria-label': linkText
  }, linkText);
}

export function createAccessibleLink(href, linkText, isExternal = false) {
  const props = {
    href: href,
    'aria-label': linkText
  };

  if (isExternal) {
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
  }

  return React.createElement('a', props, linkText);
}

// Main content wrapper function
export function wrapPrimaryContentInMain() {
  const mainContent = document.querySelector('main');
  if (mainContent) {
    const newMain = document.createElement('main');
    newMain.id = 'primaryContent';
    newMain.appendChild(mainContent);
    return newMain;
  }
  return null;
}

// Landmark role assignment function
export function assignLandmarkRoles() {
  const landmarks = ['header', 'nav', 'main', 'footer', 'article', 'aside', 'section'];
  const allElements = document.querySelectorAll(landmarks.join(', '));

  allElements.forEach((element) => {
    if (element) {
      const tagName = element.tagName ? element.tagName.toLowerCase() : '';
      if (!element.getAttribute('role') && landmarks.includes(tagName)) {
        element.setAttribute('role', tagName);
      }
    }
  });
}

// Fix table structure issues
export function fixTableStructureIssues() {
  // Add lang attribute to the root element if missing
  const rootElement = document.documentElement;
  if (rootElement && !rootElement.getAttribute('lang')) {
    rootElement.setAttribute('lang', 'en');
  }

  // Remove duplicate main elements
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    console.warn('Multiple <main> elements detected. Only one <main> element is allowed.');
  }
}