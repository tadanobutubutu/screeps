// role.healer.js

var roleHealer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // Find damaged creep in range
        var damagedCreep = creep.pos.findClosestByRange(FIND_MY_CRESTS, {
            filter: function(c) {
                return c.hits < c.hitsMax;
            }
        });
        
        if (damagedCreep) {
            if (creep.heal(damagedCreep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(damagedCreep);
            }
        }
        
        // If no damaged creeps, assist nearest healer
        if (!damagedCreep) {
            var nearestHealer = creep.pos.findClosestByRange(FIND_MY_CRESTS, {
                filter: function(c) {
                    return c.getActiveBodyparts(HEAL) > 0 && c.memory.role === 'healer';
                }
            });
            
            if (nearestHealer && creep.pos.getRangeTo(nearestHealer) > 3) {
                creep.moveTo(nearestHealer);
            }
        }
    }
};

module.exports = roleHealer;