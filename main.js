// Main JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    const unrotateButton = document.getElementById('unrotate');
    
    if (unrotateButton) {
        unrotateButton.addEventListener('click', function() {
            // Reset rotation
            const content = document.querySelector('.rotated-content');
            if (content) {
                content.style.transform = 'rotate(0deg)';
            }
        });
    }
    
    // Other existing functionality
});