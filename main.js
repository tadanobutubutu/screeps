const profiler = require('./profiler');
const { visualizer } = require('./visualizer');
const { dashboard } = require('./dashboard');
const { stats } = require('./stats');

// TODO: Add these imported modules to the relevant rendering functions
// ... (Fill in here with the appropriate function calls)

const main = () => {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        room.visualize();
        visualizer.visualizeRoom(room);
        stats.collectRoomStats(room);
        dashboard.renderRoom(room);
    }

    for (const towerId in Game.structures) {
        const tower = Game.structures[towerId];
        if (tower.structureType === STRUCTURE_TOWER) {
            tower.run();
        }
    }

    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        creep.run();
    }

    for (const deadCreep in Memory.creeps) {
        if (!Game.creeps[deadCreep]) {
            delete Memory.creeps[deadCreep];
        }
    }
};

if (profiler) {
    module.exports = profiler.wrap(main);
} else {
    module.exports = main;
}