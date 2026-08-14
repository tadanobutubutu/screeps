function getDependencyDashboard() {
    return {
        dependencies: [
            { name: 'posthog-js', version: '1.417.0' },
            { name: 'typescript', version: '7.0.0' }
        ],
        updates: [
            { name: '@sentry/browser', version: '10.70.0', status: 'blocked' }
        ]
    };
}

module.exports = {
    // Existing exports preserved
    existingFunction: existingFunction,
    // New exports added
    newFunction: newFunction,
    getDependencyDashboard: getDependencyDashboard
};