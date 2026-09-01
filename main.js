const main = require('./utilities');
const { requireDir } = require('require-dir');
requireDir(require.resolve('./utilities'));

// CommonJS requires

// Import all utilities functions for convenience
const {
    createInPageButton,
    createWebResourceButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    validateAccessibilityReport,
    getSvgAccessibleName,
    getLangAttribute,
    ensureElementId,
    ensureElementHasId,
    ensureElementHasIdOrigin,
    addMainLandmark,
    addLangAttribute,
    fixTableStructureIssues,
    fixFakeLinkIssue,
    fixFakeLinkIssues,
    fixLandmarkIssues,
    addLandmarkRegions,
    uniqueLandmarks,
    fixImageAltTexts,
    googleSignIn,
    ensureUniqueLandmarks,
    addSvgAccessibleNames,
    addAccessibleNamesToSVGs,
    renderDependencyGraphAria,
    addMainLandmarkToIndex,
    newFocusTrap,
    addressAccessibilityIssues,
    implementAccessibilityFixesFromReport,
} = main;

// Combining and preserving both feature sets from existing and new implementations
function validateTableAccessibility(table) {
    if (!table) return false;

    const hasCaption = table.querySelector('caption') !== null;
    const hasHeaders = table.querySelector('thead') !== null;
    const rows = table.querySelectorAll('tr');

    let isValid = hasCaption && hasHeaders;

    if (rows.length > 0) {
        const firstRowCells = rows[0].querySelectorAll('th, td');
        const hasScope = Array.from(firstRowCells).some((cell) => cell.hasAttribute('scope'));
        isValid = isValid && hasScope;
    }

    // New implementation for checking table accessibility
    // Replace below check with implementAccessibilityFixesFromReport
    // if (table && table.querySelectorAll) {
    //   const landmarkFixes = implementAccessibilityFixesFromReport(table);
    //   isValid = isValid && landmarkFixes.tableAccessible;
    // }

    return isValid;
}

module.exports = {
    existingFunction,
    checkAccessibility: checkAccessibilityInternal,
    addressAccessibilityIssues,
    implementAccessibilityFixesFromReport,
    updateUI,
    newFunction,
    ScreepsBot,
};
