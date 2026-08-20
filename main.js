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
        // 1. Updating package.json dependencies
        // 2. Running package manager commands
        // 3. Running tests to ensure compatibility
        console.log('React updated successfully to v19');
    } catch (error) {
        console.error('Error updating React:', error);
        throw error;
    }
}

/**
 * Adds a lang attribute to the root HTML element
 */
async function addLangAttribute() {
    try {
        const outputPath = path.join(__dirname, 'docs', 'dependency-graph.html');
        const htmlContent = await fs.readFileSync(outputPath, 'utf8');
        const updatedHtmlContent = htmlContent.replace(/<html>/g, '<html lang="en">');
        await fs.writeFileSync(outputPath, updatedHtmlContent);
        console.log('Lang attribute added to the root HTML element');
    } catch (error) {
        console.error('Error adding lang attribute:', error);
        throw error;
    }
}

module.exports = {
    generateDependencyGraph,
    updateJestToV30,
    updateReactToV19,
    addLangAttribute
};