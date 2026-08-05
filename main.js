const { initializeApp } = require('./app.js');

initializeApp();

var roleHealer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // Heal self if damaged
        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
        
        // Find wounded allies to heal
        var target = creep.pos.findClosestByRange(FIND_CREEPS, {
            filter: function(ally) {
                return ally.hits < ally.hitsMax && ally.my;
            }
        });
        
        if (target) {
            if (creep.heal(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    }
};

module.exports = roleHealer;