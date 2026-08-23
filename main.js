const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const towerManager = require('manager.tower');
const roomManager = require('manager.room');
const spawnManager = require('manager.spawn');

module.exports.loop = function () {
    // Clear dead creeps from memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Run room managers
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        if (roomManager) {
            roomManager.run(room);
        }
        if (towerManager) {
            towerManager.run(room);
        }
    }

    // Run spawn manager
    if (spawnManager) {
        spawnManager.run();
    }

    // Run creeps
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === 'harvester' && roleHarvester) {
            roleHarvester.run(creep);
        } else if (creep.memory.role === 'upgrader' && roleUpgrader) {
            roleUpgrader.run(creep);
        } else if (creep.memory.role === 'builder' && roleBuilder) {
            roleBuilder.run(creep);
        }
    }
};