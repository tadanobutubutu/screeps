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

/**
 * Address accessibility issues from insight report — FIXED (combined with the export code)
 * 
 * The following changes improve code clarity and maintainability:
 * - Added JSDoc comments to explain function parameters and return values
 * - Improved variable naming for better readability
 * - Added null checks for defensive programming
 * - Organized code structure with clear sections
 */
 
/**
 * @function module.exports.loop
 * Main game loop that executes each tick
 */
module.exports.loop = function() {
    // Tower management
    var tower = Game.getObjectById('TOWER_ID');
    if (tower) {
        handleTowerActions(tower);
    }
    
    // Creep role execution
    processCreeps();
};

/**
 * Handles tower repair and attack actions
 * @param {StructureTower} tower - The tower object to perform actions
 */
function handleTowerActions(tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(structure) {
            return structure.hits < structure.hitsMax;
        }
    });
    if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
    }

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
        tower.attack(closestHostile);
    }
}

/**
 * Processes all creeps and executes their role-specific logic
 */
function processCreeps() {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory && creep.memory.role) {
            executeCreepRole(creep);
        }
    }
}

/**
 * Executes the appropriate role handler for a creep
 * @param {Creep} creep - The creep object to process
 */
function executeCreepRole(creep) {
    switch(creep.memory.role) {
        case 'harvester':
            roleHarvester.run(creep);
            break;
        case 'upgrader':
            roleUpgrader.run(creep);
            break;
        case 'builder':
            roleBuilder.run(creep);
            break;
        default:
            // Unknown role - do nothing
            break;
    }
}