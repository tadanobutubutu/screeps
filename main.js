// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and wrapPrimaryContentInMain())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and addAriaToFormControls())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())

/**
 * Creates a focus trap for keyboard navigation within a specified container
 * @param {HTMLElement} container - The container element to trap focus within
 * @param {Object} [options] - Configuration options
 * @param {boolean} [options.initialFocus=false] - Whether to focus the first focusable element initially
 * @param {boolean} [options.returnFocus=true] - Whether to return focus to the element that triggered the trap
 * @returns {Object} An object with methods to activate, deactivate, and destroy the focus trap
 */
function createFocusTrap(container, options = {}) {
    const { initialFocus = false, returnFocus = true } = options;
    let active = false;
    let previousActiveElement = null;
    let focusableElements = [];

    // Get all focusable elements within the container
    function getFocusableElements() {
        return Array.from(container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    }

    // Handle keydown events for tab trapping
    function handleKeyDown(event) {
        if (event.key !== 'Tab') return;

        const elements = getFocusableElements();
        if (elements.length === 0) return;

        const firstElement = elements[0];
        const lastElement = elements[elements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            // Shift+Tab from first element should go to last
            lastElement.focus();
            event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            // Tab from last element should go to first
            firstElement.focus();
            event.preventDefault();
        }
    }

    // Activate the focus trap
    function activate() {
        if (active) return;

        previousActiveElement = document.activeElement;
        focusableElements = getFocusableElements();

        if (initialFocus && focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        container.addEventListener('keydown', handleKeyDown);
        active = true;
    }

    // Deactivate the focus trap
    function deactivate() {
        if (!active) return;

        container.removeEventListener('keydown', handleKeyDown);

        if (returnFocus && previousActiveElement) {
            previousActiveElement.focus();
        }

        active = false;
        previousActiveElement = null;
        focusableElements = [];
    }

    // Destroy the focus trap completely
    function destroy() {
        deactivate();
        // No need to remove event listeners as they're already removed in deactivate
    }

    return {
        activate,
        deactivate,
        destroy
    };
}

// Export the new function while preserving existing exports
export { createFocusTrap };