// ⚡ PERFORMANCE: Hoisted constant path styles to reduce per-tick object allocation.
const PATH_STYLE_HEAL = { visualizePathStyle: { stroke: '#00ff00' } };

const roleHealer = {
    run: function (creep) {
        let damagedCreep = null;

        // ⚡ PERFORMANCE: Check if cached target is still valid and needs healing
        if (creep.memory.healTargetId) {
            damagedCreep = Game.getObjectById(creep.memory.healTargetId);
            if (damagedCreep && damagedCreep.hits >= damagedCreep.hitsMax) {
                damagedCreep = null;
                delete creep.memory.healTargetId;
            }
        }

        // ⚡ PERFORMANCE: If no cached target, find one using pre-warmed cache or fallback
        if (damagedCreep === undefined || damagedCreep === null) {
            let injured = creep.room && creep.room._injuredCreeps;
            if (!Array.isArray(injured)) {
                injured = creep.room ? creep.room.find(FIND_MY_CREEPS, { filter: (c) => c.hits < c.hitsMax }) : [];
                if (creep.room) creep.room._injuredCreeps = injured;
            }
            if (injured.length > 0) {
                damagedCreep = creep.pos.findClosestByRange(injured);
            }

            // Gracefully handle target ID caching if id property exists
            if (damagedCreep && damagedCreep.id) {
                creep.memory.healTargetId = damagedCreep.id;
            }
        }

        if (damagedCreep) {
            // 回復
            if (creep.heal(damagedCreep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(damagedCreep, PATH_STYLE_HEAL);
                // 移動中も遠隔回復
                creep.rangedHeal(damagedCreep);
            }
        } else {
            // 傷ついたクリープがいない場合は防衛ポイントへ
            const flag = Game.flags.HealPoint;
            if (flag) {
                creep.moveTo(flag);
            } else {
                // 戦闘クリープの近くに待機
                // ⚡ PERFORMANCE: Use pre-warmed defenders cache or fallback
                let defender = null;
                let defenders = creep.room && creep.room._defenders;
                if (!Array.isArray(defenders)) {
                    defenders = creep.room ? creep.room.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role === 'defender' }) : [];
                    if (creep.room) creep.room._defenders = defenders;
                }
                if (defenders.length > 0) {
                    defender = creep.pos.findClosestByRange(defenders);
                }
                if (defender) {
                    creep.moveTo(defender);
                }
            }
        }
    },
};

module.exports = roleHealer;
