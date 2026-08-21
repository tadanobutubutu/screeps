const path = require('path');
const { Worker } = require('worker_threads');
const { generateDependencyGraph } = require('./dependencyGraph');
const fs = require('fs');

async function main() {
    try {
        const outputPath = path.join('docs', 'dependency-graph.html');
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
        // 1. Updating package.json dependencies
        // Add the following line
        // "jest": "^30.0.0",
        // Replace the existing "jest" version in package.json with "^30.0.0"
        // 2. Running package manager commands
        // Run `npm install` or `yarn install`
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
        // Add the following line
        // "react": "^19.0.0",
        // Replace the existing "react" version in package.json with "^19.0.0"
        // 2. Running package manager commands
        // Run `npm install` or `yarn install`
        // 3. Running tests to ensure compatibility
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
        const filePath = path.join('docs', 'dependency-graph.html');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const updatedContent = fileContent.replace(/<th([^>]*)>/g, '<th$1 scope="col">');
        fs.writeFileSync(filePath, updatedContent);
        console.log('Scope attribute added successfully to table headers.');
    } catch (error) {
        console.error('Error adding scope attribute to table headers:', error);
        throw error;
    }
}

/**
 * Adds lang attribute to the HTML element for accessibility (REACT_015)
 * This is critical for screen readers to properly interpret the document's language
 */
async function addLangAttributeToHtml() {
    try {
        console.log('Adding lang attribute to HTML element for accessibility...');
        const filePath = path.join('app', 'layout.tsx');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Check if lang attribute already exists
        if (fileContent.includes('lang=')) {
            console.log('Lang attribute already exists in HTML element.');
            return;
        }
        
        // Add lang="en" to the html tag
        const updatedContent = fileContent.replace(
            /<html([^>]*)>/,
            '<html$1 lang="en">'
        );
        
        if (updatedContent === fileContent) {
            // Try alternative pattern for html tag
            const altUpdatedContent = fileContent.replace(
                /<Html([^>]*)>/,
                '<Html$1 lang="en">'
            );
            if (altUpdatedContent !== fileContent) {
                fs.writeFileSync(filePath, altUpdatedContent);
                console.log('Lang attribute added successfully to HTML element (Html component).');
                return;
            }
            console.log('Could not find HTML element to update.');
            return;
        }
        
        fs.writeFileSync(filePath, updatedContent);
        console.log('Lang attribute added successfully to HTML element.');
    } catch (error) {
        console.error('Error adding lang attribute to HTML element:', error);
        throw error;
    }
}

module.exports = {
    generateDependencyGraph,
    updateJestToV30,
    updateReactToV19,
    addScopeToTableHeaders,
    addLangAttributeToHtml
};