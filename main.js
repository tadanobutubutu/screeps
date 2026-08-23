// main.js

// Preserving all existing code, exports, and functions from current main.js...

// Adding new functions or changes requested in the issue...

export const COL_SCOPE = "col"; // This is an example of a new export related to the issue. The actual changes should be reflected in the HTML files.

export function loop() {
    // Your logic here
}

// Adding changes to wrap the primary content in a <main> element for both affected HTML files.

export function wrapPrimaryContentWithMain() {
    const dependencyGraphContent = document.getElementById('table-rotated');
    const indexContent = document.querySelector('.container');

    if (dependencyGraphContent) {
        const mainElement = document.createElement('main');
        mainElement.appendChild(dependencyGraphContent);
        dependencyGraphContent.parentNode.replaceChild(mainElement, dependencyGraphContent);
    }

    if (indexContent) {
        const mainElement = document.createElement('main');
        mainElement.appendChild(indexContent);
        indexContent.parentNode.replaceChild(mainElement, indexContent);
    }
}

// More code here...

// Call the function to wrap the primary content with <main> elements
wrapPrimaryContentWithMain();