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

module.exports = {
    existingFunction,
    checkAccessibility: checkAccessibilityInternal,
    addressAccessibilityIssues,
    implementAccessibilityFixesFromReport,
    updateUI,
    newFunction,
    ScreepsBot,
};