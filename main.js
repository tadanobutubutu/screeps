// main.js

/**
 * Validates table accessibility by checking for:
 * - Presence of caption elements
 * - Proper use of th elements with scope attributes
 * - Table headers identification
 * @param {string} htmlContent - The HTML content to validate
 * @returns {Object} Validation result with passed status and messages
 */
function validateTableAccessibility(htmlContent) {
    const result = {
        passed: true,
        messages: []
    };

    // Check for tables without caption
    const tablesWithoutCaption = htmlContent.match(/<table[^>]*>(?!.*<caption>)[\s\S]*?<\/table>/gi);
    if (tablesWithoutCaption && tablesWithoutCaption.length > 0) {
        result.passed = false;
        result.messages.push(`Found ${tablesWithoutCaption.length} table(s) without caption element`);
    }

    // Check for th elements without scope attribute
    const thWithoutScope = htmlContent.match(/<th(?![^>]*\bscope\s*=)[^>]*>/gi);
    if (thWithoutScope && thWithoutScope.length > 0) {
        result.passed = false;
        result.messages.push(`Found ${thWithoutScope.length} th element(s) without scope attribute`);
    }

    // Check for proper table structure (thead/tbody)
    const tables = htmlContent.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
    tables.forEach((table, index) => {
        const hasThead = /<thead/i.test(table);
        const hasTbody = /<tbody/i.test(table);
        if (hasThead && !hasTbody) {
            result.passed = false;
            result.messages.push(`Table ${index + 1} has thead but missing tbody`);
        }
    });

    return result;
}

// TODO: Implement validateTableAccessibility functionality

module.exports = {
    validateTableAccessibility
};