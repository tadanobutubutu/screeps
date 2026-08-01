// Main entry point for the Screeps bot
// Handles spawning, harvesting, upgrading, and defending

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleDefender = require('role.defender');

module.exports.loop = function () {
    // Clean up dead creeps from memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Run roles for each live creep
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.spawning) {
            continue;
        }
        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'defender':
                roleDefender.run(creep);
                break;
            default:
                console.log(`Unknown role: ${creep.memory.role}`);
                break;
        }
    }

    // Auto-spawn harvesters if needed
    const spawn = Game.spawns['Spawn1'];
    if (spawn && !spawn.spawning) {
        const harvesters = _.filter(Game.creeps, (c) => c.memory.role === 'harvester');
        const upgraders = _.filter(Game.creeps, (c) => c.memory.role === 'upgrader');
        const builders = _.filter(Game.creeps, (c) => c.memory.role === 'builder');
        const defenders = _.filter(Game.creeps, (c) => c.memory.role === 'defender');

        if (harvesters.length < 3) {
            const newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester:', newName);
            spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'harvester' } });
        } else if (upgraders.length < 2) {
            const newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader:', newName);
            spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'upgrader' } });
        } else if (builders.length < 1) {
            const newName = 'Builder' + Game.time;
            console.log('Spawning new builder:', newName);
            spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'builder' } });
        } else if (defenders.length < 1) {
            const newName = 'Defender' + Game.time;
            console.log('Spawning new defender:', newName);
            spawn.spawnCreep([TOUGH, ATTACK, MOVE, MOVE], newName, { memory: { role: 'defender' } });
        }
    }
};