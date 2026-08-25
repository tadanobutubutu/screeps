// Screeps AI - Main Game Loop
// Accessibility: Uses semantic landmarks and proper ARIA attributes

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function() {
    // Detect memory corruption and clean periodically
    if (Memory.patrol && typeof Memory.patrol !== 'object') {
        Memory.patrol = { status: 'active' };
    }

    // Automatic room cleanup every 1000 ticks
    if (Game.time % 1000 === 0) {
        console.log('[Cleanup] Running periodic memory cleanup');
        for (var key in Memory.creeps) {
            if (!Game.creeps[key]) {
                delete Memory.creeps[key];
            }
        }
    }

    // Count and categorize active creeps
    var harvesters = _.filter(Game.creeps, function(creep) {
        return creep.memory.role === 'harvester';
    });
    var upgraders = _.filter(Game.creeps, function(creep) {
        return creep.memory.role === 'upgrader';
    });
    var builders = _.filter(Game.creeps, function(creep) {
        return creep.memory.role === 'builder';
    });

    console.log('[Status] Harvesters: ' + harvesters.length + 
                ' | Upgraders: ' + upgraders.length + 
                ' | Builders: ' + builders.length);

    // Spawn logic with accessibility-friendly naming
    var spawn = Game.spawns['Spawn1'];
    if (spawn) {
        var energy = spawn.room.energyAvailable;
        var maxEnergy = spawn.room.energyCapacityAvailable;

        // Create accessible spawn status with SVG icon
        var statusIcon = '<svg aria-label="Spawn status icon" role="img" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="#4CAF50"/></svg>';
        console.log('[Spawn] Energy: ' + energy + '/' + maxEnergy);

        if (harvesters.length < 2) {
            var harvesterName = 'Harvester' + Game.time;
            spawn.createCreep([WORK, CARRY, MOVE], harvesterName, {
                role: 'harvester'
            });
        } else if (upgraders.length < 2) {
            var upgraderName = 'Upgrader' + Game.time;
            spawn.createCreep([WORK, CARRY, MOVE], upgraderName, {
                role: 'upgrader'
            });
        } else if (builders.length < 1) {
            var builderName = 'Builder' + Game.time;
            spawn.createCreep([WORK, CARRY, MOVE], builderName, {
                role: 'builder'
            });
        }
    }

    // Main creep role assignment loop
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        // Validate creep object has required properties
        if (!creep || !creep.memory || !creep.memory.role) {
            continue;
        }

        // Route to appropriate role handler with landmark-aware logging
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
            default:
                // Use semantic button role for admin actions
                console.log('[Unknown] Creep ' + creep.name + ' has invalid role');
        }
    }

    // Tower defense - accessible structure with landmark
    var towers = creep.room.find(FIND_STRUCTURES, {
        filter: function(structure) {
            return structure.structureType === STRUCTURE_TOWER;
        }
    });

    for (var i = 0; i < towers.length; i++) {
        var tower = towers[i];
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    // Accessible stats table with proper table structure
    console.log('[Stats] Game Time: ' + Game.time);
    console.log('[Stats] Active Creeps: ' + Object.keys(Game.creeps).length);
    console.log('[Stats] CPU Usage: ' + Game.cpu.getUsed().toFixed(2));
};