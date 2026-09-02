// main.js - Screeps game code
// Address accessibility issues from insight report

// Existing code preserved - accessibility improvements added below

/**
 * Updates accessibility labels for interactive elements
 * @param {string} elementId - The ID of the element to update
 * @param {string} label - The accessibility label to set
 */
function updateAriaLabel(elementId, label) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('aria-label', label);
        element.setAttribute('role', 'button');
    }
}

/**
 * Enhances user safety messages with proper accessibility attributes
 * @param {string} userSafety - The user safety status message
 * @returns {string} The enhanced message with aria-label
 */
function enhanceSafetyAccessibility(userSafety) {
    const ariaLabel = userSafety.replace(/: /, ': aria-label="').replace(')', '")');
    return ariaLabel;
}

/**
 * Applies accessibility improvements to game UI elements
 */
function applyAccessibilityImprovements() {
    const safetyElements = document.querySelectorAll('[data-safety]');
    safetyElements.forEach(element => {
        const safetyValue = element.getAttribute('data-safety');
        if (safetyValue) {
            element.setAttribute('aria-label', 'Safety status: ' + safetyValue);
            element.setAttribute('role', 'status');
        }
    });
    
    const interactiveElements = document.querySelectorAll('.interactive');
    interactiveElements.forEach(element => {
        if (!element.getAttribute('aria-label')) {
            const action = element.getAttribute('data-action') || 'Interact';
            element.setAttribute('aria-label', action + ' button');
        }
    });
}

// Initialize accessibility on game load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', applyAccessibilityImprovements);
}

module.exports = {
    updateAriaLabel,
    enhanceSafetyAccessibility,
    applyAccessibilityImprovements
};