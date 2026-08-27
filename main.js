// TODO: Add any updates related to new functions

module.exports.loop = function() {
    // Game initialization
    for (var i in Game.rooms) {
        var room = Game.rooms[i];
        var controller = room.controller;
        if (controller && controller.my) {
            // Your code here
        }
    }

    // Handle creeps
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        // Creep behavior here
    }
};