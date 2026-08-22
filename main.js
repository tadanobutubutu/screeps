var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

module.exports.loop = function () {
    for (var name in Game.rooms) {
        console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy');
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
    }

    // Accessibility improvement: Ensure console output is not disruptive
    console.log = function (message) {
        if (message && message.length > 0) {
            // Log message with timestamp
            console.log(new Date().toISOString() + ' - ' + message);
        }
    };
};