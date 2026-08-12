// role.healer.js
const roleHealer = {
    run: function(creep) {
        if (creep.memory.healing && creep.carry.energy === 0) {
            creep.memory.healing = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.healing && creep.carry.energy === creep.carryCapacity) {
            creep.memory.healing = true;
            creep.say('⚕️ heal');
        }

        if (creep.memory.healing) {
            const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function(object) {
                    return object.hits < object.hitsMax;
                }
            });
            if (target) {
                if (creep.heal(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleHealer;