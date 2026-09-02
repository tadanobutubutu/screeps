const main = require('./utilities')

const {
    validateInput,
    processData,
    formatResponse,
    config: CONFIG,
    generateAccessibilityReport,
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    ensureUniqueLandmarks,
    isValidLandmark,
    writeReport,
    scanAccessibility,
    filterIssuesByRules,
    generateReportSummary,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    implementAccessibilityFixesFromReport,
    validatePersonName,
    addKeyboardNavigation,
    addAriaLabels,
    addScreenReaderAnnouncements,
    addFocusTrap,
    helper,
    formatDate,
    validateInput,
    processData,
    fetchUser,
    clearCache,
    someFunction,
    sortByTitle,
    sortByAuthor,
    checkLinkAccessibility,
    createInPageButton,
    primaryContent,
    wrapPrimaryContentInMain,
    ensureDependencyGraphAriaRole,
    ...otherExports
} = require('./')

function improveAccessibility() {
    fixTableStructureIssues();
    fixTableHeaderCellScope();
    addMainLandmark();
    addSvgAccessibleNames();
    fixFakeLinks();
    ensureUniqueLandmarks();
    addLandmarkRoles();
    renderDependencyGraphContent();
}

async function scanAndReportAccessibility() {
    const scanResults = await scanAccessibility(document, {
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa']
    });

    const report = generateAccessibilityReport({
        context: document,
        allowedRules: ['WCAG2A', 'WCAG2AA']
    });

    writeReport(report);
}

module.exports = {
    ...otherExports,
    improveAccessibility,
    scanAndReportAccessibility
}