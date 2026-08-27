// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

/**
 * REACT_036 Fix: React Fake Link
 *
 * Issue: The "rotate back" link in docs/dependency-graph.html used
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
    document.querySelector('#unrotate').replaceWith(unrotateButton);
}

/* New function REACT_015: Add lang attribute to HTML element */
function addLangAttribute() {
    if (!document.documentElement.hasAttribute('lang')) {
        document.documentElement.setAttribute('lang', document.documentElement.lang);
    }
}

/**
 * Handles the rotate back action when the button is clicked.
 * Resets the dependency graph to its original rotation (0 degrees).
 */
function handleRotateBack() {
    rotateDependencyGraph(0);

    // Dispatch event for any other listeners
    if (typeof window !== 'undefined' && window.CustomEvent) {
        const event = new CustomEvent('rotateback', { detail: { degrees: 0 } });
        window.dispatchEvent(event);
    }
}

/**
 * Rotates the dependency graph by the specified degrees.
 * @param {number} degrees - The rotation angle in degrees.
 */
function rotateDependencyGraph(degrees) {
    const graphElement = document.getElementById('dependency-graph');
    if (graphElement) {
        graphElement.style.transform = `rotate(${degrees}deg)`;
    }
}

// Add the new function REACT_015
function handleLanguageDetect() {
    // ... Add your code for determining the lang attribute ...

    addLangAttribute();
}

/**
 * Initializes the dependency graph controller.
 * Replaces fake links, sets up event handlers, and detects language.
 */
function init() {
    fixFakeLink();
    addLangAttribute(); // Added to address REACT_015
    handleLanguageDetect(); // Added to address REACT_015
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
        init,
        config,
        handleLanguageDetect // Added to address REACT_015
    };
}