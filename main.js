const accessibilityUtilsExtra = {
    validateLandmark: validateLandmarkRequired,
};

const accessibilityUtils = {
    // ... existing utility functions
    ...accessibilityUtilsExtra
};

module.exports = {
    // ... existing exported functions
    accessibilityUtils
};

function validateLandmarkRequired() {
    const requiredLandmarks = ['main', 'nav', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
        const element = document.querySelector(`[role="${landmark}"]`) ||
                       document.querySelector(landmark);
        if (!element) {
            missingLandmarks.push(landmark);
        }
    });

    if (missingLandmarks.length > 0) {
        console.warn('Missing required landmarks:', missingLandmarks.join(', '));
        return false;
    }
    return true;
}

// Expose validateLandmark to global scope if needed
if (typeof window !== 'undefined') {
    window.validateLandmark = validateLandmarkRequired;
}

// Initialize on DOM ready (added a check to ensure that document is not undefined)
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
}