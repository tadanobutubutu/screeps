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

// Track current rotation state
let currentRotation = 0;

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
    if (!unrotateLink) return;

    const unrotateButton = document.createElement('button');
    unrotateButton.id = 'unrotate';
    unrotateButton.textContent = 'Rotate back';
    unrotateButton.role = 'button';
    unrotateButton.ariaLabel = 'Rotate the dependency graph back to the original position.';
    unrotateButton.className = unrotateLink.className || '';
    
    // Copy any inline styles
    if (unrotateLink.style.cssText) {
        unrotateButton.style.cssText = unrotateLink.style.cssText;
    }

    // Replace the link with the button
    unrotateLink.parentNode.replaceChild(unrotateButton, unrotateLink);

    // Add click event listener
    unrotateButton.addEventListener('click', handleRotateBack);

    // Add keyboard support for space key
    unrotateButton.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            handleRotateBack();
        }
    });
}

/* New function REACT_015: Add lang attribute to HTML element */
function addLangAttribute() {
    const html = document.documentElement;
    if (html && !html.lang) {
        // Default to 'en' for English; could be enhanced to detect language
        html.lang = 'en';
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
    const body = document.body;
    if (!body) return;

    // Ensure a <main> landmark exists
    let main = document.querySelector('main');
    if (!main) {
        main = document.createElement('main');
        main.setAttribute('role', 'main');
        // Move body children (except header/footer/nav) into main
        const bodyChildren = Array.from(body.childNodes);
        bodyChildren.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                const tagName = child.tagName.toUpperCase();
                if (!['HEADER', 'FOOTER', 'NAV', 'MAIN'].includes(tagName)) {
                    main.appendChild(child);
                }
            } else if (child.nodeType === Node.TEXT_NODE) {
                main.appendChild(child);
            }
        });
        body.insertBefore(main, body.firstChild);
    }

    // Ensure a <header> landmark exists
    let header = document.querySelector('header');
    if (!header) {
        header = document.createElement('header');
        header.setAttribute('role', 'banner');
        if (body.firstChild) {
            body.insertBefore(header, body.firstChild);
        } else {
            body.appendChild(header);
        }
    }

    // Ensure a <nav> landmark exists
    let nav = document.querySelector('nav');
    if (!nav) {
        nav = document.createElement('nav');
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Main navigation');
        const existingNavs = document.querySelectorAll('nav');
        nav.setAttribute('aria-label', existingNavs.length > 0 ? 'Additional navigation' : 'Main navigation');
        body.insertBefore(nav, body.firstChild);
    }

    // Ensure a <footer> landmark exists
    let footer = document.querySelector('footer');
    if (!footer) {
        footer = document.createElement('footer');
        footer.setAttribute('role', 'contentinfo');
        body.appendChild(footer);
    }
}

/**
 * New function REACT_041: Add accessible names to SVGs
 *
 * Issue: SVG elements without accessible name are not announced
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
        const hasLabel = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.querySelector('title');
        if (!hasLabel) {
            svg.setAttribute('role', 'img');
            const title = document.createElement('title');
            title.textContent = `Decorative graphic ${index + 1}`;
            svg.insertBefore(title, svg.firstChild);
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
    landmarkSelectors.forEach(selector => {
        const landmarks = document.querySelectorAll(selector);
        if (landmarks.length > 1) {
            landmarks.forEach((landmark, index) => {
                const hasLabel = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby');
                if (!hasLabel) {
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
        const event = new CustomEvent('graphRotate', { detail: { degrees: 0 } });
        window.dispatchEvent(event);
    }
}

/**
 * Rotates the dependency graph by the specified degrees.
 * @param {number} degrees - The target rotation in degrees
 */
function rotateDependencyGraph(degrees) {
    const graphContainer = document.getElementById('dependency-graph');
    if (graphContainer) {
        currentRotation = degrees;
        graphContainer.style.transform = `rotate(${degrees}deg)`;
        graphContainer.style.transition = `transform ${config.animationDuration}ms ease-in-out`;
    }
}

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