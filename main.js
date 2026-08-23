// Screeps AI - Main Module

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const structureTower = require('structure.tower');

module.exports.loop = function() {
    // Clear memory of dead creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Count available energy and spawn capacity
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    let builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    
    // Auto-spawn harvesters if needed
    if (harvesters.length < 2) {
        let newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'harvester' }
        });
    }
    
    // Auto-spawn upgraders if needed
    if (upgraders.length < 2) {
        let newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'upgrader' }
        });
    }
    
    // Auto-spawn builders if needed
    if (builders.length < 2) {
        let newName = 'Builder' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'builder' }
        });
    }

    // Run tower logic
    structureTower.run();

    // Run role logic for all creeps
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
    
    // Visual stats (accessible table)
    let stats = [
        { role: 'Harvester', count: harvesters.length },
        { role: 'Upgrader', count: upgraders.length },
        { role: 'Builder', count: builders.length }
    ];
    
    // Generate accessible table for visual stats
    let visualTable = '<table><thead><tr><th scope="col">Role</th><th scope="col">Count</th></tr></thead><tbody>';
    for (let stat of stats) {
        visualTable += `<tr><td>${stat.role}</td><td>${stat.count}</td></tr>`;
    }
    visualTable += '</tbody></table>';
    
    // Note: In Screeps, use new RoomVisual() for visuals, not HTML strings
    // This is just for demonstration of the accessibility fix pattern
    if (Game.spawns['Spawn1']) {
        let roomVisual = new RoomVisual();
        roomVisual.table(
            [{ role: 'Harvester', count: harvesters.length },
             { role: 'Upgrader', count: upgraders.length },
             { role: 'Builder', count: builders.length }],
            {
                opts: [
                    { legend: true }
                ]
            }
        );
    }
};