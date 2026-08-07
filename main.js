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

// In utils.tasks.js around line 47
// Make sure all comments are properly terminated with */ if they're block comments
// For example:
// /* This is a proper block comment */
// Instead of:
// /* This is an unterminated comment

// If it's a line comment, make sure it doesn't have any trailing */ characters
// For example:
// // This is a proper line comment
// Instead of:
// // This is a line comment */

// The exact fix will depend on the specific content around line 47
// Please check the actual file content and ensure all comments are properly closed