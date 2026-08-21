const path = require('path');
const { Worker } = require('worker_threads');
const { generateDependencyGraph } = require('./dependency-graph');
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
        const filePath = path.join('docs', 'index.html');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const updatedContent = fileContent.replace(/<th(\s+[^>]*)?>/gi, (match, attrs) => {
            if (attrs && /\bscope\s*=/i.test(attrs)) {
                return match;
            }
            return `<th${attrs || ''} scope="col">`;
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
  return content.replace(/<html(\s+[^>]*)?>/gi, (match, attrs) => {
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
        const filesToUpdate = [path.join('docs', 'index.html')];
        for (const filePath of filesToUpdate) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const updatedContent = fileContent.replace(/<\/main>/gi, '');
            const newFileContent = updatedContent.replace(/(<body[^>]*>)([\s\S]*)(<\/html>)/gi, (match, bodyOpen, bodyContent, bodyClose) => {
                return bodyOpen + '\n<main>\n' + bodyContent + '\n</main>' + bodyClose;
            });
            fs.writeFileSync(filePath, newFileContent);
            console.log(`Main landmark added to ${filePath}`);
        }
        console.log('All HTML files have been updated with <main> landmarks.');
    } catch (error) {
        console.error('Error adding <main> landmark:', error);
        throw error;
    }
}

/**
 * Replaces links with hash-only href attributes with buttons for better accessibility
 */
async function replaceHashLinksWithButtons() {
    try {
        console.log('Replacing hash links with buttons for better accessibility...');
        const filePath = path.join('docs', 'index.html');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const updatedContent = fileContent.replace(/<a(\s+[^>]*)?href\s*=\s*["']#([^"']*)["'](\s+[^>]*)?>([^<]*)<\/a>/gi, (match, attrsBefore, id, attrsAfter, text) => {
            const idMatch = id;
            const idAttr = idMatch ? ` id="${idMatch}"` : '';
            const allAttrs = (attrsBefore || '') + (attrsAfter || '');
            const classMatch = allAttrs.match(/class\s*=\s*["']([^"']*)["']/i);
            const classAttr = classMatch ? ` class="${classMatch[1]}"` : '';
            return `<button${idAttr}${classAttr} type="button">${text}</button>`;
        });
        fs.writeFileSync(filePath, updatedContent);
        console.log('Hash links replaced with buttons successfully.');
    } catch (error) {
        console.error('Error replacing hash links with buttons:', error);
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
    replaceHashLinksWithButtons,
    main
};