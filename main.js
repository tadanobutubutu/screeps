const main = require('./utilities');
const { requireDir } = require('require-dir');
requireDir(require.resolve('./utilities'));

// CommonJS requires

// Import all utilities functions for convenience
const {
    createInPageButton,
    createWebResourceButton,
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

// New function to add an aria-label to an element
function addAriaLabel(element, label) {
    if (!element || !label) return element;
    if (typeof element.setAttribute === 'function') {
        element.setAttribute('aria-label', label);
    }
    return element;
}

// New function to render a dependency graph for the given nodes
function renderDependencyGraph(nodes, edges) {
    if (!nodes) return { nodes: [], edges: [] };
    const nodeArray = Array.isArray(nodes) ? nodes : [nodes];
    const edgeArray = Array.isArray(edges) ? edges : [];
    return {
        nodes: nodeArray.map((node, index) => ({
            id: node.id || `node-${index}`,
            label: node.label || node.name || `Node ${index}`,
        })),
        edges: edgeArray.map((edge, index) => ({
            from: edge.from || edge.source,
            to: edge.to || edge.target,
            id: edge.id || `edge-${index}`,
        })),
    };
}

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
    addAriaLabel,
    renderDependencyGraph,
};