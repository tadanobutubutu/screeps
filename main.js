// Rotate back button implementation
function setupUnrotate() {
    const unrotate = document.getElementById('unrotate');
    if (unrotate) {
        // Add ARIA attributes for better screen reader support
        unrotate.setAttribute('role', 'button');
        unrotate.setAttribute('tabindex', '0');
        unrotate.setAttribute('aria-label', 'Reset rotation');

        unrotate.addEventListener('click', function() {
            // Reset rotation to original state
            document.body.style.transform = 'rotate(0deg)';
        });

        // Add keyboard support
        unrotate.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.body.style.transform = 'rotate(0deg)';
            }
        });
    }
}

// Use <button> instead of <a href="#"> for in-page actions
// <button id="unrotate">rotate back</button>

document.addEventListener('DOMContentLoaded', setupUnrotate);