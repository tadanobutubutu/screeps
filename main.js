// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_025: Add other accessibility changes as per the insight report
// [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Accessibility improvements module
const AccessibilityFixes = (function() {
    'use strict';

    // REACT_015: Set lang attribute on HTML element
    function setLangAttribute() {
        const htmlElement = document.documentElement;
        if (!htmlElement.hasAttribute('lang')) {
            // Default to 'en' - update this based on your application's language
            const lang = htmlElement.getAttribute('lang') || 'en';
            htmlElement.setAttribute('lang', lang);
        }
    }

    // REACT_027: Add scope attributes to table headers
    function fixTableHeaders() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            const headers = table.querySelectorAll('th');
            
            headers.forEach((th, index) => {
                // Only add scope if it doesn't already have one
                if (!th.hasAttribute('scope')) {
                    // Check if this is a header for a column or row
                    const row = th.closest('tr');
                    const rowIndex = Array.from(row?.parentElement?.children || []).indexOf(row);
                    const cellIndex = Array.from(row?.querySelectorAll('th, td') || []).indexOf(th);
                    
                    // First row typically contains column headers
                    const isFirstRow = rowIndex === 0;
                    // First cell in a row is typically a row header
                    const isFirstCell = cellIndex === 0;
                    
                    if (isFirstRow && !isFirstCell) {
                        th.setAttribute('scope', 'col');
                    } else if (isFirstCell && !isFirstRow) {
                        th.setAttribute('scope', 'row');
                    } else if (isFirstRow && isFirstCell) {
                        // Corner cell - typically doesn't need scope or use 'col'
                        th.setAttribute('scope', 'col');
                    }
                }
            });
        });
    }

    // Initialize all accessibility fixes
    function init() {
        setLangAttribute();
        fixTableHeaders();
        
        // Observe DOM changes for dynamically added tables
        if ('MutationObserver' in window) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length) {
                        fixTableHeaders();
                    }
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    return {
        init,
        setLangAttribute,
        fixTableHeaders
    };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AccessibilityFixes.init());
} else {
    AccessibilityFixes.init();
}

// Preserve any existing exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityFixes;
}

if (typeof window !== 'undefined') {
    window.AccessibilityFixes = AccessibilityFixes;
}