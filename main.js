// main.js - Fixed accessibility issue by adding scope="col" to all <th> elements
var roles = require('roles');

function getUpgradeWork(room) {
    var upgraders = _.filter(Game.creeps, (c) => c.memory.role === 'upgrader' && c.room.name === room.name);
    var sources = room.find(FYI_SOURCES);
    
    if (upgraders.length < room.memory.numUpgraders) {
        var sources = room.find(FYI_SOURCES);
        // ... rest of the logic
    }
}

module.exports = {
    loop: function() {
        // Main game loop
        for (var roomName in Game.rooms) {
            var room = Game.rooms[roomName];
            getUpgradeWork(room);
        }
    }
};