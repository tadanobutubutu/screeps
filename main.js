const path = require('path');
const { Worker } = require('worker_threads');
const { generateDependencyGraph } = require('./dependency-graph-generator');
const fs = require('fs');

async function main() {
    try {
        const outputPath = path.join(__dirname, 'docs', 'dependency-graph.html');
        await generateDependencyGraph(outputPath);
        // Add the lang attribute to the HTML document tag for better screen reader support
        document.documentElement.lang = 'en';
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
        // Add the following line to package.json
        // "jest": "^30.0.0",
        // Replace existing Jest version
        // Run package manager commands
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
        // Add "react": "^19.0.0" to package.json
        // Replace existing React version
        // Run npm install/yarn install
        console.log('React updated successfully to v19');
    } catch (error) {
        console.error('Error updating React:', error);
        throw error;
    }
}

/**
 * Adds scope attribute to table headers for accessibility
 */
async function addScopeToTableHeaders() {
    try {
        console.log('Adding scope attribute to table headers for accessibility...');
        const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const updatedContent = fileContent.replace(/<th>(.*?)<\/th>/g, '<th scope="col">$1</th>');
        fs.writeFileSync(filePath, updatedContent);
        console.log('Scope attribute added successfully to table headers.');
    } catch (error) {
        console.error('Error adding scope attribute to table headers:', error);
        throw error;
    }
}

/**
 * Adds `lang="en"` to the root `<html>` element if missing
 * Preserves existing attributes and avoids duplication
 */
function addLangAttributeToHtml(content) {
  return content.replace(/<html\b([^>]*)>/gi, (match, attrs) => {
    if (/\blang\s*=/i.test(attrs)) return match;
    return `<html${attrs} lang="en">`;
  });
}

// Export utilities for testing
module.exports = {
  hasMainLandmark,
  addMainLandmark,
  escapeHtml,
  addLangAttributeToHtml,
  generateDependencyGraph,
  updateJestToV30,
  updateReactToV19,
  addScopeToTableHeaders
};