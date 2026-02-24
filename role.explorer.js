var roleExplorer = {
    run: function(creep) {
        // メモリにターゲットの部屋がなければ設定（例: 隣の部屋）
        if (!creep.memory.targetRoom) {
            const exits = Game.map.describeExits(creep.room.name);
            const exitDir = Object.keys(exits)[0];
            creep.memory.targetRoom = exits[exitDir];
        }
        if (creep.room.name !== creep.memory.targetRoom) {
            const exitDir = creep.room.findExitTo(creep.memory.targetRoom);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffffff' } });
        } else {
            // 部屋に着いたら適当に動いて視界を確保
            creep.moveTo(25, 25);
            creep.say('👀 scouting');
        }
    }
};
module.exports = roleExplorer;
