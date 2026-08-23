// Address accessibility issues from insight report: add ARIA attributes

// Sample function to initialize accessible modal
function initializeModal(modalId, triggerId) {
    const modal = document.getElementById(modalId);
    const trigger = document.getElementById(triggerId);
    
    if (!modal || !trigger) return;
    
    // Add ARIA attributes to trigger button
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', modalId);
    trigger.setAttribute('aria-haspopup', 'dialog');
    
    // Add ARIA attributes to modal
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    
    // Modal show/hide functions with ARIA updates
    modal.show = function() {
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        trigger.setAttribute('aria-expanded', 'true');
    };
    
    modal.hide = function() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
    };
    
    // Toggle functionality
    modal.toggle = function() {
        const isHidden = modal.getAttribute('aria-hidden') === 'true';
        if (isHidden) {
            modal.show();
        } else {
            modal.hide();
        }
    };
    
    // Add keyboard accessibility
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.hide();
        }
    });
    
    trigger.addEventListener('click', function() {
        modal.toggle();
    });
}

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeModal };
}