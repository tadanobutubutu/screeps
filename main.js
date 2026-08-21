// Main Screeps game loop
var roles = {
    harvester: require('role.harvester'),
    builder: require('role.builder'),
    upgrader: require('role.upgrader')
};

module.exports = {
    loop: function() {
        // Clear dead creeps
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        // Ensure we have enough harvesters
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if(harvesters.length < 2) {
            var newName = 'Harvester' + Game.time;
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, 
                {memory: {role: 'harvester'}});
        }

        // Display table showing creep stats
        var tableHTML = `
        <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr>
                    <th scope="col">Creep Name</th>
                    <th scope="col">Role</th>
                    <th scope="col">Position</th>
                    <th scope="col">Hits</th>
                    <th scope="col">Energy</th>
                    <th scope="col">Status</th>
                    <th scope="col">Task</th>
                    <th scope="col">Time Working</th>
                    <th scope="col">Body Parts</th>
                    <th scope="col">Carry Capacity</th>
                    <th scope="col">Fatigue</th>
                    <th scope="col">Ticks To Live</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
        `;

        for(var creepName in Game.creeps) {
            var creep = Game.creeps[creepName];
            var role = creep.memory.role || 'unknown';
            var pos = creep.pos.x + ',' + creep.pos.y;
            var hits = creep.hits + '/' + creep.hitsMax;
            var energy = creep.carry.energy || 0;
            var status = creep.spawning ? 'Spawning' : 'Active';
            var task = creep.memory.target ? 'Working' : 'Idle';
            var workTime = creep.memory.workTime || 0;
            var bodyParts = creep.body.length;
            var carryCap = creep.carryCapacity;
            var fatigue = creep.fatigue;
            var ttl = creep.ticksToLive || 'N/A';

            tableHTML += `
                <tr>
                    <th scope="row">${creepName}</th>
                    <td>${role}</td>
                    <td>${pos}</td>
                    <td>${hits}</td>
                    <td>${energy}</td>
                    <td>${status}</td>
                    <td>${task}</td>
                    <td>${workTime}</td>
                    <td>${bodyParts}</td>
                    <td>${carryCap}</td>
                    <td>${fatigue}</td>
                    <td>${ttl}</td>
                    <td><button onclick="attack('${creepName}')">Attack</button></td>
                </tr>
            `;
        }

        tableHTML += `
            </tbody>
        </table>
        `;

        // Assign roles and run
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                roles.harvester.run(creep);
            }
            else if(creep.memory.role == 'builder') {
                roles.builder.run(creep);
            }
            else if(creep.memory.role == 'upgrader') {
                roles.upgrader.run(creep);
            }
        }

        // Tower logic
        var towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
        for(var tower of towers) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
    }
};