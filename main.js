var loop = function() {
    // Your logic here
};

module.exports = {
    loop: loop,
    fixSvgAccessibleName: function(svgString) {
        // Regular expression to find SVG elements with text elements without an accessible name
        const svgRegex = /<svg.*>(.*?)<\/svg>/gs;
        let match;
        let fixedSvgString = svgString;

        while ((match = svgRegex.exec(svgString)) !== null) {
            const svgElement = match[1];
            // Check if the SVG has a title or aria-label attribute
            const hasTitle = /<title\b[^>]*>(.*?)<\/title>/gs.test(svgElement);
            const hasAriaLabel = /aria-label="[^"]*"/gs.test(svgElement);
            const hasAriaHidden = /aria-hidden="[^"]*"/gs.test(svgElement);

            // If it doesn't have a title or aria-label, we need to add an aria-hidden attribute
            if (!hasTitle && !hasAriaLabel && !hasAriaHidden) {
                // Add aria-hidden="true" to the SVG element
                fixedSvgString = fixedSvgString.replace(match[0], `<svg${match[1]} aria-hidden="true"></svg>`);
            }
        }

        return fixedSvgString;
    }
};