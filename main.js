// Insight Dashboard Main JavaScript

// DOM Ready handler
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

// Initialize dashboard functionality
function initDashboard() {
    // Initialize rotation toggle if element exists
    const unrotateBtn = document.getElementById('unrotate');
    if (unrotateBtn) {
        // Convert the fake link to button behavior
        unrotateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTableRotation();
        });
    }
}

// Toggle table rotation for accessibility
function toggleTableRotation() {
    const table = document.getElementById('table-rotated');
    if (table) {
        const isRotated = table.classList.contains('rotated');
        table.classList.toggle('rotated');
        
        // Update button text based on state
        const unrotateBtn = document.getElementById('unrotate');
        if (unrotateBtn) {
            unrotateBtn.textContent = isRotated ? 'rotate back' : 'rotate forward';
        }
    }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initDashboard,
        toggleTableRotation
    };
}