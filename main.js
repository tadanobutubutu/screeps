/**
 * Checks a table element for accessibility issues
 * @param {HTMLTableElement} table - The table element to check
 * @returns {Object} An object containing accessibility issues found
 */
function checkTableAccessibility(table) {
    const issues = [];
    
    // Check if table has a caption
    const caption = table.querySelector('caption');
    if (!caption) {
        issues.push({
            type: 'missing-caption',
            message: 'Tables should have a caption element for accessibility'
        });
    }
    
    // Check if table headers (th) have scope or other proper attributes
    const headers = table.querySelectorAll('th');
    headers.forEach((th, index) => {
        if (!th.hasAttribute('scope') && !th.hasAttribute('id')) {
            issues.push({
                type: 'header-missing-scope',
                message: `Header at index ${index} should have a scope or id attribute`
            });
        }
    });
    
    // Check for proper table structure
    if (!table.querySelector('thead')) {
        issues.push({
            type: 'missing-thead',
            message: 'Tables should have a thead section'
        });
    }
    
    if (!table.querySelector('tbody')) {
        issues.push({
            type: 'missing-tbody',
            message: 'Tables should have a tbody section'
        });
    }
    
    return {
        hasIssues: issues.length > 0,
        issues: issues
    };
}

// Export the function
module.exports = {
    checkTableAccessibility
};