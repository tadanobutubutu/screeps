var roleHealer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // Heal self first if damaged
        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
        
        // Find closest damaged creep to heal
        var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });
        
        // Move to and heal the target
        if (target) {
            if (creep.heal(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

module.exports = roleHealer;

// utils.emotions.js
// ... (previous code remains unchanged until line 389)

// Before (problematic line):
// const emotionString = "This is an unterminated string;

// After (fixed line):
const emotionString = "This is a properly terminated string";

// ... (rest of the file remains unchanged)