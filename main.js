// TODO: Address accessibility issues from insight report
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
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
 * New function REACT_017: Add/fix landmark issues
 *
 * Issue: The page has missing or improperly structured landmark
 * elements (<header>, <main>, <nav>, <footer>), which makes navigation
 * difficult for screen reader users.
 *
 * Fix: This function ensures that the document has the required
 * landmark elements with appropriate roles.
 */
function fixLandmarks() {
    // Ensure a <main> landmark exists
    if (!document.querySelector('main')) {
        const main = document.createElement('main');
        main.setAttribute('role', 'main');
        // Move body children (except header/footer/nav) into main
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach((child) => {
            if (!['HEADER', 'FOOTER', 'NAV'].includes(child.tagName)) {
                main.appendChild(child);
            }
        });
        document.body.appendChild(main);
    }

    // Ensure a <header> landmark exists
    if (!document.querySelector('header')) {
        const header = document.createElement('header');
        header.setAttribute('role', 'banner');
        document.body.insertBefore(header, document.body.firstChild);
    }

    // Ensure a <nav> landmark exists
    if (!document.querySelector('nav')) {
        const nav = document.createElement('nav');
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Main navigation');
        document.body.insertBefore(nav, document.body.children[1] || null);
    }

    // Ensure a <footer> landmark exists
    if (!document.querySelector('footer')) {
        const footer = document.createElement('footer');
        footer.setAttribute('role', 'contentinfo');
        document.body.appendChild(footer);
    }
}

/**
 * New function REACT_041: Add accessible names to SVGs
 *
 * Issue: SVG elements without accessible names are not announced
 * properly by screen readers, making them inaccessible to users
 * who rely on assistive technology.
 *
 * Fix: This function adds aria-label and role attributes to SVG
 * elements that lack accessible names.
 */
function addAccessibleNamesToSVGs() {
    const svgs = document.querySelectorAll('svg');
    let count = 0;
    svgs.forEach((svg, index) => {
        if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
            svg.setAttribute('role', 'img');
            svg.setAttribute('aria-label', svg.getAttribute('aria-label') || `Decorative graphic ${index + 1}`);
            count++;
        }
    });
    return count;
}

/**
 * New function REACT_025: Ensure unique landmarks
 *
 * Issue: Multiple landmarks with the same role (e.g., two <nav>
 * elements without distinguishing labels) make it difficult for
 * screen reader users to navigate to a specific section.
 *
 * Fix: This function ensures that multiple landmarks of the same
 * type have unique aria-label attributes.
 */
function ensureUniqueLandmarks() {
    const landmarkSelectors = ['header', 'nav', 'main', 'footer', 'aside', 'section[role]'];
    landmarkSelectors.forEach((selector) => {
        const landmarks = document.querySelectorAll(selector);
        if (landmarks.length > 1) {
            landmarks.forEach((landmark, index) => {
                if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
                    const tagName = landmark.tagName.toLowerCase();
                    landmark.setAttribute('aria-label', `${tagName} ${index + 1}`);
                }
            });
        }
    });
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

// (Existing code for rotateDependencyGraph and init functions)

/**
 * Initializes the dependency graph controller.
 * Replaces fake links and sets up event handlers.
 */
function init() {
    fixFakeLink();
    addLangAttribute(); // Added to address REACT_015
    fixLandmarks(); // Added to address REACT_017
    addAccessibleNamesToSVGs(); // Added to address REACT_041
    ensureUniqueLandmarks(); // Added to address REACT_025
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
        addLangAttribute,
        fixLandmarks,
        addAccessibleNamesToSVGs,
        ensureUniqueLandmarks
    };
}