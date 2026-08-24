/**
 * Main entry point for handling React landmark accessibility
 * Ensures pages have proper <main> landmark for keyboard and screen reader users
 */

// Preserve existing exports and functionality

/**
 * Checks if an element is a valid landmark element
 * @param {string} tagName - The tag name to check
 * @returns {boolean} - Whether the tag is a landmark element
 */
function isLandmarkElement(tagName) {
    const landmarkTags = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form'];
    return landmarkTags.includes(tagName.toLowerCase());
}

/**
 * Adds a <main> landmark wrapper around the primary content if one doesn't exist
 * @param {HTMLElement} container - The container to search within
 * @returns {boolean} - Whether a <main> landmark was added or already exists
 */
function ensureMainLandmark(container) {
    if (!container || !(container instanceof HTMLElement)) {
        return false;
    }

    // Check if a <main> element already exists
    const existingMain = container.querySelector('main');
    if (existingMain) {
        return true;
    }

    // Find the first child that should be wrapped in <main>
    const primaryContent = container.querySelector('table, .container, [role="main"], article, section');
    
    if (primaryContent && primaryContent.parentNode === container) {
        const mainElement = document.createElement('main');
        container.insertBefore(mainElement, primaryContent);
        mainElement.appendChild(primaryContent);
        return true;
    }

    return false;
}

/**
 * Applies main landmark fixes to all relevant containers in the document
 * @returns {number} - Number of main landmarks added or verified
 */
function applyMainLandmarks() {
    const containers = document.querySelectorAll('body, [role="application"], [role="document"]');
    let count = 0;

    containers.forEach(container => {
        if (ensureMainLandmark(container)) {
            count++;
        }
    });

    return count;
}

// Auto-apply on DOM ready if running in browser context
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyMainLandmarks);
    } else {
        applyMainLandmarks();
    }
}

// Export for testing and external use
module.exports = {
    isLandmarkElement,
    ensureMainLandmark,
    applyMainLandmarks
};