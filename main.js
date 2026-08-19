// main.js (unchanged from original)
const constants = require('./src/constants');
const roomManager = require('./src/managers/roomManager');
const spawnManager = require('./src/managers/spawnManager');
const towerManager = require('./src/managers/towerManager');
const builder = require('./src/roles/builder');

// Main game loop
module.exports.loop = function () {
    // Game logic here
    roomManager.run();
    spawnManager.run();
    towerManager.run();
    builder.run();
};

// Export all required modules
module.exports.constants = constants;
module.exports.roomManager = roomManager;
module.exports.spawnManager = spawnManager;
module.exports.towerManager = towerManager;
module.exports.builder = builder;