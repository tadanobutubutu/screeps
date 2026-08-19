// Screeps Bot Main Entry Point
// This is the primary game loop executed every tick by the Screeps engine.

// Import core modules and configurations
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleWallRepairer = require('role.wallRepairer');
const roleClaimer = require('role.claimer');
const roleMiner = require('role.miner');
const roleHauler = require('role.hauler');
const roleRemoteHarvester = require('role.remoteHarvester');
const roleRemoteHauler = require('role.remoteHauler');
const roleDefender = require('role.defender');
const roleScout = require('role.scout');

const structureTower = require('structure.tower');
const structureLink = require('structure.link');
const structureTerminal = require('structure.terminal');
const structureLab = require('structure.lab');
const structureFactory = require('structure.factory');
const structurePowerSpawn = require('structure.powerSpawn');
const structureNuker = require('structure.nuker');
const structureObserver = require('structure.observer');

const roomManager = require('room.manager');
const spawnManager = require('spawn.manager');
const creepManager = require('creep.manager');
const memoryManager = require('memory.manager');
const marketManager = require('market.manager');
const intelManager = require('intel.manager');
const visualManager = require('visual.manager');
const profiler = require('profiler');

// Profiler setup for CPU tracking
profiler.enable();

// Global constants and configuration
global.ROLE_PRIORITIES = {
    harvester: 10,
    miner: 9,
    hauler: 8,
    upgrader: 7,
    builder: 6,
    repairer: 5,
    wallRepairer: 4,
    remoteHarvester: 3,
    remoteHauler: 3,
    defender: 2,
    claimer: 1,
    scout: 1
};

global.BODY_PARTS = {
    WORK: WORK,
    CARRY: CARRY,
    MOVE: MOVE,
    ATTACK: ATTACK,
    RANGED_ATTACK: RANGED_ATTACK,
    HEAL: HEAL,
    TOUGH: TOUGH,
    CLAIM: CLAIM
};

// Utility functions
global.getBodyCost = (body) => body.reduce((cost, part) => cost + BODYPART_COST[part], 0);

global.generateBody = (energy, pattern, maxParts = 50) => {
    const body = [];
    let cost = 0;
    let i = 0;
    while (cost + getBodyCost([pattern[i % pattern.length]]) <= energy && body.length < maxParts) {
        const part = pattern[i % pattern.length];
        const partCost = BODYPART_COST[part];
        if (cost + partCost <= energy) {
            body.push(part);
            cost += partCost;
        }
        i++;
    }
    return body;
};

// Main game loop
module.exports.loop = function () {
    // Initialize profiler for this tick
    profiler.wrap(() => {
        try {
            // Clean up memory of dead creeps and invalid entries
            memoryManager.cleanup();

            // Process each room we own or observe
            for (const roomName in Game.rooms) {
                const room = Game.rooms[roomName];
                if (room.controller && room.controller.my) {
                    roomManager.run(room);
                    spawnManager.run(room);
                    structureTower.run(room);
                    structureLink.run(room);
                    structureTerminal.run(room);
                    structureLab.run(room);
                    structureFactory.run(room);
                    structurePowerSpawn.run(room);
                    structureNuker.run(room);
                    structureObserver.run(room);
                }
            }

            // Run creep logic for all our creeps
            creepManager.run();

            // Handle market operations
            marketManager.run();

            // Update intelligence data
            intelManager.run();

            // Generate visuals for debugging
            visualManager.run();

            // Garbage collection for global objects
            if (Game.time % 100 === 0) {
                global._gc && global._gc();
            }

        } catch (error) {
            console.log(`<font color="#FF0000">[ERROR] Main loop crashed: ${error.message}</font>`);
            console.log(`<font color="#FF0000">${error.stack}</font>`);
            Game.notify(`Main loop error: ${error.message}`);
        }
    });
};

// Accessibility Notes for Web Dashboard (app/layout.tsx, dashboard/app/layout.tsx):
// The following accessibility fixes should be applied to the React/Next.js dashboard files:
// 1. REACT_015: Add lang="en" to <html> element
// 2. REACT_027: Fix table structures - use <th>, scope, <caption>
// 3. REACT_017: Use semantic landmarks (<header>, <main>, <nav>, <footer>, <aside>)
// 4. REACT_041: Add aria-label or role="img" to SVG elements, or aria-hidden="true" for decorative SVGs
// 5. REACT_025: Ensure unique landmarks (no duplicate main/nav)
// 6. REACT_036: Use <a href> for navigation, <button> for actions
=======
import React from 'react';

// Assuming children is a prop
function Layout({ children }) {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
}

export default Layout;
>>>>>>> origin/main