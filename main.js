// main.js - Main entry point for the application

/**
 * Ensures a page has the required accessibility landmarks
 * @param {Document} doc - The document to check/fix
 * @returns {Object} - Report of accessibility status
 */
function ensureAccessibilityLandmarks(doc) {
    const report = {
        hasMainLandmark: false,
        warnings: []
    };

    // Check if main landmark exists
    const mainElement = doc.querySelector('main, [role="main"]');
    report.hasMainLandmark = !!mainElement;

    // Add warning if main landmark is missing (REACT_017)
    if (!report.hasMainLandmark) {
        report.warnings.push({
            rule: 'REACT_017',
            message: 'Page has no <main> landmark',
            suggestion: 'Wrap the primary content in <main> so it can be skipped to'
        });
    }

    return report;
}

/**
 * Wraps content in a main landmark if it doesn't exist
 * @param {Document} doc - The document to modify
 * @param {HTMLElement} contentElement - The element to wrap
 * @returns {HTMLElement} - The main element (new or existing)
 */
function wrapInMainLandmark(doc, contentElement) {
    let mainElement = doc.querySelector('main, [role="main"]');
    
    if (!mainElement) {
        mainElement = doc.createElement('main');
        mainElement.setAttribute('id', 'main-content');
        mainElement.setAttribute('tabindex', '-1');
        
        // Insert at the appropriate location in the document
        const header = doc.querySelector('header');
        if (header && header.nextSibling) {
            header.parentNode.insertBefore(mainElement, header.nextSibling);
        } else {
            doc.body.insertBefore(mainElement, doc.body.firstChild);
        }
    }
    
    if (contentElement && !mainElement.contains(contentElement)) {
        mainElement.appendChild(contentElement);
    }
    
    return mainElement;
}

module.exports = {
    ensureAccessibilityLandmarks,
    wrapInMainLandmark
};