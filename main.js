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

    // Replace the anchor tag with a button for in-page action
    var rotateBackButton = document.getElementById('unrotate');
    if (rotateBackButton) {
        rotateBackButton.onclick = function() {
            // Add your logic here for the "rotate back" action
            console.log('Rotating back...');
        };
    }
};