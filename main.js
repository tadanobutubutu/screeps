var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder')
};

StructureSpawn.prototype.createCustomCreep = function(energy, roleName) {
    var body = [];
    var maxParts = Math.floor(energy / 200);
    
    for (var i = 0; i < maxParts; i++) {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
    }
    
    return this.createCreep(body, undefined, { role: roleName, working: false });
};

module.exports.loop = function() {
    var tower = Game.getObjectById('TOWER_ID_HERE');
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
    
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role && roles[creep.memory.role]) {
            roles[creep.memory.role].run(creep);
        }
    }
    
    if (Game.spawns['Spawn1'].energy >= 200) {
        var targetRole = 'harvester';
        var harvesters = _.filter(Game.creeps, function(creep) {
            return creep.memory.role == 'harvester';
        });
        if (harvesters.length >= 2) {
            targetRole = 'upgrader';
        }
        Game.spawns['Spawn1'].createCustomCreep(Game.spawns['Spawn1'].energy, targetRole);
    }
};