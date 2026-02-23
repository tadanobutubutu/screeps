const roleHarvester = require("role.harvester");
const roleUpgrader = require("role.upgrader");
const roleBuilder = require("role.builder");
const roleRepairer = require("role.repairer");
const roleScout = require("role.scout");
const roleMedic = require("role.medic");
const roleTransporter = require("role.transporter");

const StatsManager = require("utils.stats");
const DashboardRenderer = require("utils.dashboard");
const DefenseManager = require("utils.defense");
const AIHelper = require("utils.ai");
const MissionSystem = require("utils.missions");

module.exports.loop = function () {
  StatsManager.initMemory();
  MissionSystem.initMemory();

  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      StatsManager.recordCreepDeath();
    }
  }

  for (let spawnName in Game.spawns) {
    const spawn = Game.spawns[spawnName];
    const room = spawn.room;
    const creeps = Object.values(Game.creeps);

    const harvesters = creeps.filter((c) => c.memory.role === "harvester");
    const upgraders = creeps.filter((c) => c.memory.role === "upgrader");
    const builders = creeps.filter((c) => c.memory.role === "builder");
    const repairers = creeps.filter((c) => c.memory.role === "repairer");
    const scouts = creeps.filter((c) => c.memory.role === "scout");
    const medics = creeps.filter((c) => c.memory.role === "medic");
    const transporters = creeps.filter((c) => c.memory.role === "transporter");

    const energyCapacity = room.energyCapacityAvailable;
    const energyAvailable = room.energyAvailable;

    function getBody(capacity) {
      if (capacity >= 1300)
        return [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
      if (capacity >= 800)
        return [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
      if (capacity >= 550) return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
      if (capacity >= 400) return [WORK, WORK, CARRY, MOVE];
      return [WORK, CARRY, MOVE];
    }

    function getMedicBody(capacity) {
      if (capacity >= 650)
        return [HEAL, HEAL, MOVE, MOVE];
      if (capacity >= 500)
        return [HEAL, MOVE, MOVE];
      return [HEAL, MOVE];
    }

    function getScoutBody() {
      return [MOVE, MOVE];
    }

    function getTransporterBody(capacity) {
      if (capacity >= 800)
        return [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
      if (capacity >= 500)
        return [CARRY, CARRY, CARRY, MOVE, MOVE];
      return [CARRY, CARRY, MOVE];
    }

    const aiDecision = AIHelper.suggestCreepCount(room);
    const hostiles = room.find(FIND_HOSTILE_CREEPS);

    if (hostiles.length === 0) {
      if (harvesters.length < aiDecision.harvester) {
        const body = getBody(energyCapacity);
        const cost = _.sum(body, (p) => BODYPART_COST[p]);
        if (energyAvailable >= cost && !spawn.spawning) {
          spawn.spawnCreep(body, "Harvester" + Game.time, {
            memory: { role: "harvester" },
          });
          StatsManager.recordCreepBirth();
        }
      } else if (upgraders.length < aiDecision.upgrader) {
        const body = getBody(energyCapacity);
        const cost = _.sum(body, (p) => BODYPART_COST[p]);
        if (energyAvailable >= cost && !spawn.spawning) {
          spawn.spawnCreep(body, "Upgrader" + Game.time, {
            memory: { role: "upgrader" },
          });
          StatsManager.recordCreepBirth();
        }
      } else if (builders.length < aiDecision.builder) {
        const body = getBody(energyCapacity);
        const cost = _.sum(body, (p) => BODYPART_COST[p]);
        if (energyAvailable >= cost && !spawn.spawning) {
          spawn.spawnCreep(body, "Builder" + Game.time, {
            memory: { role: "builder" },
          });
          StatsManager.recordCreepBirth();
        }
      } else if (repairers.length < aiDecision.repairer) {
        const body = getBody(energyCapacity);
        const cost = _.sum(body, (p) => BODYPART_COST[p]);
        if (energyAvailable >= cost && !spawn.spawning) {
          spawn.spawnCreep(body, "Repairer" + Game.time, {
            memory: { role: "repairer" },
          });
          StatsManager.recordCreepBirth();
        }
      } else if (scouts.length < 1 && Game.time % 500 === 0) {
        const body = getScoutBody();
        const cost = _.sum(body, (p) => BODYPART_COST[p]);
        if (energyAvailable >= cost && !spawn.spawning) {
          spawn.spawnCreep(body, "Scout" + Game.time, {
            memory: { role: "scout" },
          });
          StatsManager.recordCreepBirth();
        }
      } else if (medics.length < 1 && room.controller && room.controller.level >= 4) {
        const body = getMedicBody(energyCapacity);
        const cost = _.sum(body, (p) => BODYPART_COST[p]);
        if (energyAvailable >= cost && !spawn.spawning) {
          spawn.spawnCreep(body, "Medic" + Game.time, {
            memory: { role: "medic" },
          });
          StatsManager.recordCreepBirth();
        }
      } else if (transporters.length < 1 && room.controller && room.controller.level >= 5) {
        const body = getTransporterBody(energyCapacity);
        const cost = _.sum(body, (p) => BODYPART_COST[p]);
        if (energyAvailable >= cost && !spawn.spawning) {
          spawn.spawnCreep(body, "Transporter" + Game.time, {
            memory: { role: "transporter" },
          });
          StatsManager.recordCreepBirth();
        }
      }
    }

    if (spawn.spawning) {
      const spawningCreep = Game.creeps[spawn.spawning.name];
      spawn.room.visual.text(
        "🤖 " + spawningCreep.memory.role,
        spawn.pos.x + 1,
        spawn.pos.y,
        { align: "left", opacity: 0.8, font: 0.8 }
      );
    }

    DefenseManager.findTowerTargets(room);
  }

  for (let name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === "harvester") roleHarvester.run(creep);
    else if (creep.memory.role === "upgrader") roleUpgrader.run(creep);
    else if (creep.memory.role === "builder") roleBuilder.run(creep);
    else if (creep.memory.role === "repairer") roleRepairer.run(creep);
    else if (creep.memory.role === "scout") roleScout.run(creep);
    else if (creep.memory.role === "medic") roleMedic.run(creep);
    else if (creep.memory.role === "transporter") roleTransporter.run(creep);
  }

  if (Game.time % 20 === 0) {
    for (let roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      if (room.controller && room.controller.my) {
        DashboardRenderer.displayVisuals(room);
      }
    }
  }

  if (Game.time % 50 === 0) {
    const allCreeps = Object.values(Game.creeps);
    const summary = {
      harvester: allCreeps.filter((c) => c.memory.role === "harvester").length,
      upgrader: allCreeps.filter((c) => c.memory.role === "upgrader").length,
      builder: allCreeps.filter((c) => c.memory.role === "builder").length,
      repairer: allCreeps.filter((c) => c.memory.role === "repairer").length,
      scout: allCreeps.filter((c) => c.memory.role === "scout").length,
      medic: allCreeps.filter((c) => c.memory.role === "medic").length,
      transporter: allCreeps.filter((c) => c.memory.role === "transporter").length,
    };
    console.log(
      `📊 [${Game.time}] Creeps: ${allCreeps.length} | H:${summary.harvester} U:${summary.upgrader} B:${summary.builder} R:${summary.repairer} S:${summary.scout} M:${summary.medic} T:${summary.transporter}`
    );

    const stats = StatsManager.getStats();
    console.log(
      `⚡ Energy: ${stats.energyProcessed} processed | ${stats.energyUpgraded} upgraded | Avg: ${stats.avgEnergyPerTick}/tick`
    );
  }

  if (Game.time % 1000 === 0) {
    if (Math.random() < 0.3) {
      MissionSystem.createRandomMission();
    }
  }
};
