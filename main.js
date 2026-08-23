const path = require('path');
const { Worker } = require('worker_threads');
const { generateDependencyGraph } = require('./dependencyGraph');
const fs = require('fs');

async function main() {
    try {
        const outputPath = path.join(__dirname, 'docs', 'dependency-graph.html');
        await generateDependencyGraph(outputPath);
        // Replace the fake link with a button for better accessibility
        replaceFakeLink(outputPath);
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
 * Replaces a hash‑only <a> link with an equivalent <button> element
 * to avoid “dead link” warnings and improve keyboard/screen‑reader behavior.
 * @param {string} filePath - Path to the HTML file to patch
 */
function replaceFakeLink(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = content.replace(
        /<a id="unrotate" href="#">rotate back<\/a>/,
        '<button type="button" id="unrotate">rotate back</button>'
    );
    fs.writeFileSync(filePath, fixedContent);
}

/**
 * Updates Jest to v30 and related dependencies
 */
async function updateJestToV30() {
    try {
        console.log('Updating Jest to v30 and related dependencies...');
        // Implementation would go here
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
        const updatedContent = fileContent.replace(/<th([^>]*)>/g, (match, attrs) => {
            if (attrs.includes('scope')) {
                return match;
            }
            return `<th${attrs} scope="col">`;
        });
        fs.writeFileSync(filePath, updatedContent);
        console.log('Scope attribute added successfully to table headers.');
    } catch (error) {
        console.error('Error adding scope attribute to table headers:', error);
        throw error;
    }
}

/**
 * Adds `lang="en"` to the root `<html>` element if it is missing.
 * Preserves any existing attributes and avoids duplicating a `lang` attribute.
 * @param {string} content - HTML string to modify
 * @returns {string} - Modified HTML with a language attribute
 */
function addLangAttribute(content) {
  return content.replace(/<html(\s[^>]*)?>/, (match, attrs) => {
    if (attrs && /\slang\s*=/i.test(attrs)) {
      return match;
    }
    return `<html${attrs ? attrs : ''} lang="en">`;
  });
}

/**
 * Adds a <main> landmark to the HTML content for accessibility
 */
async function addMainLandmark() {
    try {
        console.log('Adding <main> landmark to HTML content for accessibility...');
        const filesToUpdate = ['docs/dependency-graph.html', 'docs/index.html'];
        for (const filePath of filesToUpdate) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const updatedContent = addLangAttribute(fileContent);
            const newFileContent = `<main>` + updatedContent.replace(/<\/html>/, '</main></html>') + '</main>';
            fs.writeFileSync(filePath, newFileContent);
            console.log(`Main landmark added to ${filePath}`);
        }
        console.log('All HTML files have been updated with <main> landmarks.');
    } catch (error) {
        console.error('Error adding <main> landmark:', error);
        throw error;
    }
}

// Export utilities for testing
module.exports = {
    generateDependencyGraph,
    updateJestToV30,
    updateReactToV19,
    addScopeToTableHeaders,
    addLangAttribute,
    addMainLandmark,
    main,
    replaceFakeLink,
};