var loop = function() {
    // Game tick logic
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        // Room processing
    }
    
    // Spawn management
    for (var name in Game.spawns) {
        var spawn = Game.spawns[name];
        // Spawn logic
    }
    
    // Creep actions
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        // Creep logic
    }
};

module.exports.loop = loop;