// ⚡ PERFORMANCE: Hoisted constant path styles to reduce per-tick object allocation.
const PATH_STYLE_DELIVER = { visualizePathStyle: { stroke: '#00ffff' } };
const PATH_STYLE_WITHDRAW = { visualizePathStyle: { stroke: '#ffff00' } };

const roleTransporter = {
    run: function (creep) {
        creep.say('🚚');

        this._updateState(creep);

        if (creep.memory.transporting) {
            this._deliverEnergy(creep);
        } else {
            this._withdrawEnergy(creep);
        }
    },

    _updateState: function (creep) {
        if (creep.memory.transporting && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.transporting = false;
        }
        if (!creep.memory.transporting && creep.store.getFreeCapacity() === 0) {
            creep.memory.transporting = true;
        }
    },

    _deliverEnergy: function (creep) {
        // ⚡ PERFORMANCE: Use pre-filtered room-level delivery targets.
        const targets = creep.room._deliveryTargets || [];

        if (targets && targets.length > 0) {
            // ⚡ PERFORMANCE: ターゲットIDをキャッシュして毎ティックの再探索を回避
            let target = Game.getObjectById(creep.memory.deliveryTargetId);

            // ⚡ PERFORMANCE: O(1) check for delivery target validity instead of O(N) .some()
            if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
                // ⚡ PERFORMANCE: filter before findClosestByRange to avoid repeated lookups when all are full
                let validTargets = [];
                for (let i = 0; i < targets.length; i++) {
                    if (targets[i].store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        validTargets.push(targets[i]);
                    }
                }
                target = creep.pos.findClosestByRange(validTargets);
                if (target) {
                    creep.memory.deliveryTargetId = target.id;
                } else {
                    delete creep.memory.deliveryTargetId;
                }
            }

            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, PATH_STYLE_DELIVER);
                }
            }
        } else {
            delete creep.memory.deliveryTargetId;
        }
    },

    _withdrawEnergy: function (creep) {
        // ⚡ PERFORMANCE: Use pre-calculated withdrawal sources cache from main.js
        const sources = creep.room._withdrawalSources || [];

        if (sources.length > 0) {
            // ⚡ PERFORMANCE: ターゲットIDをキャッシュ
            let target = Game.getObjectById(creep.memory.withdrawalTargetId);

            // ⚡ PERFORMANCE: O(1) check for withdrawal target validity instead of O(N) .some()
            if (!target || ('energy' in target && target.energy === 0) || ('store' in target && target.store[RESOURCE_ENERGY] === 0)) {
                // ⚡ PERFORMANCE: filter before findClosestByRange to avoid repeated lookups when all are empty
                let validSources = [];
                for (let i = 0; i < sources.length; i++) {
                    let s = sources[i];
                    if (('energy' in s && s.energy > 0) || ('store' in s && s.store[RESOURCE_ENERGY] > 0)) {
                        validSources.push(s);
                    }
                }
                target = creep.pos.findClosestByRange(validSources);
                if (target) {
                    creep.memory.withdrawalTargetId = target.id;
                } else {
                    delete creep.memory.withdrawalTargetId;
                }
            }

            if (target) {
                if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, PATH_STYLE_WITHDRAW);
                }
            }
        } else {
            delete creep.memory.withdrawalTargetId;
        }
    },
};

module.exports = roleTransporter;
