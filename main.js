// main.js
// This file contains the main application logic for the Screeps AI

// Import all necessary modules
const constants = require('./src/constants');
const roomManager = require('./src/managers/roomManager');
const spawnManager = require('./src/managers/spawnManager');
const towerManager = require('./src/managers/towerManager');
const builderRole = require('./src/roles/builder');

// Main loop function
module.exports.loop = function() {
    // Game loop logic
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        roomManager.manageRoom(room);
    }

    // Spawn management
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        spawnManager.manageSpawn(spawn);
    }

    // Tower management
    for (const towerId in Game.towers) {
        const tower = Game.towers[towerId];
        towerManager.manageTower(tower);
    }

    // Creep management
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if (creep.memory.role === 'builder') {
            builderRole.run(creep);
        }
    }
};

// Helper function to generate dependency graph HTML
function generateDependencyGraph() {
    const files = [
        'src/constants.js',
        'src/managers/roomManager.js',
        'src/managers/spawnManager.js',
        'src/managers/towerManager.js',
        'src/roles/builder.js'
    ];

    let html = `
<!DOCTYPE html>
<html>
<head>
    <title>Dependency Graph</title>
    <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
    </style>
</head>
<body>
    <h1>Dependency Graph</h1>
    <table>
        <thead>
            <tr>
                <th scope="col">File</th>
                <th scope="col">Dependencies</th>
            </tr>
        </thead>
        <tbody>
    `;

    files.forEach(file => {
        html += `
            <tr>
                <td>${file}</td>
                <td>None</td>
            </tr>
        `;
    });

    html += `
        </tbody>
    </table>
</body>
</html>
    `;

    return html;
}

// Export the dependency graph generator
module.exports.generateDependencyGraph = generateDependencyGraph;