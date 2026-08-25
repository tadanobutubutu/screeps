// Dependency Dashboard - main.js

// Main game loop for Screeps
module.exports = {
    loop: function() {
        // Clear any existing flags
        for (const name in Memory.flags) {
            delete Memory.flags[name];
        }
        
        // Check for creep spawning needs
        const harvesterCount = _.sum(Game.creeps, c => c.memory.role === 'harvester');
        const builderCount = _.sum(Game.creeps, c => c.memory.role === 'builder');
        
        // Spawn harvesters if needed
        if (harvesterCount < 2) {
            const spawn = Game.spawns['Spawn1'];
            if (spawn) {
                const newName = 'Harvester' + Game.time;
                spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
                    memory: { role: 'harvester' }
                });
            }
        }
        
        // Spawn builders if needed
        if (builderCount < 2 && harvesterCount >= 2) {
            const spawn = Game.spawns['Spawn1'];
            if (spawn) {
                const newName = 'Builder' + Game.time;
                spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
                    memory: { role: 'builder' }
                });
            }
        }
        
        // Assign roles and run behaviors
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            
            if (creep.memory.role === 'harvester') {
                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    const sources = creep.room.find(FIND_SOURCES);
                    if (sources.length > 0) {
                        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[0]);
                        }
                    }
                } else {
                    if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.spawns['Spawn1']);
                    }
                }
            }
            
            if (creep.memory.role === 'builder') {
                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    const sources = creep.room.find(FIND_SOURCES);
                    if (sources.length > 0) {
                        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[0]);
                        }
                    }
                } else {
                    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if (targets.length > 0) {
                        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                    }
                }
            }
        }
        
        // Tower defense logic
        const towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER);
        for (const tower of towers) {
            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            } else {
                // Heal wounded allies
                const closestWounded = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: c => c.hits < c.hitsMax
                });
                if (closestWounded) {
                    tower.heal(closestWounded);
                }
            }
        }
    }
};