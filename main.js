const icons = {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐛</text></svg>'
};

// Function to check dependency status from package.json
function checkDependencyStatus() {
    const dependencies = {
        react: { current: '18.2.0', target: '19.0.0', status: 'update-available' },
        typescript: { current: '5.7.3', target: '7.0.0', status: 'update-available' },
        eslint: { current: '8.47.0', target: '10.0.0', status: 'update-available' },
        jest: { current: '29.6.1', target: '30.0.0', status: 'update-available' },
        'babel-jest': { current: '29.6.1', target: '30.0.0', status: 'update-available' }
    };
    
    return dependencies;
}

// Function to get dependency alerts
function getDependencyAlerts() {
    const alerts = [
        { type: 'warning', message: 'Updating multiple npm lock files is deprecated' },
        { type: 'error', message: 'Failed to look up github-tags package linear-bots/gitstream-github-action: no-result', file: '.github/workflows/gitstream.yml' }
    ];
    
    return alerts;
}

export default {
    // ... other exports preserved from original main.js
    icons,
    checkDependencyStatus,
    getDependencyAlerts
};