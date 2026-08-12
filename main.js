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

const emotionString = "This is a properly terminated string"; // Fixed unterminated string issue

function randomFunction() {
    // Return a random number between 0 (inclusive) and 1 (exclusive)
    return Math.random();
}

module.exports = {
    roleHealer,
    emotionString,
    randomFunction
};