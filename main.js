module.exports.loop = function () {
    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }

    // Run each creep's logic
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.spawning) continue;

        // Basic role-based behavior
        switch (creep.memory.role) {
            case 'harvester':
                runHarvester(creep);
                break;
            case 'upgrader':
                runUpgrader(creep);
                break;
            case 'builder':
                runBuilder(creep);
                break;
            default:
                runHarvester(creep);
        }
    }

    // Spawn management
    for (const name in Game.spawns) {
        const spawn = Game.spawns[name];
        if (spawn.spawning) continue;

        const harvesters = _.filter(Game.creeps, c => c.memory.role === 'harvester');
        const upgraders = _.filter(Game.creeps, c => c.memory.role === 'upgrader');
        const builders = _.filter(Game.creeps, c => c.memory.role === 'builder');

        // Prioritize harvesters, then upgraders, then builders
        if (harvesters.length < 2) {
            spawnCreep(spawn, 'harvester');
        } else if (upgraders.length < 1) {
            spawnCreep(spawn, 'upgrader');
        } else if (builders.length < 1) {
            spawnCreep(spawn, 'builder');
        }
    }

    // Run tower logic
    for (const name in Game.structures) {
        const structure = Game.structures[name];
        if (structure.structureType === STRUCTURE_TOWER) {
            runTower(structure);
        }
    }
};

function runHarvester(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    } else {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: s => (s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN) &&
                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            runUpgrader(creep);
        }
    }
}

function runUpgrader(creep) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
        runHarvester(creep);
        return;
    }
    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
    }
}

function runBuilder(creep) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
        runHarvester(creep);
        return;
    }
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
    } else {
        runUpgrader(creep);
    }
}

function runTower(tower) {
    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
        tower.attack(closestHostile);
        return;
    }

    const closestDamaged = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: c => c.hits < c.hitsMax
    });
    if (closestDamaged) {
        tower.heal(closestDamaged);
        return;
    }

    const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: s => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART
    });
    if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
    }
}

function spawnCreep(spawn, role) {
    const energy = spawn.room.energyCapacityAvailable;
    let body = [];
    const parts = Math.floor(energy / 200);

    if (role === 'harvester') {
        body = Array(parts).fill([WORK, CARRY, MOVE]).flat();
    } else if (role === 'upgrader') {
        body = Array(parts).fill([WORK, CARRY, MOVE]).flat();
    } else if (role === 'builder') {
        body = Array(parts).fill([WORK, CARRY, MOVE]).flat();
    }

    body = body.slice(0, 50);
    if (body.length === 0) body = [WORK, CARRY, MOVE];

    const name = `${role}_${Game.time}`;
    const result = spawn.spawnCreep(body, name, {
        memory: { role }
    });

    if (result === OK) {
        console.log(`Spawning new ${role}: ${name}`);
    }
}