/**
 * Gets the accessible name of an SVG element.
 * @param {SVGElement} svgElement - The SVG element to get the accessible name from.
 * @returns {string|null} The accessible name or null if not found.
 */
function getSvgAccessibleName(svgElement) {
    if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
        return null;
    }

    // Check aria-label attribute first
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim()) {
        return ariaLabel.trim();
    }

    // Check aria-labelledby attribute (new change)
    const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
    if (ariaLabelledby && ariaLabelledby.trim()) {
        const labelElementId = ariaLabelledby.trim().split(/\s+/)[0];
        const labelElement = document.getElementById(labelElementId);
        if (labelElement && labelElement.textContent) {
            return labelElement.textContent.trim();
        }
    }

    // Check for title element inside SVG (new change)
    const titleElement = svgElement.querySelector('title');
    if (titleElement && titleElement.textContent) {
        return titleElement.textContent.trim();
    }

    const landmarks = [];

    /**
     * Checks if a given link/URL is accessible by making an HTTP HEAD request.
     * @param {string} url - The URL to check for accessibility
     * @returns {Promise<boolean>} - Returns true if the link is accessible (status 200-399), false otherwise
     */
    async function isLinkAccessible(url) {
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                mode: 'no-cors'
            });

            if (response.ok) {
                return true;
            }

            try {
                const response = await fetch(url, { method: 'GET' });
                return response.ok;
            } catch (getError) {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    function isLinkAccessibleSync(url) {
        try {
            const response = isLinkAccessible(url);
            return response;
        } catch (error) {
            return false;
        }
    }

    function createInPageButton(options = {}) {
        // ... existing code ...
    }

    function validateTableAccessibility(table) {
        // ... existing code ...
    }

    function validateTableStructure(table) {
        // ... existing code ...
    }

    function validateLandmark() {
        // ... existing code ...
    }

    function validateLandmarkStructure() {
        // ... existing code ...
    }

    function validateLandmarkAttributes() {
        // ... existing code ...
    }

    function setSvgAttributes(svg, options = {}) {
        if (!svg || svg.tagName !== 'SVG') return false;
        // Implementation here
        return true;
    }

    function ensureUniqueLandmarks() {
        // ... existing code ...
    }

    function validateLinkAccessibility() {
        // ... existing code ...
    }

    function handleFakeLinks() {
        // ... existing code ...
    }

    // Functions to ensure unique landmarks
    function addLandmark(landmark) {
        // Add a landmark only if it doesn't already exist
        if (!landmarks.includes(landmark)) {
            landmarks.push(landmark);
            return true;
        }
        return false;
    }

    function getLandmarks() {
        // Return a copy to prevent external modification of internal state
        return [...landmarks];
    }

    function hasLandmark(landmark) {
        // Check if a landmark already exists
        return landmarks.includes(landmark);
    }

    function removeLandmark(landmark) {
        // Remove a landmark if it exists
        const index = landmarks.indexOf(landmark);
        if (index !== -1) {
            landmarks.splice(index, 1);
            return true;
        }
        return false;
    }

    module.exports = {
        getSvgAccessibleName,
        addLandmark,
        getLandmarks,
        hasLandmark,
        removeLandmark
    };