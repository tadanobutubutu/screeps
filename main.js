// Screeps Main Script

// Module requires
const roleHarvester = require('role.harvester');
const roleBuilder = require('role.builder');
const roleAttacker = require('role.attacker');

// Constants
const MAX_HARVESTERS = 5;
const MAX_BUILDERS = 3;

// Creep spawning logic
function spawnCreeps() {
    const harvesterCount = _.sum(Game.creeps, c => c.memory.role === 'harvester');
    const builderCount = _.sum(Game.creeps, c => c.memory.role === 'builder');
    
    if (harvesterCount < MAX_HARVESTERS) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, { role: 'harvester' });
    }
    
    if (builderCount < MAX_BUILDERS) {
        Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE, MOVE], undefined, { role: 'builder' });
    }
}

// Tower defense logic
function runTowers() {
    const towers = Game.rooms['W0N0'].find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_TOWER }
    });
    
    for (const tower of towers) {
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }
}

// Main game loop
module.exports.loop = function() {
    // TODO: Address accessibility issues from insight report:
    // - Ensure all interactive elements have proper labels
    // - Add ARIA attributes where applicable
    // - Ensure color contrast meets WCAG 2.1 AA standards
    // - Provide keyboard navigation support
    
    // Clear dead creeps memory
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    spawnCreeps();
    
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role === 'attacker') {
            roleAttacker.run(creep);
        }
    }
    
    runTowers();
};