// role.healer.js - Fixed version with corrected syntax error

var roleHealer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // Find damaged creeps in range
        var damagedCreep = creep.pos.findClosestByRange(FIND_CREEPS, {
            filter: function(creep) {
                return creep.hits < creep.hitsMax;  // Fixed: was using === instead of <
            }
        });

        if (damagedCreep) {
            if (creep.heal(damagedCreep) === ERR_NOT_IN_RANGE) {
                creep.moveTo(damagedCreep);
            }
        }
        
        // Heal self if needed
        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
    }
};

module.exports = roleHealer;