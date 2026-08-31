const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport } = require('./utilities');

const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, addressAccessibilityIssues } = main;

const http = require('http');

// New function to display module structure
function displayModuleStructure() {
    console.log('Module Structure:');
    console.log('----------------');
    for (const key in require.cache) {
        const module = require.cache[key];
        console.log(`Module: ${key}`);
        console.log('Exports:');
        for (const exportKey in module.exports) {
            console.log(`  ${exportKey}`);
        }
        console.log('');
    }
}

// New function to render dependency graphs
function renderDependencyGraph() {
    console.log('Dependency Graph:');
    console.log('------------------');
    // Assuming a simple function to render the graph
    // This would be replaced by actual rendering logic
    console.log('Rendering logic to be implemented...');
}

// Expose new functions to the module
exports.displayModuleStructure = displayModuleStructure;
exports.renderDependencyGraph = renderDependencyGraph;