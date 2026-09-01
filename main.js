// main.js - Entry point for the application

const fs = require('fs');
const path = require('path');

// Configuration object
const config = {
    name: 'dependency-counter',
    version: '1.0.0',
    dependencies: {},
    devDependencies: {}
};

// Load dependencies from package.json if it exists
function loadDependencies() {
    try {
        const packagePath = path.join(__dirname, 'package.json');
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            config.dependencies = packageJson.dependencies || {};
            config.devDependencies = packageJson.devDependencies || {};
        }
    } catch (error) {
        console.error('Error loading dependencies:', error.message);
    }
}

// Count all dependencies
function countDependencies() {
    const prodDeps = Object.keys(config.dependencies).length;
    const devDeps = Object.keys(config.devDependencies).length;
    return {
        dependencies: prodDeps,
        devDependencies: devDeps,
        total: prodDeps + devDeps
    };
}

// Get dependency list
function getDependencies() {
    return {
        dependencies: config.dependencies,
        devDependencies: config.devDependencies
    };
}

// Main execution
function main() {
    loadDependencies();
    const counts = countDependencies();
    console.log('Dependency counts:', counts);
}

// Export functions for testing and external use
module.exports = {
    config,
    countDependencies,
    getDependencies,
    loadDependencies,
    main
};

// Run if executed directly
if (require.main === module) {
    main();
}