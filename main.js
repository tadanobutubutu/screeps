// Renovate Dependency Dashboard processing logic

// No changes to existing code. The dependency dashboard is informational
// and does not require code modifications in main.js.

function processDependencyDashboard(issueBody) {
    const dependencies = extractDependencies(issueBody);
    return dependencies;
}

function extractDependencies(issueBody) {
    const deps = [];
    const regex = /`([^`]+)` (\^?\d+\.\d+\.\d+)/g;
    let match;
    while ((match = regex.exec(issueBody)) !== null) {
        deps.push({ name: match[1], version: match[2] });
    }
    return deps;
}

module.exports = {
    processDependencyDashboard,
    extractDependencies,
};