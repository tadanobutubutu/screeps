// ⚡ PERFORMANCE: Hoisted constant path styles to reduce per-tick object allocation.
const PATH_STYLE_HEAL = { visualizePathStyle: { stroke: '#00ff00' } };
const PATH_STYLE_IDLE = { visualizePathStyle: { stroke: '#ffffff', opacity: 0.2 } };
const PATH_STYLE_HARVEST = { visualizePathStyle: { stroke: '#ffaa00' } };

function _updateState(creep) {
    // State machine: Gather energy or Heal
    if (creep.memory.healing && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.healing = false;
        creep.say('⚡ harvest');
    }
    if (!creep.memory.healing && creep.store.getFreeCapacity() === 0) {
        creep.memory.healing = true;
        creep.say('💊 heal');
    }
}

function _handleHealingMode(creep, injured) {
    if (injured.length > 0) {
        const target = _getHealTarget(creep, injured);
        if (target) {
            _performHeal(creep, target);
        }
    } else {
        delete creep.memory.healTargetId;
        _idle(creep);
    }
}

function _handleGatheringMode(creep, sources, injured) {
    const canHarvest = creep.getActiveBodyparts(WORK) > 0;
    if (canHarvest && sources.length > 0) {
        const target = _getHarvestTarget(creep, sources);
        if (target) {
            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, PATH_STYLE_HARVEST);
            }
        }
    } else if (injured.length > 0) {
        const target = _getHealTarget(creep, injured);
        if (target && creep.store[RESOURCE_ENERGY] > 0) {
            _performHeal(creep, target);
        }
    } else {
        delete creep.memory.healTargetId;
    }
}

function _getHealTarget(creep, injured) {
    // ⚡ PERFORMANCE: Cache heal target ID and use closest by range
    let target = Game.getObjectById(creep.memory.healTargetId);

    // If target is invalid or fully healed, find a new one
    if (!target || target.hits === target.hitsMax) {
        target = creep.pos.findClosestByRange(injured);
        if (target) {
            creep.memory.healTargetId = target.id;
        } else {
            delete creep.memory.healTargetId;
        }
    }
    return target;
}

function _getHarvestTarget(creep, sources) {
    // ⚡ PERFORMANCE: Cache harvest target ID and use closest by range
    let target = Game.getObjectById(creep.memory.harvestTargetId);

    if (!target || target.energy === 0) {
        target = creep.pos.findClosestByRange(sources);
        if (target) {
            creep.memory.harvestTargetId = target.id;
        } else {
            delete creep.memory.harvestTargetId;
        }
    }
    return target;
}

function _performHeal(creep, target) {
    if (creep.pos.isNearTo(target)) {
        creep.heal(target);
    } else {
        creep.rangedHeal(target);
        creep.moveTo(target, PATH_STYLE_HEAL);
    }
}

function _idle(creep) {
    // No one to heal: Move to idle position
    const idlePos = creep.room.controller
        ? creep.room.controller.pos
        : new RoomPosition(25, 25, creep.room.name);
    if (!creep.pos.inRangeTo(idlePos, 3)) {
        creep.moveTo(idlePos, PATH_STYLE_IDLE);
    }
}

const roleMedic = {
    run: function (creep) {
        creep.say('💊');

        // ⚡ PERFORMANCE: Use pre-warmed room caches for injured creeps and active sources.
        // These are populated in main.js processCreeps global loop.
        const injured = creep.room._injuredCreeps || [];
        const sources = creep.room._activeSources || [];

        _updateState(creep);

        if (creep.memory.healing) {
            _handleHealingMode(creep, injured);
        } else {
            _handleGatheringMode(creep, sources, injured);
        }
    },
};

module.exports = roleMedic;
