const roleHealer = {
    run: function (creep) {
        // 傷ついた味方クリープを探す
        const damagedCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (c) => c.hits < c.hitsMax,
        });

        if (damagedCreep) {
            // 回復
            if (creep.heal(damagedCreep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(damagedCreep, { visualizePathStyle: { stroke: '#00ff00' } });
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
                const defender = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: (c) => c.memory.role === 'defender',
                });
                if (defender) {
                    creep.moveTo(defender);
                }
            }
        }
    },
};

module.exports = roleHealer;
