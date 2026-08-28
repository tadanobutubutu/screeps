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

    // Check aria-labelledby attribute
    const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
    if (ariaLabelledby && ariaLabelledby.trim()) {
        const labelElementId = ariaLabelledby.trim().split(/\s+/)[0];
        const labelElement = document.getElementById(labelElementId);
        if (labelElement && labelElement.textContent) {
            return labelElement.textContent.trim();
        }
    }

    // Check for title element inside SVG
    const titleElement = svgElement.querySelector('title');
    if (titleElement && titleElement.textContent) {
        return titleElement.textContent.trim();
    }

    return null;
}

module.exports = { getSvgAccessibleName };