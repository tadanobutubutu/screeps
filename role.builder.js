const roleBuilder = {
    run: function (creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.say('⚡ harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            creep.say('🛠 build');
        }

        if (creep.memory.building) {
            // 建設サイトを探す
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                // 最も近い建設サイトへ
                const target = creep.pos.findClosestByPath(targets);
                if (target && creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#0000ff' } });
                }
            } else {
                // 建設サイトがなければアップグレードモードに
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {
                        visualizePathStyle: { stroke: '#ffffff' },
                    });
                }
            }
        } else {
            // エネルギーを採取
            const sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if (sources.length > 0) {
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
    },
};

module.exports = roleBuilder;
