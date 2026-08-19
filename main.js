// Rotate back button implementation
function setupUnrotate() {
    const unrotate = document.getElementById('unrotate');
    if (unrotate) {
        unrotate.addEventListener('click', function() {
            // Reset rotation to original state
            document.body.style.transform = 'rotate(0deg)';
        });
    }
}

// Use <button> instead of <a href="#"> for in-page actions
// <button id="unrotate">rotate back</button>

document.addEventListener('DOMContentLoaded', setupUnrotate);