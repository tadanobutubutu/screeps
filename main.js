var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

StructureSpawn.prototype.createCustomCreep = function(energy, roleName) {
    var body = [];
    for (var i = 0; i < Math.floor(energy / 200); i++) {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
    }
    if (body.length > 0) {
        return this.createCreep(body, undefined, { role: roleName, working: false });
    }
    return ERR_NOT_ENOUGH_RESOURCES;
};

StructureSpawn.prototype.createHarvester = function(energy) {
    return this.createCustomCreep(energy, 'harvester');
};

StructureSpawn.prototype.createUpgrader = function(energy) {
    return this.createCustomCreep(energy, 'upgrader');
};

StructureSpawn.prototype.createBuilder = function(energy) {
    return this.createCustomCreep(energy, 'builder');
};

module.exports.loop = function() {
    var tower = Game.getObjectById('TOWER_ID');
    if (tower) {
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

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    var harvesters = _.filter(Game.creeps, function(creep) {
        return creep.memory.role === 'harvester';
    });
    var upgraders = _.filter(Game.creeps, function(creep) {
        return creep.memory.role === 'upgrader';
    });
    var builders = _.filter(Game.creeps, function(creep) {
        return creep.memory.role === 'builder';
    });

    if (harvesters.length < 2) {
        var newHarvester = Game.spawns['Spawn1'].createHarvester(Game.rooms['W0N0'].energyAvailable);
        console.log('Spawning new harvester: ' + newHarvester);
    }
    if (upgraders.length < 2) {
        var newUpgrader = Game.spawns['Spawn1'].createUpgrader(Game.rooms['W0N0'].energyAvailable);
        console.log('Spawning new upgrader: ' + newUpgrader);
    }
    if (builders.length < 1) {
        var newBuilder = Game.spawns['Spawn1'].createBuilder(Game.rooms['W0N0'].energyAvailable);
        console.log('Spawning new builder: ' + newBuilder);
    }

    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 }
        );
    }

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