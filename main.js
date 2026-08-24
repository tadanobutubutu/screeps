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
    
    // Add the fix for the fake link
    document.getElementById('unrotate').addEventListener('click', function() {
        // Logic to rotate back, e.g., a page reload or a UI state change
        window.location.reload();
    });
};

module.exports.loop = loop;