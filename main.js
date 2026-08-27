#!/usr/bin/env node

/**
 * Main entry point for the package
 */

const fs = require('fs');
const path = require('path');

/**
 * Reads package.json and returns the parsed content
 * @returns {Object} Parsed package.json content
 */
function readPackageJson() {
    const packagePath = path.join(process.cwd(), 'package.json');
    const content = fs.readFileSync(packagePath, 'utf8');
    return JSON.parse(content);
}

/**
 * Counts the total number of dependencies
 * @param {Object} pkg - Package.json object (optional, will read from file if not provided)
 * @returns {number} Total count of dependencies
 */
function countDependencies(pkg) {
    if (!pkg) {
        pkg = readPackageJson();
    }
    
    let count = 0;
    
    if (pkg.dependencies) {
        count += Object.keys(pkg.dependencies).length;
    }
    
    if (pkg.devDependencies) {
        count += Object.keys(pkg.devDependencies).length;
    }
    
    if (pkg.optionalDependencies) {
        count += Object.keys(pkg.optionalDependencies).length;
    }
    
    if (pkg.peerDependencies) {
        count += Object.keys(pkg.peerDependencies).length;
    }
    
    return count;
}

/**
 * Gets dependency information summary
 * @param {Object} pkg - Package.json object (optional, will read from file if not provided)
 * @returns {Object} Summary of all dependencies
 */
function getDependencySummary(pkg) {
    if (!pkg) {
        pkg = readPackageJson();
    }
    
    return {
        dependencies: pkg.dependencies ? Object.keys(pkg.dependencies).length : 0,
        devDependencies: pkg.devDependencies ? Object.keys(pkg.devDependencies).length : 0,
        optionalDependencies: pkg.optionalDependencies ? Object.keys(pkg.optionalDependencies).length : 0,
        peerDependencies: pkg.peerDependencies ? Object.keys(pkg.peerDependencies).length : 0,
        total: countDependencies(pkg)
    };
}

/**
 * Main function that runs the CLI
 */
function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log('Usage: node main.js [options]');
        console.log('Options:');
        console.log('  --help, -h    Show this help message');
        console.log('  --count       Count all dependencies');
        console.log('  --summary     Show dependency summary');
        return 0;
    }
    
    if (args.includes('--summary')) {
        const summary = getDependencySummary();
        console.log('Dependency Summary:');
        console.log(`  Dependencies: ${summary.dependencies}`);
        console.log(`  Dev Dependencies: ${summary.devDependencies}`);
        console.log(`  Optional Dependencies: ${summary.optionalDependencies}`);
        console.log(`  Peer Dependencies: ${summary.peerDependencies}`);
        console.log(`  Total: ${summary.total}`);
        return 0;
    }
    
    if (args.includes('--count')) {
        const count = countDependencies();
        console.log(`Total dependencies: ${count}`);
        return 0;
    }
    
    // Default behavior
    const count = countDependencies();
    console.log(`Total dependencies: ${count}`);
    return 0;
}

// Export functions for testing and external use
module.exports = {
    countDependencies,
    getDependencySummary,
    readPackageJson,
    main
};

// Run main if executed directly
if (require.main === module) {
    main();
}