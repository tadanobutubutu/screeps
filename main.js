// REACT_017: React Landmarks validation
// Validates that pages have proper <main> landmark for accessibility

/**
 * Check if HTML content has a <main> landmark
 * @param {string} htmlContent - The HTML content to validate
 * @returns {boolean} - True if <main> landmark exists
 */
function hasMainLandmark(htmlContent) {
    if (!htmlContent || typeof htmlContent !== 'string') {
        return false;
    }
    
    // Match <main> tag (with possible attributes) and its closing tag
    const mainTagRegex = /<main[\s\S]*?>[\s\S]*?<\/main>/i;
    const selfClosingRegex = /<main[\s\S]*?\/>/i;
    
    return mainTagRegex.test(htmlContent) || selfClosingRegex.test(htmlContent);
}

/**
 * Validate React landmark accessibility
 * @param {string} htmlContent - The HTML content to validate
 * @returns {object} - Validation result with details
 */
function validateReactLandmarks(htmlContent) {
    const hasMain = hasMainLandmark(htmlContent);
    
    return {
        valid: hasMain,
        rule: 'REACT_017',
        message: hasMain 
            ? 'Page has proper <main> landmark' 
            : 'Page has no <main> landmark',
        severity: 'warning',
        suggestion: hasMain 
            ? null 
            : 'Wrap the primary content in <main> so it can be skipped to'
    };
}

/**
 * Check multiple files for landmark issues
 * @param {array} files - Array of objects with 'path' and 'content' properties
 * @returns {array} - Array of validation results
 */
function checkAllFilesForLandmarks(files) {
    if (!Array.isArray(files)) {
        return [];
    }
    
    return files.map(file => ({
        file: file.path,
        ...validateReactLandmarks(file.content || file.html || '')
    }));
}

// Preserve existing exports if any
module.exports = {
    hasMainLandmark,
    validateReactLandmarks,
    checkAllFilesForLandmarks
};