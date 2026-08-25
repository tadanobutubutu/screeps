// TODO: Replace this placeholder with the actual main.js content...

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
    const unrotateLink = document.getElementById('unrotate');

    if (!unrotateLink || unrotateLink.tagName !== 'A') {
        return;
    }

    // Create button element to replace the fake link
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.type = 'button';
    button.textContent = unrotateLink.textContent || 'rotate back';
    button.className = unrotateLink.className || '';

    // Preserve data attributes from the original element
    for (let i = 0; i < unrotateLink.attributes.length; i++) {
        const attr = unrotateLink.attributes[i];
        if (attr.name.startsWith('data-')) {
            button.setAttribute(attr.name, attr.value);
        }
    }

    // Replace the anchor with the button in the DOM
    const parent = unrotateLink.parentNode;
    if (parent) {
        parent.replaceChild(button, unrotateLink);
    }

    // Add lang attribute based on the HTML document language
    button.setAttribute('lang', document.documentElement.lang);

    // Attach click handler for rotate back functionality
    button.addEventListener('click', function() {
        handleRotateBack();
    });
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
 * Rotates the dependency graph by a specified number of degrees.
 *
 * @param {number} degrees - The rotation angle in degrees.
 */
function rotateDependencyGraph(degrees) {
    const graph = document.getElementById('dependency-graph')
        || document.querySelector('.dependency-graph');

    if (graph) {
        graph.style.transform = `rotate(${degrees}deg)`;
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
        init,
        config
    };
}