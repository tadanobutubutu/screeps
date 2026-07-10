'use strict';

// User Safety: safe

/* ------------------------------------------------------------------
 *  Mock globals for testing environments (e.g., Jest)
 * ------------------------------------------------------------------ */
if (typeof global.Game === 'undefined') {
  // Simple mock structure for tests. In production, Screeps provides Game.
  global.Game = {
    creeps: {}
  };
}

// Role modules (hypothetical paths)
const roleHarvester = require('./role.harvester');
const roleUpgrader   = require('./role.upgrader');
const roleBuilder    = require('./role.builder');
const