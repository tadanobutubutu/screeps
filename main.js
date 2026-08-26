// main.js

document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    // Rotate functionality
    const unrotateBtn = document.getElementById('unrotate');
    if (unrotateBtn) {
        unrotateBtn.addEventListener('click', function() {
            // Reset rotation logic
            document.body.style.transform = 'rotate(0deg)';
        });
    }

    // ... existing code ...
});