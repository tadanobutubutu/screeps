// TODO: Address accessibility issues from insight report
// Added accessibility-related functionality

/**
 * Adds accessibility attributes to a button element
 * @param {HTMLElement} button - The button element to enhance
 */
function addAccessibilityToButton(button) {
    if (!button) return;
    
    // Add ARIA attributes for better screen reader support
    if (!button.hasAttribute('aria-label')) {
        const textContent = button.textContent.trim();
        if (textContent) {
            button.setAttribute('aria-label', textContent);
        }
    }
    
    // Ensure button has proper focus management
    button.setAttribute('tabindex', '0');
    
    // Add keyboard event support if not present
    if (!button.hasAttribute('data-accessible-added')) {
        button.addEventListener('keydown', function(e) {
            // Space and Enter keys should activate the button
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                button.click();
            }
        });
        button.setAttribute('data-accessible-added', 'true');
    }
}

/**
 * Adds accessibility features to image elements
 * @param {HTMLImageElement} image - The image element to enhance
 */
function addAccessibilityToImage(image) {
    if (!image) return;
    
    // Ensure alt text exists
    if (!image.hasAttribute('alt') || !image.getAttribute('alt').trim()) {
        image.setAttribute('alt', '');
    }
}

/**
 * Adds accessibility features to form inputs
 * @param {HTMLInputElement} input - The input element to enhance
 */
function addAccessibilityToInput(input) {
    if (!input) return;
    
    // Ensure label association
    const id = input.getAttribute('id');
    if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (!label) {
            // Create a label if none exists
            const newLabel = document.createElement('label');
            newLabel.setAttribute('for', id);
            newLabel.textContent = input.getAttribute('aria-label') || 'Input field';
            input.parentNode.insertBefore(newLabel, input);
        }
    }
    
    // Add ARIA describedby for error messages if they exist
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        const errorId = 'error-' + Math.random().toString(36).substr(2, 9);
        errorMessage.setAttribute('id', errorId);
        input.setAttribute('aria-describedby', errorId);
        input.setAttribute('aria-invalid', 'true');
    }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addAccessibilityToButton,
        addAccessibilityToImage,
        addAccessibilityToInput
    };
}

// Initialize accessibility enhancements when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Apply accessibility enhancements to all buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(addAccessibilityToButton);
        
        // Apply accessibility enhancements to all images
        const images = document.querySelectorAll('img');
        images.forEach(addAccessibilityToImage);
        
        // Apply accessibility enhancements to all inputs
        const inputs = document.querySelectorAll('input');
        inputs.forEach(addAccessibilityToInput);
    });
}

// Placeholder for additional accessibility-related code changes
// Future accessibility enhancements can be added here