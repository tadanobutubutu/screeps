var roleHealer = {
    run: function(creep) {
        // Find all creeps in the room
        var creeps = creep.room.find(FIND_MY_CREEPS);
        
        // Find wounded allies needing healing
        var wounded = _.filter(creeps, function(c) {
            return c.hits < c.hitsMax;
        });
        
        // If there are wounded allies, heal them
        if (wounded.length > 0) {
            // Heal the most wounded ally
            var target = creep.pos.findClosestByRange(wounded);
            if (creep.heal(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return;
        }
        
        // Heal self if needed
        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
    }
};

module.exports = roleHealer;