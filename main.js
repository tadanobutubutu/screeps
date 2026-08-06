// role.healer.js
var roleHealer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
        
        var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });
        
        if(target) {
            if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

module.exports = roleHealer;