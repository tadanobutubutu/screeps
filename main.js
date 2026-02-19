module.exports.loop = function () {

  // 死んだCreepのメモリを掃除
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  // Spawner（スポーン装置）を取得
  const spawn = Game.spawns['Spawn1'];

  // Creepが5体未満なら新しいCreepをスポーン
  const creepCount = Object.keys(Game.creeps).length;
  if (creepCount < 5) {
    spawn.spawnCreep(
      [WORK, CARRY, MOVE],
      'Worker' + Game.time,
      { memory: { role: 'harvester' } }
    );
  }

  // すべてのCreepにロールに応じた行動をさせる
  for (let name in Game.creeps) {
    const creep = Game.creeps[name];

    if (creep.memory.role === 'harvester') {
      // エネルギーが満タンなら拠点に運ぶ
      if (creep.store.getFreeCapacity() === 0) {
        const targets = creep.room.find(FIND_STRUCTURES, {
          filter: (s) =>
            (s.structureType === STRUCTURE_SPAWN ||
              s.structureType === STRUCTURE_EXTENSION ||
              s.structureType === STRUCTURE_TOWER) &&
            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        if (targets.length > 0) {
          if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
          }
        }
      } else {
        // エネルギーを採掘する
        const sources = creep.room.find(FIND_SOURCES_ACTIVE);
        if (sources.length > 0) {
          if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
          }
        }
      }
    }
  }
};