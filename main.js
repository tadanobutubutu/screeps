// main.js - Application logic

// Handle unrotate functionality
document.addEventListener('DOMContentLoaded', function() {
    const unrotateBtn = document.getElementById('unrotate');
    
    if (unrotateBtn) {
        unrotateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Reset rotation on all rotated elements
            const rotatedElements = document.querySelectorAll('.rotated');
            rotatedElements.forEach(function(el) {
                el.classList.remove('rotated');
            });
            
            // Scroll back to original position
            if (window.scrollY > 0) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Export any existing functionality
module.exports = {
    // Preserve existing exports
};