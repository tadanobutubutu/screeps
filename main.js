// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// Your existing code, exports, and functions...

// Let's add the missing lang attribute and unique landmarks in the HTML:

function addAccessibleSvg(svgData, label) {
    // Regex to find the SVG tag and the content within it
    const svgRegex = /<svg[\s\S]*?<\/svg>/i;
    const titleRegex = /<title[^>]*>(.*?)<\/title>/i;

    // Replace the SVG content with an updated version that includes a title element
    return svgData.replace(svgRegex, (match) => {
        // Check if the SVG already contains a title
        let hasTitle = titleRegex.test(match);

        // Add a title element if it doesn't already exist
        if (!hasTitle && label) {
            // Insert a title element at the beginning of the SVG content
            return match.replace(/(<svg[^>]*>)/i, (openTagMatch) => {
                return openTagMatch + '<title>' + label + '</title>';
            });
        }

        // If the SVG already has a title or no label provided, return the original match
        return match;
    });
}

function updateIcons(icons, label) {
    const updatedIcons = {};
    for (const key in icons) {
        const svgData = icons[key];
        const accessibleSvg = addAccessibleSvg(svgData, label);
        updatedIcons[key] = accessibleSvg;
    }
    return updatedIcons;
}

function updateRotateBackLink() {
    const rotateBackLink = document.querySelector('.rotate-back-link');
    if (rotateBackLink) {
        // Create a button to replace the anchor for accessibility
        const button = document.createElement('button');
        button.textContent = rotateBackLink.textContent || 'rotate back';
        button.type = 'button'; // Specify the button type to avoid form submission
        button.className = rotateBackLink.className;
        button.onclick = function() {
            // Preserve the original onclick behavior if any
            if (rotateBackLink.onclick) {
                rotateBackLink.onclick();
            }
        };
        // Replace the anchor with the button
        rotateBackLink.parentNode.replaceChild(button, rotateBackLink);
    }
}

// Export the new functions
exports.addAccessibleSvg = addAccessibleSvg;
exports.updateIcons = updateIcons;
exports.updateRotateBackLink = updateRotateBackLink;

// Call the function to update the 'rotate back' link on page load
if (typeof window !== 'undefined') {
    window.onload = updateRotateBackLink;
}

// Additional code to add accessible names to SVGs
// Example usage:
// const icons = {
//     icon: '<svg>...</svg>',
//     apple: '<svg>...</svg>'
// };
// const updatedIcons = updateIcons(icons, 'Accessible description');
// ...

// Landmark ID generation for unique landmarks
const uniqueLandmarkId = (1, 2, 3, 4).map((index) => `landmark-${index}`);
const updatedLandmarkRegex = updatedHTML.replace(
  /(<landmark>)(.*)(<\/landmark>)/g,
  (match, startTag, internals, endTag) => {
    return `${startTag} id=${uniqueLandmarkId[index]} ${endTag}`;
  }
);

// Apply landmark updates if HTML exists
if (updatedHTML) {
    rootElement.innerHTML = updatedLandmarkRegex;
}

const rootElement = document.getElementById('root');