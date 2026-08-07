// role.healer.js
const roleHealer = {
    run: function(creep) {
        // Find injured creeps
        const targets = creep.room.find(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });

        // If there are injured creeps, heal them
        if(targets.length > 0) {
            if(creep.heal(targets[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        // If no injured creeps, move to flag or idle
        else {
            const flag = Game.flags['HealerIdle'];
            if(flag) {
                creep.moveTo(flag, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleHealer;