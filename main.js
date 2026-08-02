var utils = require('utils');
var emotions = require('utils.emotions');

module.exports.loop = function () {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            continue;
        }
        var creep = Game.creeps[name];
        if (creep.spawning) {
            continue;
        }
        emotions.run(creep);
    }
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (!creep.spawning) {
            utils.run(creep);
        }
    }
};