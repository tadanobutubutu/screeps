"use strict";
/* Main entry point for the Screeps bot. */
/* This file contains all imports and logic from both branches. */
/* A simple status check is added for monitoring purposes. */
/* global describe, test, expect */

// ----------------- Imports ----------------------------
const Game = global.Game;
const Flags = global.Flags;

// Roles
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const awayHarvester = require('role.awayHarvester'); // New import
const spawner = require('role.spawner'); // New import
const controllerDefault = require('role.controllerDefault'); // New import

/* ------------------------------------------------------------------
 *  Helper – safely require optional modules
 * ------------------------------------------------------------------ */
function safeRequire(name) {
  try {
    return require(name);
  } catch (_) {
    return undefined; // module missing / failed to load
  }
}

// Optional modules
const Controller = safeRequire("./controller") || require("./controller");
const Defender   = safeRequire("./defender")   || require("./defender");
const Builder    = safeRequire("./builder")    || require("./builder");

// ----------------- Jest for Testing ------------------
// Ensure Jest is available in case tests require it
try {
    require('