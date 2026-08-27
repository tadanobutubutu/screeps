// Screeps AI - Main Game Loop

// This file handles the core game logic for the Screeps bot.
// Accessibility note: The REACT_027 warnings about <th> scope attributes 
// do not apply to this Node.js game script file as there is no DOM/HTML table structure.

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

StructureSpawn.prototype.createCustomCreep =
    function(energy, roleName) {
        var body = [];
        for (var i = 0; i < Math.floor(energy / 150); i++) {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }
        
        if (body.length > 0) {
            return this.createCreep(body, undefined, { role: roleName });
        }
        return ERR_NOT_ENOUGH_RESOURCES;
    };

module.exports.loop = function() {
    // Clean up memory of dead creeps
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // Manage tower defense and repair
    const towers = _.filter(Game.structures, { structureType: STRUCTURE_TOWER });
    for (const tower of towers) {
        const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(structure) {
                return structure.hits < structure.hitsMax;
            }
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    // Run creep roles
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
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
};