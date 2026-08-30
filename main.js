// TODO: Address accessibility issues from insight report:
// ... (existing code)

// TODO: Implement a function to count dependencies
function countDependencies(dependencies) {
    return Object.keys(dependencies).length;
}

/**
 * Renders a dependency graph visualization
 * @param {Object} dependencies - The dependencies object
 * @returns {string} - HTML string for the dependency graph
 */
function renderDependencyGraph(dependencies) {
    // ... (existing code)
}

/**
 * Renders the index view with all packages
 * @param {Array} packages - List of packages to display
 * @returns {string} - HTML string for the index view
 */
function renderIndexView(packages) {
    // ... (existing code)
}

/**
 * Main entry point for the application
 */
function main() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const graphData = renderDependencyGraph(packageJson.dependencies || {});
    const indexHtml = renderIndexView([{ name: 'example', version: '1.0.0' }]);

    // Add the new function to count dependencies
    const numDependencies = countDependencies(packageJson.dependencies || {}); // Count local dependencies or empty object if undefined
    const countDependencyMessage = numDependencies === 1 ? 'dependency' : 'dependencies';
    const finalHtml = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Dependencies</title>
            </head>
            <body>
                <h1>Dependency Index</h1>
                <p>There are ${numDependencies} ${countDependencyMessage} found.</p>
                ${indexHtml}
            </body>
        </html>
    `;

    return { graphData, finalHtml };
}

module.exports = {
    renderDependencyGraph,
    renderIndexView,
    main,
    countDependencies // Export the new function
};