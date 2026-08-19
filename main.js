// main.js

/**
 * Handles the rotate back action for the dependency graph
 * Replaces the fake link with a proper button element
 */
function handleRotateBack() {
    const rotateBackButton = document.createElement('button');
    rotateBackButton.id = 'unrotate';
    rotateBackButton.textContent = 'rotate back';
    rotateBackButton.addEventListener('click', () => {
        // Add your rotation logic here
        console.log('Rotating back');
    });

    // Replace the old <a> element with the new <button>
    const oldLink = document.getElementById('unrotate');
    if (oldLink) {
        oldLink.parentNode.replaceChild(rotateBackButton, oldLink);
    }
}

// Initialize the rotation button when the page loads
document.addEventListener('DOMContentLoaded', handleRotateBack);

export default {
    handleRotateBack
};