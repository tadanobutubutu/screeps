(function (exports, require, module, __filename, __dirname) {
    // Existing code and exports are preserved...

    function myFunction() {
        console.log("This is my new function!");
    }

    // Export the function
    module.exports.myFunction = myFunction;

    // Additional code to add accessible names to SVGs

    // Function to add accessible names to SVGs for accessibility
    function addAccessibleNameToSvg(svgData, label) {
        // Regex to find the SVG tag and the content within it
        const svgRegex = /<svg[\s\S]*?<\/svg>/i;
        const titleRegex = /<title[^>]*>(.*?)<\/title>/i;
        const textRegex = /<text[^>]*>(.*?)<\/text>/i;

        // Replace the SVG content with an updated version that includes a title element
        return svgData.replace(svgRegex, (match) => {
            // Check if the SVG already contains a title
            let hasTitle = titleRegex.test(match);
            let hasText = textRegex.test(match);

            // Add a title element if it doesn't already exist and if the SVG contains text
            if (!hasTitle && hasText) {
                // Replace the SVG content with a title element wrapping the existing text
                return match.replace(textRegex, (textMatch) => {
                    return `<title>${label}</title>${textMatch}`;
                });
            }

            // If the SVG doesn't contain text or already has a title, return the original match
            return match;
        });
    }

    // Export the accessibility function
    module.exports.addAccessibleNameToSvg = addAccessibleNameToSvg;

    // Function to update icons with accessible name
    function updateIcons(icons, label) {
        const updatedIcons = {};
        for (const key in icons) {
            const svgData = icons[key];
            const accessibleSvg = addAccessibleNameToSvg(svgData, label);
            updatedIcons[key] = accessibleSvg;
        }
        return updatedIcons;
    }

    // Export the new functions
    module.exports.updateIcons = updateIcons;

    // Other code...
})(module.exports, require, module, __filename, __dirname);