// TODO: Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

/**
 * REACT_036 Fix: React Fake Link
 *
 * Issue: The "rotate back" link in ... used
 * <a href="#"> which doesn't navigate anywhere, causing screen readers
 * to announce it as a dead link and preventing proper keyboard activation.
 *
 * Fix: This script replaces the anchor element with a proper <button>
 * element that has correct keyboard focus,
 * space/enter activation, and screen reader semantics.
 */

/**
 * Configuration for the dependency graph controller.
 */
const config = {
    rotationStep: 90,
    animationDuration: 300
};

/**
 * Replaces the fake anchor link with a proper button element
 * for accessibility compliance (REACT_036).
 *
 * This function finds the <a id="unrotate" href="#"> element and
 * replaces it with a <button> that provides proper keyboard focus,
 * space/enter activation, and screen reader semantics.
 */
function fixFakeLink() {
    const unrotateButton = document.createElement('button');
    unrotateButton.id = 'unrotate';
    unrotateButton.textContent = 'Rotate back';
    unrotateButton.role = 'button';
    unrotateButton.ariaLabel = 'Rotate the dependency graph back to the original position.';
    unrotateButton.addEventListener('click', handleRotateBack);
    const oldLink = document.getElementById('unrotate');
    if (oldLink && oldLink.parentNode) {
        oldLink.parentNode.replaceChild(unrotateButton, oldLink);
    }
}

/* New function REACT_015: Add lang attribute to HTML element */
function addLangAttribute() {
    // Add lang attribute to HTML element for accessibility compliance (REACT_015)
    // This helps screen readers announce content in the correct language
    if (document.documentElement) {
        document.documentElement.lang = 'en';
    }
}

/**
 * Handles the rotate back action when the button is clicked.
 * Resets the dependency graph to its original rotation (0 degrees).
 */
function handleRotateBack() {
    const svg = document.querySelector('.dependency-graph svg');
    if (svg) {
        svg.style.transform = 'rotate(0deg)';
    }
    // Dispatch event for any other listeners
    if (typeof window !== 'undefined' && window.CustomEvent) {
        const event = new CustomEvent('graphRotated', { detail: { degrees: 0 } });
        window.dispatchEvent(event);
    }
}

// (Existing code for rotateDependencyGraph and init functions)

/**
 * Rotates the dependency graph by the specified number of degrees.
 * @param {number} degrees - The number of degrees to rotate the graph.
 */
function rotateDependencyGraph(degrees) {
    const svg = document.querySelector('.dependency-graph svg');
    if (svg) {
        const currentRotation = parseInt(svg.getAttribute('data-rotation') || '0', 10);
        const newRotation = currentRotation + degrees;
        svg.style.transform = `rotate(${newRotation}deg)`;
        svg.setAttribute('data-rotation', newRotation.toString());
    }
}

/**
 * Initializes the dependency graph controller.
 * Replaces fake links and sets up event handlers.
 */
function init() {
    fixFakeLink();
    addLangAttribute(); // Added to address REACT_015
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

// Export functions for testing and module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fixFakeLink,
        handleRotateBack,
        rotateDependencyGraph,
        addLangAttribute,
        init,
        config
    };
}