// Screeps AI - Main Module

// Main game loop
module.exports = function() {
    // Harvest and upgrade logic
    const creeps = Game.creeps;
    const sources = Game.sources;
    const controller = Game.controllers[0]; // assuming first controller

    Object.values(creeps).forEach(creep => {
        const source = creep.findClosestByPath(FIND_SOURCES, {
            filter: (source) => source.energy > 0
        });
        if (source) {
            harvest(creep, source);
        } else {
            upgradeController(creep, controller);
        }
    });
};

// Harvest and upgrade logic functions
function harvest(creep, source) {
    if (!source) return;
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }
}

function upgradeController(creep, controller) {
    if (!controller) return;
    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller);
    }
}