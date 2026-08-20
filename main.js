// Screeps AI - Main Module

const roles = {
    harvester: require('role.harvester'),
    builder: require('role.builder'),
    upgrader: require('role.upgrader'),
    defender: require('role.defender')
};

module.exports = {
    loop: function() {
        // Clean up dead creeps
        for (const name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        // Count harvester to maintain minimum
        const harvesters = _.filter(Game.creeps, creep => creep.memory.role === 'harvester');
        if (harvesters.length < 2) {
            const newHarvester = Game.spawns['Spawn1'].createCreep([WORK, CARRY, MOVE], undefined, { role: 'harvester' });
            if (typeof newHarvester === 'string') {
                console.log('Spawning new harvester: ' + newHarvester);
            }
        }

        // Run roles
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            if (roles[creep.memory.role] && roles[creep.memory.role].run) {
                roles[creep.memory.role].run(creep);
            }
        }
    }
};