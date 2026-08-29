// main.js - Entry point for the application

const fs = require('fs');
const path = require('path');

/**
 * Reads and parses a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Object|null} Parsed JSON object or null on error
 */
function readJsonFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
        return null;
    }
}

/**
 * Writes data to a JSON file
 * @param {string} filePath - Path to the JSON file
 * @param {Object} data - Data to write
 * @returns {boolean} True if successful, false otherwise
 */
function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error(`Error writing file: ${error.message}`);
        return false;
    }
}

/**
 * Counts dependencies from a package.json object
 * @param {Object} packageJson - Parsed package.json object
 * @returns {Object} Object containing counts of different dependency types
 */
function countDependencies(packageJson) {
    const counts = {
        dependencies: 0,
        devDependencies: 0,
        peerDependencies: 0,
        optionalDependencies: 0,
        total: 0
    };
    
    if (!packageJson || typeof packageJson !== 'object') {
        return counts;
    }
    
    if (packageJson.dependencies && typeof packageJson.dependencies === 'object') {
        counts.dependencies = Object.keys(packageJson.dependencies).length;
    }
    
    if (packageJson.devDependencies && typeof packageJson.devDependencies === 'object') {
        counts.devDependencies = Object.keys(packageJson.devDependencies).length;
    }
    
    if (packageJson.peerDependencies && typeof packageJson.peerDependencies === 'object') {
        counts.peerDependencies = Object.keys(packageJson.peerDependencies).length;
    }
    
    if (packageJson.optionalDependencies && typeof packageJson.optionalDependencies === 'object') {
        counts.optionalDependencies = Object.keys(packageJson.optionalDependencies).length;
    }
    
    counts.total = counts.dependencies + counts.devDependencies + 
                   counts.peerDependencies + counts.optionalDependencies;
    
    return counts;
}

/**
 * Counts dependencies from a package.json file
 * @param {string} packagePath - Path to package.json file
 * @returns {Object} Object containing counts of different dependency types
 */
function countDependenciesFromFile(packagePath) {
    const packageJson = readJsonFile(packagePath);
    return countDependencies(packageJson);
}

/**
 * Gets the list of all dependency names
 * @param {Object} packageJson - Parsed package.json object
 * @returns {string[]} Array of dependency names
 */
function getAllDependencyNames(packageJson) {
    const names = [];
    
    if (!packageJson || typeof packageJson !== 'object') {
        return names;
    }
    
    const deps = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
    
    for (const depType of deps) {
        if (packageJson[depType] && typeof packageJson[depType] === 'object') {
            names.push(...Object.keys(packageJson[depType]));
        }
    }
    
    return names;
}

// Export functions for module usage
module.exports = {
    readJsonFile,
    writeJsonFile,
    countDependencies,
    countDependenciesFromFile,
    getAllDependencyNames
};

// Main execution when run directly
if (require.main === module) {
    const packagePath = path.join(process.cwd(), 'package.json');
    const deps = countDependenciesFromFile(packagePath);
    
    console.log('Dependency Counts:');
    console.log(`  Dependencies: ${deps.dependencies}`);
    console.log(`  Dev Dependencies: ${deps.devDependencies}`);
    console.log(`  Peer Dependencies: ${deps.peerDependencies}`);
    console.log(`  Optional Dependencies: ${deps.optionalDependencies}`);
    console.log(`  Total: ${deps.total}`);
}