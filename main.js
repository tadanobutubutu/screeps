// Existing code and exports from main.js
function existingFunction() {
    // Existing code
}

// Some more existing code
// >>>>>>> origin/main-branch

// New function to wrap content with a <main> tag
function wrapContentWithMain(content) {
    return `<main>${content}</main>`;
}

// Existing exports with the new function added
module.exports = {
    existingFunction,
    wrapContentWithMain, // Added this new export
    // No existing exports should be removed or renamed
};

// End of main.js