/**
 * main.js
 * This file contains the main module for the accessibility validation library.
 * It preserves the existing code and adds implementations for the new accessibility checks.
 *
 * Existing code is preserved as per the TODO comment, and new functions are added to address:
 * - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
 * - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
 * - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
 * - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
 * - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
 * - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
 */

export { default as getLangAttribute } from './getLangAttribute';
export { default as createInPageButton } from './createInPageButton';
export { default as validateTableAccessibility } from './validateTableAccessibility';
export { default as validateTableStructure } from './validateTableStructure';
export { default as validateLandmark } from './validateLandmark';
export { default as validateLandmarkStructure } from './validateLandmarkStructure';
export { default as getSvgAccessibleName } from './getSvgAccessibleName';
export { default as setSvgAttributes } from './setSvgAttributes';
export { default as ensureUniqueLandmarks } from './ensureUniqueLandmarks';
export { default as validateLinkAccessibility } from './validateLinkAccessibility';
export { default as handleFakeLinks } from './handleFakeLinks';

/**
 * Entry point for the accessibility checks.
 * This function orchestrates the various validation steps and returns an object
 * summarizing the results of each check.
 *
 * @returns {Object} - An object containing the results of each validation check.
 */
export function runAccessibilityChecks() {
  const checks = {
    langAttribute: getLangAttribute(),
    inPageButton: createInPageButton(),
    tableAccessibility: validateTableAccessibility(),
    tableStructure: validateTableStructure(),
    landmark: validateLandmark(),
    landmarkStructure: validateLandmarkStructure(),
    svgAccessibleName: getSvgAccessibleName(),
    svgAttributes: setSvgAttributes(),
    uniqueLandmarks: ensureUniqueLandmarks(),
    linkAccessibility: validateLinkAccessibility(),
    fakeLinks: handleFakeLinks(),
  };

  return checks;
}

// The following section preserves the original file header and comment
// as required by the TODO note.

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())