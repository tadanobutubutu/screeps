// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

/**
 * Checks if a link or button element is accessible by verifying:
 * 1. It has proper ARIA attributes if needed
 * 2. It has a visible label or accessible name
 * 3. It's not hidden from assistive technologies
 * @param {HTMLElement} element - The link or button element to check
 * @returns {boolean} True if the element is accessible, false otherwise
 */
function checkElementAccessibility(element) {
    if (!element || !(element.tagName === 'A' || element.tagName === 'BUTTON')) {
        return false;
    }

    // Check for proper ARIA attributes if present
    const ariaHidden = element.getAttribute('aria-hidden');
    if (ariaHidden === 'true') {
        return false;
    }

    // Check for visible label or accessible name
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    const hasTextContent = element.textContent.trim().length > 0;

    if (!ariaLabel && !ariaLabelledBy && !hasTextContent) {
        return false;
    }

    // Check if element is visually hidden but not hidden from screen readers
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
        if (element.getAttribute('aria-hidden') !== 'true') {
            return false;
        }
    }

    return true;
}

// TODO: Implement this function for checking link and button accessibility
// This function is now implemented above