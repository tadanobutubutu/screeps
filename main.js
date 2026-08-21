const path = require('path');
const { Worker } = require('worker_threads');
const { generateDependencyGraph } = require('./dependencyGraph');
const fs = require('fs');

/**
 * Export utilities for testing
 */
module.exports = {
    generateDependencyGraph,
    initializeApp: initializeApp || async function () {
        const mainElement = document.querySelector('main');
        if (mainElement) {
            console.log('Main landmark found');
        }
        return mainElement;
    },
    getMainContent: getMainContent || function () {
        return document.querySelector('main') || document.getElementById('main');
    },
    init: init || function () {
        const main = getMainContent();
        if (main) {
            main.setAttribute('role', 'main');
        }
        return main;
    },
    addLangAttribute: addLangAttribute || function (content) {
        return content.replace(/<html(\s[^>]*)?>/, (match, attrs) => {
            if (attrs && /\slang\s*=/i.test(attrs)) {
                return match;
            }
            return `<html${attrs ? attrs : ''} lang="en">`;
        });
    },
    addMainLandmark: addMainLandmark || async function () {
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
    },
    replaceHashLinksWithButtons: replaceHashLinksWithButtons || async function () {
        try {
            console.log('Replacing hash links with buttons for better accessibility...');
            const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const updatedContent = fileContent.replace(/<a\s+id="unrotate"\s+href="#"\s*>(.*?)<\/a>/g, (match, text) => {
                return `<button id="unrotate">${text}</button>`;
            });
            fs.writeFileSync(filePath, updatedContent);
            console.log('Hash links replaced with buttons successfully.');
        } catch (error) {
            console.error('Error replacing hash links with buttons:', error);
            throw error;
        }
    }
};

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