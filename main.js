// main.js
// This file contains the main application logic for the Screeps AI

// Import required modules
const constants = require('./src/constants');
const roomManager = require('./src/managers/roomManager');
const spawnManager = require('./src/managers/spawnManager');
const towerManager = require('./src/managers/towerManager');
const builder = require('./src/roles/builder');

// Main loop function
function loop() {
    // Initialize managers
    roomManager.run();
    spawnManager.run();
    towerManager.run();

    // Run role-specific logic
    builder.run();

    // Add more role managers as needed
}

// Helper function to create table headers with proper scope attributes
function createTableHeader(text, scope = 'col') {
    return `<th scope="${scope}"><div>${text}</div></th>`;
}

// Export the main loop function
module.exports = {
    loop,
    createTableHeader
};

// Additional utility functions can be added here
// For example, a function to generate the dependency graph table
function generateDependencyGraph() {
    const headers = [
        createTableHeader('Source File'),
        createTableHeader('Dependency'),
        createTableHeader('Type'),
        createTableHeader('Status')
    ];

    // Table generation logic would go here
    // This is just a placeholder to demonstrate the proper table structure
    return `
        <table>
            <thead>
                <tr>
                    ${headers.join('')}
                </tr>
            </thead>
            <tbody>
                <!-- Table rows would be added here -->
            </tbody>
        </table>
    `;
}

// Export additional functions if needed
module.exports.generateDependencyGraph = generateDependencyGraph;