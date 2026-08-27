// main.js

// Existing code - PRESERVE all functions and exports

function rotateImage() {
    // rotate image logic
    console.log('Image rotated');
}

function someOtherFunction() {
    // existing functionality
    console.log('Other function called');
}

// Fixed: Changed <a href="#"> to <button> for in-page action
// This ensures proper keyboard and screen reader behavior
document.addEventListener('DOMContentLoaded', () => {
    const unrotateButton = document.getElementById('unrotate');
    if (unrotateButton) {
        unrotateButton.addEventListener('click', () => {
            // rotate back logic
            console.log('Rotating back');
        });
    }
});

// Template string containing the fixed HTML (if applicable in your codebase)
const componentTemplate = `
    <button id="unrotate">rotate back</button>
`;

// Export any existing exports
export { rotateImage, someOtherFunction };