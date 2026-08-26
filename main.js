// TODO: Address accessibility issues from insight report
// ----- NEW CODE START -----

/**
 * Configuration for the ARIA-enabled rotate button.
 */
const rotateButtonConfig = {
    role: 'button',
    ariaLabel: 'Rotate the dependency graph',
    ariaLivedRegion: 'polite'
};

/**
 * Replaces the fake anchor link with an ARIA-enabled button for improved screen reader accessibility.
 *
 * This function finds the <a id="unrotate" href="#"> and replaces it with a <button> with an ARIA role and label.
 * The button will be focusable and reacts to space/enter key interactions.
 */
function fixFakeLinkWithAria() {
    const unrotateButton = document.createElement('button');
    Object.assign(unrotateButton, rotateButtonConfig);
    unrotateButton.id = 'unrotate';
    unrotateButton.textContent = 'Rotate';
    unrotateButton.addEventListener('click', handleRotateBack);
    document.querySelector('#unrotate').replaceWith(unrotateButton);
}

/**
 * Handles the rotate action when the button is clicked.
 * Calls the rotateDependencyGraph function to reset the dependency graph to its original rotation (0 degrees).
 */
function handleRotate() {
    rotateDependencyGraph(0);

    // Dispatch event for any other listeners
    if (typeof window !== 'undefined' && window.CustomEvent) {
        const event = new CustomEvent('rotate', { detail: { degrees: 0 } });
        window.dispatchEvent(event);
    }
}

// (Existing code for rotateDependencyGraph, init, and addLangAttribute functions)

/**
 * Initializes the dependency graph controller.
 * Replaces fake links with ARIA-enabled buttons and sets up event handlers.
 */
function init() {
    fixFakeLinkWithAria();
    addLangAttribute(); // Added to address REACT_015
}

// (Existing auto-initialize when DOM is ready)

// Export functions for testing and module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fixFakeLinkWithAria,
        handleRotate,
        handleRotateBack,
        rotateDependencyGraph,
        init,
        config
    };
}
// ----- NEW CODE END -----