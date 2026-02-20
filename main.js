// [v2] creepサマリーログ追加: CodeSandbox -> GitHub -> Screeps PTR
// main.js - Screeps メインループ
const roleHarvester = require("role.harvester");
const roleUpgrader = require("role.upgrader");
const roleBuilder = require("role.builder");
const roleRepairer = require("role.repairer");

module.exports.loop = function () {
  // 死んだcreepのメモリを削除
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }

  // 各スポーンでcreepを生成
  for (let spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
    const creeps = Object.values(Game.creeps);

    const harvesters = creeps.filter((c) => c.memory.role === "harvester");
    const upgraders = creeps.filter((c) => c.memory.role === "upgrader");
    const builders = creeps.filter((c) => c.memory.role === "builder");
    const repairers = creeps.filter((c) => c.memory.role === "repairer");

    const energyCapacity = spawn.room.energyCapacityAvailable;
    const energyAvailable = spawn.room.energyAvailable;

    // creepのボディを取得
    function getBody(capacity) {
      if (capacity >= 800)
        return [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
      if (capacity >= 550) return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
      if (capacity >= 400) return [WORK, WORK, CARRY, MOVE];
      return [WORK, CARRY, MOVE];
    }

    // harvesterを最低4体維持
    if (harvesters.length < 4) {
      const body = getBody(energyCapacity);
      const cost = _.sum(body, (p) => BODYPART_COST[p]);
      if (energyAvailable >= cost && !spawn.spawning) {
        spawn.spawnCreep(body, "Harvester" + Game.time, {
          memory: { role: "harvester" },
        });
      }
    }
    // upgraderを2体維持
    else if (upgraders.length < 2) {
      const body = getBody(energyCapacity);
      const cost = _.sum(body, (p) => BODYPART_COST[p]);
      if (energyAvailable >= cost && !spawn.spawning) {
        spawn.spawnCreep(body, "Upgrader" + Game.time, {
          memory: { role: "upgrader" },
        });
      }
    }
    // builderを2体維持
    else if (builders.length < 2) {
      const body = getBody(energyCapacity);
      const cost = _.sum(body, (p) => BODYPART_COST[p]);
      if (energyAvailable >= cost && !spawn.spawning) {
        spawn.spawnCreep(body, "Builder" + Game.time, {
          memory: { role: "builder" },
        });
      }
    }
    // repairerを1体維持
    else if (repairers.length < 1) {
      const body = getBody(energyCapacity);
      const cost = _.sum(body, (p) => BODYPART_COST[p]);
      if (energyAvailable >= cost && !spawn.spawning) {
        spawn.spawnCreep(body, "Repairer" + Game.time, {
          memory: { role: "repairer" },
        });
      }
    }

    // スポーン中の表示
    if (spawn.spawning) {
      const spawningCreep = Game.creeps[spawn.spawning.name];
      spawn.room.visual.text(
        "Spawning: " + spawningCreep.memory.role,
        spawn.pos.x + 1,
        spawn.pos.y,
        { align: "left", opacity: 0.8 }
      );
    }
  }

  // 全creepにロールを実行
  for (let name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === "harvester") roleHarvester.run(creep);
    else if (creep.memory.role === "upgrader") roleUpgrader.run(creep);
    else if (creep.memory.role === "builder") roleBuilder.run(creep);
    else if (creep.memory.role === "repairer") roleRepairer.run(creep);
  }

  // [v2] 10tickごとにcreepサマリーをコンソール出力
  if (Game.time % 10 === 0) {
    const allCreeps = Object.values(Game.creeps);
    const summary = {
      harvester: allCreeps.filter((c) => c.memory.role === "harvester").length,
      upgrader: allCreeps.filter((c) => c.memory.role === "upgrader").length,
      builder: allCreeps.filter((c) => c.memory.role === "builder").length,
      repairer: allCreeps.filter((c) => c.memory.role === "repairer").length,
    };
    console.log(
      `[Tick ${Game.time}] creeps: ${allCreeps.length} total | H:${summary.harvester} U:${summary.upgrader} B:${summary.builder} R:${summary.repairer}`
    );
  }
};
