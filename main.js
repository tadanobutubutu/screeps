// role.healer.js
const roleHealer = {
    run: function(creep) {
        if (creep.memory.healing && creep.hits < creep.hitsMax) {
            creep.heal(creep);
        } else if (creep.hits < creep.hitsMax) {
            creep.memory.healing = true;
            creep.heal(creep);
        } else {
            creep.memory.healing = false;
            // Find a creep to heal
            const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (c) => c.hits < c.hitsMax
            });

            if (target) {
                if (creep.pos.inRangeTo(target, 1)) {
                    creep.heal(target);
                } else {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // If no creeps to heal, move to a safe position
                const safePos = creep.room.controller;
                if (safePos) {
                    creep.moveTo(safePos, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHealer;