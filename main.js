// Main game logic for Screeps
// This file contains the core game loop and AI logic

// Memory management and creep spawning logic
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');

module.exports.loop = function() {
    // Clear memory of dead creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Spawn logic
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');

    // Spawn harvesters first
    if (harvesters.length < 3) {
        const newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    // Then spawn upgraders
    else if (upgraders.length < 2) {
        const newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'upgrader'}});
    }
    // Then spawn builders
    else if (builders.length < 2) {
        const newName = 'Builder' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'builder'}});
    }

    // Run role-based logic for each creep
    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role === 'repairer') {
            roleRepairer.run(creep);
        }
    }

    // Tower defense logic
    const towers = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER);
    for (let tower of towers) {
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
        else {
            // Repair structures if no hostiles
            const structuresToRepair = tower.pos.findInRange(FIND_STRUCTURES, 5, {
                filter: (structure) => structure.hits < structure.hitsMax && 
                           (structure.structureType === STRUCTURE_ROAD || 
                            structure.structureType === STRUCTURE_CONTAINER ||
                            structure.structureType === STRUCTURE_WALL)
            });
            if (structuresToRepair.length > 0) {
                tower.repair(structuresToRepair[0]);
            }
        }
    }

    // Room statistics (accessible table)
    const room = Game.rooms['W0N0'];
    if (room) {
        const sources = room.find(FIND_SOURCES);
        const minerals = room.find(FIND_MINERALS);
        const structures = room.find(FIND_STRUCTURES);
        
        // Display room statistics
        const statsTable = `
<table>
    <thead>
        <tr>
            <th scope="col">Resource Type</th>
            <th scope="col">Count</th>
            <th scope="col">Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Sources</th>
            <td>${sources.length}</td>
            <td>Active</td>
        </tr>
        <tr>
            <th scope="row">Minerals</th>
            <td>${minerals.length}</td>
            <td>${minerals.length > 0 ? minerals[0].mineralType : 'None'}</td>
        </tr>
        <tr>
            <th scope="row">Structures</th>
            <td>${structures.length}</td>
            <td>Operational</td>
        </tr>
    </tbody>
</table>
        `;
    }
};