"use strict";

/* Main entry point for the Screeps bot.
 * This file has been merged from two branches.
 * It imports core modules (Controller, Defender, Builder) and
 * legacy role modules (harvester, upgrader, builder).
 * The bot runs its loop each tick, executing Controller logic first
 * and then handling each creep by role. Errors from individual
 * modules are logged but do not break the loop.
 *
 * The Grok monitor requires a `checkStatus` method that returns "OK".
 */

const Game  = global.Game;
const Flags = global.Flags;

// Bot specific modules
const Controller = require("./controller");
const Defender   = require("./defender");
const Builder    = require("./builder");

// Legacy role modules
const roleHarvester = require('role.harvester');
const roleUpgrader   = require('role.upgrader');
const roleBuilder    = require('role.builder');

// Main loop executed each tick
module.exports.loop = function () {
    // Run core controller logic
    try {
        Controller.run();
    } catch (err) {
        console.error("[Controller] error", err);
    }

    // Run defender and builder modules
    try {
        Defender.run();
    } catch (err) {
        console.error("[Defender] error", err);
    }
    try {
        Builder.run();
    } catch (err) {
        console.error("[Builder] error", err);
    }

    // Legacy creep logic
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
};

// Status check for monitoring tools
module.exports.checkStatus = function () {
    return 'OK';
};