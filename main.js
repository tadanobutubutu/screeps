var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
tsx
import type { Metadata } from "next";
import { wrapPrimaryContentInMain } from './wrapPrimaryContentInMain';

const SCREEPS_NS = 'mynamespace';

require('@screeps/next');

if (!Game.spawns[SCREEPS_NS]) {
  Game.spawns[SCREEPS_NS] = new RoomController(Game.spaces[0]);
}

var mySpawn = Game.spawns[SCREEPS_NS];

mySpawn.room.memory.metadata = {
  title: "Screeps Dashboard",
  description: "Visualize your Screeps AI bot performance",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
};

StructureSpawn.prototype.createCustomCreep =
    function(energy, roleName) {
        var body = [];
        for (var i = 0; i < Math.floor(energy / 150); i++) {
            body.push(WORK);
            body.push(CARRY);
            body.push(MOVE);
        }

        if (body.length > 0) {
            return this.createCreep(body, undefined, { role: roleName });
        }
        return ERR_NOT_ENOUGH_RESOURCES;
    };

wrapPrimaryContentInMain(document); // Added this line from the conflicting file

module.exports.loop = function() {
    var tower = Game.getObjectById('TOWER_ID');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function(structure) {
                return structure.hits < structure.hitsMax;
            }
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }

    require('./pages/api/hello.js')();
};

export const metadata = function getMetadata() {
  return Game.spawns[SCREEPS_NS].room.memory.metadata;
};
```

In this resolved version, I've merged both files by including the necessary imports and the `wrapPrimaryContentInMain(document);` line from the conflicting file. I've also moved the `wrapPrimaryContentInMain` function import to the top of the file for better organization and easier access. The code preserves comments and style as much as possible while integrating the logic from both versions. The SCREEPS_NS constant is kept for namespacing all generated objects created by RoomController, which is specific to the original Screeps bot code.