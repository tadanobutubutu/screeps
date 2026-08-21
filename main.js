// Screeps AI - Main Entry Point
// Repository: screeps/screeps

module.exports.loop = function() {
    // Memory cleanup
    if (Game.time % 100 === 0) {
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    }

    // Main game loop
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        
        if (creep.spawning) continue;
        
        const role = creep.memory.role;
        
        if (role === 'harvester') {
            // Harvest energy
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else if (role === 'builder') {
            // Build structures
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // Upgrade controller if no construction sites
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else if (role === 'upgrader') {
            // Upgrade controller
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#00ff00' } });
            }
        }
    }

    // Spawn creeps if needed
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');

    if (harvesters.length < 2) {
        const newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'harvester' }
        });
    }

    if (builders.length < 2 && harvesters.length >= 2) {
        const newName = 'Builder' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'builder' }
        });
    }

    if (upgraders.length < 1 && harvesters.length >= 2) {
        const newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: 'upgrader' }
        });
    }
};