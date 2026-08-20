// Game constants
const TOWER_RANGE = 20;
const HOSTILE_LIMIT = 3;
const HOSTILE_THRESHOLD = 50;
const SPAWN_DEFENSE_RCL = 3;
const TOWER_DEFENSE_RCL = 3;

module.exports = {
    getTowerDefenseLevel,
    shouldSpawnDefense,
    getHostileCreeps,
    formatCapacity,
    formatAvailable,
    formatTime,
    isMyRoom,
    isMyPowerCreep,
    findEnergy,
    findMineral
};

function getTowerDefenseLevel(room) {
    if (!room.towers || room.towers.length === 0) return 0;
    const towers = room.towers.filter(t => t.effects && t.effects.length > 0);
    return towers.length;
}

function shouldSpawnDefense(room) {
    if (room.controller && room.controller.level < SPAWN_DEFENSE_RCL) return false;
    const hostiles = getHostileCreeps(room);
    return hostiles.length >= HOSTILE_LIMIT;
}

function getHostileCreeps(room) {
    return room.find(FIND_HOSTILE_CREEPS, {
        filter: c => c.getBodyParts(ATTACK) > 0 || c.getBodyParts(RANGED_ATTACK) > 0
    });
}

function formatCapacity(capacity, total) {
    return `${capacity}/${total}`;
}

function formatAvailable(amount) {
    return `${Math.floor(amount)} available`;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function isMyRoom(room) {
    return room.controller && room.controller.my;
}

function isMyPowerCreep(creep) {
    return creep.owner && creep.owner.username === 'differen';
}

function findEnergy(creep) {
    const sources = creep.room.find(FIND_SOURCES_ACTIVE);
    const dropped = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5, {
        filter: r => r.resourceType === RESOURCE_ENERGY && r.amount >= 50
    });
    if (dropped.length > 0) return dropped[0];
    const containers = creep.pos.findInRange(FIND_STRUCTURES, 5, {
        filter: s => s.structureType === STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= 100
    });
    if (containers.length > 0) return containers[0];
    if (sources.length > 0) {
        const closest = creep.pos.findClosestByRange(sources);
        if (closest) return closest;
    }
    return null;
}

function findMineral(creep) {
    const minerals = creep.room.find(FIND_MINERALS);
    if (minerals.length > 0) {
        const extractor = creep.pos.findInRange(FIND_STRUCTURES, 5, {
            filter: s => s.structureType === STRUCTURE_EXTRACTOR
        });
        if (extractor.length > 0) return minerals[0];
    }
    return null;
}