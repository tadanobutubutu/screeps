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

module.exports = {
    generateDependencyGraph
};