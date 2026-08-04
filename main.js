module.exports.loop = function () {
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.spawning) {
            continue;
        }
    }
};