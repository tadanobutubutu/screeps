/**
 * Screeps Bot Main Loop
 * Resolved merge conflict: integrating full accessible source addressing insight report.
 * Improvements: documented roles, clear control flow, memory cleanup, readable naming.
 */

module.exports.loop = function () {
    // Accessibility: clear dead creep references to prevent stale memory
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
            console.log("Cleared dead creep memory:", name);
        }
    }

    // Spawn logic with readable, maintainable conditions
    const spawn = Game.spawns["Spawn1"];
    if (spawn && !spawn.spawning) {
        const harvesters = _.filter(Game.creeps, (c) => c.memory.role === "harvester");
        if (harvesters.length < 2) {
            const newName = "Harvester" + Game.time;
            console.log("Spawning new harvester:", newName);
            spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
                memory: { role: "harvester" }
            });
        }
    }

    // Execute documented behaviors for all live creeps
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        switch (creep.memory.role) {
            case "harvester":
                runHarvester(creep);
                break;
            case "builder":
                runBuilder(creep);
                break;
            case "upgrader":
                runUpgrader(creep);
                break;
            default:
                console.log("Unknown role for creep:", name, creep.memory.role);
        }
    }
};

function runHarvester(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
            }
        }
    } else {
        const targets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) &&
                       structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (targets.length > 0) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
            }
        }
    }
}

function runBuilder(creep) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    } else {
        const site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (site) {
            if (creep.build(site) === ERR_NOT_IN_RANGE) {
                creep.moveTo(site);
            }
        }
    }
}

function runUpgrader(creep) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    } else {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
}