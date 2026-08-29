import someFunction from './utils';
import fs from 'fs';
import path from 'path';

// Export the someFunction from './utils'
export { someFunction };

/**
 * Counts the total number of dependencies in package.json
 * @returns {Object} An object containing counts for dependencies, devDependencies, and total
 */
function countDependencies() {
  const packagePath = ... 'package.json');
  
  try {
    const packageContent = ... 'utf8');
    const packageJson = ...
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    const dependencyCount = ...
    const devDependencyCount = ...
    
    return {
      dependencies: dependencyCount,
      devDependencies: devDependencyCount,
      total: dependencyCount + devDependencyCount
    };
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return {
      dependencies: 0,
      devDependencies: 0,
      total: 0
    };
  }
}

export { countDependencies };

/**
 * Gets the accessible name for an SVG element
 * @param {Element} svgElement - The SVG element to get the accessible name from
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    return null;
  }
  
  // Check for aria-label attribute
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby attribute
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    if (referencedElement) {
      return referencedElement.textContent;
    }
  }
  
  // Check for title element inside SVG
  const titleElement = svgElement.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent;
  }
  
  // Check for desc element inside SVG
  const descElement = svgElement.querySelector('desc');
  if (descElement && descElement.textContent) {
    return descElement.textContent;
  }
  
  return null;
}

/**
 * Sets accessibility attributes on an SVG element
 * @param {Element} svgElement - The SVG element to set attributes on
 * @param {string} accessibleName - The accessible name to set for the SVG
 */
function setSvgAttributes(svgElement, accessibleName) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg' || !accessibleName) {
    return;
  }
  
  // Set role="img" for proper accessibility
  svgElement.setAttribute('role', 'img');
  
  // Set aria-label with the accessible name
  svgElement.setAttribute('aria-label', accessibleName);
  
  // Ensure the SVG has a focusable attribute for keyboard navigation
  svgElement.setAttribute('focusable', 'false');
}

export { getSvgAccessibleName, setSvgAttributes };