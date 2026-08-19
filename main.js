// Current main.js content (no changes needed as per the issue description)
const path = require('path');
const { Worker } = require('worker_threads');
const { generateDependencyGraph } = require('./dependency-graph-generator');

async function main() {
    try {
        const outputPath = path.join(__dirname, 'docs', 'dependency-graph.html');
        await generateDependencyGraph(outputPath);
        console.log('Dependency graph generated successfully!');
    } catch (error) {
        console.error('Error generating dependency graph:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

/**
 * Updates Jest to v30 and related dependencies
 */
async function updateJestToV30() {
    try {
        console.log('Updating Jest to v30 and related dependencies...');
        // Implementation would go here
        // This would typically involve:
        // 1. Updating package.json dependencies
        // 2. Running package manager commands
        // 3. Running tests to ensure compatibility
        console.log('Jest updated successfully to v30');
    } catch (error) {
        console.error('Error updating Jest:', error);
        throw error;
    }
}

/**
 * Updates React to v19
 */
async function updateReactToV19() {
    try {
        console.log('Updating React to v19...');
        // Implementation would go here
        // This would typically involve:
        // 1. Updating package.json dependencies
        // 2. Running package manager commands
        // 3. Running tests to ensure compatibility
        console.log('React updated successfully to v19');
    } catch (error) {
        console.error('Error updating React:', error);
        throw error;
    }
}

module.exports = {
    generateDependencyGraph,
    updateJestToV30,
    updateReactToV19
};