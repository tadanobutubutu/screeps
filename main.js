"use strict";

/* Main entry point for the Screeps bot.
 * This file contains the existing bot logic and imports.
 * The Grok downstream monitor now needs a simple status
 * check, so we introduce `checkStatus` returning "OK".
 *
 * The rest of the bot loads its modules and runs them
 * in the standard Screeps loop.
 */

// ----------------- Imports ----------------------------
const Game      = global.Game;      // Screeps runtime environment
const Flags     = global.Flags;     // Global flag collection

// Bot specific modules
const Controller = require("./controller");
const Defender   = require("./defender");
const Builder    = require("./builder");

// ----------------- Bot Logic --------------------------
/**
 * Main loop called by the Screeps engine once per tick.
 */
function mainLoop() {
    // Run main controller logic
    try {
        Controller.run();
    } catch (err) {
        console.error("[Controller] error:", err);
    }

    // Run defensives/hardening logic
    try {
        Defender.run();
    } catch (err) {
        console.error("[Defender] error:", err);
    }

    // Build and upgrade logic
    try {
        Builder.run();
    } catch (err) {
        console.error("[Builder] error:", err);
    }

    // You can add more modules here as needed
}

// The Screeps engine looks for `module.exports.loop` by default
module.exports.loop = mainLoop;

// ----------------- Monitor API --------------------------
/**
 * Simple status check used by the Grok monitor during E2E tests.
 *
 * @returns {string} always `"OK"`
 */
module.exports.checkStatus = function () {
    return "OK";
};